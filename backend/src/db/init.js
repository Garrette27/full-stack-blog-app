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

  return mongoose.connect(DATABASE_URL, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    connectTimeoutMS: 30000,
    bufferMaxEntries: 0, // Disable mongoose buffering
    bufferCommands: false, // Disable mongoose buffering
  })
}
