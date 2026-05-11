import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // No Authorization header needed - httpOnly cookie is sent automatically by browser
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error('API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers
      }
    })

    // Only redirect on 401 if we're NOT on the sign-in page
    // (don't redirect when user is trying to login with wrong credentials)
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname
      if (currentPath !== '/signin' && currentPath !== '/sign-in') {
        // Handle unauthorized access - clear user cookie and redirect to signin
        Cookies.remove('auth_token', { path: '/' })
        window.location.href = '/signin'
      }
      // If we're on sign-in page, let the component handle the error
    }
    if (error.response?.status === 403) {
      console.error('Forbidden - You may not have permission to access this resource')
    }
    return Promise.reject(error)
  }
)

export default api
