import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()

  if (token) {
    const { sub } = jwtDecode(token)
    return (
      <div>
        Logged in as <User id={sub} /> |{' '}
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#007bff',
            textDecoration: 'underline',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '0',
            marginRight: '10px',
            fontSize: 'inherit',
          }}
        >
          Dashboard
        </button>
        <button onClick={() => setToken(null)}>Logout</button>
      </div>
    )
  }

  return (
    <div>
      <Link to='/login'>Log In</Link> | <Link to='/signup'>Sign Up</Link>
    </div>
  )
}
