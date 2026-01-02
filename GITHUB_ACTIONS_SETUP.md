# GitHub Actions Automated Deployment Setup

This guide will help you set up automatic deployment from GitHub to Google Cloud Run, just like Vercel! 🚀

## What This Does

Once configured, every time you push code to the `main` branch, GitHub Actions will automatically:
1. Build your application
2. Deploy the backend to Google Cloud Run
3. Deploy the frontend to Google Cloud Run
4. Update your services with the latest code

**No more manual deployment needed!** Just push to GitHub and your app will deploy automatically.

## Prerequisites

1. ✅ Your code is already on GitHub
2. ✅ Google Cloud project is set up (`perfect-rider-439500-c2`)
3. ✅ Services are already deployed to Cloud Run

## Step 1: Create a Service Account in Google Cloud

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select your project: `perfect-rider-439500-c2`
3. Navigate to **IAM & Admin** → **Service Accounts**
4. Click **+ CREATE SERVICE ACCOUNT**
5. Fill in the details:
   - **Name**: `github-actions-deployer`
   - **Description**: `Service account for GitHub Actions deployments`
6. Click **CREATE AND CONTINUE**
7. Grant these roles:
   - `Cloud Run Admin` (to deploy services)
   - `Service Account User` (to use service accounts)
   - `Storage Admin` (if using Cloud Build/Storage)
8. Click **CONTINUE** then **DONE**

## Step 2: Create and Download Service Account Key

1. Click on the service account you just created (`github-actions-deployer`)
2. Go to the **KEYS** tab
3. Click **ADD KEY** → **Create new key**
4. Select **JSON** format
5. Click **CREATE**
6. A JSON file will be downloaded to your computer - **save this file securely**

## Step 3: Add Secret to GitHub Repository

1. Go to your GitHub repository: `Garrette27/full-stack-blog-app`
2. Click **Settings** (top menu)
3. In the left sidebar, click **Secrets and variables** → **Actions**
4. Click **New repository secret**
5. Create the secret:
   - **Name**: `GOOGLE_CLOUD_CREDENTIALS`
   - **Value**: Open the JSON file you downloaded, copy ALL its contents, and paste it here
6. Click **Add secret**

## Step 4: Enable Required APIs

Make sure these APIs are enabled in your Google Cloud project:

1. Go to [Google Cloud Console APIs](https://console.cloud.google.com/apis/library)
2. Enable these APIs (if not already enabled):
   - **Cloud Run API**
   - **Cloud Build API**
   - **Cloud Resource Manager API**

## Step 5: Test the Workflow

1. Make a small change to your code (or just push your current code)
2. Commit and push to the `main` branch:
   ```bash
   git add .
   git commit -m "test: trigger GitHub Actions deployment"
   git push origin main
   ```
3. Go to your GitHub repository
4. Click on the **Actions** tab
5. You should see a workflow run called "Deploy Blog Application"
6. Click on it to see the deployment progress
7. Once it completes, your app will be automatically deployed!

## How It Works

The workflow (`.github/workflows/cd.yaml`) is configured to:
- Trigger automatically on every push to `main` branch
- Use Google Cloud CLI to deploy using `--source` flag (Cloud Build handles the Docker build automatically)
- Deploy backend first, then frontend
- Pass the backend URL to the frontend automatically

## Troubleshooting

### Workflow Fails with "Permission Denied"

- Check that the service account has the correct roles (Cloud Run Admin, Service Account User)
- Verify the JSON credentials in GitHub Secrets are correct (full file contents)

### Workflow Fails with "API Not Enabled"

- Enable the required APIs: Cloud Run API, Cloud Build API, Cloud Resource Manager API
- Go to [APIs & Services](https://console.cloud.google.com/apis/library) and enable them

### Deployment Works But App Doesn't Update

- Check the Cloud Run service logs in Google Cloud Console
- Verify environment variables are set correctly
- Check that the services are using the latest revision

## Manual Deployment (Backup Method)

If you ever need to deploy manually, you can still use:
```powershell
.\deploy-simple.ps1
```

But with GitHub Actions set up, you shouldn't need to! 🎉

## Next Steps

Once set up, your workflow will be:
1. **Make changes** to your code
2. **Commit and push** to GitHub
3. **GitHub Actions automatically deploys** to Cloud Run
4. **Done!** Your app is live

Just like Vercel! ✨

