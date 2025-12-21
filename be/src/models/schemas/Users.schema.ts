import { ObjectId } from 'mongodb'
import { UserVerifyStatus, UserRole } from '~/constants/enums'

interface UserType {
  _id?: ObjectId
  first_name: string
  last_name: string
  full_name?: string
  email: string
  password: string
  role?: UserRole
  createdAt?: Date
  updatedAt?: Date
  email_verified_token?: string
  forgot_password_token?: string
  verify?: UserVerifyStatus
  address?: string
  avatar?: string
  phonenumber?: string
}

export default class User {
  _id: ObjectId
  first_name: string
  last_name: string
  full_name: string
  email: string
  password: string
  role: UserRole
  createdAt: Date
  updatedAt: Date
  email_verified_token: string
  forgot_password_token: string
  verify: UserVerifyStatus
  address: string
  avatar: string
  phonenumber: string

  constructor(user: UserType) {
    this._id = user._id || new ObjectId()
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.full_name = user.full_name || `${user.first_name} ${user.last_name}`.trim()
    this.email = user.email
    this.password = user.password
    this.role = user.role || UserRole.Customer
    this.createdAt = user.createdAt || new Date()
    this.updatedAt = user.updatedAt || new Date()
    this.email_verified_token = user.email_verified_token || ''
    this.forgot_password_token = user.forgot_password_token || ''
    this.verify = user.verify || UserVerifyStatus.Unverified
    this.address = user.address || ''
    this.avatar = user.avatar || ''
    this.phonenumber = user.phonenumber || ''
  }
}
