import { Link, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from '../contexts/AuthContext.jsx'
import { User } from './User.jsx'

export function Header() {
  const [token, setToken] = useAuth()
  const navigate = useNavigate()

  if (token) {
    const { sub } = jwtDecode(token)
    console.log('Header rendering with token, showing Dashboard link')
    return (
      <div
        style={{
          border: '1px solid red',
          padding: '5px',
          background: '#ffffcc',
        }}
      >
        <strong>DEBUG: Header v2 loaded</strong>
        <br />
        Logged in as <User id={sub} /> |{' '}
        <button
          onClick={() => {
            console.log('Dashboard button clicked, navigating to /dashboard')
            navigate('/dashboard')
          }}
          style={{
            background: '#007bff',
            color: 'white',
            border: '2px solid #0056b3',
            fontWeight: 'bold',
            cursor: 'pointer',
            padding: '5px 10px',
            marginRight: '10px',
            fontSize: '14px',
            borderRadius: '4px',
          }}
        >
          🎯 DASHBOARD 🎯
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
