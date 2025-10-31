import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function createUser({ username, password }) {
  const existing = await User.findOne({ username })
  if (existing) throw new Error('username already exists')

  const hashed = await bcrypt.hash(password, 10)
  const user = new User({ username, password: hashed })
  await user.save()
  return { username }
}

export async function loginUser({ username, password }) {
  const user = await User.findOne({ username })
  if (!user) throw new Error('invalid credentials')

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) throw new Error('invalid credentials')

  // Use username as stable subject so posts are scoped per account
  const token = jwt.sign({ sub: username, username }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  return token
}

export async function getUserInfoById(userId) {
  // For now expose the id passed in as username for simple display
  return { username: userId }
}
