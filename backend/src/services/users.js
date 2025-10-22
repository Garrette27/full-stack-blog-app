import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { User } from '../db/models/user.js'

export async function createUser({ username, password }) {
  // For now, just return a mock user without database operations
  console.log(`Creating user: ${username}`)
  return { username, id: 'mock-user-id' }
}

export async function loginUser({ username, password }) {
  // For now, just return a mock token without database operations
  console.log(`Login attempt: ${username}`)
  
  // Simple mock authentication - accept any credentials for now
  const token = jwt.sign({ sub: 'mock-user-id', username }, process.env.JWT_SECRET, {
    expiresIn: '24h',
  })
  return token
}

export async function getUserInfoById(userId) {
  // For now, just return a mock user info without database operations
  console.log(`Getting user info for: ${userId}`)
  return { username: userId || 'mock-user' }
}
