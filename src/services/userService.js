import api from '../utils/api'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  if (response.data?.success) {
    return response.data.data
  }
  throw new Error(response.data?.message || 'Request failed')
}

export const userService = {
  // Create new user (Admin only)
  createUser: async (userData) => {
    const response = await api.post('/auth/sign-up', userData)
    return extractData(response)
  },

  // Get all users (Admin only) - with filter and pagination support
  getAllUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams()

    // Add filters to query params
    if (filters.name) queryParams.append('name', filters.name)
    if (filters.email) queryParams.append('email', filters.email)
    if (filters.role) queryParams.append('role', filters.role)

    // Add pagination params
    if (filters.pageNum !== undefined) queryParams.append('pageNum', filters.pageNum)
    if (filters.pageSize !== undefined) queryParams.append('pageSize', filters.pageSize)

    const url = `/auth/filter${queryParams.toString() ? '?' + queryParams.toString() : ''}`
    const response = await api.get(url)
    return extractData(response)
  },

  // Update user (Admin only)
  updateUser: async (id, userData) => {
    const response = await api.put(`/user/${id}`, userData)
    return extractData(response)
  },

  // Delete user (Admin only)
  deleteUser: async (id) => {
    const response = await api.delete(`/user/${id}`)
    if (response.data?.success) {
      return response.data
    }
    throw new Error(response.data?.message || 'Delete failed')
  },
}
