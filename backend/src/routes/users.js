import { createUser, loginUser, getUserInfoById } from '../services/users.js'
import { createUserSession } from '../services/userSession.js'

export function userRoutes(app) {
  app.post('/api/v1/user/signup', async (req, res) => {
    try {
      const user = await createUser(req.body)
      // Create session record for signup
      try {
        await createUserSession(user._id, 'signup', req)
      } catch (sessionError) {
        // Don't fail signup if session creation fails, just log it
        console.error('Failed to create signup session:', sessionError)
      }
      return res.status(201).json({ username: user.username })
    } catch (err) {
      return res.status(400).json({
        error: 'failed to create the user, does the username already exist?',
      })
    }
  })

  app.post('/api/v1/user/login', async (req, res) => {
    try {
      const { token, userId } = await loginUser(req.body)
      // Create session record for login
      try {
        await createUserSession(userId, 'login', req)
      } catch (sessionError) {
        // Don't fail login if session creation fails, just log it
        console.error('Failed to create login session:', sessionError)
      }
      return res.status(200).send({ token })
    } catch (err) {
      console.error('Login error:', err.message, err.stack)

      // Check if it's a configuration error
      if (
        err.message.includes('JWT_SECRET') ||
        err.message.includes('configuration error')
      ) {
        return res.status(500).send({
          error: 'Server configuration error. Please contact support.',
        })
      }

      // For invalid credentials, don't reveal too much
      return res.status(400).send({
        error: err.message.includes('invalid credentials')
          ? 'Login failed, did you enter the correct username/password?'
          : err.message || 'Login failed. Please try again.',
      })
    }
  })

  app.get('/api/v1/users/:id', async (req, res) => {
    const userInfo = await getUserInfoById(req.params.id)
    return res.status(200).send(userInfo)
  })
}
