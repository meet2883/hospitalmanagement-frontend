import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const InsuranceList = () => {
  const navigate = useNavigate()
  const { insurances, fetchInsurances, deleteInsurance, loading } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, insurance: null })

  useEffect(() => {
    fetchInsurances()
  }, [fetchInsurances])

  const filteredInsurances = insurances.filter((insurance) =>
    insurance.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurance.policyProvider?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleDelete = async () => {
    if (deleteDialog.insurance) {
      const success = await deleteInsurance(deleteDialog.insurance.id)
      if (success) {
        setDeleteDialog({ open: false, insurance: null })
      }
    }
  }

  const openDeleteDialog = (insurance) => {
    setDeleteDialog({ open: true, insurance })
  }

  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={600}>
            Insurance Plans
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage insurance plans
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/insurance/new')}
        >
          Add Insurance Plan
        </Button>
      </Box>

      <Card>
        <CardContent>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 3,
              gap: 2,
            }}
          >
            <SearchIcon color="action" />
            <TextField
              placeholder="Search insurance plans..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Policy Name</TableCell>
                  <TableCell>Provider</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredInsurances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary">
                        No insurance plans found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInsurances.map((insurance) => (
                    <TableRow key={insurance.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {insurance.policyName}
                        </Typography>
                      </TableCell>
                      <TableCell>{insurance.policyProvider}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/insurance/${insurance.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(insurance)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, insurance: null })}
      >
        <DialogTitle>Delete Insurance Plan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete insurance plan "
            {deleteDialog.insurance?.policyName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, insurance: null })}
          >
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default InsuranceList
