#!/bin/bash

# Enhanced deployment script for the blog app
# This script deploys both backend and frontend to Google Cloud Run

set -e  # Exit on any error

# Configuration
PROJECT_ID="perfect-rider-439500-c2"
REGION="asia-east1"
BACKEND_SERVICE="blog-backend-1058054107417"
FRONTEND_SERVICE="blog-frontend"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting deployment process...${NC}"

# Check if gcloud is authenticated
if ! gcloud auth list --filter=status:ACTIVE --format="value(account)" | grep -q .; then
    echo -e "${RED}❌ Not authenticated with gcloud. Please run 'gcloud auth login'${NC}"
    exit 1
fi

# Set the project
echo -e "${YELLOW}📋 Setting project to $PROJECT_ID${NC}"
gcloud config set project $PROJECT_ID

# Deploy backend
echo -e "${YELLOW}🔧 Deploying backend...${NC}"
gcloud run deploy $BACKEND_SERVICE \
  --source=backend/ \
  --region=$REGION \
  --set-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/blog?retryWrites=true&w=majority" \
  --allow-unauthenticated \
  --quiet

# Get the backend URL
BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
echo -e "${GREEN}✅ Backend deployed at: $BACKEND_URL${NC}"

# Deploy frontend
echo -e "${YELLOW}🎨 Deploying frontend...${NC}"
gcloud run deploy $FRONTEND_SERVICE \
  --source=. \
  --region=$REGION \
  --set-env-vars="VITE_BACKEND_URL=$BACKEND_URL/api/v1" \
  --allow-unauthenticated \
  --quiet

# Get the frontend URL
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")
echo -e "${GREEN}✅ Frontend deployed at: $FRONTEND_URL${NC}"

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}📱 Frontend URL: $FRONTEND_URL${NC}"
echo -e "${BLUE}🔧 Backend URL: $BACKEND_URL${NC}"
echo -e "${BLUE}📊 View in Google Cloud Console: https://console.cloud.google.com/run?project=$PROJECT_ID${NC}"

