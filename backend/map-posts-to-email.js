import mongoose from 'mongoose'
import { Post } from './src/db/models/post.js'
import { User } from './src/db/models/user.js'

// Database connection
const DATABASE_URL = 'mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/blog?retryWrites=true&w=majority'

async function mapPostsToEmail() {
  try {
    console.log('🔍 Connecting to MongoDB...')
    await mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 10000,
    })
    console.log('✅ Connected to MongoDB')

    // Step 1: Investigate existing posts and users
    console.log('\n📊 Investigating existing posts and users...')
    
    const posts = await Post.find({}).populate('author', 'username email')
    const users = await User.find({})
    
    console.log(`\n📈 Summary:`)
    console.log(`   Total users: ${users.length}`)
    console.log(`   Total posts: ${posts.length}`)
    
    // Show all users
    console.log(`\n👥 Users in database:`)
    users.forEach(user => {
      console.log(`   - ${user.username} (${user.email})`)
    })
    
    // Show posts by author
    if (posts.length > 0) {
      console.log(`\n📝 Posts by author:`)
      const postsByAuthor = {}
      
      posts.forEach(post => {
        const authorId = post.author._id.toString()
        if (!postsByAuthor[authorId]) {
          postsByAuthor[authorId] = {
            email: post.author.email,
            username: post.author.username,
            count: 0
          }
        }
        postsByAuthor[authorId].count++
      })
      
      Object.values(postsByAuthor).forEach(author => {
        console.log(`   - ${author.username} (${author.email}): ${author.count} posts`)
      })
    }

    // Step 2: Check if gjencomienda@gmail.com exists
    console.log(`\n🎯 Checking if gjencomienda@gmail.com exists...`)
    const targetUser = await User.findOne({ email: 'gjencomienda@gmail.com' })
    
    if (!targetUser) {
      console.log('❌ User gjencomienda@gmail.com not found!')
      console.log('   You need to create this user first or use an existing email.')
      return
    }
    
    console.log(`✅ Found target user: ${targetUser.username} (${targetUser.email})`)

    // Step 3: Find posts that need to be mapped
    console.log(`\n🔄 Looking for posts to map...`)
    
    if (posts.length === 0) {
      console.log('✅ No posts found - nothing to map!')
      return
    }

    // Find posts that don't belong to gjencomienda@gmail.com
    const postsToMap = posts.filter(post => 
      post.author.email !== 'gjencomienda@gmail.com'
    )
    
    if (postsToMap.length === 0) {
      console.log('✅ All posts already belong to gjencomienda@gmail.com!')
      return
    }
    
    console.log(`📋 Found ${postsToMap.length} posts to map to gjencomienda@gmail.com:`)
    
    postsToMap.forEach(post => {
      console.log(`   - "${post.title}" by ${post.author.username} (${post.author.email})`)
    })

    // Step 4: Map the posts
    console.log(`\n🚀 Mapping posts to gjencomienda@gmail.com...`)
    
    const updateResult = await Post.updateMany(
      { author: { $ne: targetUser._id } },
      { author: targetUser._id }
    )
    
    console.log(`✅ Successfully mapped ${updateResult.modifiedCount} posts!`)

    // Step 5: Verify the mapping
    console.log(`\n🔍 Verifying the mapping...`)
    const updatedPosts = await Post.find({}).populate('author', 'username email')
    
    const postsByAuthorAfter = {}
    updatedPosts.forEach(post => {
      const authorEmail = post.author.email
      if (!postsByAuthorAfter[authorEmail]) {
        postsByAuthorAfter[authorEmail] = 0
      }
      postsByAuthorAfter[authorEmail]++
    })
    
    console.log(`📊 Posts after mapping:`)
    Object.entries(postsByAuthorAfter).forEach(([email, count]) => {
      console.log(`   - ${email}: ${count} posts`)
    })

    console.log(`\n🎉 Mapping completed successfully!`)
    console.log(`   All posts now belong to gjencomienda@gmail.com`)
    console.log(`   You can now log in with gjencomienda@gmail.com to see all your posts!`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n👋 Disconnected from MongoDB')
  }
}

// Run the script
mapPostsToEmail()
