import { User } from '../db/models/user.js'
import { Post } from '../db/models/post.js'

export function adminRoutes(app) {
  // Admin endpoint to check database contents (temporary for debugging)
  app.get('/api/v1/admin/check-database', async (req, res) => {
    try {
      // Get all users
      const users = await User.find({}).select('username email _id')

      // Get all posts with author info
      const posts = await Post.find({}).populate('author', 'username email')

      // Check if gjencomienda@gmail.com exists
      const targetUser = await User.findOne({ email: 'gjencomienda@gmail.com' })

      const result = {
        users: users,
        posts: posts,
        targetUserExists: !!targetUser,
        targetUser: targetUser,
        summary: {
          totalUsers: users.length,
          totalPosts: posts.length,
          postsWithAuthors: posts.filter((p) => p.author).length,
        },
      }

      return res.json(result)
    } catch (error) {
      console.error('Error checking database:', error)
      return res.status(500).json({ error: 'Failed to check database' })
    }
  })

  // Endpoint to map posts to a specific user
  app.post('/api/v1/admin/map-posts-to-user', async (req, res) => {
    try {
      const { targetEmail, postIds } = req.body

      if (!targetEmail) {
        return res.status(400).json({ error: 'targetEmail is required' })
      }

      // Find the target user
      const targetUser = await User.findOne({ email: targetEmail })
      if (!targetUser) {
        return res.status(404).json({ error: 'Target user not found' })
      }

      let query = {}
      if (postIds && postIds.length > 0) {
        query._id = { $in: postIds }
      }

      // Update posts to point to the target user
      const result = await Post.updateMany(query, { author: targetUser._id })

      return res.json({
        message: 'Posts mapped successfully',
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount,
        targetUser: {
          id: targetUser._id,
          username: targetUser.username,
          email: targetUser.email,
        },
      })
    } catch (error) {
      console.error('Error mapping posts:', error)
      return res.status(500).json({ error: 'Failed to map posts' })
    }
  })
}
