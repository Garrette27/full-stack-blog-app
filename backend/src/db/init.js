import mongoose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = process.env.MONGODB_URI || process.env.DATABASE_URL

  if (!DATABASE_URL) {
    throw new Error('MONGODB_URI is not set. Configure the environment variable for MongoDB connection.')
  }

  console.log('Connecting to database...')
  console.log('DATABASE_URL:', DATABASE_URL.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')) // Log URL with credentials hidden

  mongoose.connection.on('open', () => {
    console.info('✅ Successfully connected to database')
  })

  mongoose.connection.on('error', (err) => {
    console.error('❌ Database connection error:', err)
  })

  // For serverless, we need to handle connection differently
  if (process.env.NODE_ENV === 'production') {
    // In Vercel serverless, connect without waiting
    return mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      bufferMaxEntries: 0,
      bufferCommands: false,
      maxPoolSize: 1, // Limit connections for serverless
    })
  } else {
    // For local development
    return mongoose.connect(DATABASE_URL, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    })
  }
}
