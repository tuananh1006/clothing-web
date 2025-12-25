// Auth types
export interface User {
  _id: string
  first_name: string
  last_name: string
  full_name: string
  email: string
  role: UserRole
  status?: 'active' | 'inactive'
  address?: string
  avatar?: string
  phonenumber?: string
  orders_count?: number
  total_spent?: number
  createdAt?: string
  updatedAt?: string
}

export enum UserRole {
  Customer = 'customer',
  Admin = 'admin',
}

export interface LoginRequest {
  email: string
  password: string
  remember_me?: boolean
}

export interface LoginResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface RegisterRequest {
  first_name: string
  last_name: string
  email: string
  password: string
  password_confirmation: string
  agree_terms: boolean
}

export interface RegisterResponse {
  access_token: string
  refresh_token: string
  user: User
}

export interface SocialLoginRequest {
  provider: 'google' | 'facebook'
  token: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  email: string
  password: string
  password_confirmation: string
}

export interface VerifyForgotPasswordTokenRequest {
  forgot_password_token: string
}

