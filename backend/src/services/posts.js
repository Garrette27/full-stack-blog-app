import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
import mongoose from 'mongoose'

export async function createPost(userId, { title, contents, tags, author, firstName, lastName, birthDate, email }) {
  // Check if database is connected
  if (!mongoose.connection.readyState) {
    throw new Error('Database not connected')
  }

  // Find the user
  const user = await User.findById(userId)
  if (!user) {
    throw new Error('User not found')
  }

  // Create a new post
  const newPost = new Post({
    title: title || 'Untitled',
    author: userId,
    contents: contents || '',
    tags: tags || [],
    // Additional fields from the form
    authorName: author || `${firstName || ''} ${lastName || ''}`.trim() || user.username,
    firstName: firstName || '',
    lastName: lastName || '',
    birthDate: birthDate || null,
    email: email || user.email,
    likes: 0,
    shares: 0
  })
  
  const savedPost = await newPost.save()
  return await Post.findById(savedPost._id).populate('author', 'username email')
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  // Mock implementation - filter posts based on query
  let filteredPosts = [...mockPosts]
  
  if (query.author) {
    filteredPosts = filteredPosts.filter(post => post.author === query.author)
  }
  
  if (query.tags) {
    filteredPosts = filteredPosts.filter(post => 
      post.tags.some(tag => query.tags.includes(tag))
    )
  }
  
  if (query.createdAt) {
    if (query.createdAt.$lt) {
      filteredPosts = filteredPosts.filter(post => post.createdAt < query.createdAt.$lt)
    }
    if (query.createdAt.$gte) {
      filteredPosts = filteredPosts.filter(post => post.createdAt >= query.createdAt.$gte)
    }
  }
  
  // Sort posts
  filteredPosts.sort((a, b) => {
    const aValue = a[sortBy]
    const bValue = b[sortBy]
    if (sortOrder === 'ascending') {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0
    }
  })
  
  return filteredPosts
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  return await listPosts({ author: authorUsername }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function listPostsByUser(userId, options) {
  return await listPosts({ author: userId }, options)
}

export async function listPostsByTagAndUser(tag, userId, options) {
  return await listPosts({ tags: tag, author: userId }, options)
}

// New function to get both existing posts (public) and user's own posts
export async function listPostsWithExisting(userId, options) {
  // Check if database is connected
  if (!mongoose.connection.readyState) {
    console.log('Database not connected, returning empty array')
    return []
  }

  try {
    // Get all posts from the database
    const allPosts = await Post.find({}).populate('author', 'username email')
    
    console.log(`Getting posts for user: ${userId}`)
    console.log(`Found ${allPosts.length} total posts in database`)
    
    // Sort the posts according to options
    let sortedPosts = [...allPosts]
    if (options.sortBy) {
      const sortOrder = options.sortOrder === 'ascending' ? 1 : -1
      sortedPosts.sort((a, b) => {
        const aValue = a[options.sortBy]
        const bValue = b[options.sortBy]
        if (aValue < bValue) return -1 * sortOrder
        if (aValue > bValue) return 1 * sortOrder
        return 0
      })
    }
    
    return sortedPosts
  } catch (error) {
    console.error('Error fetching posts from database:', error)
    return []
  }
}

export async function getPostById(postId) {
  if (!mongoose.connection.readyState) {
    throw new Error('Database not connected')
  }
  
  const post = await Post.findById(postId).populate('author', 'username email')
  if (!post) throw new Error('Post not found')
  return post
}

export async function updatePost(userId, postId, { title, contents, tags }) {
  const post = mockPosts.find(p => p._id === postId)
  if (!post) throw new Error('Post not found')
  
  // Check if this is an existing post (created before today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const postDate = new Date(post.createdAt)
  
  // Prevent editing of existing posts (created before today)
  if (postDate < today) {
    throw new Error('Cannot edit existing public posts')
  }
  
  // Only allow editing of user's own posts
  if (post.author !== userId) {
    throw new Error('Access denied: Can only edit your own posts')
  }
  
  // Mock update - in real app would save to database
  post.title = title || post.title
  post.contents = contents || post.contents
  post.tags = tags || post.tags
  post.updatedAt = new Date()
  
  return post
}

export async function deletePost(userId, postId) {
  const post = mockPosts.find(p => p._id === postId)
  if (!post) return { deletedCount: 0 }
  
  // Check if this is an existing post (created before today)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const postDate = new Date(post.createdAt)
  
  // Prevent deletion of existing posts (created before today)
  if (postDate < today) {
    throw new Error('Cannot delete existing public posts')
  }
  
  // Only allow deletion of user's own posts
  if (post.author !== userId) {
    throw new Error('Access denied: Can only delete your own posts')
  }
  
  const postIndex = mockPosts.findIndex(p => p._id === postId)
  if (postIndex === -1) return { deletedCount: 0 }
  
  // Mock deletion - in real app would remove from database
  mockPosts.splice(postIndex, 1)
  return { deletedCount: 1 }
}

export async function likePost(postId) {
  if (!mongoose.connection.readyState) {
    throw new Error('Database not connected')
  }
  
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  post.likes = (post.likes || 0) + 1
  await post.save()
  return await Post.findById(postId).populate('author', 'username email')
}

export async function sharePost(postId) {
  if (!mongoose.connection.readyState) {
    throw new Error('Database not connected')
  }
  
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  post.shares = (post.shares || 0) + 1
  await post.save()
  return await Post.findById(postId).populate('author', 'username email')
}
