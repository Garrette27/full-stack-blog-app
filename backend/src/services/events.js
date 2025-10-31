import { v4 as uuidv4 } from 'uuid'
import { Event } from '../db/models/event.js'
import mongoose from 'mongoose'

export async function trackEvent({
  postId,
  action,
  session = uuidv4(),
  date = Date.now(),
}) {
  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, using mock event tracking')
    return {
      _id: `mock-event-${Date.now()}`,
      post: postId,
      action,
      session,
      date
    }
  }

  try {
    const event = new Event({ post: postId, action, session, date })
    return await event.save()
  } catch (error) {
    console.error('Error tracking event:', error)
    // Return mock event if database fails
    return {
      _id: `mock-event-${Date.now()}`,
      post: postId,
      action,
      session,
      date
    }
  }
}

export async function getTotalViews(postId) {
  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, using mock total views')
    return { views: 0 }
  }

  try {
    return {
      views: await Event.countDocuments({ post: postId, action: 'startView' }),
    }
  } catch (error) {
    console.error('Error getting total views:', error)
    return { views: 0 }
  }
}

export async function getDailyViews(postId) {
  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, using mock daily views')
    return []
  }

  try {
    return await Event.aggregate([
      {
        $match: {
          post: postId,
          action: 'startView',
        },
      },
      {
        $group: {
          _id: {
            $dateTrunc: { date: '$date', unit: 'day' },
          },
          views: { $count: {} },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
  } catch (error) {
    console.error('Error getting daily views:', error)
    return []
  }
}

export async function getDailyDurations(postId) {
  // Check if database is connected
  if (mongoose.connection.readyState !== 1) {
    console.log('Database not connected, using mock daily durations')
    return []
  }

  try {
    return await Event.aggregate([
      {
        $match: {
          post: postId,
        },
      },
      {
        $project: {
          session: '$session',
          startDate: {
            $cond: [{ $eq: ['$action', 'startView'] }, '$date', undefined],
          },
          endDate: {
            $cond: [{ $eq: ['$action', 'endView'] }, '$date', undefined],
          },
        },
      },
      {
        $group: {
          _id: '$session',
          startDate: { $min: '$startDate' },
          endDate: { $max: '$endDate' },
        },
      },
      {
        $project: {
          day: { $dateTrunc: { date: '$startDate', unit: 'day' } },
          duration: { $subtract: ['$endDate', '$startDate'] },
        },
      },
      {
        $group: {
          _id: '$day',
          averageDuration: { $avg: '$duration' },
        },
      },
      {
        $sort: { _id: 1 },
      },
    ])
  } catch (error) {
    console.error('Error getting daily durations:', error)
    return []
  }
}

