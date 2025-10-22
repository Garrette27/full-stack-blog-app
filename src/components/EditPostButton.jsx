import { useMutation } from '@tanstack/react-query'
import { updatePost } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'
import PropTypes from 'prop-types'
import { useState } from 'react'

export function EditPostButton({ postId, currentTitle, currentContents }) {
  const [token] = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [newTitle, setNewTitle] = useState(currentTitle)
  const [newContents, setNewContents] = useState(currentContents)

  const editPostMutation = useMutation({
    mutationFn: () =>
      updatePost(token, postId, { title: newTitle, contents: newContents }),
    onSuccess: () => {
      alert('Post updated successfully')
      setIsEditing(false)
    },
  })

  return (
    <div>
      {isEditing ? (
        <div>
          <input
            type='text'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
          />
          <textarea
            value={newContents}
            onChange={(e) => setNewContents(e.target.value)}
          />
          <button onClick={() => editPostMutation.mutate()}>
            Save Changes
          </button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <button onClick={() => setIsEditing(true)}>Edit Post</button>
      )}
    </div>
  )
}

EditPostButton.propTypes = {
  postId: PropTypes.string.isRequired,
  currentTitle: PropTypes.string.isRequired,
  currentContents: PropTypes.string.isRequired,
}
