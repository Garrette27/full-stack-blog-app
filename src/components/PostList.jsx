import PropTypes from 'prop-types'
import { Post } from './Post.jsx'

export function PostList({ posts = [] }) {
  console.log('Posts:', posts) // Debugging output
  return (
    <div>
      {posts.map(({ _id, ...rest }) => (
        <>
          <Post {...rest} postId={_id} /> {/* Explicitly map _id to postId */}
          <hr />
        </>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired, // Ensure _id exists in each post
      title: PropTypes.string.isRequired,
      contents: PropTypes.string,
      author: PropTypes.string,
    }),
  ).isRequired,
}
