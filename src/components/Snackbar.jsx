import React, { useEffect } from 'react'
import { Snackbar, Alert } from '@mui/material'
import { useApp } from '../contexts/AppContext'

const CustomSnackbar = () => {
  const { notification, closeNotification } = useApp()

  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        closeNotification()
      }, 6000)
      return () => clearTimeout(timer)
    }
  }, [notification.open, closeNotification])

  return (
    <Snackbar
      open={notification.open}
      autoHideDuration={6000}
      onClose={closeNotification}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert
        onClose={closeNotification}
        severity={notification.severity}
        sx={{ width: '100%' }}
        variant="filled"
      >
        {notification.message}
      </Alert>
    </Snackbar>
  )
}

export default CustomSnackbar
