import dotenv from 'dotenv'
dotenv.config({ path: '../database.env' })

import mongoose from 'mongoose'
import { app } from './app.js'

// Ensure database connection is established before exporting app
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    })
    console.log('✅ MongoDB Atlas Connected!')
  } catch (error) {
    console.error('❌ MongoDB Connection Failed:', error.message)
    // Don't exit in serverless, just log the error
  }
}

// Connect immediately when module loads
connectDB()

// For Vercel serverless functions, export app directly
export default app

// For local development, start server
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      const PORT = process.env.PORT || 8080
      app.listen(PORT, '0.0.0.0', () => {
        console.info(`✅ Express server running on http://0.0.0.0:${PORT}`)
      })
    } catch (err) {
      console.error('❌ Error starting server:', err)
      process.exit(1)
    }
  }

  startServer()
}
