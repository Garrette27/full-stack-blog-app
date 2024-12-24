export const getPosts = async (queryParams) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/posts?` +
      new URLSearchParams(queryParams),
  )
  return await res.json()
}

export const createPost = async (post) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(post),
  })
  return await res.json()
}

// DELETE Post Function
export const deletePost = async (postId) => {
  try {
    const res = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/posts/${postId}`,
      {
        method: 'DELETE',
      },
    )

    if (!res.ok) {
      throw new Error(`Error deleting post: ${res.statusText}`)
    }

    return true // Indicate successful deletion
  } catch (error) {
    console.error('Error deleting post:', error)
    throw error // Re-throw the error for further handling
  }
}
