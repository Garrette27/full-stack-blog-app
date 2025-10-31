import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'

import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { passwordResetRoutes } from './routes/passwordReset.js'
import { adminRoutes } from './routes/admin.js'

const app = express()

// Configure CORS to allow requests from deployed frontend domains
const corsOptions = {
  origin: true, // Allow all origins temporarily for debugging
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200 // For legacy browser support
}

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url} - Origin: ${req.headers.origin}`)
  next()
})

app.use(cors(corsOptions))
app.use(bodyParser.json())

// Health/readiness check
app.get('/healthz', (req, res) => {
  const dbReady = mongoose.connection?.readyState === 1
  const state = {
    dbReadyState: `${mongoose.connection?.readyState ?? 'n/a'}`,
    uptime: process.uptime(),
  }
  res.status(dbReady ? 200 : 503).json(state)
})

// Alternate health endpoint under API prefix
app.get('/api/v1/health', (req, res) => {
  const dbReady = mongoose.connection?.readyState === 1
  const state = {
    dbReadyState: `${mongoose.connection?.readyState ?? 'n/a'}`,
    uptime: process.uptime(),
  }
  res.status(dbReady ? 200 : 503).json(state)
})

postsRoutes(app)
userRoutes(app)
eventRoutes(app)
passwordResetRoutes(app)
adminRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
