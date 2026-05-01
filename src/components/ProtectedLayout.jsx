import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import AppLayout from './AppLayout'
import Snackbar from './Snackbar'

const ProtectedLayout = () => {
  const { isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return (
    <AppLayout>
      <Outlet />
      <Snackbar />
    </AppLayout>
  )
}

export default ProtectedLayout
