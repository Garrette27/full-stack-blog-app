import PropTypes from 'prop-types'
import { DeletePostButton } from './DeletePostButton' // Import the DeletePostButton component

export function Post({ title, contents, author, postId }) {
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
}
