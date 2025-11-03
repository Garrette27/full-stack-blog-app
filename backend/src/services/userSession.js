import { UserSession } from '../db/models/userSession.js'
// Import User model to ensure it's registered with Mongoose for populate()
// eslint-disable-next-line no-unused-vars
import { User } from '../db/models/user.js'
import { v4 as uuidv4 } from 'uuid'

// Parse user agent to extract device information
function parseUserAgent(userAgent) {
  const ua = userAgent || ''

  // Detect device type
  let deviceType = 'desktop'
  if (
    /Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua)
  ) {
    deviceType = 'mobile'
  } else if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'tablet'
  }

  // Detect browser
  let browser = 'Unknown'
  if (ua.includes('Chrome')) browser = 'Chrome'
  else if (ua.includes('Firefox')) browser = 'Firefox'
  else if (ua.includes('Safari')) browser = 'Safari'
  else if (ua.includes('Edge')) browser = 'Edge'
  else if (ua.includes('Opera')) browser = 'Opera'

  // Detect OS
  let os = 'Unknown'
  if (ua.includes('Windows')) os = 'Windows'
  else if (ua.includes('Mac')) os = 'macOS'
  else if (ua.includes('Linux')) os = 'Linux'
  else if (ua.includes('Android')) os = 'Android'
  else if (ua.includes('iOS')) os = 'iOS'

  // Detect platform
  let platform = 'Unknown'
  if (ua.includes('Windows')) platform = 'Windows'
  else if (ua.includes('Mac')) platform = 'macOS'
  else if (ua.includes('Linux')) platform = 'Linux'
  else if (ua.includes('Android')) platform = 'Android'
  else if (ua.includes('iPhone') || ua.includes('iPad')) platform = 'iOS'

  return {
    userAgent: ua,
    platform,
    browser,
    deviceType,
    os,
  }
}

// Get location info from IP (simplified version - in production you'd use a service like ipapi)
async function getLocationInfo(ip) {
  // For now, we'll use a simplified approach without external API calls
  // In production, you'd integrate with services like ipapi.co, ipinfo.io, or MaxMind

  // Basic IP-based location detection (very simplified)
  let country = 'Unknown'
  let region = 'Unknown'
  let city = 'Unknown'
  let timezone = 'Unknown'

  // Simple IP-based detection (this is just for demo purposes)
  if (
    ip.startsWith('127.') ||
    ip.startsWith('192.168.') ||
    ip.startsWith('10.')
  ) {
    country = 'Local'
    region = 'Local Network'
    city = 'Local'
    timezone = 'Local'
  } else if (ip.includes('::1')) {
    country = 'Local'
    region = 'Local Network'
    city = 'Local'
    timezone = 'Local'
  }

  return {
    ip,
    country,
    region,
    city,
    timezone,
    latitude: null,
    longitude: null,
  }
}

// Create a new user session
export async function createUserSession(userId, action, req) {
  try {
    const sessionId = uuidv4()
    const userAgent = req.headers['user-agent'] || ''
    const ip =
      req.ip ||
      req.connection.remoteAddress ||
      req.headers['x-forwarded-for'] ||
      '127.0.0.1'

    const deviceInfo = parseUserAgent(userAgent)
    const locationInfo = await getLocationInfo(ip)

    const session = new UserSession({
      userId,
      sessionId,
      action,
      deviceInfo,
      locationInfo,
      timestamp: new Date(),
    })

    return await session.save()
  } catch (error) {
    console.error('Error creating user session:', error)
    throw error
  }
}

// Get user sessions for dashboard
export async function getUserSessions(userId, limit = 50) {
  try {
    // Remove populate as it's not needed and can cause errors with orphaned sessions
    // The frontend only needs session data, not user data
    const sessions = await UserSession.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean() // Use lean() for better performance since we don't need Mongoose documents
    
    // Convert to plain objects and ensure proper serialization
    return sessions.map(session => ({
      ...session,
      _id: session._id.toString(),
      userId: session.userId.toString(),
    }))
  } catch (error) {
    console.error('Error fetching user sessions:', error)
    throw error
  }
}

// Get dashboard analytics
export async function getDashboardAnalytics(userId) {
  try {
    const sessions = await UserSession.find({ userId })

    // Device analytics
    const deviceStats = sessions.reduce(
      (acc, session) => {
        const deviceType = session.deviceInfo.deviceType || 'unknown'
        const browser = session.deviceInfo.browser || 'unknown'
        const os = session.deviceInfo.os || 'unknown'

        acc.deviceTypes[deviceType] = (acc.deviceTypes[deviceType] || 0) + 1
        acc.browsers[browser] = (acc.browsers[browser] || 0) + 1
        acc.operatingSystems[os] = (acc.operatingSystems[os] || 0) + 1

        return acc
      },
      {
        deviceTypes: {},
        browsers: {},
        operatingSystems: {},
      },
    )

    // Location analytics
    const locationStats = sessions.reduce(
      (acc, session) => {
        const country = session.locationInfo.country || 'Unknown'
        const city = session.locationInfo.city || 'Unknown'

        acc.countries[country] = (acc.countries[country] || 0) + 1
        acc.cities[city] = (acc.cities[city] || 0) + 1

        return acc
      },
      {
        countries: {},
        cities: {},
      },
    )

    // Activity timeline
    const timeline = sessions.map((session) => ({
      action: session.action,
      timestamp: session.timestamp,
      device: session.deviceInfo.deviceType,
      location: `${session.locationInfo.city}, ${session.locationInfo.country}`,
      browser: session.deviceInfo.browser,
    }))

    return {
      totalSessions: sessions.length,
      deviceStats,
      locationStats,
      timeline: timeline.sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp),
      ),
      lastLogin: sessions.find((s) => s.action === 'login')?.timestamp || null,
      lastSignup:
        sessions.find((s) => s.action === 'signup')?.timestamp || null,
    }
  } catch (error) {
    console.error('Error getting dashboard analytics:', error)
    throw error
  }
}

// Get all users analytics (admin function)
export async function getAllUsersAnalytics() {
  try {
    const sessions = await UserSession.find()

    const userStats = sessions.reduce((acc, session) => {
      const userId = session.userId.toString()
      if (!acc[userId]) {
        acc[userId] = {
          userId,
          totalSessions: 0,
          lastActivity: null,
          countries: new Set(),
          devices: new Set(),
        }
      }

      acc[userId].totalSessions++
      acc[userId].lastActivity = new Date(
        Math.max(
          new Date(acc[userId].lastActivity || 0),
          new Date(session.timestamp),
        ),
      )
      acc[userId].countries.add(session.locationInfo.country)
      acc[userId].devices.add(session.deviceInfo.deviceType)

      return acc
    }, {})

    return Object.values(userStats).map((user) => ({
      ...user,
      countries: Array.from(user.countries),
      devices: Array.from(user.devices),
    }))
  } catch (error) {
    console.error('Error getting all users analytics:', error)
    throw error
  }
}
