import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'

import { postsRoutes } from './routes/posts.js'
import { userRoutes } from './routes/users.js'
import { eventRoutes } from './routes/events.js'
import { passwordResetRoutes } from './routes/passwordReset.js'

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

postsRoutes(app)
userRoutes(app)
eventRoutes(app)
passwordResetRoutes(app)

app.get('/', (req, res) => {
  res.send('Hello from Express!')
})

export { app }
