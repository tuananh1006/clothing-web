import { Request, Response, NextFunction } from 'express'
import databaseServices from '~/services/database.services'
import { ObjectId } from 'mongodb'
import { UserRole } from '~/constants/enums'

export const requireAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const decoded = (req as any).decoded_authorization as { userId?: string }
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    const user = await databaseServices.users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' })
    }
    if (user.role !== UserRole.Admin && user.role !== UserRole.Staff) {
      return res.status(403).json({ message: 'Forbidden: Admin access required' })
    }
    next()
  } catch (err) {
    return res.status(500).json({ message: 'Internal Server Error' })
  }
}
