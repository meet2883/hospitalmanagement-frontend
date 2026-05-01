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

  // Get all users (Admin only)
  getAllUsers: async () => {
    const response = await api.get('/user/all')
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
