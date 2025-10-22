# Development Setup Guide

## Quick Start (Choose One Option)

### Option 1: Use MongoDB Atlas (Recommended - No local installation needed)

1. **Create MongoDB Atlas Account:**
   - Go to https://www.mongodb.com/atlas
   - Sign up for free
   - Create a new cluster (choose the free tier)
   - Get your connection string

2. **Update Backend Configuration:**
   - Replace the DATABASE_URL in `backend/.env` with your Atlas connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/blog?retryWrites=true&w=majority`

3. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Option 2: Install MongoDB Locally

1. **Install MongoDB:**
   - Download from https://www.mongodb.com/try/download/community
   - Install and start the MongoDB service
   - Default connection: `mongodb://localhost:27017/blog`

2. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

### Option 3: Use Docker (if Docker is installed)

1. **Start MongoDB with Docker:**
   ```bash
   docker run -d -p 27017:27017 --name mongodb mongo
   ```

2. **Start the Backend:**
   ```bash
   cd backend
   npm run dev
   ```

## Google Cloud & Docker Credentials Setup

### Google Cloud Setup:
1. Go to https://console.cloud.google.com/
2. Create a new project
3. Enable APIs: Cloud Run, Container Registry, Cloud Build
4. Create Service Account:
   - Go to IAM & Admin > Service Accounts
   - Create new service account
   - Download JSON key file
5. Set environment variable:
   ```bash
   set GOOGLE_APPLICATION_CREDENTIALS=path\to\your\key.json
   ```

### Docker Setup:
1. Install Docker Desktop from https://www.docker.com/products/docker-desktop/
2. Sign in to Docker Hub
3. For Google Cloud integration:
   ```bash
   gcloud auth configure-docker
   ```

## Testing the Setup

Once your backend is running, you should see:
- Console message: "express server running on http://localhost:3001"
- Your frontend should be able to connect to the API

## Troubleshooting

- **ERR_CONNECTION_REFUSED**: Backend server not running
- **Database connection errors**: Check your DATABASE_URL in .env
- **Port conflicts**: Make sure port 3001 is not used by another application

