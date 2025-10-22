import { PasswordReset } from '../db/models/passwordReset.js'
import { User } from '../db/models/user.js'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Simple email configuration (you can replace with your own SMTP settings)
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER || 'your-email@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  })
}

export async function requestPasswordReset(emailOrUsername) {
  console.log('🔍 Starting password reset for:', emailOrUsername)
  
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      console.log('Database not connected - returning success message')
      return { message: 'Password reset request received. Please contact support for assistance.' }
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: emailOrUsername },
        { username: emailOrUsername }
      ]
    })

    if (!user) {
      console.log('User not found:', emailOrUsername)
      return { message: 'If an account with that email/username exists, a password reset link has been sent.' }
    }

    // Generate reset token
    const resetToken = randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 3600000) // 1 hour from now

    // Save reset token to database
    await PasswordReset.create({
      userId: user._id,
      token: resetToken,
      expiresAt
    })

    // In a real application, you would send an email here
    // For now, we'll just log the reset link
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password?token=${resetToken}`
    console.log('Password reset link:', resetLink)

    return { 
      message: 'If an account with that email/username exists, a password reset link has been sent.',
      resetLink // Only for development/testing
    }
  } catch (error) {
    console.error('Error requesting password reset:', error)
    throw new Error('Failed to process password reset request')
  }
}

export async function resetPassword(token, newPassword) {
  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      console.log('Database not connected - returning success message')
      return { message: 'Password reset request received. Please contact support for assistance.' }
    }

    // Find the reset token
    const passwordReset = await PasswordReset.findOne({ 
      token,
      expiresAt: { $gt: new Date() } // Token not expired
    })

    if (!passwordReset) {
      throw new Error('Invalid or expired reset token')
    }

    // Find the user
    const user = await User.findById(passwordReset.userId)
    if (!user) {
      throw new Error('User not found')
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user's password
    await User.findByIdAndUpdate(user._id, { password: hashedPassword })

    // Delete the used reset token
    await PasswordReset.findByIdAndDelete(passwordReset._id)

    console.log('Password reset successful for user:', user.username)
    return { message: 'Password reset successfully! You can now log in with your new password.' }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}

