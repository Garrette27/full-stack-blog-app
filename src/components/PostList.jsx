import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
import React from 'react'

export function PostList({ posts = [] }) {
  console.log('Posts:', posts) // Debugging output
  return (
    <div>
      {posts.map(({ _id, createdAt, ...rest }) => (
        <React.Fragment key={_id}>
          <Post {...rest} postId={_id} createdAt={createdAt} />{' '}
          {/* Pass createdAt */}
          <hr />
        </React.Fragment>
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
      createdAt: PropTypes.string, // Add createdAt to the shape
    }),
  ).isRequired,
}
