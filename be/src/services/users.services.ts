import User from '~/models/schemas/Users.schema'
import databaseServices from './database.services'
import { RegisterRequestBody } from '~/models/requests/users.requests'
import { hashPassword } from '~/utils/crypto'
import { signToken } from '~/utils/jwt'
import { TokenType } from '~/constants/enums'
import type { StringValue } from 'ms'
import RefreshToken from '~/models/schemas/RefreshToken.schema'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
config()
class UsersService {
  private signAccessToken(user_id: string) {
    // Token signing logic
    return signToken({
      payload: { userId: user_id, token_type: TokenType.AccessToken },
      options: { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_IN as StringValue }
    })
  }

  private signRefreshToken(user_id: string) {
    // Token signing logic
    return signToken({
      payload: { userId: user_id, token_type: TokenType.RefreshToken },
      options: { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_IN as StringValue }
    })
  }

  private signEmailVerifyToken(user_id: string) {
    // Token signing logic
    return signToken({
      payload: { userId: user_id, token_type: TokenType.EmailVerifyToken }
    })
  }

  private signForgotPasswordToken(user_id: string) {
    // Token signing logic
    return signToken({
      payload: { userId: user_id, token_type: TokenType.ForgotPasswordToken }
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
    return { access_token, refresh_token }
  }

  // Service methods here
  async register(payload: RegisterRequestBody) {
    // Registration logic
    const result = await databaseServices.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = result.insertedId.toString()
    const [access_token, refresh_token] = await this.signAccessAndRefreshToken(user_id)
    return { access_token, refresh_token }
  }

  async checkEmailExists(email: string) {
    const user = await databaseServices.users.findOne({ email })
    return !!user
  }
}

export default new UsersService()
