# Troubleshooting Guide: Login and Password Reset Issues

## Problem
Your blog app was working 2 months ago, but now:
- Login credentials are not working
- Forgot password function is not working

## Most Likely Causes

### 1. Missing Environment Variables in Cloud Run
The backend requires two critical environment variables:
- `JWT_SECRET` - Used to sign authentication tokens
- `DATABASE_URL` - MongoDB connection string

If these are missing, login will fail silently or with configuration errors.

### 2. Database Connection Issues
- MongoDB Atlas credentials may have expired
- Database IP whitelist may need updating
- Database URL may have changed

## How to Diagnose

### Step 1: Run the Health Check Script
```bash
node check-backend-health.js
```

This will check:
- Backend connectivity
- Environment variable configuration
- Database connection status
- API endpoint accessibility

### Step 2: Check Cloud Run Environment Variables
1. Go to [Google Cloud Console](https://console.cloud.google.com/run)
2. Select your project: `perfect-rider-439500-c2`
3. Click on `blog-backend-1058054107417` service
4. Go to "Variables & Secrets" tab
5. Verify these environment variables exist:
   - `JWT_SECRET` (should have a value)
   - `DATABASE_URL` (should be a MongoDB connection string)

### Step 3: Check Backend Logs
1. In Cloud Run, go to the "Logs" tab
2. Look for errors like:
   - "JWT_SECRET is not set"
   - "DATABASE_URL is not set"
   - Database connection errors
   - Authentication failures

## How to Fix

### Option 1: Redeploy Backend with Environment Variables

Using the deployment script:
```bash
# PowerShell (Windows)
.\deploy.ps1

# Or bash (Linux/Mac)
./deploy.sh
```

### Option 2: Manually Set Environment Variables in Cloud Run

1. Go to Cloud Run console
2. Click "Edit & Deploy New Revision"
3. Go to "Variables & Secrets" tab
4. Add/Update these variables:
   - `JWT_SECRET`: `my-super-secret-jwt-key-2025` (or your own secret)
   - `DATABASE_URL`: Your MongoDB connection string
5. Click "Deploy"

### Option 3: Use gcloud CLI

```bash
gcloud run services update blog-backend-1058054107417 \
  --region=asia-east1 \
  --update-env-vars="JWT_SECRET=my-super-secret-jwt-key-2025,DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority"
```

## Testing After Fix

1. **Test Health Endpoint:**
   ```bash
   curl https://blog-backend-1058054107417.asia-east1.run.app/api/v1/health
   ```
   Should return: `{"dbReadyState":"1","hasJwtSecret":true,"hasDatabaseUrl":true,"envVarsConfigured":true}`

2. **Test Login:**
   - Go to your frontend login page
   - Try logging in with your credentials
   - Check browser console (F12) for detailed error messages
   - The improved error handling will now show specific error messages

3. **Test Password Reset:**
   - Go to forgot password page
   - Enter your username/email
   - Check for error messages (improved error handling will show network or server errors)

## What Was Fixed

1. **Improved Error Messages:**
   - Login now shows actual API error messages instead of generic "failed to login"
   - Password reset shows network errors and server errors clearly
   - Backend logs configuration errors properly

2. **Better Diagnostics:**
   - Health endpoint now reports environment variable status
   - Added diagnostic script to check backend health
   - Improved error logging in backend

3. **Configuration Validation:**
   - Backend now checks for JWT_SECRET before attempting login
   - Health endpoint reports missing environment variables

## Still Having Issues?

1. Check browser console (F12) for detailed error messages
2. Check Cloud Run logs for backend errors
3. Verify MongoDB Atlas:
   - Database is running
   - IP whitelist includes Cloud Run IPs (or 0.0.0.0/0 for testing)
   - Credentials are correct
4. Test backend directly:
   ```bash
   curl -X POST https://blog-backend-1058054107417.asia-east1.run.app/api/v1/user/login \
     -H "Content-Type: application/json" \
     -d '{"username":"test","password":"test"}'
   ```

