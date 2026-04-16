import api from '../utils/api'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  if (response.data?.success) {
    return response.data.data
  }
  throw new Error(response.data?.message || 'Request failed')
}

export const insuranceService = {
  // Get all insurance
  getAllInsurance: async () => {
    const response = await api.get('/insurance/all')
    return extractData(response)
  },

  // Get insurance by ID
  getInsuranceById: async (id) => {
    const response = await api.get(`/insurance/${id}`)
    return extractData(response)
  },

  // Create new insurance
  createInsurance: async (insuranceData) => {
    const response = await api.post('/insurance/create', insuranceData)
    return extractData(response)
  },

  // Update insurance
  updateInsurance: async (id, insuranceData) => {
    const response = await api.put(`/insurance/update/${id}`, insuranceData)
    return extractData(response)
  },

  // Delete insurance
  deleteInsurance: async (id) => {
    const response = await api.delete(`/insurance/${id}`)
    if (response.data?.success) {
      return response.data
    }
    throw new Error(response.data?.message || 'Delete failed')
  },
}
