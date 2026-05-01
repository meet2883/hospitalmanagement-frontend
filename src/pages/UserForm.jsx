import React, { useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { userService } from '../services/userService'

const UserForm = () => {
  const navigate = useNavigate()
  const { showNotification } = useApp()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    verifyPassword: '',
    role: 'EMPLOYEE',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    // Verify password validation
    if (!formData.verifyPassword) {
      newErrors.verifyPassword = 'Please verify your password'
    } else if (formData.password !== formData.verifyPassword) {
      newErrors.verifyPassword = 'Passwords do not match'
    }

    // Role validation
    if (!formData.role) {
      newErrors.role = 'Role is required'
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

    try {
      // Prepare payload - exclude verifyPassword
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        role: formData.role,
      }

      await userService.createUser(payload)
      showNotification('User created successfully', 'success')

      // Navigate back to dashboard after successful creation
      setTimeout(() => {
        navigate('/dashboard')
      }, 500)
    } catch (error) {
      showNotification(error.message || 'Failed to create user', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev)
  }

  const toggleVerifyPasswordVisibility = () => {
    setShowVerifyPassword((prev) => !prev)
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        <Typography variant="h4" fontWeight={600}>
          Create New User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a new user to the system
        </Typography>
      </Box>

      <Card maxWidth="600" sx={{ maxWidth: 600 }}>
        <CardContent sx={{ p: 4 }}>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Name Field */}
              <TextField
                name="name"
                label="Full Name"
                fullWidth
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                disabled={isSubmitting}
                required
                autoComplete="name"
              />

              {/* Email Field */}
              <TextField
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                disabled={isSubmitting}
                required
                autoComplete="email"
              />

              {/* Role Selection */}
              <FormControl fullWidth required disabled={isSubmitting}>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  label="Role"
                >
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="EMPLOYEE">Employee</MenuItem>
                </Select>
              </FormControl>

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
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={togglePasswordVisibility}
                        edge="end"
                        disabled={isSubmitting}
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Verify Password Field */}
              <TextField
                name="verifyPassword"
                label="Verify Password"
                type={showVerifyPassword ? 'text' : 'password'}
                fullWidth
                value={formData.verifyPassword}
                onChange={handleChange}
                error={!!errors.verifyPassword}
                helperText={errors.verifyPassword}
                disabled={isSubmitting}
                required
                autoComplete="new-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={toggleVerifyPasswordVisibility}
                        edge="end"
                        disabled={isSubmitting}
                        aria-label={
                          showVerifyPassword
                            ? 'Hide password'
                            : 'Show password'
                        }
                      >
                        {showVerifyPassword ? (
                          <VisibilityOffIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              {/* Action Buttons */}
              <Box
                sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}
              >
                <Button
                  type="button"
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={isSubmitting}
                  startIcon={
                    isSubmitting ? (
                      <CircularProgress size={20} />
                    ) : (
                      <PersonAddIcon />
                    )
                  }
                >
                  {isSubmitting ? 'Creating User...' : 'Create User'}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default UserForm
