import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Grid,
  Chip,
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  PersonAdd as PersonAddIcon,
  Email as EmailIcon,
  Badge as BadgeIcon,
  LocalHospital as LocalHospitalIcon,
  Lock as LockIcon,
} from '@mui/icons-material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { userService } from '../services/userService'

const SPECIALIZATIONS = [
  'CARDIOLOGIST',
  'PHISHIYO',
  'PHYCHOLOGIST',
]

const UserForm = () => {
  const navigate = useNavigate()
  const { showNotification } = useApp()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    verifyPassword: '',
    role: 'EMPLOYEE',
    specialization: '',
  })

  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showVerifyPassword, setShowVerifyPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isDoctor = formData.role === 'DOCTOR'

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

    // Specialization validation for doctors
    if (isDoctor && !formData.specialization) {
      newErrors.specialization = 'Specialization is required for doctors'
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

      // Add specialization for doctors
      if (isDoctor) {
        payload.specialization = formData.specialization
      }

      await userService.createUser(payload)
      showNotification('User created successfully', 'success')

      // Navigate back to users list after successful creation
      setTimeout(() => {
        navigate('/users')
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

  const handleRoleChange = (e) => {
    const newRole = e.target.value
    setFormData((prev) => ({
      ...prev,
      role: newRole,
      // Clear specialization if switching away from doctor role
      specialization: newRole === 'DOCTOR' ? prev.specialization : '',
    }))
  }

  const getRoleDescription = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'Full system access including user management'
      case 'DOCTOR':
        return 'Can manage appointments and consultation remarks'
      case 'EMPLOYEE':
        return 'Can view and manage appointments'
      default:
        return ''
    }
  }

  return (
    <Box sx={{ p: 1 }}>
      {/* Header */}
      <Box sx={{ mb: 2, maxWidth: 800 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/users')}
          size="small"
        >
          Back to Users
        </Button>
        <Typography variant="h5" fontWeight={600} sx={{ mt: 1 }}>
          Create New User
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Add a new user to the Hospital Management System
        </Typography>
      </Box>

      {/* Form Card */}
      <Box sx={{ maxWidth: 800 }}>
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            p: 3,
          }}
        >
          {/* Form Info Banner */}
          <Box
            sx={{
              p: 1.5,
              mb: 2.5,
              backgroundColor: 'info.lighter',
              color: 'info.dark',
              borderRadius: 1.5,
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Typography variant="body2" fontWeight={500}>
              All fields marked with * are required. Passwords must be at least 6 characters.
            </Typography>
          </Box>

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2.5}>
              {/* Name Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="name"
                  label="Full Name"
                  fullWidth
                  size="small"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  disabled={isSubmitting}
                  required
                  autoComplete="name"
                  placeholder="Enter full name"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <BadgeIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Email Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="email"
                  label="Email Address"
                  type="email"
                  fullWidth
                  size="small"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!errors.email}
                  helperText={errors.email}
                  disabled={isSubmitting}
                  required
                  autoComplete="email"
                  placeholder="user@example.com"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Role Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required disabled={isSubmitting} size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    name="role"
                    value={formData.role}
                    onChange={handleRoleChange}
                    label="Role"
                  >
                    <MenuItem value="ADMIN">
                      <Box>
                        <Typography variant="inherit" fontSize="0.875rem">Admin</Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                          Full system access
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="DOCTOR">
                      <Box>
                        <Typography variant="inherit" fontSize="0.875rem">Doctor</Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                          Medical practitioner
                        </Typography>
                      </Box>
                    </MenuItem>
                    <MenuItem value="EMPLOYEE">
                      <Box>
                        <Typography variant="inherit" fontSize="0.875rem">Employee</Typography>
                        <Typography variant="caption" color="text.secondary" fontSize="0.75rem">
                          Staff member
                        </Typography>
                      </Box>
                    </MenuItem>
                  </Select>
                </FormControl>
                {formData.role && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                    {getRoleDescription(formData.role)}
                  </Typography>
                )}
              </Grid>

              {/* Specialization - Only for Doctors */}
              {isDoctor && (
                <Grid item xs={12} sm={6}>
                  <FormControl
                    fullWidth
                    required
                    disabled={isSubmitting}
                    error={!!errors.specialization}
                    size="small"
                  >
                    <InputLabel>Specialization</InputLabel>
                    <Select
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      label="Specialization"
                    >
                      {SPECIALIZATIONS.map((spec) => (
                        <MenuItem key={spec} value={spec}>
                          {spec}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.specialization && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                        {errors.specialization}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
              )}

              {/* Password Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  disabled={isSubmitting}
                  required
                  autoComplete="new-password"
                  placeholder="Enter password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={togglePasswordVisibility}
                          edge="end"
                          disabled={isSubmitting}
                          size="small"
                          aria-label={
                            showPassword ? 'Hide password' : 'Show password'
                          }
                        >
                          {showPassword ? <VisibilityOffIcon fontSize="small" /> : <VisibilityIcon fontSize="small" />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Verify Password Field */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="verifyPassword"
                  label="Verify Password"
                  type={showVerifyPassword ? 'text' : 'password'}
                  fullWidth
                  size="small"
                  value={formData.verifyPassword}
                  onChange={handleChange}
                  error={!!errors.verifyPassword}
                  helperText={errors.verifyPassword}
                  disabled={isSubmitting}
                  required
                  autoComplete="new-password"
                  placeholder="Re-enter password"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="action" fontSize="small" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={toggleVerifyPasswordVisibility}
                          edge="end"
                          disabled={isSubmitting}
                          size="small"
                          aria-label={
                            showVerifyPassword
                              ? 'Hide password'
                              : 'Show password'
                          }
                        >
                          {showVerifyPassword ? (
                            <VisibilityOffIcon fontSize="small" />
                          ) : (
                            <VisibilityIcon fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              {/* Selected Role Badge */}
              {formData.role && (
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="caption" color="text.secondary">
                      Creating user as:
                    </Typography>
                    <Chip
                      label={formData.role}
                      color={formData.role === 'ADMIN' ? 'error' : formData.role === 'DOCTOR' ? 'success' : 'info'}
                      size="small"
                    />
                    {isDoctor && formData.specialization && (
                      <>
                        <Typography variant="caption" color="text.secondary">
                          with specialization:
                        </Typography>
                        <Chip label={formData.specialization} variant="outlined" size="small" />
                      </>
                    )}
                  </Box>
                </Grid>
              )}

              {/* Action Buttons */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 1.5, justifyContent: 'flex-end', mt: 1 }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/users')}
                    disabled={isSubmitting}
                    size="small"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitting}
                    startIcon={
                      isSubmitting ? (
                        <CircularProgress size={16} />
                      ) : (
                        <PersonAddIcon fontSize="small" />
                      )
                    }
                    size="small"
                  >
                    {isSubmitting ? 'Creating...' : 'Create User'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Box>
      </Box>
    </Box>
  )
}

export default UserForm
