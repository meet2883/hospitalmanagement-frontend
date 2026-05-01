import React from 'react'
import { Navigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp()

  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  return children
}

export default ProtectedRoute
