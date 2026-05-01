import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  CircularProgress,
  Alert,
  Collapse,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { authService } from '../services/authService'

const SignIn = () => {
  const navigate = useNavigate()
  const { showNotification, signIn: contextSignIn, isAuthenticated } = useApp()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [loginSuccess, setLoginSuccess] = useState(false)

  // Navigate to dashboard when authenticated and login was successful
  useEffect(() => {
    if (isAuthenticated && loginSuccess) {
      navigate('/dashboard')
      setLoginSuccess(false)
    }
    // Redirect to dashboard if already authenticated
    if (isAuthenticated && !loginSuccess && !isSubmitting) {
      navigate('/dashboard')
    }
  }, [isAuthenticated, loginSuccess, navigate, isSubmitting])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear field errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    // Clear API error when user starts typing
    if (apiError) {
      setApiError('')
    }
  }

  const validate = () => {
    const newErrors = {}

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setApiError('')

    try {
      const success = await contextSignIn(
        formData.email,
        formData.password
      )

      if (success) {
        // Set login success flag - useEffect will handle navigation
        setLoginSuccess(true)
      }
    } catch (error) {
      // Handle different types of errors
      const errorMessage = error.message || 'Sign in failed'
      let displayError = errorMessage

      // Map common errors to user-friendly messages
      if (errorMessage.toLowerCase().includes('bad credentials') ||
          errorMessage.toLowerCase().includes('invalid') ||
          errorMessage.toLowerCase().includes('unauthorized')) {
        displayError = 'Invalid email or password'
        setErrors({
          email: ' ',
          password: ' '
        })
      } else if (errorMessage.toLowerCase().includes('network')) {
        displayError = 'Network error. Please check your connection and try again.'
      } else if (errorMessage.toLowerCase().includes('timeout')) {
        displayError = 'Request timed out. Please try again.'
      } else if (errorMessage.toLowerCase().includes('server') ||
                 errorMessage.toLowerCase().includes('500')) {
        displayError = 'Server error. Please try again later.'
      }

      setApiError(displayError)
      showNotification(displayError, 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        px: 2,
      }}
    >
      <Card
        sx={{
          maxWidth: 450,
          width: '100%',
          boxShadow: 3,
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <LoginIcon
              sx={{ fontSize: 48, color: 'primary.main', mb: 2 }}
            />
            <Typography variant="h4" fontWeight={600} gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>

          {/* API Error Alert */}
          <Collapse in={!!apiError}>
            <Alert
              severity="error"
              sx={{ mb: 3 }}
              onClose={() => setApiError('')}
            >
              {apiError}
            </Alert>
          </Collapse>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Email Field */}
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email || !!apiError}
                helperText={errors.email || (apiError && ' ')}
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
                required
              />

              {/* Password Field */}
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password || !!apiError}
                helperText={errors.password || (apiError && ' ')}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isSubmitting}
                        aria-label={
                          showPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={20} />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{ py: 1.5, mt: 2 }}
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default SignIn
