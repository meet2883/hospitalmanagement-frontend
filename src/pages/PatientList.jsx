import React, { useEffect, useState, useCallback, useRef } from 'react'
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
  Chip,
  TablePagination,
  TableSortLabel,
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { debounce } from 'lodash'

const PatientList = () => {
  const navigate = useNavigate()
  const { patients, fetchPatients, deletePatient, loading, user } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patient: null })

  // Get user role
  const userRole = user?.role || 'EMPLOYEE'
  const canModify = userRole === 'ADMIN' || 'EMPLOYEE' // Only ADMIN can create, update, delete

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    phoneNumber: '',
    gender: '',
    bloodgroup: '',
  })

  // Ref to track latest filters for debounce
  const filtersRef = useRef(filters)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('patientName')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  // Check if any filter is active
  const hasActiveFilters =
    filters.name ||
    filters.phoneNumber ||
    filters.gender ||
    filters.bloodgroup

  // Debounced fetch for text inputs - directly calls fetchPatients
  const debouncedFetch = useCallback(
    debounce(() => {
      const apiFilters = {}
      const currentFilters = filtersRef.current

      if (currentFilters.name) {
        apiFilters.name = currentFilters.name
      }
      if (currentFilters.phoneNumber) {
        apiFilters.phoneNumber = currentFilters.phoneNumber
      }
      if (currentFilters.gender) {
        apiFilters.gender = currentFilters.gender
      }
      if (currentFilters.bloodgroup) {
        apiFilters.bloodgroup = currentFilters.bloodgroup
      }

      setPage(0)
      fetchPatients(apiFilters)
    }, 500),
    [fetchPatients]
  )

  // Apply filters for dropdowns (immediate)
  const applyFilters = async (updatedFilters = {}) => {
    const apiFilters = {}
    const mergedFilters = { ...filters, ...updatedFilters }

    if (mergedFilters.name) {
      apiFilters.name = mergedFilters.name
    }
    if (mergedFilters.phoneNumber) {
      apiFilters.phoneNumber = mergedFilters.phoneNumber
    }
    if (mergedFilters.gender) {
      apiFilters.gender = mergedFilters.gender
    }
    if (mergedFilters.bloodgroup) {
      apiFilters.bloodgroup = mergedFilters.bloodgroup
    }

    setPage(0)
    await fetchPatients(apiFilters)
  }

  // Helper function to clear all filters
  const clearFilters = async () => {
    const emptyFilters = {
      name: '',
      phoneNumber: '',
      gender: '',
      bloodgroup: '',
    }
    setFilters(emptyFilters)
    await fetchPatients({})
    setPage(0)
  }

  // Use patients directly since API handles filtering
  const filteredPatients = patients || []

  // Sort patients
  const sortedPatients = React.useMemo(() => {
    const stabilized = filteredPatients.map((el, index) => [el, index])
    stabilized.sort((a, b) => {
      const aData = a[0]
      const bData = b[0]
      const aValue = aData[orderBy]
      const bValue = bData[orderBy]

      let comparison = 0
      if (aValue == null) comparison = 1
      else if (bValue == null) comparison = -1
      else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }

      return order === 'asc' ? comparison : -comparison
    })
    return stabilized.map((el) => el[0])
  }, [filteredPatients, orderBy, order])

  // Pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  // Sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property) => () => {
    handleSort(property)
  }

  const paginatedPatients = sortedPatients.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleDelete = async () => {
    if (deleteDialog.patient) {
      const success = await deletePatient(deleteDialog.patient.id)
      if (success) {
        setDeleteDialog({ open: false, patient: null })
      }
    }
  }

  const openDeleteDialog = (patient) => {
    setDeleteDialog({ open: true, patient })
  }

  const headCells = [
    { id: 'patientName', label: 'Name' },
    { id: 'age', label: 'Age' },
    { id: 'gender', label: 'Gender' },
    { id: 'phoneNumber', label: 'Phone' },
    { id: 'bloodGroup', label: 'Blood Group' },
    { id: 'insurance', label: 'Insurance', sortable: false },
    ...(canModify ? [{ id: 'actions', label: 'Actions', sortable: false }] : []),
  ]

  const activeFilterCount = [
    filters.name,
    filters.phoneNumber,
    filters.gender,
    filters.bloodgroup,
  ].filter(Boolean).length

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
            Patients
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canModify ? 'Manage' : 'View'} patient records ({filteredPatients.length} total)
          </Typography>
        </Box>
        {canModify && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/patients/new')}
          >
            Add Patient
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          {/* Advanced Filters Section */}
          <Box sx={{ mb: 3 }}>
            {/* Filter Header with Toggle */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <FilterListIcon color="primary" />
                <Typography variant="h6" fontWeight={600}>
                  Advanced Filters
                </Typography>
                {activeFilterCount > 0 && (
                  <Chip
                    label={`${activeFilterCount} active`}
                    size="small"
                    color="primary"
                    variant="outlined"
                    sx={{ fontSize: '0.75rem', ml: 1 }}
                  />
                )}
              </Box>
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  color="secondary"
                >
                  Clear Filters
                </Button>
              )}
            </Box>

            {/* Filters Grid - All in one row */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.name}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, name: e.target.value }))
                    debouncedFetch()
                  }}
                  placeholder="Search by name..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Phone Number"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.phoneNumber}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, phoneNumber: e.target.value }))
                    debouncedFetch()
                  }}
                  placeholder="Search by phone..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Gender</InputLabel>
                  <Select
                    label="Gender"
                    value={filters.gender}
                    onChange={(e) => {
                      const value = e.target.value
                      setFilters({ ...filters, gender: value })
                      applyFilters({ gender: value })
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Blood Group</InputLabel>
                  <Select
                    label="Blood Group"
                    value={filters.bloodgroup}
                    onChange={(e) => {
                      const value = e.target.value
                      setFilters({ ...filters, bloodgroup: value })
                      applyFilters({ bloodgroup: value })
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="A+">A+</MenuItem>
                    <MenuItem value="A-">A-</MenuItem>
                    <MenuItem value="B+">B+</MenuItem>
                    <MenuItem value="B-">B-</MenuItem>
                    <MenuItem value="AB+">AB+</MenuItem>
                    <MenuItem value="AB-">AB-</MenuItem>
                    <MenuItem value="O+">O+</MenuItem>
                    <MenuItem value="O-">O-</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <Alert
                severity="success"
                sx={{
                  mt: 2.5,
                  borderRadius: 1.5,
                  '& .MuiAlert-message': {
                    py: 0.5,
                  },
                }}
              >
                <Typography variant="body2">
                  Found <strong>{filteredPatients.length}</strong> patient{filteredPatients.length !== 1 ? 's' : ''} matching your criteria
                </Typography>
              </Alert>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  {headCells.map((headCell) => (
                    <TableCell
                      key={headCell.id}
                      align={headCell.id === 'actions' ? 'center' : 'left'}
                      sortDirection={orderBy === headCell.id ? order : false}
                    >
                      {headCell.sortable !== false ? (
                        <TableSortLabel
                          active={orderBy === headCell.id}
                          direction={orderBy === headCell.id ? order : 'asc'}
                          onClick={createSortHandler(headCell.id)}
                        >
                          {headCell.label}
                        </TableSortLabel>
                      ) : (
                        headCell.label
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={canModify ? 7 : 6} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedPatients.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canModify ? 7 : 6} align="center">
                      <Typography color="text.secondary">
                        No patients found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedPatients.map((patient) => (
                    <TableRow key={patient.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {patient.patientName}
                        </Typography>
                      </TableCell>
                      <TableCell>{patient.age || 'N/A'}</TableCell>
                      <TableCell>{patient.gender || 'N/A'}</TableCell>
                      <TableCell>{patient.phoneNumber || 'N/A'}</TableCell>
                      <TableCell>
                        {patient.bloodGroup ? (
                          <Chip
                            label={patient.bloodGroup}
                            size="small"
                            color="error"
                          />
                        ) : (
                          'N/A'
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.insurance?.policyName || 'None'}
                      </TableCell>
                      {canModify && (
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/patients/${patient.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => openDeleteDialog(patient)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={sortedPatients.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, patient: null })}
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete patient "
            {deleteDialog.patient?.patientName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, patient: null })}
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

export default PatientList
