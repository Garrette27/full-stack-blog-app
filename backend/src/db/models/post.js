import mongoose, { Schema } from 'mongoose'

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: 'user', required: true },
    contents: String,
    tags: [String],
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
  },
  { timestamps: true },
)

export const Post = mongoose.model('Post', postSchema)
