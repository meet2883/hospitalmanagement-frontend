import api from '../utils/api'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  if (response.data?.success) {
    return response.data.data
  }
  throw new Error(response.data?.message || 'Request failed')
}

export const doctorService = {
  // Get all doctors
  getAllDoctors: async () => {
    const response = await api.get('/doctor/all')
    return extractData(response)
  },

  // Get doctor by ID
  getDoctorById: async (id) => {
    const response = await api.get(`/doctor/${id}`)
    return extractData(response)
  },

  // Create new doctor
  createDoctor: async (doctorData) => {
    const response = await api.post('/doctor/create', doctorData)
    return extractData(response)
  },

  // Update doctor
  updateDoctor: async (id, doctorData) => {
    const response = await api.put(`/doctor/update/${id}`, doctorData)
    return extractData(response)
  },

  // Delete doctor
  deleteDoctor: async (id) => {
    const response = await api.delete(`/doctor/delete/${id}`)
    if (response.data?.success) {
      return response.data
    }
    throw new Error(response.data?.message || 'Delete failed')
  },
}
