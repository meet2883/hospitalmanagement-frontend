import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  TextField,
  Grid,
} from '@mui/material'
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material'
import { useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { insuranceService } from '../services/insuranceService'

const InsuranceForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { createInsurance, updateInsurance } = useApp()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    policyName: '',
    policyProvider: '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (id) {
      fetchInsuranceData()
    }
  }, [id])

  const fetchInsuranceData = async () => {
    try {
      const data = await insuranceService.getInsuranceById(id)
      setFormData({
        policyName: data.policyName || '',
        policyProvider: data.policyProvider || '',
      })
    } catch (error) {
      console.error('Error fetching insurance:', error)
    }
  }

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

    if (!formData.policyName.trim()) {
      newErrors.policyName = 'Policy name is required'
    }
    if (!formData.policyProvider.trim()) {
      newErrors.policyProvider = 'Policy provider is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validate()) {
      return
    }

    const payload = {
      policyName: formData.policyName,
      policyProvider: formData.policyProvider,
    }

    let success
    if (isEditing) {
      success = await updateInsurance(id, payload)
    } else {
      success = await createInsurance(payload)
    }

    if (success) {
      navigate('/insurance')
    }
  }

  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/insurance')}
          sx={{ mb: 2 }}
        >
          Back to Insurance Plans
        </Button>
        <Typography variant="h4" fontWeight={600}>
          {isEditing ? 'Edit Insurance Plan' : 'Add New Insurance Plan'}
        </Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="policyName"
                  label="Policy Name"
                  fullWidth
                  value={formData.policyName}
                  onChange={handleChange}
                  error={!!errors.policyName}
                  helperText={errors.policyName}
                  required
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="policyProvider"
                  label="Policy Provider"
                  fullWidth
                  value={formData.policyProvider}
                  onChange={handleChange}
                  error={!!errors.policyProvider}
                  helperText={errors.policyProvider}
                  required
                />
              </Grid>

              <Grid item xs={12}>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                  <Button
                    type="button"
                    variant="outlined"
                    onClick={() => navigate('/insurance')}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained">
                    {isEditing ? 'Update Insurance' : 'Create Insurance'}
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </CardContent>
      </Card>
    </Box>
  )
}

export default InsuranceForm
