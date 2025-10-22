// Mock posts service - works without database
// These are the original posts from your database
const mockPosts = [
  {
    _id: '6716103bcf3166fd2c1b0a95',
    title: 'Hello Mongoose!',
    author: 'Daniel Bugl',
    contents: 'This post is stored in a MongoDB database using Mongoose.',
    tags: ['mongoose', 'mongodb'],
    createdAt: new Date('2024-10-21T08:26:35.02Z'),
    updatedAt: new Date('2024-10-21T08:26:35.02Z'),
    likes: 12,
    shares: 5
  },
  {
    _id: '6716113f5b8ddf26feb4c269',
    title: 'Hello again, Mongoose!',
    author: 'Daniel Bugl',
    contents: 'This post is stored in a MongoDB database using Mongoose.',
    tags: ['mongoose', 'mongodb'],
    createdAt: new Date('2024-10-21T08:30:55.831Z'),
    updatedAt: new Date('2024-10-21T08:30:55.875Z'),
    likes: 8,
    shares: 3
  }
]

export async function createPost(userId, { title, contents, tags }) {
  // Create a new post with mock data
  const newPost = {
    _id: `post-${Date.now()}`,
    title: title || 'Untitled',
    author: userId,
    contents: contents || '',
    tags: tags || [],
    createdAt: new Date(),
    updatedAt: new Date(),
    likes: 0,
    shares: 0
  }
  
  // In a real app, this would save to database
  console.log(`Creating post for user ${userId}:`, newPost.title)
  return newPost
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
  // Get all existing posts (created before today) - these are public
  const today = new Date()
  today.setHours(0, 0, 0, 0) // Start of today
  
  // Filter existing posts (created before today)
  const existingPosts = mockPosts.filter(post => {
    const postDate = new Date(post.createdAt)
    return postDate < today
  })
  
  // For now, we'll just return the existing posts since we don't have user-specific posts yet
  // In a real implementation, you would also fetch user's own posts created today or later
  
  console.log(`Getting posts for user: ${userId}`)
  console.log(`Found ${existingPosts.length} existing posts`)
  
  // Sort the posts according to options
  if (options.sortBy) {
    const sortOrder = options.sortOrder === 'ascending' ? 1 : -1
    existingPosts.sort((a, b) => {
      const aValue = a[options.sortBy]
      const bValue = b[options.sortBy]
      if (aValue < bValue) return -1 * sortOrder
      if (aValue > bValue) return 1 * sortOrder
      return 0
    })
  }
  
  return existingPosts
}

export async function getPostById(postId) {
  const post = mockPosts.find(p => p._id === postId)
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
  const post = mockPosts.find(p => p._id === postId)
  if (!post) throw new Error('Post not found')

  post.likes = (post.likes || 0) + 1
  return post
}

export async function sharePost(postId) {
  const post = mockPosts.find(p => p._id === postId)
  if (!post) throw new Error('Post not found')

  post.shares = (post.shares || 0) + 1
  return post
}
