export enum UserVerifyStatus {
  Unverified,
  Verified,
  Banned
}

export enum TokenType {
  AccessToken,
  RefreshToken,
  ForgotPasswordToken,
  EmailVerifyToken
}

export enum UserRole {
  Admin = 'admin',
  Staff = 'staff',
  Customer = 'customer'
}
