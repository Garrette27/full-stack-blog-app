import mongoose from 'mongoose'

const userSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true
  },
  action: {
    type: String,
    enum: ['login', 'signup', 'logout'],
    required: true
  },
  deviceInfo: {
    userAgent: String,
    platform: String,
    browser: String,
    deviceType: String, // mobile, desktop, tablet
    os: String
  },
  locationInfo: {
    ip: String,
    country: String,
    region: String,
    city: String,
    timezone: String,
    latitude: Number,
    longitude: Number
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
})

// Index for efficient queries
userSessionSchema.index({ userId: 1, timestamp: -1 })
userSessionSchema.index({ sessionId: 1 })
userSessionSchema.index({ 'locationInfo.country': 1 })

export const UserSession = mongoose.model('UserSession', userSessionSchema)





















