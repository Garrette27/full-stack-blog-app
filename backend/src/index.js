import dotenv from 'dotenv'
dotenv.config()

import { app } from './app.js'
import { initDatabase } from './db/init.js'

const startServer = async () => {
  try {
    await initDatabase()
    const PORT = process.env.PORT || 8080
    app.listen(PORT, '0.0.0.0', () => {
      console.info(`✅ Express server running on http://0.0.0.0:${PORT}`)
    })
  } catch (err) {
    console.error('error connecting to database:', err)
    process.exit(1)
  }
}

startServer()
