import Cookies from 'js-cookie'
import api from '../utils/api'

const USER_COOKIE_NAME = 'auth_token'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
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
      const response = await api.post('/auth/sign-in', { email: username, password })

      // Extract user data from response body
      const data = extractData(response)

      // User data structure: { role: "ADMIN", name: "Meet Panchal" }
      const userData = data.user || data.data || data

      // Parse role to extract clean role name
      // Handle formats: "[ROLE_ADMIN]", "ROLE_ADMIN", or "ADMIN"
      let cleanRole = 'EMPLOYEE'; // default fallback
      if (userData.role) {
        // First, try to match ROLE_XXX format
        const roleMatch = userData.role.match(/ROLE_(\w+)/)
        if (roleMatch) {
          cleanRole = roleMatch[1]
        } else if (userData.role === 'ADMIN' || userData.role === 'DOCTOR' || userData.role === 'EMPLOYEE') {
          // Direct role name without prefix
          cleanRole = userData.role
        } else {
          // Fallback: use the role as-is
          cleanRole = userData.role
        }
      }
      userData.role = cleanRole

      // Store user data in cookie for frontend display
      // Auth token is handled by httpOnly cookie (set by backend)
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
        expires: 7,
        secure: false,
        sameSite: 'Lax',
        path: '/'
      })

      return { user: userData }
    } catch (error) {
      console.error('Sign in error:', error)
      throw handleAuthError(error)
    }
  },

  // Sign out
  signOut: async () => {
    try {
      // Call logout API if available (clears httpOnly cookie on backend)
      await api.post('/auth/logout')
    } catch (error) {
      console.error('Logout API error:', error)
      // Continue with local logout even if API fails
    } finally {
      // Remove user cookie with exact same options as when setting
      Cookies.remove(USER_COOKIE_NAME, {
        path: '/',
        secure: false,
        sameSite: 'Lax'
      })

      // Also try removing with different path combinations to ensure cleanup
      Cookies.remove(USER_COOKIE_NAME, { path: '/' })
      Cookies.remove(USER_COOKIE_NAME)
    }
  },

  // Verify session with backend - call this on page load/refresh
  verifySession: async () => {
    try {
      const response = await api.post('/auth/me')
      const data = extractData(response)

      // User data from response: { email, id, name, role }
      const userData = data || data.data || data.user

      // Parse role to extract clean role name
      let cleanRole = 'EMPLOYEE'
      if (userData.role) {
        const roleMatch = userData.role.match(/ROLE_(\w+)/)
        if (roleMatch) {
          cleanRole = roleMatch[1]
        } else if (userData.role === 'ADMIN' || userData.role === 'DOCTOR' || userData.role === 'EMPLOYEE') {
          cleanRole = userData.role
        } else {
          cleanRole = userData.role
        }
      }
      userData.role = cleanRole

      // Update user data in cookie
      Cookies.set(USER_COOKIE_NAME, JSON.stringify(userData), {
        expires: 7,
        secure: false,
        sameSite: 'Lax',
        path: '/'
      })

      return { user: userData, isValid: true }
    } catch (error) {
      // Session is invalid or expired
      console.error('Session verification failed:', error.message)
      // Clear user cookie
      Cookies.remove(USER_COOKIE_NAME, { path: '/' })
      return { user: null, isValid: false }
    }
  },

  // Get stored user data (from cookie - for immediate UI display)
  getUser: () => {
    const userStr = Cookies.get(USER_COOKIE_NAME)
    if (userStr) {
      try {
        return JSON.parse(userStr)
      } catch (e) {
        console.error('Error parsing user data from cookie:', e)
        return null
      }
    }
    return null
  },

  // Check if user is authenticated (cookie exists)
  isAuthenticated: () => {
    return !!Cookies.get(USER_COOKIE_NAME)
  },
}
