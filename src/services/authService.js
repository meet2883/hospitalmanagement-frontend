import Cookies from 'js-cookie'
import { getToken as getSessionToken, setToken, removeToken } from '../utils/cookies'
import api from '../utils/api'

const TOKEN_COOKIE_NAME = 'auth_token'
const USER_COOKIE_NAME = 'auth_user'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  console.log('API Response:', response.data)

  // Handle different response formats
  if (response.data?.success) {
    return response.data.data || response.data
  }
  // If response doesn't have success field, return data directly
  if (response.data) {
    return response.data
  }

  throw new Error(response.data?.message || 'Request failed')
}

// Helper function to handle auth errors
const handleAuthError = (error) => {
  if (error.response) {
    const message = error.response.data?.message || 'Authentication failed'
    throw new Error(message)
  } else if (error.request) {
    throw new Error('Network error. Please check your connection.')
  }
  throw new Error('An unexpected error occurred')
}

export const authService = {
  // Sign in with username and password
  signIn: async (username, password) => {
    try {
      console.log('=== SignIn Started ===')
      const response = await api.post('/auth/sign-in', { name: username, password })
      console.log('Raw API response:', response)

      // Extract token from response headers (authorization header)
      const authHeader = response.headers?.authorization || response.headers?.Authorization
      console.log('Authorization header:', authHeader)

      let token = null
      if (authHeader) {
        token = authHeader.startsWith('Bearer ') ? authHeader.replace('Bearer ', '') : authHeader
        console.log('Token extracted from header:', token.substring(0, 20) + '...')
      }

      if (token) {
        // Store in sessionStorage for Authorization header (JS-readable)
        setToken(token)
        console.log('setToken called, checking sessionStorage...')

        // Verify it was stored
        const storedToken = sessionStorage.getItem('auth_token')
        console.log('Token in sessionStorage after setToken:', storedToken ? 'FOUND' : 'NOT FOUND')

        // Also store in cookie for backend compatibility
        Cookies.set(TOKEN_COOKIE_NAME, token, {
          expires: 7,
          secure: false,
          sameSite: 'Lax',
          path: '/'
        })
        console.log('Token stored in cookie')
      } else {
        console.error('NO TOKEN FOUND IN RESPONSE HEADERS!')
        throw new Error('No token received from server')
      }

      // Extract user data from response body
      const data = extractData(response)
      console.log('Response body data:', data)

      const userData = data.user || data.data || data
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
        expires: 7,
        secure: false,
        sameSite: 'Lax',
        path: '/'
      })
      console.log('User data stored in cookie:', userData)

      // Return consistent structure
      const result = {
        token: token,
        user: userData
      }
      console.log('Returning from signIn:', result)
      console.log('=== SignIn Completed ===')
      return result
    } catch (error) {
      console.error('Sign in error:', error)
      throw handleAuthError(error)
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Call logout API if available
      await api.post('/auth/sign-out')
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    } finally {
      // Remove from sessionStorage
      removeToken()

      // Remove from cookies
      Cookies.remove(TOKEN_COOKIE_NAME, { path: '/' })
      Cookies.remove(USER_COOKIE_NAME, { path: '/' })
    }
  },

  // Get stored token
  getToken: () => {
    return getSessionToken()
  },

  // Get stored user data
  getUser: () => {
    const userStr = Cookies.get(USER_COOKIE_NAME, { path: '/' })
    return userStr ? JSON.parse(userStr) : null
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = getSessionToken()
    return !!token
  },
}
