import { getBackendUrl } from '../config.js'

export const signup = async ({ username, password }) => {
  const res = await fetch(`${getBackendUrl()}/user/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  })
  if (!res.ok) throw new Error('failed to sign up')
  return await res.json()
}

export const login = async ({ username, password }) => {
  try {
    const res = await fetch(`${getBackendUrl()}/user/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    const data = await res.json()

    if (!res.ok) {
      // Extract error message from response
      const errorMessage =
        data?.error || `Login failed with status ${res.status}`
      console.error('Login API error:', {
        status: res.status,
        statusText: res.statusText,
        error: data.error,
        url: `${getBackendUrl()}/user/login`,
      })
      throw new Error(errorMessage)
    }

    return data
  } catch (error) {
    // Handle network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error during login:', error)
      throw new Error(
        'Cannot connect to server. Please check your internet connection and try again.',
      )
    }
    throw error
  }
}

export const getUserInfo = async (id) => {
  const res = await fetch(`${getBackendUrl()}/users/${id}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  })
  return await res.json()
}
