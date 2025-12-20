import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id: ObjectId
  token: string
  created_at: Date
  user_id: ObjectId
  constructor(data: RefreshTokenType) {
    this._id = new ObjectId()
    this.token = data.token
    this.created_at = data.created_at
    this.user_id = data.user_id
  }
}
