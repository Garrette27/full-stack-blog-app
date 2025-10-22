import { expressjwt } from 'express-jwt'

export const requireAuth = expressjwt({
  secret: process.env.JWT_SECRET,
  algorithms: ['HS256'],
  requestProperty: 'auth',
  getToken: (req) => {
    const authHeader = req.headers.authorization
    if (authHeader && authHeader.split(' ')[0] === 'Bearer') {
      return authHeader.split(' ')[1]
    }
    return null
  }
})
