import { Post } from '../db/models/post.js'
import { User } from '../db/models/user.js'
// Author is stored as string now; no need to cast to ObjectId

export async function createPost(userId, { title, contents, tags }) {
  let normalizedTags = []
  if (Array.isArray(tags)) {
    normalizedTags = tags
      .filter((t) => typeof t === 'string' && t.trim() !== '')
      .map((t) => t.trim())
  } else if (typeof tags === 'string') {
    normalizedTags = tags
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0)
  }

  const post = new Post({
    title,
    author: String(userId),
    contents,
    tags: normalizedTags,
  })
  return await post.save()
}

function toMongooseSort(value) {
  if (!value) return -1
  const v = String(value).toLowerCase()
  if (v === 'desc' || v === 'descending' || v === '-1' || v === '-') return -1
  return 1
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  const order = toMongooseSort(sortOrder)
  return await Post.find(query).sort({ [sortBy]: order })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(authorUsername, options) {
  return await listPosts({ author: authorUsername }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function listPostsByUser(userId, options) {
  // userId here is actually the username (we set sub=username)
  const user = await User.findOne({ username: userId })
  const orFilters = [{ author: String(userId) }]
  if (user?._id) {
    orFilters.push({ author: user._id })
  }
  return await listPosts({ $or: orFilters }, options)
}

export async function listPostsByTagAndUser(tag, userId, options) {
  const user = await User.findOne({ username: userId })
  const orFilters = [{ tags: tag, author: String(userId) }]
  if (user?._id) {
    orFilters.push({ tags: tag, author: user._id })
  }
  return await listPosts({ $or: orFilters }, options)
}

// Removed date-based mixing; backend now strictly returns user-owned posts

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(userId, postId, { title, contents, tags }) {
  const user = await User.findOne({ username: userId })
  const orFilters = [{ author: String(userId) }]
  if (user?._id) orFilters.push({ author: user._id })
  return await Post.findOneAndUpdate(
    { _id: postId, $or: orFilters },
    { $set: { title, contents, tags } },
    { new: true },
  )
}

export async function deletePost(userId, postId) {
  const user = await User.findOne({ username: userId })
  const orFilters = [{ author: String(userId) }]
  if (user?._id) orFilters.push({ author: user._id })
  return await Post.deleteOne({ _id: postId, $or: orFilters })
}

export async function likePost(postId) {
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  post.likes = (post.likes || 0) + 1
  await post.save()
  return post
}

export async function sharePost(postId) {
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  post.shares = (post.shares || 0) + 1
  await post.save()
  return post
}
