# Enhanced deployment script for the blog app (PowerShell version)
# This script deploys both backend and frontend to Google Cloud Run

param(
    [switch]$BackendOnly,
    [switch]$FrontendOnly
)

# Configuration
$PROJECT_ID = "perfect-rider-439500-c2"
$REGION = "asia-east1"
$BACKEND_SERVICE = "blog-backend-1058054107417"
$FRONTEND_SERVICE = "blog-frontend"

Write-Host "🚀 Starting deployment process..." -ForegroundColor Blue

# Use full path to gcloud
$GCLOUD_CMD = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

# Check if gcloud is authenticated
$authCheck = & $GCLOUD_CMD auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $authCheck) {
    Write-Host "❌ Not authenticated with gcloud. Please run 'gcloud auth login'" -ForegroundColor Red
    exit 1
}

# Set the project
Write-Host "📋 Setting project to $PROJECT_ID" -ForegroundColor Yellow
& $GCLOUD_CMD config set project $PROJECT_ID

if (-not $FrontendOnly) {
    # Deploy backend
    Write-Host "🔧 Deploying backend..." -ForegroundColor Yellow
    
    & $GCLOUD_CMD run deploy $BACKEND_SERVICE `
      --source=backend/ `
      --region=$REGION `
      --set-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://gjencomienda:Qwerty12345@cluster0.t0o3n.mongodb.net/test?retryWrites=true&w=majority" `
      --allow-unauthenticated `
      --quiet

    # Get the backend URL
    $BACKEND_URL = $(& $GCLOUD_CMD run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
    Write-Host "✅ Backend deployed at: $BACKEND_URL" -ForegroundColor Green
} else {
    # Get existing backend URL
    $BACKEND_URL = $(& $GCLOUD_CMD run services describe $BACKEND_SERVICE --region=$REGION --format="value(status.url)")
    Write-Host "📋 Using existing backend: $BACKEND_URL" -ForegroundColor Blue
}

if (-not $BackendOnly) {
    # Deploy frontend
    Write-Host "🎨 Deploying frontend..." -ForegroundColor Yellow
    
    & $GCLOUD_CMD run deploy $FRONTEND_SERVICE `
      --source=. `
      --region=$REGION `
      --set-env-vars="VITE_BACKEND_URL=$BACKEND_URL/api/v1" `
      --allow-unauthenticated `
      --quiet

    # Get the frontend URL
    $FRONTEND_URL = $(& $GCLOUD_CMD run services describe $FRONTEND_SERVICE --region=$REGION --format="value(status.url)")
    Write-Host "✅ Frontend deployed at: $FRONTEND_URL" -ForegroundColor Green
}

Write-Host "🎉 Deployment completed successfully!" -ForegroundColor Green
Write-Host "📱 Frontend URL: $FRONTEND_URL" -ForegroundColor Blue
Write-Host "🔧 Backend URL: $BACKEND_URL" -ForegroundColor Blue
Write-Host "📊 View in Google Cloud Console: https://console.cloud.google.com/run?project=$PROJECT_ID" -ForegroundColor Blue
