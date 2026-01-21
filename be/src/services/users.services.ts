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
    if (!user) {
      throw new ErrorWithStatus(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return {
      access_token,
      refresh_token,
      user: {
        _id: user_id,
        id: user_id, // Keep for backward compatibility
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role || 'customer',
        avatar: user.avatar || '',
        avatar_url: user.avatar || '', // Keep for backward compatibility
        address: user.address || '',
        phonenumber: user.phonenumber || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
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
    
    // Insert refresh token
    databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: refresh_token, created_at: new Date() })
    )
    
    const user = await databaseServices.users.findOne({ _id: result.insertedId })
    if (!user) {
      throw new ErrorWithStatus(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.INTERNAL_SERVER_ERROR)
    }
    return {
      access_token,
      refresh_token,
      user: {
        _id: user_id,
        id: user_id, // Keep for backward compatibility
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role || 'customer',
        avatar: user.avatar || '',
        avatar_url: user.avatar || '', // Keep for backward compatibility
        address: user.address || '',
        phonenumber: user.phonenumber || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
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

  async refreshToken(refresh_token: string) {
    // Verify refresh token và lấy user_id
    const decoded_refresh_token = (await verifyToken({
      token: refresh_token,
      secretOrPublicKey: process.env.JWT_SECRET as string
    })) as any

    const user_id = decoded_refresh_token.userId

    // Kiểm tra refresh token có tồn tại trong DB không
    const refreshTokenDoc = await databaseServices.refreshTokens.findOne({ token: refresh_token })
    if (!refreshTokenDoc) {
      throw new ErrorWithStatus(USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST, HTTP_STATUS.UNAUTHORIZED)
    }

    // Xóa refresh token cũ
    await databaseServices.refreshTokens.deleteOne({ token: refresh_token })

    // Tạo access token và refresh token mới
    const [new_access_token, new_refresh_token] = await this.signAccessAndRefreshToken(user_id)

    // Lưu refresh token mới vào DB
    await databaseServices.refreshTokens.insertOne(
      new RefreshToken({ user_id: new ObjectId(user_id), token: new_refresh_token, created_at: new Date() })
    )

    // Lấy thông tin user
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }

    return {
      access_token: new_access_token,
      refresh_token: new_refresh_token,
      user: {
        _id: user_id,
        id: user_id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        full_name: user.full_name || `${user.first_name} ${user.last_name}`.trim(),
        email: user.email,
        role: user.role || 'customer',
        avatar: user.avatar || '',
        avatar_url: user.avatar || '',
        address: user.address || '',
        phonenumber: user.phonenumber || '',
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }
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

    // Tạo link reset password
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173'
    const resetPasswordUrl = `${frontendUrl}/reset-password?token=${encodeURIComponent(token)}&email=${encodeURIComponent(payload.email)}`

    const subject = 'Yêu cầu đặt lại mật khẩu - YORI Fashion'
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .container {
            background-color: #ffffff;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            padding: 30px;
            margin: 20px 0;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #1e88e5;
            margin-bottom: 10px;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #1e88e5;
            color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
            font-weight: bold;
            text-align: center;
          }
          .button:hover {
            background-color: #159cc9;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            font-size: 12px;
            color: #666;
            text-align: center;
          }
          .warning {
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">YORI Fashion</div>
          </div>
          
          <h2>Xin chào ${user.full_name || user.email},</h2>
          
          <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
          
          <p>Vui lòng click vào nút bên dưới để đặt lại mật khẩu:</p>
          
          <div style="text-align: center;">
            <a href="${resetPasswordUrl}" class="button">Đặt lại mật khẩu</a>
          </div>
          
          <p>Hoặc copy và dán link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #1e88e5;">${resetPasswordUrl}</p>
          
          <div class="warning">
            <strong>⚠️ Lưu ý:</strong> Link này chỉ có hiệu lực trong 1 giờ. Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </div>
          
          <div class="footer">
            <p>Email này được gửi tự động, vui lòng không trả lời.</p>
            <p>&copy; ${new Date().getFullYear()} YORI Fashion. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
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
    // Tự động đăng nhập sau khi reset password thành công
    return this.login(user_id)
  }

  async getMe(user_id: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    return {
      _id: user._id.toString(),
      first_name: user.first_name,
      last_name: user.last_name,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      avatar: user.avatar || '',
      address: user.address || '',
      phonenumber: user.phonenumber || '',
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }
  }

  async updateMe(user_id: string, data: {
    first_name?: string
    last_name?: string
    email?: string
    phonenumber?: string
    address?: string
    date_of_birth?: string
  }) {
    const updateData: any = {
      updatedAt: new Date()
    }

    if (data.first_name !== undefined) updateData.first_name = data.first_name
    if (data.last_name !== undefined) updateData.last_name = data.last_name
    if (data.email !== undefined) {
      // Check if email already exists for another user
      const existingUser = await databaseServices.users.findOne({ email: data.email })
      if (existingUser && existingUser._id.toString() !== user_id) {
        throw new ErrorWithStatus(USERS_MESSAGES.EMAIL_ALREADY_EXISTS, HTTP_STATUS.CONFLICT)
      }
      updateData.email = data.email
    }
    if (data.phonenumber !== undefined) updateData.phonenumber = data.phonenumber
    if (data.address !== undefined) updateData.address = data.address
    if (data.date_of_birth !== undefined) updateData.date_of_birth = new Date(data.date_of_birth)

    // Update full_name if first_name or last_name changed
    if (data.first_name !== undefined || data.last_name !== undefined) {
      const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
      const firstName = data.first_name !== undefined ? data.first_name : user?.first_name || ''
      const lastName = data.last_name !== undefined ? data.last_name : user?.last_name || ''
      updateData.full_name = `${firstName} ${lastName}`.trim()
    }

    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      { $set: updateData }
    )

    return this.getMe(user_id)
  }

  async uploadAvatar(user_id: string, avatar_url: string) {
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          avatar: avatar_url,
          updatedAt: new Date()
        }
      }
    )
    return { avatar_url }
  }

  async changePassword(user_id: string, new_password: string) {
    const user = await databaseServices.users.findOne({ _id: new ObjectId(user_id) })
    if (!user) {
      throw new ErrorWithStatus(USERS_MESSAGES.USER_NOT_FOUND, HTTP_STATUS.NOT_FOUND)
    }
    await databaseServices.users.updateOne(
      { _id: new ObjectId(user_id) },
      {
        $set: {
          password: hashPassword(new_password),
          updatedAt: new Date()
        }
      }
    )
  }
}

export default new UsersService()
