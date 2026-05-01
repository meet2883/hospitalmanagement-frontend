import axios from 'axios'
import Cookies from 'js-cookie'
import { getToken } from './cookies'

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = getToken()
    if (token) {
      // Ensure token doesn't already have "Bearer" prefix
      const cleanToken = token.startsWith('Bearer ') ? token.replace('Bearer ', '') : token
      config.headers.Authorization = `Bearer ${cleanToken}`
    }
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

    if (error.response?.status === 401) {
      // Handle unauthorized access - clear token and redirect to signin
      Cookies.remove('auth_token')
      Cookies.remove('auth_user')
      window.location.href = '/signin'
    }
    if (error.response?.status === 403) {
      console.error('Forbidden - You may not have permission to access this resource')
    }
    return Promise.reject(error)
  }
)

export default api
