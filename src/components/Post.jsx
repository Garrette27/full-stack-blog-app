import PropTypes from 'prop-types'
import { DeletePostButton } from './DeletePostButton' // Import the DeletePostButton component
import { format } from 'date-fns' // Import date-fns for date formatting

export function Post({ title, contents, author, postId, createdAt }) {
  console.log('Post ID:', postId) // Debugging output

  return (
    <article>
      <h3>{title}</h3>
      <div>{contents}</div>
      {author && (
        <em>
          <br />
          Written by <strong>{author}</strong>
        </em>
      )}
      <p>
        <small>
          Published:{' '}
          {createdAt ? format(new Date(createdAt), 'PPpp') : 'Unknown'}
          {/* Format the createdAt date if it exists */}
        </small>
      </p>
      <DeletePostButton postId={postId} />{' '}
      {/* Pass postId as a prop to DeletePostButton */}
    </article>
  )
}

// Define PropTypes for the component
Post.propTypes = {
  title: PropTypes.string.isRequired, // Add title as required
  contents: PropTypes.string,
  author: PropTypes.string,
  postId: PropTypes.string.isRequired, // Add postId as a required prop
  createdAt: PropTypes.string, // Add createdAt as an optional prop
}
