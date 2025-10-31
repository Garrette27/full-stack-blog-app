import {
  likePost,
  sharePost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  listPostsByUser,
  listPostsByTagAndUser,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'
import { requireAuth } from '../middleware/jwt.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', requireAuth, async (req, res) => {
    res.set('Cache-Control', 'private, no-store')
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    const userKey = req.auth?.username || req.auth?.sub
    
    console.log('Posts request - User Key:', userKey, 'Auth object:', req.auth)
    console.log('Posts request - Headers:', req.headers.authorization)
    console.log('Posts request - Query params:', req.query)
    
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'Query by either author or tag, not both' })
      } else if (author) {
        if (author !== userKey) {
          return res.status(403).json({ error: 'Access denied: Can only view your own posts' })
        }
        const posts = await listPostsByUser(author, options)
        return res.json(posts)
      } else if (tag) {
        const posts = await listPostsByTagAndUser(tag, userKey, options)
        return res.json(posts)
      } else {
        // Return only posts belonging to the authenticated user
        const posts = await listPostsByUser(userKey, options)
        console.log('Posts found for user:', userKey, 'Count:', posts.length)
        return res.json(posts)
      }
    } catch (err) {
      console.error('Error listing posts', err)
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
      const userKey = req.auth?.username || req.auth?.sub
      const post = await createPost(userKey, req.body)
      return res.json(post)
    } catch (err) {
      if (err?.name === 'ValidationError') {
        return res.status(400).json({ error: err.message })
      }
      console.error('Error creating post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const userKey = req.auth?.username || req.auth?.sub
      const post = await updatePost(userKey, req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error updating post', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id', requireAuth, async (req, res) => {
    try {
      const userKey = req.auth?.username || req.auth?.sub
      const { deletedCount } = await deletePost(userKey, req.params.id)
      if (deletedCount === 0) return res.sendStatus(404)
      return res.status(204).end()
    } catch (err) {
      console.error('Error deleting post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id/like', async (req, res) => {
    try {
      const post = await likePost(req.params.id)
      return res.json(post)
    } catch (err) {
      console.error('Error liking post:', err.message)
      return res.status(500).json({ error: err.message })
    }
  })

  app.patch('/api/v1/posts/:id/share', async (req, res) => {
    try {
      const post = await sharePost(req.params.id)
      return res.json(post)
    } catch (err) {
      console.error('Error sharing post', err)
      return res.status(500).end()
    }
  })
}