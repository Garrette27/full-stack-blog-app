#!/usr/bin/env node

/**
 * Diagnostic script to check backend health and configuration
 * Run this to verify if your backend is properly configured
 */

const BACKEND_URL = 'https://blog-backend-1058054107417.asia-east1.run.app'

async function checkBackendHealth() {
  console.log('🔍 Checking backend health...\n')
  console.log(`Backend URL: ${BACKEND_URL}\n`)

  // Check health endpoint
  try {
    console.log('1. Checking /api/v1/health endpoint...')
    const healthResponse = await fetch(`${BACKEND_URL}/api/v1/health`)
    const healthData = await healthResponse.json()

    console.log('   Status:', healthResponse.status)
    console.log('   Response:', JSON.stringify(healthData, null, 2))

    if (healthData.envVarsConfigured === false) {
      console.log(
        '\n   ⚠️  WARNING: Environment variables are not properly configured!',
      )
      console.log(
        '   - JWT_SECRET:',
        healthData.hasJwtSecret ? '✅ Set' : '❌ Missing',
      )
      console.log(
        '   - DATABASE_URL:',
        healthData.hasDatabaseUrl ? '✅ Set' : '❌ Missing',
      )
    }

    if (healthData.dbReadyState !== '1') {
      console.log('\n   ⚠️  WARNING: Database is not connected!')
      console.log('   Database state:', healthData.dbReadyState)
      console.log(
        '   (0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting)',
      )
    }

    if (
      healthResponse.status === 200 &&
      healthData.envVarsConfigured &&
      healthData.dbReadyState === '1'
    ) {
      console.log('\n   ✅ Backend is healthy!')
    } else {
      console.log('\n   ❌ Backend has configuration issues')
    }
  } catch (error) {
    console.error('   ❌ Error checking health:', error.message)
    console.error('   This could mean:')
    console.error('   - Backend is not running')
    console.error('   - Network connectivity issues')
    console.error('   - CORS configuration problems')
  }

  // Test login endpoint (without credentials)
  console.log('\n2. Testing login endpoint connectivity...')
  try {
    const loginResponse = await fetch(`${BACKEND_URL}/api/v1/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'test', password: 'test' }),
    })

    const loginData = await loginResponse.json()
    console.log('   Status:', loginResponse.status)
    console.log(
      '   Response:',
      loginData.error || loginData.message || 'Connected',
    )

    if (loginResponse.status === 400 && loginData.error) {
      console.log(
        '   ✅ Login endpoint is reachable (expected to fail with invalid credentials)',
      )
    } else if (loginResponse.status === 500) {
      console.log('   ⚠️  Server error - likely configuration issue')
    }
  } catch (error) {
    console.error('   ❌ Error connecting to login endpoint:', error.message)
  }

  // Test password reset endpoint
  console.log('\n3. Testing password reset endpoint connectivity...')
  try {
    const resetResponse = await fetch(
      `${BACKEND_URL}/api/v1/password-reset/request`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com' }),
      },
    )

    const resetData = await resetResponse.json()
    console.log('   Status:', resetResponse.status)
    console.log(
      '   Response:',
      resetData.message || resetData.error || 'Connected',
    )

    if (resetResponse.status === 200 || resetResponse.status === 400) {
      console.log('   ✅ Password reset endpoint is reachable')
    }
  } catch (error) {
    console.error(
      '   ❌ Error connecting to password reset endpoint:',
      error.message,
    )
  }

  console.log('\n📋 Summary:')
  console.log('If you see errors above, check:')
  console.log('1. Environment variables in Cloud Run:')
  console.log('   - JWT_SECRET must be set')
  console.log('   - DATABASE_URL must be set')
  console.log('2. Database connection:')
  console.log('   - Verify MongoDB Atlas credentials are correct')
  console.log('   - Check if database IP is whitelisted in MongoDB Atlas')
  console.log('3. To fix: Redeploy backend with environment variables:')
  console.log('   gcloud run deploy blog-backend-1058054107417 \\')
  console.log('     --source=backend/ \\')
  console.log('     --region=asia-east1 \\')
  console.log(
    '     --set-env-vars="JWT_SECRET=your-secret,DATABASE_URL=your-mongodb-url" \\',
  )
  console.log('     --allow-unauthenticated')
}

checkBackendHealth().catch(console.error)
