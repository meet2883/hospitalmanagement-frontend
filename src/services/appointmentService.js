import api from '../utils/api'

// Helper function to extract data from ApiResponse
const extractData = (response) => {
  if (response.data?.success) {
    return response.data.data
  }
  throw new Error(response.data?.message || 'Request failed')
}

// Convert snake_case keys to camelCase for appointment data
const convertAppointmentKeys = (appointments) => {
  if (Array.isArray(appointments)) {
    return appointments.map((apt) => ({
      ...apt,
      patientName: apt.patient_name,
      doctorName: apt.doctor_name,
      patientId: apt.patient_id || apt.patientId,
      doctorId: apt.doctor_id || apt.doctorId,
      appointmentdatetime: apt.date, // Map 'date' to 'appointmentdatetime'
    }))
  }
  return appointments
}

export const appointmentService = {
  // Get all appointments
  getAllAppointments: async () => {
    const response = await api.get('/appointment')
    const data = extractData(response)
    return convertAppointmentKeys(data)
  },

  // Create new appointment
  createAppointment: async (appointmentData, patientId, doctorId) => {
    const response = await api.post(
      `/appointment/create/${patientId}/${doctorId}`,
      appointmentData
    )
    return extractData(response)
  },

  // Update appointment
  updateAppointment: async (id, appointmentData) => {
    const response = await api.put(`/appointment/update/${id}`, appointmentData)
    return extractData(response)
  },

  // Delete appointment
  deleteAppointment: async (id) => {
    const response = await api.delete(`/appointment/${id}`)
    if (response.data?.success) {
      return response.data
    }
    throw new Error(response.data?.message || 'Delete failed')
  },
}
