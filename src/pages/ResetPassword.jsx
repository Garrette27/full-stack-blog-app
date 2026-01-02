import { useState, useEffect } from 'react'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { PasswordInput } from '../components/PasswordInput.jsx'
import { getBackendUrl } from '../config.js'

export function ResetPassword() {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    if (!token) {
      setMessage('Invalid reset link. Please request a new password reset.')
    }
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== confirmPassword) {
      setMessage('Passwords do not match.')
      return
    }

    if (password.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const response = await fetch(`${getBackendUrl()}/password-reset/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(
          'Password reset successfully! You can now log in with your new password.',
        )
        setTimeout(() => {
          navigate('/login')
        }, 3000)
      } else {
        setMessage(data.error || 'Failed to reset password. Please try again.')
      }
    } catch (error) {
      setMessage('Failed to reset password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!token) {
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
        <h2>Invalid Reset Link</h2>
        <p>The password reset link is invalid or has expired.</p>
        <Link
          to='/forgot-password'
          style={{ color: '#007bff', textDecoration: 'none' }}
        >
          Request a new password reset
        </Link>
      </div>
    )
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
      <h2>Reset Password</h2>
      <p>Enter your new password below.</p>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor='password'
            style={{ display: 'block', marginBottom: '5px' }}
          >
            New Password:
          </label>
          <PasswordInput
            id='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength='6'
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label
            htmlFor='confirmPassword'
            style={{ display: 'block', marginBottom: '5px' }}
          >
            Confirm New Password:
          </label>
          <PasswordInput
            id='confirmPassword'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength='6'
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>

      {message && (
        <div
          style={{
            marginTop: '15px',
            padding: '10px',
            backgroundColor: message.includes('successfully')
              ? '#d4edda'
              : '#f8d7da',
            border: `1px solid ${
              message.includes('successfully') ? '#c3e6cb' : '#f5c6cb'
            }`,
            borderRadius: '4px',
            color: message.includes('successfully') ? '#155724' : '#721c24',
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
