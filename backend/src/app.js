import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

// Import models early to ensure they're registered with Mongoose before routes use them
import './db/models/user.js'
import './db/models/userSession.js'

import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { passwordResetRoutes } from './routes/passwordReset.js'
import { adminRoutes } from './routes/admin.js'
import { dashboardRoutes } from './routes/dashboard.js'

const app = express()

// Middleware to ensure database is connected before processing requests
app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ error: 'Database not connected' })
  }
  next()
})

// Configure CORS to allow requests from deployed frontend domains
const corsOptions = {
  origin: [
    'http://localhost:5173', // Vite dev server
    'https://full-stack-blog-app-ten.vercel.app', // Your Vercel frontend
    /^https:\/\/.*\.vercel\.app$/ // Allow all Vercel subdomains
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200, // For legacy browser support
}

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(
    `${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${
      req.headers.origin
    }`,
  )
  next()
})

app.use(cors(corsOptions))
app.use(bodyParser.json())

// Health/readiness check
app.get('/healthz', (req, res) => {
  const dbReady = mongoose.connection?.readyState === 1
  const hasJwtSecret = !!process.env.JWT_SECRET
  const hasDatabaseUrl = !!process.env.DATABASE_URL

  const state = {
    dbReadyState: `${mongoose.connection?.readyState ?? 'n/a'}`,
    uptime: process.uptime(),
    hasJwtSecret,
    hasDatabaseUrl,
    envVarsConfigured: hasJwtSecret && hasDatabaseUrl,
  }

  // Return 503 if critical components are not ready
  const isHealthy = dbReady && hasJwtSecret && hasDatabaseUrl
  res.status(isHealthy ? 200 : 503).json(state)
})

// Alternate health endpoint under API prefix
app.get('/api/v1/health', (req, res) => {
  const dbReady = mongoose.connection?.readyState === 1
  const hasJwtSecret = !!process.env.JWT_SECRET
  const hasDatabaseUrl = !!process.env.DATABASE_URL

  const state = {
    dbReadyState: `${mongoose.connection?.readyState ?? 'n/a'}`,
    uptime: process.uptime(),
    hasJwtSecret,
    hasDatabaseUrl,
    envVarsConfigured: hasJwtSecret && hasDatabaseUrl,
  }

  // Return 503 if critical components are not ready
  const isHealthy = dbReady && hasJwtSecret && hasDatabaseUrl
  res.status(isHealthy ? 200 : 503).json(state)
})

postsRoutes(app)
userRoutes(app)
eventRoutes(app)
passwordResetRoutes(app)
adminRoutes(app)
dashboardRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
