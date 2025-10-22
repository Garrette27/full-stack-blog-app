import mongoose, { Schema } from 'mongoose'

const passwordResetSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'user', required: true },
  token: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, default: Date.now, expires: 3600 }, // 1 hour expiration
}, { timestamps: true })

export const PasswordReset = mongoose.model('PasswordReset', passwordResetSchema)

