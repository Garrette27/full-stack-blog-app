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

    // Send email with reset link
    const resetLink = `${process.env.FRONTEND_URL || 'https://blog-frontend-1058054107417.asia-east1.run.app'}/reset-password?token=${resetToken}`
    
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'your-email@gmail.com',
        to: user.email || emailOrUsername,
        subject: 'Password Reset Request - Blog App',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.username || emailOrUsername},</p>
          <p>We received a request to reset the password for your Blog App account.</p>
          <p>Click the link below to reset your password (this link expires in 1 hour):</p>
          <p><a href="${resetLink}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email or contact support: support@blogapp.com.</p>
          <p>Thanks,<br>The Blog App Team</p>
          <p><small>If the button doesn't work, copy and paste this link into your browser: ${resetLink}</small></p>
        `
      })
      console.log('✅ Password reset email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      // Still return success message for security
    }

    return { 
      message: 'If an account with that email/username exists, a password reset link has been sent.'
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

