import express from 'express'

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.json({ message: 'Hello from test backend!' })
})

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() })
})

const PORT = process.env.PORT || 8080

app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Test server running on port ${PORT}`)
})

