// Token storage for Authorization header (httpOnly cookie can't be read by JS)
const TOKEN_STORAGE_KEY = 'auth_token'

// Read token from sessionStorage (for Authorization header)
export const getToken = () => {
  const token = sessionStorage.getItem(TOKEN_STORAGE_KEY)
  console.log('getToken from sessionStorage:', token ? 'found' : 'not found')
  return token
}

// Store token in sessionStorage
export const setToken = (token) => {
  sessionStorage.setItem(TOKEN_STORAGE_KEY, token)
  console.log('Token saved to sessionStorage')
}

// Remove token from sessionStorage
export const removeToken = () => {
  sessionStorage.removeItem(TOKEN_STORAGE_KEY)
  console.log('Token removed from sessionStorage')
}
