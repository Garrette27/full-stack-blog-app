import { requireAuth } from '../middleware/jwt.js'
import { 
  getUserSessions, 
  getDashboardAnalytics, 
  getAllUsersAnalytics 
} from '../services/userSession.js'

export function dashboardRoutes(app) {
  // Get user's own dashboard analytics
  app.get('/api/v1/dashboard/analytics', requireAuth, async (req, res) => {
    try {
      const userId = req.auth.sub
      const analytics = await getDashboardAnalytics(userId)
      return res.json(analytics)
    } catch (err) {
      console.error('Error getting dashboard analytics:', err)
      return res.status(500).json({ error: 'Failed to get dashboard analytics' })
    }
  })

  // Get user's recent sessions
  app.get('/api/v1/dashboard/sessions', requireAuth, async (req, res) => {
    try {
      const userId = req.auth.sub
      const limit = parseInt(req.query.limit) || 50
      const sessions = await getUserSessions(userId, limit)
      return res.json(sessions)
    } catch (err) {
      console.error('Error getting user sessions:', err)
      return res.status(500).json({ error: 'Failed to get user sessions' })
    }
  })

  // Get all users analytics (admin endpoint - you might want to add admin auth)
  app.get('/api/v1/dashboard/admin/analytics', requireAuth, async (req, res) => {
    try {
      const analytics = await getAllUsersAnalytics()
      return res.json(analytics)
    } catch (err) {
      console.error('Error getting all users analytics:', err)
      return res.status(500).json({ error: 'Failed to get all users analytics' })
    }
  })
}









