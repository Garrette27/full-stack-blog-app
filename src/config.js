// Configuration for the application
export const config = {
  // Backend API URL - this will be used if VITE_BACKEND_URL is not available
  BACKEND_URL: 'https://blog-backend-1058054107417-leirxu2voq-de.a.run.app/api/v1'
}

// Get the backend URL from environment variable or fallback to config
export const getBackendUrl = () => {
  console.log('Environment VITE_BACKEND_URL:', import.meta.env.VITE_BACKEND_URL)
  console.log('Config BACKEND_URL:', config.BACKEND_URL)
  const url = import.meta.env.VITE_BACKEND_URL || config.BACKEND_URL
  console.log('Final backend URL:', url)
  return url
}

