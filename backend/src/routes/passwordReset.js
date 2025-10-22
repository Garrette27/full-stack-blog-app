import { requestPasswordReset, resetPassword } from '../services/passwordReset.js'

export function passwordResetRoutes(app) {
  // Request password reset
  app.post('/api/v1/password-reset/request', async (req, res) => {
    console.log('=== PASSWORD RESET ROUTE HIT ===')
    console.log('Request body:', req.body)
    console.log('Request headers:', req.headers)
    
    try {
      const { email } = req.body
      console.log('Email/Username received:', email)
      
      if (!email) {
        console.log('❌ No email/username provided')
        return res.status(400).json({ error: 'Email or username is required' })
      }

      console.log('✅ Calling requestPasswordReset service...')
      const result = await requestPasswordReset(email)
      console.log('✅ Password reset service completed:', result)
      
      res.json(result)
    } catch (error) {
      console.error('❌ Error in forgot password route:', error)
      console.error('❌ Error stack:', error.stack)
      res.status(500).json({ error: 'Failed to process password reset request' })
    }
  })

  // Reset password with token
  app.post('/api/v1/password-reset/reset', async (req, res) => {
    try {
      const { token, password } = req.body
      if (!token || !password) {
        return res.status(400).json({ error: 'Token and password are required' })
      }

      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters long' })
      }

      const result = await resetPassword(token, password)
      res.json(result)
    } catch (error) {
      console.error('Error in reset password route:', error)
      res.status(400).json({ error: error.message })
    }
  })
}
