import { createContext, useState, useContext } from 'react'
import PropTypes from 'prop-types'

export const AuthContext = createContext({
  token: null,
  setToken: () => {},
  userId: null,
})

export const AuthContextProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  
  // Extract userId from token if it exists
  const getUserIdFromToken = (token) => {
    if (!token) return null
    try {
      // Decode JWT token to get user ID
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.sub || payload.userId || null
    } catch (error) {
      console.error('Error decoding token:', error)
      return null
    }
  }
  
  const userId = getUserIdFromToken(token)
  
  return (
    <AuthContext.Provider value={{ token, setToken, userId }}>
      {children}
    </AuthContext.Provider>
  )
}

AuthContextProvider.propTypes = {
  children: PropTypes.element.isRequired,
}

export function useAuth() {
  const { token, setToken, userId } = useContext(AuthContext)
  return [token, setToken, null, userId]
}
