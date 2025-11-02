import { PasswordReset } from '../db/models/passwordReset.js'
import { User } from '../db/models/user.js'
import { randomBytes } from 'crypto'
import nodemailer from 'nodemailer'
import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

// Email configuration with explicit SMTP settings for better reliability
const createTransporter = () => {
  const emailUser = process.env.EMAIL_USER || 'gjencomienda@gmail.com'
  const emailPass = process.env.EMAIL_PASS

  // Enhanced logging to debug authentication issues
  console.log('📧 Configuring email transporter...')
  console.log('📧 EMAIL_USER:', emailUser)
  console.log('📧 EMAIL_PASS length:', emailPass ? emailPass.length : 0)
  console.log(
    '📧 EMAIL_PASS starts with:',
    emailPass ? emailPass.substring(0, 4) + '...' : 'undefined',
  )

  if (
    !emailPass ||
    emailPass === 'your-app-password-here' ||
    emailPass === 'your-app-password'
  ) {
    console.error(
      '❌ EMAIL_PASS not configured. Please set a valid Gmail App Password.',
    )
    console.error(
      '📝 See GMAIL_SETUP.md for instructions on how to generate one.',
    )
  }

  // Use explicit SMTP configuration instead of service shorthand for better reliability
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    requireTLS: true,
    auth: {
      user: emailUser,
      pass: emailPass || 'your-app-password',
    },
    debug: false, // set to true for verbose debugging
    logger: false, // set to true for verbose logging
  })
}

export async function requestPasswordReset(emailOrUsername) {
  console.log('🔍 Starting password reset for:', emailOrUsername)

  try {
    // Check if database is connected
    if (!mongoose.connection.readyState) {
      console.log('Database not connected - returning success message')
      return {
        message:
          'Password reset request received. Please contact support for assistance.',
      }
    }

    // Find user by username
    const user = await User.findOne({ username: emailOrUsername })

    if (!user) {
      console.log('User not found:', emailOrUsername)
      // Return success message for security (don't reveal if user exists)
      return {
        message:
          'If a user with that email/username exists, a password reset link has been sent.',
      }
    }

    console.log('User found, generating reset token...')

    // Generate a secure random token
    const token = randomBytes(32).toString('hex')

    // Set expiration to 1 hour from now
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 1)

    // Save token to database
    await PasswordReset.create({
      userId: user._id,
      token,
      expiresAt,
    })

    console.log('Token saved, preparing email...')

    // Create reset link
    const resetLink = `${
      process.env.FRONTEND_URL ||
      'https://blog-frontend-1058054107417.asia-east1.run.app'
    }/reset-password?token=${token}`

    // Send email notification
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'gjencomienda@gmail.com',
        to: user.username, // Use the username as the email address
        subject: 'Password Reset Request - Blog App',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${user.username},</p>
          <p>We received a request to reset the password for your Blog App account.</p>
          <p>Click the link below to reset your password (this link expires in 1 hour):</p>
          <p><a href="${resetLink}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a></p>
          <p>If you did not request a password reset, please ignore this email or contact support: support@blogapp.com.</p>
          <p>Thanks,<br>The Blog App Team</p>
          <p><small>If the button doesn't work, copy and paste this link into your browser: ${resetLink}</small></p>
        `,
      })
      console.log('✅ Password reset email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      console.error('❌ Email error details:', emailError.response)
      // Still return success message for security
    }

    return {
      message:
        'Password reset request received. Please check your email for further instructions.',
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
      return {
        message:
          'Password reset request received. Please contact support for assistance.',
      }
    }

    // Find the reset token
    const passwordReset = await PasswordReset.findOne({
      token,
      expiresAt: { $gt: new Date() }, // Token not expired
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
    return {
      message:
        'Password reset successfully! You can now log in with your new password.',
    }
  } catch (error) {
    console.error('Error resetting password:', error)
    throw error
  }
}
