import { Post } from '../db/models/post.js'

export async function createPost({ title, author, contents, tags }) {
  const post = new Post({ title, author, contents, tags })
  return await post.save()
}

async function listPosts(
  query = {},
  { sortBy = 'createdAt', sortOrder = 'descending' } = {},
) {
  return await Post.find(query).sort({ [sortBy]: sortOrder })
}

export async function listAllPosts(options) {
  return await listPosts({}, options)
}

export async function listPostsByAuthor(author, options) {
  return await listPosts({ author }, options)
}

export async function listPostsByTag(tags, options) {
  return await listPosts({ tags }, options)
}

export async function getPostById(postId) {
  return await Post.findById(postId)
}

export async function updatePost(postId, { title, author, contents, tags }) {
  return await Post.findOneAndUpdate(
    { _id: postId },
    { $set: { title, author, contents, tags } },
    { new: true },
  )
}

export async function deletePost(postId) {
  return await Post.deleteOne({ _id: postId })
}

export async function likePost(postId) {
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  // Increment the like count (assuming you have a 'likes' field in the model)
  post.likes = (post.likes || 0) + 1

  await post.save()
  return post // Return updated post
}

export async function sharePost(postId) {
  const post = await Post.findById(postId)
  if (!post) throw new Error('Post not found')

  // Increment the share count (assuming you have a 'shares' field in the model)
  post.shares = (post.shares || 0) + 1

  await post.save()
  return post // Return updated post
}
