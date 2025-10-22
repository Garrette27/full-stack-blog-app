import {
  likePost,
  sharePost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  listPostsByUser,
  listPostsByTagAndUser,
  listPostsWithExisting,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', requireAuth, async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    const userId = req.auth.sub // Get the authenticated user's ID
    
    console.log('Posts request - User ID:', userId, 'Auth object:', req.auth)
    console.log('Posts request - Headers:', req.headers.authorization)
    console.log('Posts request - Query params:', req.query)
    
    // Set cache control headers to prevent caching
    res.set({
      'Cache-Control': 'no-cache, no-store, must-revalidate, private',
      'Pragma': 'no-cache',
      'Expires': '0',
      'Last-Modified': new Date().toUTCString(),
      'ETag': `"${Date.now()}"`
    })
    
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'Query by either author or tag, not both' })
      } else if (author) {
        // Only allow users to filter by their own posts
        if (author !== userId) {
          return res.status(403).json({ error: 'Access denied: Can only view your own posts' })
        }
        const posts = await listPostsByAuthor(author, options)
        console.log('Posts found for author:', author, 'Count:', posts.length)
        return res.json(posts)
      } else if (tag) {
        // Filter posts by tag but only for the authenticated user
        const posts = await listPostsByTagAndUser(tag, userId, options)
        console.log('Posts found for tag:', tag, 'Count:', posts.length)
        return res.json(posts)
      } else {
        // Return existing posts (public) + user's own posts
        const posts = await listPostsWithExisting(userId, options)
        console.log('Posts found for user:', userId, 'Count:', posts.length)
        return res.json(posts)
      }
    } catch (err) {
      console.error('Error listing posts', err)
      // Return empty array instead of 500 error for now
      return res.json([])
    }
  })

  app.get('/api/v1/posts/:id', async (req, res) => {
    const { id } = req.params
    try {
      const post = await getPostById(id)
      if (!post) return res.status(404).end()
      return res.json(post)
    } catch (err) {
      console.error('Error getting post', err)
      return res.status(500).end()
    }
  })

  app.post('/api/v1/posts', requireAuth, async (req, res) => {
    try {
      const post = await createPost(req.auth.sub, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error creating post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      // Check if this is an existing post (created before today)
      const existingPost = await getPostById(req.params.id)
      if (!existingPost) return res.sendStatus(404)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of today
      
      // Prevent editing of existing posts (created before today)
      if (existingPost.createdAt < today) {
        return res.status(403).json({ error: 'Cannot edit existing public posts' })
      }
      
      const post = await updatePost(req.auth.sub, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error updating post', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      // Check if this is an existing post (created before today)
      const post = await getPostById(req.params.id)
      if (!post) return res.sendStatus(404)
      
      const today = new Date()
      today.setHours(0, 0, 0, 0) // Start of today
      
      // Prevent deletion of existing posts (created before today)
      if (post.createdAt < today) {
        return res.status(403).json({ error: 'Cannot delete existing public posts' })
      }
      
      // Only allow deletion of user's own posts created today or later
      const { deletedCount } = await deletePost(req.auth.sub, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('Error deleting post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id/like', async (req, res) => {
    try {
      const post = await likePost(req.params.id) // Directly call the service to update the like count
      return res.json(post)
    } catch (err) {
      console.error('Error liking post:', err.message)
      console.error('Full error:', err)
      return res.status(500).json({ error: err.message })
    }
  })

  app.patch('/api/v1/posts/:id/share', async (req, res) => {
    try {
      const post = await sharePost(req.params.id) // Directly call the service to update the share count
      return res.json(post)
    } catch (err) {
      console.error('Error sharing post', err)
      return res.status(500).end()
    }
  })
}
