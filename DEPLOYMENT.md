# 🚀 Deployment Guide

This guide explains how to deploy your blog app to Google Cloud Run.

## Prerequisites

1. ✅ Google Cloud CLI installed and configured
2. ✅ Authenticated with your Google account
3. ✅ Project set to `perfect-rider-439500-c2`

## Quick Deployment

### Option 1: Full Deployment (Recommended)
Deploy both backend and frontend:

```bash
# Windows PowerShell
.\deploy.ps1

# Linux/Mac
chmod +x deploy.sh
./deploy.sh
```

### Option 2: Deploy Only Backend
```bash
# Windows PowerShell
.\deploy.ps1 -BackendOnly

# Linux/Mac (modify deploy.sh to add backend-only option)
```

### Option 3: Deploy Only Frontend
```bash
# Windows PowerShell
.\deploy.ps1 -FrontendOnly

# Linux/Mac (modify deploy.sh to add frontend-only option)
```

## Manual Deployment

If you prefer to run commands manually:

### Deploy Backend
```bash
gcloud run deploy blog-backend-1058054107417 \
  --source=backend/ \
  --region=asia-east1 \
  --set-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/blog?retryWrites=true&w=majority" \
  --allow-unauthenticated
```

### Deploy Frontend
```bash
gcloud run deploy blog-frontend \
  --source=. \
  --region=asia-east1 \
  --set-env-vars="VITE_BACKEND_URL=<BACKEND_URL>/api/v1" \
  --allow-unauthenticated
```

## What's New

The deployment scripts now:
- ✅ Automatically get backend URL and pass it to frontend
- ✅ Deploy both services in the correct order
- ✅ Provide colored output for better visibility
- ✅ Show final URLs for easy access
- ✅ Support partial deployments (backend-only or frontend-only)

## Troubleshooting

### Authentication Issues
```bash
gcloud auth login
gcloud config set project perfect-rider-439500-c2
```

### Check Current Configuration
```bash
gcloud config list
gcloud auth list
```

### View Services
```bash
gcloud run services list --region=asia-east1
```

## Environment Variables

- `JWT_SECRET`: Secret key for JWT token signing
- `DATABASE_URL`: MongoDB connection string
- `VITE_BACKEND_URL`: Backend API URL for frontend

## URLs

After deployment, you'll get:
- Frontend URL: Your main app URL
- Backend URL: API endpoint URL
- Google Cloud Console: https://console.cloud.google.com/run?project=perfect-rider-439500-c2

