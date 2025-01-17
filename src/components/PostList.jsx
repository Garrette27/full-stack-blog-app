import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { Post } from './Post.jsx'
import './PostList.css'

export function PostList({ posts = [] }) {
  const [allPosts, setAllPosts] = useState(posts)

  // Update posts on like or share action
  const updatePost = (updatedPost) => {
    setAllPosts((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post,
      ),
    )
  }

  useEffect(() => {
    setAllPosts(posts)
  }, [posts])

  return (
    <div className='post-list-container'>
      <div className='contact-list'>
        <h3>Unordered List</h3>
        <ul>
          {allPosts.map(({ _id, title }) => (
            <li key={_id}>
              <a href={`#post${_id}`}>{title}</a>
            </li>
          ))}
        </ul>
      </div>

      {allPosts.map(
        ({
          _id,
          createdAt,
          title,
          contents,
          author,
          imageUrl,
          videoUrl,
          likeCount,
        }) => (
          <React.Fragment key={_id}>
            <div id={`post${_id}`} className='post'>
              <Post
                title={title}
                contents={contents}
                author={author}
                postId={_id}
                createdAt={createdAt}
                imageUrl={imageUrl}
                videoUrl={videoUrl}
                initialLikeCount={likeCount} // Pass likeCount as initialLikeCount
                updatePost={updatePost} // Passing the update function to Post
              />
              <hr />
            </div>
          </React.Fragment>
        ),
      )}
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
      imageUrl: PropTypes.string,
      videoUrl: PropTypes.string,
      likeCount: PropTypes.number,
    }),
  ).isRequired,
}
