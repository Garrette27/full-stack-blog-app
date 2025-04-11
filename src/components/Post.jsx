import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { likePost, sharePost } from '../api/posts.js'
import { useState, useEffect } from 'react'
import { DeletePostButton } from './DeletePostButton'
import { User } from './User.jsx'
import { EditPostButton } from './EditPostButton'

export function Post({
  title,
  contents,
  author,
  postId,
  createdAt,
  imageUrl,
  videoUrl,
  initialLikeCount, // Assuming you pass the initial like count
}) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)

  const handleLike = async (id) => {
    try {
      const updatedPost = await likePost(id)
      setLikeCount(updatedPost.likeCount)
      alert('Post liked successfully!')
    } catch (error) {
      alert('Failed to like post. Please try again.')
    }
  }

  const handleShare = async (id) => {
    try {
      await sharePost(id)
      alert('Post shared successfully!')
    } catch (error) {
      alert('Failed to share post. Please try again.')
    }
  }

  const embedImage = (url) => {
    return /\.(jpeg|jpg|gif|png|bmp|webp)$/i.test(url) ? (
      <img src={url} alt='Embedded content' className='post-image' />
    ) : null
  }

  const embedVideo = (url) => {
    const youtubeRegex =
      /https:\/\/(www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/
    const match = url.match(youtubeRegex)
    if (match) {
      const videoId = match[2]
      return (
        <iframe
          title='Descriptive Title'
          width='560'
          height='315'
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder='0'
          allow='accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'
          allowFullScreen
        ></iframe>
      )
    }
    return null
  }

  const parseContentWithEmbeds = (content) => {
    const urlRegex = /https?:\/\/[^\s]+/g
    const urls = content.match(urlRegex)
    if (urls) {
      return urls.map((url, index) => {
        const image = embedImage(url)
        const video = embedVideo(url)

        if (image) {
          return <div key={index}>{image}</div>
        } else if (video) {
          return <div key={index}>{video}</div>
        }
        return (
          <a key={index} href={url} target='_blank' rel='noopener noreferrer'>
            {url}
          </a>
        )
      })
    }
    return content
  }

  useEffect(() => {
    if (initialLikeCount !== undefined) {
      setLikeCount(initialLikeCount)
    }
  }, [initialLikeCount])

  return (
    <article className='post'>
      <div className='post-header'>
        <h2 id={`post${postId}`}>{title}</h2>
      </div>

      <div className='post-content'>
        {parseContentWithEmbeds(contents)}
        {imageUrl && <img src={imageUrl} alt={title} className='post-image' />}
        {videoUrl && (
          <video controls>
            <track
              kind='subtitles'
              src='path_to_captions.vtt'
              srcLang='en'
              label='English'
            />
            <source src='video_file.mp4' type='video/mp4' />
            Your browser does not support the video tag.
          </video>
        )}
      </div>

      {author && (
        <em>
          Written by <User id={author} />
        </em>
      )}
      <p>
        <small>
          Published:{' '}
          {createdAt ? format(new Date(createdAt), 'PPpp') : 'Unknown'}
        </small>
      </p>

      <div className='post-footer'>
        <button className='like-button' onClick={() => handleLike(postId)}>
          Like {likeCount > 0 && `(${likeCount})`}
        </button>
        <button className='share-button' onClick={() => handleShare(postId)}>
          Share
        </button>
      </div>

      <EditPostButton
        postId={postId}
        currentTitle={title}
        currentContents={contents}
      />
      <DeletePostButton postId={postId} />
    </article>
  )
}

Post.propTypes = {
  title: PropTypes.string.isRequired,
  contents: PropTypes.string,
  author: PropTypes.string,
  postId: PropTypes.string.isRequired,
  createdAt: PropTypes.string,
  imageUrl: PropTypes.string,
  videoUrl: PropTypes.string,
  initialLikeCount: PropTypes.number,
}
