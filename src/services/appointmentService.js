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
    return appointments.map((apt) => {
      // Handle nested patient and doctor objects from backend
      const appointmentdatetime = apt.appointmentdatetime || apt.appointmentDateTime || apt.date || apt.appointment_date
      const patientName = apt.patient?.patientName || apt.patient_name || apt.patientName || apt.patient?.name
      const doctorName = apt.doctor?.name || apt.doctor_name || apt.doctorName || apt.doctor?.doctorName
      const patientId = apt.patient?.id || apt.patient_id || apt.patientId
      const doctorId = apt.doctor?.id || apt.doctor_id || apt.doctorId
      const status = apt.status || apt.appointmentStatus

      return {
        ...apt,
        // Preserve original fields and add mapped fields
        patientName: patientName || 'N/A',
        doctorName: doctorName || 'N/A',
        patientId,
        doctorId,
        appointmentdatetime,
        status,
        // Also preserve snake_case versions for compatibility
        patient_name: patientName || 'N/A',
        doctor_name: doctorName || 'N/A',
      }
    })
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

  getByDoctor: async (id) => {
    const response = await api.get(`/appointment/get-appointment-by-doctor/${id}`)
    const data = extractData(response)
    return convertAppointmentKeys(data)
  },

  getAppointments: async (filters) => {
    let filter = {};

    if (filters && filters.date) {
      filter['date'] = filters.date
    }
    if (filters && filters.status) {
      filter['status'] = filters.status
    }
    if (filters && filters.patientName) {
      filter['patientName'] = filters.patientName
    }
    if (filters && filters.doctorName) {
      filter['doctorName'] = filters.doctorName
    }

    const response = await api.get(`/appointment/filter`, { params: filter })
    const data = extractData(response)
    const converted = convertAppointmentKeys(data)
    return converted
  }
}
