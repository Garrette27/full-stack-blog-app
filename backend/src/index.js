import dotenv from 'dotenv'
dotenv.config({ path: '../database.env' })

import mongoose from 'mongoose'
import { app } from './app.js'
import { initDatabase } from './db/init.js'

// Connect to database for all environments
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB Atlas Connected!')
  })
  .catch((error) => {
    console.error('❌ MongoDB Connection Failed:', error.message)
  })

// For Vercel serverless functions, export app directly
export default app

// For local development, start server
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      console.log('🔄 Initializing database connection...')
      try {
        await initDatabase()
      } catch (e) {
        console.warn('⚠️  Initial DB connect attempt failed:', e?.message)
      }

      // Wait briefly for connection readiness; continue even if not connected so the service can start
      let attempts = 0
      const maxAttempts = 10
      while (mongoose.connection.readyState !== 1 && attempts < maxAttempts) {
        console.log(`⏳ Waiting for database connection... (attempt ${attempts + 1}/${maxAttempts})`)
        await new Promise((resolve) => setTimeout(resolve, 500))
        attempts++
      }

      if (mongoose.connection.readyState === 1) {
        console.info('✅ Database connection established successfully')
      } else {
        console.warn('⚠️  Database not connected at startup; continuing to serve. /healthz will report 503 until connected.')
      }
      
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
