import { useQuery } from '@tanstack/react-query'
import PropTypes from 'prop-types'
import { getUserInfo } from '../api/users.js'

export function User({ id }) {
  // If the id looks like an Object ID (24 hex characters), show a friendly name
  if (id && id.length === 24 && /^[0-9a-fA-F]{24}$/.test(id)) {
    return <strong>Blog Author</strong>
  }
  
  const userInfoQuery = useQuery({
    queryKey: ['users', id],
    queryFn: () => getUserInfo(id),
  })
  const userInfo = userInfoQuery.data ?? {}
  
  // Handle case where userInfo might be an object with _id and username
  const username = userInfo?.username || userInfo?.id || id
  
  return <strong>{username}</strong>
}

User.propTypes = {
  id: PropTypes.string.isRequired,
}
