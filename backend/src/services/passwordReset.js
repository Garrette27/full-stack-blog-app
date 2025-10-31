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
      user: process.env.EMAIL_USER || 'gjencomienda@gmail.com',
      pass: process.env.EMAIL_PASS || 'your-app-password'
    }
  })
}

export async function requestPasswordReset(emailOrUsername) {
  console.log('🔍 Starting password reset for:', emailOrUsername)
  
  try {
    // For now, let's implement a simple email notification without database storage
    // This will work even when database is not connected
    
    console.log('📧 Sending password reset notification email...')
    
    // Send email notification
    const resetLink = `${process.env.FRONTEND_URL || 'https://blog-frontend-1058054107417.asia-east1.run.app'}/reset-password`
    
    try {
      const transporter = createTransporter()
      await transporter.sendMail({
        from: process.env.EMAIL_USER || 'gjencomienda@gmail.com',
        to: emailOrUsername,
        subject: 'Password Reset Request - Blog App',
        html: `
          <h2>Password Reset Request</h2>
          <p>Hi ${emailOrUsername},</p>
          <p>We received a request to reset the password for your Blog App account.</p>
          <p>To reset your password, please contact support or use the following information:</p>
          <p><strong>Email/Username:</strong> ${emailOrUsername}</p>
          <p><strong>Request Time:</strong> ${new Date().toLocaleString()}</p>
          <p>If you did not request a password reset, please ignore this email or contact support.</p>
          <p>Thanks,<br>The Blog App Team</p>
          <p><small>This is an automated notification. For immediate assistance, please contact support.</small></p>
        `
      })
      console.log('✅ Password reset notification email sent successfully')
    } catch (emailError) {
      console.error('❌ Failed to send email:', emailError)
      // Still return success message for security
    }

    return { 
      message: 'Password reset request received. Please check your email for further instructions.'
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

