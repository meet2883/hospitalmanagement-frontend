import api from '../utils/api'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  if (response.data?.success) {
    return response.data.data
  }
  throw new Error(response.data?.message || 'Request failed')
}

export const patientService = {
  // Get all patients
  getAllPatients: async () => {
    const response = await api.get('/patient/all')
    return extractData(response)
  },

  // Get patient by ID
  getPatientById: async (id) => {
    const response = await api.get(`/patient/${id}`)
    return extractData(response)
  },

  // Create new patient
  createPatient: async (patientData) => {
    const response = await api.post('/patient', patientData)
    return extractData(response)
  },

  // Update patient
  updatePatient: async (id, patientData) => {
    const response = await api.put(`/patient/update/${id}`, patientData)
    return extractData(response)
  },

  // Delete patient
  deletePatient: async (id) => {
    const response = await api.delete(`/patient/delete/${id}`)
    if (response.data?.success) {
      return response.data
    }
    throw new Error(response.data?.message || 'Delete failed')
  },
}
