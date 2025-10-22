import mongoose from 'mongoose'

const DATABASE_URL = 'mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/blog?retryWrites=true&w=majority'

async function testConnection() {
  try {
    console.log('🔍 Testing database connection...')
    console.log('Database URL:', DATABASE_URL)
    
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      bufferCommands: true
    })
    
    console.log('✅ Database connected successfully!')
    
    // Test a simple query
    const collections = await mongoose.connection.db.listCollections().toArray()
    console.log('📋 Available collections:', collections.map(c => c.name))
    
    // Check if we can find any posts
    const Post = mongoose.model('Post', new mongoose.Schema({}, { strict: false }))
    const posts = await Post.find({})
    console.log(`📝 Found ${posts.length} posts in database`)
    
    if (posts.length > 0) {
      console.log('First few posts:')
      posts.slice(0, 3).forEach((post, index) => {
        console.log(`${index + 1}. ${post.title || 'Untitled'} by ${post.author || 'Unknown'}`)
      })
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    console.error('Full error:', error)
  } finally {
    await mongoose.disconnect()
    console.log('👋 Disconnected from database')
  }
}

testConnection()
