# Simple deployment script for the blog app
Write-Host "🚀 Starting deployment process..." -ForegroundColor Blue

# Configuration
$PROJECT_ID = "perfect-rider-439500-c2"
$REGION = "asia-east1"
$BACKEND_SERVICE = "blog-backend-1058054107417"
$FRONTEND_SERVICE = "blog-frontend"

# Set the project
Write-Host "📋 Setting project to $PROJECT_ID" -ForegroundColor Yellow
gcloud config set project $PROJECT_ID

# Deploy backend
Write-Host "🔧 Deploying backend..." -ForegroundColor Yellow
gcloud run deploy $BACKEND_SERVICE --source=backend/ --region=$REGION --set-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/test?retryWrites=true&w=majority" --allow-unauthenticated --quiet

# Get the backend URL
$BACKEND_URL = gcloud run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)"
Write-Host "✅ Backend deployed at: $BACKEND_URL" -ForegroundColor Green

# Deploy frontend
Write-Host "🎨 Deploying frontend..." -ForegroundColor Yellow
gcloud run deploy $FRONTEND_SERVICE --source=. --region=$REGION --set-env-vars="VITE_BACKEND_URL=$BACKEND_URL/api/v1" --allow-unauthenticated --quiet

# Get the frontend URL
$FRONTEND_URL = gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)"
Write-Host "✅ Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📱 Frontend URL: $FRONTEND_URL" -ForegroundColor Blue
Write-Host "🔧 Backend URL: $BACKEND_URL" -ForegroundColor Blue
Write-Host "📊 View in Google Cloud Console: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor Blue