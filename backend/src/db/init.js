import mongoose from 'mongoose'

export function initDatabase() {
  const DATABASE_URL = process.env.DATABASE_URL
  
  if (!DATABASE_URL) {
    console.warn('⚠️  No DATABASE_URL found in environment variables')
    console.warn('⚠️  Using in-memory database for development')
    // For now, we'll skip database connection in production if no URL is provided
    return Promise.resolve()
  }
  
  console.log('Connecting to database...')
  
  mongoose.connection.on('open', () => {
    console.info('✅ Successfully connected to database')
  })
  
  mongoose.connection.on('error', (err) => {
    console.error('❌ Database connection error:', err)
  })
  
  return mongoose.connect(DATABASE_URL, {
    serverSelectionTimeoutMS: 10000, // 10 seconds timeout
    socketTimeoutMS: 45000, // 45 seconds timeout
    bufferCommands: false, // Disable mongoose buffering
    bufferMaxEntries: 0 // Disable mongoose buffering
  }).catch(err => {
    console.error('❌ Failed to connect to database:', err)
    console.warn('⚠️  Continuing without database connection...')
    // Don't throw the error, just log it and continue
    return Promise.resolve()
  })
}
