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
  
  try {
    const connection = mongoose.connect(DATABASE_URL)
    return connection
  } catch (err) {
    console.error('❌ Failed to connect to database:', err)
    throw err
  }
}
