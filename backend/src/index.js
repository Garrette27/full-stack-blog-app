import dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import { app } from './app.js'
import { initDatabase } from './db/init.js'

const startServer = async () => {
  try {
    await initDatabase()
    
    // Wait a moment for the database connection to be established
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Check if database is connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('⚠️  Database not connected, but continuing with server startup')
    } else {
      console.info('✅ Database connection verified')
    }
    
    const PORT = process.env.PORT || 8080
    app.listen(PORT, '0.0.0.0', () => {
      console.info(`✅ Express server running on http://0.0.0.0:${PORT}`)
    })
  } catch (err) {
    console.error('error starting server:', err)
    process.exit(1)
  }
}

startServer()
