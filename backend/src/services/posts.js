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

// Mock posts data including the Web Fundamentals post
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
  },
  {
    _id: 'web-fundamentals-001',
    title: 'Web Fundamentals',
    author: 'Erika Prianes',
    contents: `# Web Fundamentals

## Introduction
Web development is the process of building websites and web applications that run on the internet or intranet. It involves creating the visual and interactive elements that users see and interact with, as well as the server-side logic that powers the application.

## Key Technologies

### HTML (HyperText Markup Language)
HTML is the foundation of web development. It provides the structure and content of web pages using elements and tags.

**Basic HTML Structure:**
\`\`\`html
<!DOCTYPE html>
<html>
<head>
    <title>My Web Page</title>
</head>
<body>
    <h1>Welcome to Web Development</h1>
    <p>This is a paragraph of text.</p>
</body>
</html>
\`\`\`

### CSS (Cascading Style Sheets)
CSS is used to style and layout web pages. It controls the appearance of HTML elements.

**Basic CSS Example:**
\`\`\`css
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f0;
    margin: 0;
    padding: 20px;
}

h1 {
    color: #333;
    text-align: center;
}
\`\`\`

### JavaScript
JavaScript is a programming language that adds interactivity and dynamic behavior to web pages.

**Basic JavaScript Example:**
\`\`\`javascript
function greetUser(name) {
    alert('Hello, ' + name + '!');
}

// Event listener
document.getElementById('myButton').addEventListener('click', function() {
    greetUser('World');
});
\`\`\`

## Modern Web Development

### Frontend Frameworks
- **React**: A JavaScript library for building user interfaces
- **Vue.js**: A progressive framework for building UIs
- **Angular**: A platform for building mobile and desktop web applications

### Backend Technologies
- **Node.js**: JavaScript runtime for server-side development
- **Python**: With frameworks like Django and Flask
- **PHP**: Popular for web development
- **Java**: With Spring framework

### Databases
- **MongoDB**: NoSQL document database
- **MySQL**: Relational database management system
- **PostgreSQL**: Advanced open-source relational database

## Best Practices

1. **Responsive Design**: Ensure your website works on all devices
2. **Performance Optimization**: Minimize load times and optimize assets
3. **Security**: Implement proper authentication and data validation
4. **Accessibility**: Make your website usable for everyone
5. **SEO**: Optimize for search engines

## Conclusion
Web development is a constantly evolving field that requires continuous learning. By mastering the fundamentals of HTML, CSS, and JavaScript, you'll have a solid foundation to build upon as you explore more advanced technologies and frameworks.

Remember: The best way to learn web development is by building projects and practicing regularly!`,
    tags: ['web-development', 'html', 'css', 'javascript', 'fundamentals'],
    createdAt: new Date('2024-10-20T10:00:00.000Z'),
    updatedAt: new Date('2024-10-20T10:00:00.000Z'),
    likes: 25,
    shares: 12
  }
]

// New function to get both existing posts (public) and user's own posts
export async function listPostsWithExisting(userId, options) {
  // Check if database is connected
  if (!mongoose.connection.readyState) {
    console.log('Database not connected, using mock data')
    
    // Return mock posts when database is not available
    let sortedPosts = [...mockPosts]
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
    // Fallback to mock data
    return mockPosts
  }
}

export async function getPostById(postId) {
  if (!mongoose.connection.readyState) {
    // Use mock data when database is not connected
    const post = mockPosts.find(p => p._id === postId)
    if (!post) throw new Error('Post not found')
    return post
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
