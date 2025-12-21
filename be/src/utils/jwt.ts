import jwt, { SignOptions } from 'jsonwebtoken'

export const signToken = ({
  payload,
  secret = process.env.JWT_SERCRET!,
  options = {
    algorithm: 'HS256'
  }
}: {
  payload: object
  secret?: string
  options?: SignOptions
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    jwt.sign(payload, secret, options ?? {}, (err, token) => {
      if (err) return reject(err)
      resolve(token!)
    })
  })
}

export const verifyToken = ({
  token,
  secretOrPublicKey = process.env.JWT_SERCRET! as string
}: {
  token: string
  secretOrPublicKey?: string
}) => {
  return new Promise<jwt.JwtPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey, (err, decoded) => {
      if (err) throw reject(err)
      resolve(decoded as jwt.JwtPayload)
    })
  })
}
