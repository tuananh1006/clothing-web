export interface RegisterRequestBody {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  agree_terms: boolean
}

export interface LoginRequestBody {
  email: string
  password: string
  remember_me?: boolean
}

export interface SocialLoginRequestBody {
  provider: 'google' | 'facebook'
  token: string
  device_name?: string
}

export interface ForgotPasswordRequestBody {
  email: string
}

export interface ResetPasswordRequestBody {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface VerifyForgotPasswordTokenReqBody {
  forgot_password_token: string
}
