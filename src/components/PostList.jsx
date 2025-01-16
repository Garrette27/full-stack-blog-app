import React from 'react' // Add this import to resolve the error
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
import './PostList.css'

export function PostList({ posts = [] }) {
  return (
    <div className='post-list-container'>
      {posts.map(({ _id, createdAt, title, contents, author }) => (
        <React.Fragment key={_id}>
          <div className='post'>
            <Post
              title={title}
              contents={contents}
              author={author}
              postId={_id}
              createdAt={createdAt}
            />
            <hr />
          </div>
        </React.Fragment>
      ))}
    </div>
  )
}

PostList.propTypes = {
  posts: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      contents: PropTypes.string,
      author: PropTypes.string,
      createdAt: PropTypes.string,
    }),
  ).isRequired,
}
