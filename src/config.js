// Configuration for the application
export const config = {
  // Backend API URL - this will be used if VITE_BACKEND_URL is not available
  BACKEND_URL: 'https://blog-backend-1058054107417.asia-east1.run.app/api/v1'
}

// Get the backend URL from environment variable or fallback to config
export const getBackendUrl = () => {
  const url = import.meta.env.VITE_BACKEND_URL || config.BACKEND_URL
  return url
}

