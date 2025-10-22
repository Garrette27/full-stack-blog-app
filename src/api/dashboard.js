import { getBackendUrl } from '../config.js'

// Get dashboard analytics for the current user
export const getDashboardAnalytics = async (token) => {
  const res = await fetch(`${getBackendUrl()}/dashboard/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to get dashboard analytics')
  return await res.json()
}

// Get user sessions for the current user
export const getUserSessions = async (token, limit = 50) => {
  const res = await fetch(`${getBackendUrl()}/dashboard/sessions?limit=${limit}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to get user sessions')
  return await res.json()
}

// Get all users analytics (admin function)
export const getAllUsersAnalytics = async (token) => {
  const res = await fetch(`${getBackendUrl()}/dashboard/admin/analytics`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  if (!res.ok) throw new Error('Failed to get all users analytics')
  return await res.json()
}









