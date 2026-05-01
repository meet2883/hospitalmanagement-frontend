import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from './contexts/AppContext'
import ProtectedLayout from './components/ProtectedLayout'
import Dashboard from './pages/Dashboard'
import PatientList from './pages/PatientList'
import PatientForm from './pages/PatientForm'
import DoctorList from './pages/DoctorList'
import DoctorForm from './pages/DoctorForm'
import AppointmentList from './pages/AppointmentList'
import AppointmentForm from './pages/AppointmentForm'
import AppointmentUpdateForm from './pages/AppointmentUpdateForm'
import InsuranceList from './pages/InsuranceList'
import InsuranceForm from './pages/InsuranceForm'
import UserForm from './pages/UserForm'
import SignIn from './pages/SignIn'

function App() {
  return (
    <AppProvider>
      <Routes>
        <Route path="/signin" element={<SignIn />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/patients" element={<PatientList />} />
          <Route path="/patients/new" element={<PatientForm />} />
          <Route path="/patients/:id/edit" element={<PatientForm />} />
          <Route path="/doctors" element={<DoctorList />} />
          <Route path="/doctors/new" element={<DoctorForm />} />
          <Route path="/doctors/:id/edit" element={<DoctorForm />} />
          <Route path="/appointments" element={<AppointmentList />} />
          <Route path="/appointments/new" element={<AppointmentForm />} />
          <Route path="/appointments/:id/edit" element={<AppointmentUpdateForm />} />
          <Route path="/insurance" element={<InsuranceList />} />
          <Route path="/insurance/new" element={<InsuranceForm />} />
          <Route path="/insurance/:id/edit" element={<InsuranceForm />} />
          <Route path="/users/new" element={<UserForm />} />
        </Route>
        <Route path="*" element={<Navigate to="/signin" replace />} />
      </Routes>
    </AppProvider>
  )
}

export default App
