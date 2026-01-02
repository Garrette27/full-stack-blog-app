# Fix permissions for GitHub Actions service account
Write-Host "🔧 Fixing GitHub Actions service account permissions..." -ForegroundColor Yellow

$PROJECT_ID = "perfect-rider-439500-c2"
$SERVICE_ACCOUNT = "github-actions-deployer@perfect-rider-439500-c2.iam.gserviceaccount.com"
$GCLOUD = "$env:LOCALAPPDATA\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd"

Write-Host "📋 Adding Artifact Registry Writer role to: $SERVICE_ACCOUNT" -ForegroundColor Blue

# Grant Artifact Registry Writer role (required for --source deployments)
& $GCLOUD projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT" `
  --role="roles/artifactregistry.writer"

Write-Host "✅ Permissions updated successfully!" -ForegroundColor Green
Write-Host "🚀 GitHub Actions should now be able to deploy from source!" -ForegroundColor Blue

