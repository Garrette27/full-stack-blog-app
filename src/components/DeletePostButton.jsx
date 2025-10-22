import { useMutation } from '@tanstack/react-query'
import { deletePost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import PropTypes from 'prop-types' // Import PropTypes

export function DeletePostButton({ postId }) {
  const [token] = useAuth()
  const deletePostMutation = useMutation({
    mutationFn: () => deletePost(token, postId),
    onSuccess: () => {
      alert('Post deleted successfully')
    },
  })

  return (
    <button
      onClick={() => deletePostMutation.mutate()}
      disabled={deletePostMutation.isPending}
    >
      {deletePostMutation.isPending ? 'Deleting...' : 'Delete Post'}
    </button>
  )
}

// Add PropTypes validation for the postId prop
DeletePostButton.propTypes = {
  postId: PropTypes.string.isRequired, // Ensure postId is passed and is a string
}
