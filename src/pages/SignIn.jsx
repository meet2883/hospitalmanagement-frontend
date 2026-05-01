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
    username: '',
    password: '',
  })

  const [errors, setErrors] = useState({})
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
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = 'Username is required'
    } 
    // else if (formData.username.length < 3) {
    //   newErrors.username = 'Username must be at least 3 characters'
    // } else if (formData.username.length > 50) {
    //   newErrors.username = 'Username must not exceed 50 characters'
    // } else if (!/^[a-zA-Z0-9_@.-]+$/.test(formData.username)) {
    //   newErrors.username = 'Username can only contain letters, numbers, and _@.-'
    // }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } 
    // else if (formData.password.length < 6) {
    //   newErrors.password = 'Password must be at least 6 characters'
    // }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    setIsSubmitting(true)

    try {
      const success = await contextSignIn(
        formData.username,
        formData.password
      )

      if (success) {
        // Set login success flag - useEffect will handle navigation
        setLoginSuccess(true)
      }
    } catch (error) {
      showNotification(error.message || 'Sign in failed', 'error')
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Username Field */}
              <TextField
                name="username"
                label="Username"
                fullWidth
                value={formData.username}
                onChange={handleChange}
                error={!!errors.username}
                helperText={errors.username}
                disabled={isSubmitting}
                autoComplete="username"
                autoFocus
                required
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">@</InputAdornment>
                    ),
                  },
                }}
              />

              {/* Password Field */}
              <TextField
                name="password"
                label="Password"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                disabled={isSubmitting}
                autoComplete="current-password"
                required
                slotProps={{
                  input: {
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
                  },
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
