import dotenv from 'dotenv'
dotenv.config({ path: '../database.env' })

import { app } from './app.js'
import { initDatabase } from './db/init.js'

// For Vercel serverless functions, export app directly
export default app

// For local development, start server
if (process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      console.log('🔄 Initializing database connection...')
      await initDatabase()
      console.log('✅ Database connection established successfully')
      
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
