import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function createUser({ username, password }) {
  const existing = await User.findOne({ username })
  if (existing) throw new Error('username already exists')

  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashed })
  await user.save()
  return { username, _id: user._id }
}

export async function loginUser({ username, password }) {
  // Check if JWT_SECRET is configured
  if (!process.env.JWT_SECRET) {
    console.error('❌ JWT_SECRET is not set in environment variables')
    throw new Error('Server configuration error: JWT_SECRET is missing')
  }

  const user = await User.findOne({ username })
  if (!user) throw new Error('invalid credentials')

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new Error('invalid credentials')

  // Use username as stable subject so posts are scoped per account
  try {
    const token = jwt.sign(
      { sub: username, username, userId: user._id.toString() },
      process.env.JWT_SECRET,
      {
        expiresIn: '24h',
      },
    )
    return { token, userId: user._id }
  } catch (jwtError) {
    console.error('❌ JWT signing error:', jwtError)
    throw new Error(
      'Server configuration error: Failed to generate authentication token',
    )
  }
}

export async function getUserInfoById(userId) {
  // For now expose the id passed in as username for simple display
  return { username: userId }
}
