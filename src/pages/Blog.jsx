import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { PostList } from '../components/PostList.jsx'
import { CreatePost } from '../components/CreatePost.jsx'
import { PostFilter } from '../components/PostFilter.jsx'
import { PostSorting } from '../components/PostSorting.jsx'
import { Header } from '../components/Header.jsx'
import { PostStats } from '../components/PostStats.jsx'
import { getPosts } from '../api/posts.js'
import { useAuth } from '../contexts/AuthContext.jsx'

export function Blog() {
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('descending')
  const [showStats, setShowStats] = useState(false)
  const [selectedPostId, setSelectedPostId] = useState(null)
  const [token, setToken, , userId] = useAuth()

  const postsQuery = useQuery({
    queryKey: ['posts', { author: userId, sortBy, sortOrder }],
    queryFn: () => getPosts({ sortBy, sortOrder }, token), // Fix parameter order: queryParams first, then token
    enabled: !!token && !!userId, // Only run query if user is authenticated and userId is available
  })
  const posts = postsQuery.data ?? []

  // Show login message if not authenticated
  if (!token) {
    return (
      <div style={{ padding: 8 }}>
        <Header />
        <br />
        <hr />
        <br />
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <h2>Welcome to the Blog!</h2>
          <p>Please log in to view and manage your blog posts.</p>
          <button 
            onClick={async () => {
              try {
                const response = await fetch('https://blog-backend-1058054107417-1058054107417.asia-east1.run.app/api/v1/user/login', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ username: 'mock-user', password: 'mock-password' })
                })
                const data = await response.json()
                if (data.token) {
                  setToken(data.token)
                }
              } catch (error) {
                console.error('Login error:', error)
              }
            }}
            style={{ 
              background: '#4CAF50', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px', 
              cursor: 'pointer',
              borderRadius: '4px',
              fontSize: '16px',
              marginTop: '20px'
            }}
          >
            Mock Login (Auto-login for demo)
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: 8 }}>
      <Header />
      <br />
      <hr />
      <br />
      <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>My Blog Posts</h2>
        <button 
          onClick={() => {
            setShowStats(!showStats)
            if (!showStats && posts.length > 0) {
              setSelectedPostId(posts[0]._id)
            }
          }}
          style={{ 
            background: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            padding: '10px 20px', 
            cursor: 'pointer',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {showStats ? 'Hide' : 'Show'} Analytics
        </button>
      </div>
      <CreatePost />
      <br />
      <hr />
      <PostSorting
        fields={['createdAt', 'updatedAt']}
        value={sortBy}
        onChange={(value) => setSortBy(value)}
        orderValue={sortOrder}
        onOrderChange={(orderValue) => setSortOrder(orderValue)}
      />
      <hr />
      <div style={{ display: 'flex', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          {posts.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
              <h3>No posts yet</h3>
              <p>Create your first blog post using the form above!</p>
            </div>
          ) : (
            <PostList posts={posts} currentUserId={userId} />
          )}
        </div>
        {showStats && selectedPostId && (
          <div style={{ width: '600px', border: '1px solid #ccc', padding: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <h3>Statistics</h3>
              <button 
                onClick={() => setShowStats(false)}
                style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}
              >
                Close
              </button>
            </div>
            <PostStats postId={selectedPostId} />
          </div>
        )}
      </div>
    </div>
  )
}
