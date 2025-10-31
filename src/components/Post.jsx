import PropTypes from 'prop-types'
import { format } from 'date-fns'
import { likePost, sharePost } from '../api/posts.js'
import { useState, useEffect } from 'react'
import { useMutation } from '@tanstack/react-query'
import { DeletePostButton } from './DeletePostButton'
import { User } from './User.jsx'
import { EditPostButton } from './EditPostButton'
import { postTrackEvent } from '../api/events.js'

export function Post({
  title,
  contents,
  author,
  postId,
  createdAt,
  imageUrl,
  videoUrl,
  initialLikeCount, // Assuming you pass the initial like count
  currentUserId, // Add this to determine if user can edit/delete
}) {
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [session, setSession] = useState()
  const trackEventMutation = useMutation({
    mutationFn: (action) => postTrackEvent({ postId, action, session }),
    onSuccess: (data) => setSession(data?.session),
  })

  // Determine if the post can be edited/deleted
  const canEditDelete = () => {
    // If no current user, can't edit/delete
    if (!currentUserId) return false
    
    // If no author info, can't edit/delete (shouldn't happen but safety check)
    if (!author) return false
    
    // Check if this is the user's own post
    const authorId = typeof author === 'object' ? author._id : author
    const isOwnPost = authorId === currentUserId
    
    // Check if this is an existing post (created before today)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const postDate = new Date(createdAt)
    const isExistingPost = postDate < today
    
    // Can edit/delete only if it's the user's own post AND not an existing post
    return isOwnPost && !isExistingPost
  }

  const handleLike = async (id) => {
    try {
      const updatedPost = await likePost(id)
      setLikeCount(updatedPost.likes)
      // Also track a like event for analytics
      trackEventMutation.mutate('like')
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

  useEffect(() => {
    let timeout = setTimeout(() => {
      trackEventMutation.mutate('startView')
      timeout = null
    }, 1000)
    return () => {
      if (timeout) clearTimeout(timeout)
      else trackEventMutation.mutate('endView')
    }
  }, [])

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
          Written by <User id={typeof author === 'object' ? author._id : author} />
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

      {canEditDelete() && (
        <>
          <EditPostButton
            postId={postId}
            currentTitle={title}
            currentContents={contents}
          />
          <DeletePostButton postId={postId} />
        </>
      )}
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
  currentUserId: PropTypes.string,
}
