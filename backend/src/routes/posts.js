import {
  likePost,
  sharePost,
  listAllPosts,
  listPostsByAuthor,
  listPostsByTag,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from '../services/posts.js'

export function postsRoutes(app) {
  app.get('/api/v1/posts', async (req, res) => {
    const { sortBy, sortOrder, author, tag } = req.query
    const options = { sortBy, sortOrder }
    try {
      if (author && tag) {
        return res
          .status(400)
          .json({ error: 'Query by either author or tag, not both' })
      } else if (author) {
        return res.json(await listPostsByAuthor(author, options))
      } else if (tag) {
        return res.json(await listPostsByTag(tag, options))
      } else {
        return res.json(await listAllPosts(options))
      }
    } catch (err) {
      console.error('Error listing posts', err)
      return res.status(500).end()
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

  app.post('/api/v1/posts', async (req, res) => {
    try {
      const post = await createPost(req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error creating post', err)
      return res.status(500).end()
    }
  })

  app.patch('/api/v1/posts/:id', async (req, res) => {
    try {
      const post = await updatePost(req.params.id, req.body)
      return res.json(post)
    } catch (err) {
      console.error('Error updating post', err)
      return res.status(500).end()
    }
  })

  app.delete('/api/v1/posts/:id', async (req, res) => {
    try {
      const { deletedCount } = await deletePost(req.params.id)
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
      console.error('Error liking post', err)
      return res.status(500).end()
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
