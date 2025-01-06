import PropTypes from 'prop-types'
import { DeletePostButton } from './DeletePostButton' // Import the DeletePostButton component
import { format } from 'date-fns' // Import date-fns for date formatting
import ReactHtmlParser from 'html-react-parser' // Import the parser

export function Post({ title, contents, author, postId, createdAt }) {
  console.log('Post ID:', postId) // Debugging output

  return (
    <article className='post'>
      <h2>{title}</h2> {/* Changed to h2 for more prominence */}
      {/* Parse and render the HTML content */}
      <div className='post-content'>{ReactHtmlParser(contents)}</div>
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
  contents: PropTypes.string, // Contents are now a string containing HTML
  author: PropTypes.string,
  postId: PropTypes.string.isRequired, // Add postId as a required prop
  createdAt: PropTypes.string, // Add createdAt as an optional prop
}
