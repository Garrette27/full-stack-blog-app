# Fix Cloud Build permissions for deployment
Write-Host "🔧 Fixing Cloud Build permissions..." -ForegroundColor Yellow

$PROJECT_ID = "perfect-rider-439500-c2"
$PROJECT_NUMBER = "1058054107417"

# Get the default service account email
$SERVICE_ACCOUNT = "$PROJECT_NUMBER-compute@developer.gserviceaccount.com"

Write-Host "📋 Setting up permissions for service account: $SERVICE_ACCOUNT" -ForegroundColor Blue

# Grant necessary roles to the default service account
& "C:\Users\Admin\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT" --role="roles/run.admin"

& "C:\Users\Admin\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT" --role="roles/iam.serviceAccountUser"

& "C:\Users\Admin\AppData\Local\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.cmd" projects add-iam-policy-binding $PROJECT_ID --member="serviceAccount:$SERVICE_ACCOUNT" --role="roles/artifactregistry.admin"

Write-Host "✅ Permissions updated successfully!" -ForegroundColor Green
Write-Host "🚀 You can now run the deployment again." -ForegroundColor Blue

