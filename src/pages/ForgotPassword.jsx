import { useState } from 'react'
import { Link } from 'react-router-dom'
import { getBackendUrl } from '../config.js'

export function ForgotPassword() {
  const [emailOrUsername, setEmailOrUsername] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(
        `${getBackendUrl()}/password-reset/request`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: emailOrUsername }),
        },
      )

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        // If response is not JSON, use status text
        throw new Error(
          `Server error: ${response.status} ${response.statusText}`,
        )
      }

      if (response.ok) {
        setMessage(data.message || 'Password reset link sent!')
      } else {
        const errorMsg =
          data?.error ||
          `Failed to send password reset email (Status: ${response.status})`
        console.error('Password reset API error:', {
          status: response.status,
          statusText: response.statusText,
          error: data.error,
          url: `${getBackendUrl()}/password-reset/request`,
        })
        setMessage(errorMsg)
      }
    } catch (error) {
      console.error('Password reset error:', error)
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        setMessage(
          'Cannot connect to server. Please check your internet connection and try again.',
        )
      } else {
        setMessage(
          `Failed to send password reset email: ${
            error.message || 'Unknown error'
          }`,
        )
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        backgroundColor: '#f9f9f9',
      }}
    >
      <h2>Forgot Password</h2>
      <p>
        Enter your email address or username and we&apos;ll send you a link to
        reset your password.
      </p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor='email'
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Email Address or Username:
          </label>
          <input
            type='text'
            id='email'
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              boxSizing: 'border-box',
            }}
          />
        </div>

        <button
          type='submit'
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: message.includes('sent') ? '#d4edda' : '#f8d7da',
            border: `1px solid ${
              message.includes('sent') ? '#c3e6cb' : '#f5c6cb'
            }`,
            borderRadius: '4px',
            color: message.includes('sent') ? '#155724' : '#721c24',
          }}
        >
          {message}
        </div>
      )}

      <div style={{ marginTop: '15px', textAlign: 'center' }}>
        <Link to='/login' style={{ color: '#007bff', textDecoration: 'none' }}>
          Back to Login
        </Link>
      </div>
    </div>
  )
}
