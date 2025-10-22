// postsAPI.js
import { getBackendUrl } from '../config.js'

/**
 * Fetch all posts with optional query parameters.
 * @param {Object} queryParams - Key-value pairs for query parameters.
 * @param {string} token - Authentication token.
 * @returns {Promise<Array>} - List of posts.
 */
export const getPosts = async (queryParams, token) => {
  const url = new URL(`${getBackendUrl()}/posts`)
  if (queryParams) {
    Object.entries(queryParams).forEach(([key, value]) =>
      url.searchParams.append(key, value),
    )
  }

  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`Error fetching posts: ${res.statusText}`)
  return await res.json()
}

/**
 * Create a new post.
 * @param {Object} post - Post data.
 * @returns {Promise<Object>} - Created post data.
 */
export const createPost = async (token, post) => {
  const res = await fetch(`${getBackendUrl()}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(post),
  })

  if (!res.ok) throw new Error(`Error creating post: ${res.statusText}`)
  return await res.json()
}

/**
 * Delete a post by ID.
 * @param {string} postId - ID of the post to delete.
 * @param {string} token - Authentication token.
 * @returns {Promise<boolean>} - Returns true if deletion succeeds.
 */
export const deletePost = async (postId, token) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(
    `${getBackendUrl()}/posts/${postId}`,
    {
      method: 'DELETE',
      headers,
    },
  )

  if (!res.ok) throw new Error(`Error deleting post: ${res.statusText}`)
  return true
}

/**
 * Update an existing post by ID.
 * @param {string} postId - ID of the post to update.
 * @param {Object} updatedPost - Updated post data.
 * @param {string} token - Authentication token.
 * @returns {Promise<Object>} - Updated post data.
 */
export const updatePost = async (postId, updatedPost, token) => {
  const headers = {
    'Content-Type': 'application/json',
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(
    `${getBackendUrl()}/posts/${postId}`,
    {
      method: 'PATCH',
      headers,
      body: JSON.stringify(updatedPost),
    },
  )

  if (!res.ok) throw new Error(`Error updating post: ${res.statusText}`)
  return await res.json()
}

/**
 * Like a post by ID.
 * @param {string} postId - ID of the post to like.
 * @returns {Promise<Object>} - Updated post data.
 */
export const likePost = async (postId) => {
  if (!postId) throw new Error('Invalid post ID')

  const res = await fetch(
    `${getBackendUrl()}/posts/${postId}/like`, // Remove extra '/api/v1'
    {
      method: 'PATCH',
    },
  )

  if (!res.ok) throw new Error(`Failed to like post: ${res.statusText}`)
  return await res.json()
}

// sharePost function
export const sharePost = async (postId) => {
  if (!postId) throw new Error('Invalid post ID')

  const res = await fetch(
    `${getBackendUrl()}/posts/${postId}/share`, // Remove extra '/api/v1'
    {
      method: 'PATCH',
    },
  )

  if (!res.ok) throw new Error(`Failed to share post: ${res.statusText}`)
  return await res.json()
}

export default {
  getPosts,
  createPost,
  deletePost,
  updatePost,
  likePost,
  sharePost,
}
