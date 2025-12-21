import User from '~/models/schemas/Users.schema'
import databaseServices from './database.services'
import {
  RegisterRequestBody,
  SocialLoginRequestBody,
  ForgotPasswordRequestBody,
  ResetPasswordRequestBody
} from '~/models/requests/users.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken, verifyToken } from '~/utils/jwt'
import { TokenType, UserVerifyStatus } from '~/constants/enums'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
import { randomBytes } from 'crypto'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import HTTP_STATUS from '~/constants/httpStatus'
import { sendEmail } from './email.services'

config()

class UsersService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { userId: user_id, token_type: TokenType.AccessToken },
      secret: process.env.JWT_SECRET,
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as StringValue }
    })
  }

  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { userId: user_id, token_type: TokenType.RefreshToken },
      secret: process.env.JWT_SECRET,
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as StringValue }
    })
  }

  private signForgotPasswordToken(user_id: string) {
    return signToken({
      payload: { userId: user_id, token_type: TokenType.ForgotPasswordToken },
      secret: process.env.JWT_SECRET,
      options: { expiresIn: '1h' }
    })
  }

  private signAccessAndRefreshToken(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }

  async login(user_id: string) {
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, created_at: new Date() })
    )
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    return {
      access_token,
      refresh_token,
      token_type: 'Bearer',
      expires_in: 3600,
      user: {
        id: user_id,
        name: user?.full_name,
        email: user?.email,
        avatar_url: user?.avatar,
        role: user?.role
      }
    }
  }

  async register(payload: RegisterRequestBody) {
    const result = await databaseServices.users.insertOne(
      new User({
        ...payload,
        password: hashPassword(payload.password)
      })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    const user = await databaseServices.users.findOne({ _id: result.insertedId })
    return {
      access_token,
      user: {
        id: user_id,
        email: user?.email,
        full_name: user?.full_name,
        role: user?.role
      }
    }
  }

  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return !!user
  }

  async logout(refresh_token: string) {
    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })
  }

  async socialLogin(payload: SocialLoginRequestBody) {
    // Mock verification: assume token is valid and contains email/name
    // In real app, verify with Google/Facebook API
    const email = `user_${payload.token.substring(0, 5)}@example.com` // Mock email from token
    const name = `User ${payload.token.substring(0, 5)}` // Mock name

    let user = await databaseServices.users.findOne({ email })
    if (!user) {
      const password = randomBytes(16).toString('hex')
      const result = await databaseServices.users.insertOne(
        new User({
          first_name: name,
          last_name: '',
          email,
          password: hashPassword(password),
          verify: UserVerifyStatus.Verified
        })
      )
      user = await databaseServices.users.findOne({ _id: result.insertedId })
    }

    return this.login(user!._id.toString())
  }

  async forgotPassword(payload: ForgotPasswordRequestBody) {
    const user = await databaseServices.users.findOne({ email: payload.email })
    if (!user) {
      // Return success even if email not found for security
      return
    }
    const token = await this.signForgotPasswordToken(user._id.toString())
    await databaseServices.users.updateOne({ _id: user._id }, { $set: { forgot_password_token: token } })

    const subject = 'Reset Password Request'
    const html = `
      <h3>Hello ${user.full_name || user.email},</h3>
      <p>You requested to reset your password.</p>
      <p>Your reset token is:</p>
      <h2>${token}</h2>
      <p>This token is valid for 1 hour.</p>
      <p>If you did not request this, please ignore this email.</p>
    `
    await sendEmail(payload.email, subject, html)
  }

  async resetPassword(user_id: string, password: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(password),
          forgot_password_token: ''
        }
      }
    )
  }
}

export default new UsersService()
