import React, { createContext, useContext, useState, useCallback } from 'react'
import { patientService } from '../services/patientService'
import { doctorService } from '../services/doctorService'
import { appointmentService } from '../services/appointmentService'
import { insuranceService } from '../services/insuranceService'
import { authService } from '../services/authService'

const AppContext = createContext()

export const useApp = () => {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}

export const AppProvider = ({ children }) => {
  const [patients, setPatients] = useState([])
  const [doctors, setDoctors] = useState([])
  const [appointments, setAppointments] = useState([])
  const [insurances, setInsurances] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success',
  })
  const [user, setUser] = useState(() => authService.getUser())
  const [isAuthenticated, setIsAuthenticated] = useState(() =>
    authService.isAuthenticated()
  )

  const showNotification = useCallback((message, severity = 'success') => {
    setNotification({ open: true, message, severity })
  }, [])

  const closeNotification = useCallback(() => {
    setNotification((prev) => ({ ...prev, open: false }))
  }, [])

  // Patient operations
  const fetchPatients = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await patientService.getAllPatients()
      setPatients(data)
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to fetch patients', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const createPatient = async (patientData) => {
    setLoading(true)
    try {
      await patientService.createPatient(patientData)
      await fetchPatients()
      showNotification('Patient created successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to create patient', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updatePatient = async (id, patientData) => {
    setLoading(true)
    try {
      await patientService.updatePatient(id, patientData)
      await fetchPatients()
      showNotification('Patient updated successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to update patient', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deletePatient = async (id) => {
    setLoading(true)
    try {
      await patientService.deletePatient(id)
      await fetchPatients()
      showNotification('Patient deleted successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to delete patient', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Doctor operations
  const fetchDoctors = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await doctorService.getAllDoctors()
      setDoctors(data)
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to fetch doctors', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const createDoctor = async (doctorData) => {
    setLoading(true)
    try {
      await doctorService.createDoctor(doctorData)
      await fetchDoctors()
      showNotification('Doctor created successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to create doctor', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateDoctor = async (id, doctorData) => {
    setLoading(true)
    try {
      await doctorService.updateDoctor(id, doctorData)
      await fetchDoctors()
      showNotification('Doctor updated successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to update doctor', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteDoctor = async (id) => {
    setLoading(true)
    try {
      await doctorService.deleteDoctor(id)
      await fetchDoctors()
      showNotification('Doctor deleted successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to delete doctor', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Appointment operations
  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await appointmentService.getAllAppointments()
      setAppointments(data)
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to fetch appointments', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const createAppointment = async (appointmentData, patientId, doctorId) => {
    setLoading(true)
    try {
      await appointmentService.createAppointment(
        appointmentData,
        patientId,
        doctorId
      )
      await fetchAppointments()
      showNotification('Appointment created successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to create appointment', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateAppointment = async (id, appointmentData) => {
    setLoading(true)
    try {
      await appointmentService.updateAppointment(id, appointmentData)
      await fetchAppointments()
      showNotification('Appointment updated successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to update appointment', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteAppointment = async (id) => {
    setLoading(true)
    try {
      await appointmentService.deleteAppointment(id)
      await fetchAppointments()
      showNotification('Appointment deleted successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to delete appointment', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Insurance operations
  const fetchInsurances = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await insuranceService.getAllInsurance()
      setInsurances(data)
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to fetch insurance plans', 'error')
    } finally {
      setLoading(false)
    }
  }, [showNotification])

  const createInsurance = async (insuranceData) => {
    setLoading(true)
    try {
      await insuranceService.createInsurance(insuranceData)
      await fetchInsurances()
      showNotification('Insurance plan created successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to create insurance plan', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const updateInsurance = async (id, insuranceData) => {
    setLoading(true)
    try {
      await insuranceService.updateInsurance(id, insuranceData)
      await fetchInsurances()
      showNotification('Insurance plan updated successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to update insurance plan', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteInsurance = async (id) => {
    setLoading(true)
    try {
      await insuranceService.deleteInsurance(id)
      await fetchInsurances()
      showNotification('Insurance plan deleted successfully')
      return true
    } catch (err) {
      setError(err.message)
      showNotification(err.message || 'Failed to delete insurance plan', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  // Auth operations
  const signIn = async (username, password) => {
    setLoading(true)
    try {
      const data = await authService.signIn(username, password)
      console.log('Context signIn - received data:', data)
      console.log('Context signIn - user to set:', data.user)

      setUser(data.user)
      setIsAuthenticated(true)

      console.log('Context signIn - isAuthenticated set to true')

      showNotification('Signed in successfully')
      return true
    } catch (err) {
      console.error('Context signIn - error:', err)
      setError(err.message)
      showNotification(err.message || 'Sign in failed', 'error')
      return false
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    await authService.signOut()
    setUser(null)
    setIsAuthenticated(false)
    showNotification('Signed out successfully')
  }

  const value = {
    patients,
    doctors,
    appointments,
    insurances,
    loading,
    error,
    notification,
    user,
    isAuthenticated,
    fetchPatients,
    createPatient,
    updatePatient,
    deletePatient,
    fetchDoctors,
    createDoctor,
    updateDoctor,
    deleteDoctor,
    fetchAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    fetchInsurances,
    createInsurance,
    updateInsurance,
    deleteInsurance,
    signIn,
    signOut,
    showNotification,
    closeNotification,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
