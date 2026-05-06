import React from 'react'
import { Outlet, Navigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import AppLayout from './AppLayout'
import Snackbar from './Snackbar'

// Route configuration with role restrictions
const routeConfig = {
  '/dashboard': ['ADMIN', 'EMPLOYEE', 'DOCTOR'],
  '/patients': ['ADMIN', 'EMPLOYEE', 'DOCTOR'],
  '/patients/new': ['ADMIN', 'EMPLOYEE'], // No DOCTOR
  '/patients/:id/edit': ['ADMIN', 'EMPLOYEE'], // No DOCTOR
  '/doctors': ['ADMIN'],
  '/doctors/new': ['ADMIN'],
  '/appointments': ['ADMIN', 'EMPLOYEE', 'DOCTOR'],
  '/appointments/new': ['ADMIN', 'EMPLOYEE'], // No DOCTOR
  '/appointments/:id/edit': ['ADMIN', 'EMPLOYEE'], // No DOCTOR
  '/insurance': ['ADMIN'],
  '/insurance/new': ['ADMIN'],
  '/users': ['ADMIN'],
  '/users/new': ['ADMIN'],
  '/consultation-remarks': ['ADMIN', 'DOCTOR'],
}

const ProtectedLayout = () => {
  let appContext
  try {
    appContext = useApp()
  } catch (error) {
    console.error('Context error in ProtectedLayout:', error)
    return <Navigate to="/signin" replace />
  }

  const { isAuthenticated, user } = appContext
  const location = useLocation()
  const userRole = user?.role || 'EMPLOYEE'

  // Check if user is authenticated
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />
  }

  // Check role-based access for current route
  const currentPath = location.pathname
  let allowedRoles = []

  // Find matching route (exact or partial match)
  for (const [route, roles] of Object.entries(routeConfig)) {
    if (currentPath === route || currentPath.startsWith(route + '/')) {
      allowedRoles = roles
      break
    }
  }

  // Additional check for edit routes with dynamic segments
  if (!allowedRoles.length) {
    // Check if it's an edit route (e.g., /patients/123/edit)
    const editMatch = currentPath.match(/^\/(patients|appointments)\/\d+\/edit$/)
    if (editMatch) {
      const resource = editMatch[1]
      const editRouteKey = `/${resource}/:id/edit`
      if (routeConfig[editRouteKey]) {
        allowedRoles = routeConfig[editRouteKey]
      }
    }
  }

  // If no specific route config, allow all (fallback)
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Redirect to dashboard if not authorized
    return <Navigate to="/dashboard" replace />
  }

  return (
    <AppLayout>
      <Outlet />
      <Snackbar />
    </AppLayout>
  )
}

export default ProtectedLayout
