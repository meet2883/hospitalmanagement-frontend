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
  Chip,
  TablePagination,
  TableSortLabel,
  TextField,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format, parseISO } from 'date-fns'
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { debounce } from 'lodash'

const AppointmentList = () => {
  const navigate = useNavigate()
  const { appointments, fetchAppointments, deleteAppointment, loading, user, fetchAppointmentsByDoctorId } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })

  // Get user role
  const userRole = user?.role || 'EMPLOYEE'
  const canEdit = userRole === 'ADMIN' || userRole === 'DOCTOR'
  const canDelete = userRole === 'ADMIN'
  const canModify = userRole === 'ADMIN' // For creating new appointments

  // Filter states
  const [filters, setFilters] = useState({
    date: null,
    status: '',
    patientName: '',
    doctorName: '',
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
  const [orderBy, setOrderBy] = useState('appointmentdatetime')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    // Fetch appointments on mount and when user changes
    const fetchInitialData = async () => {
      if (userRole === "DOCTOR") {
        // For doctors, set the filter and fetch with doctorName
        setFilters({ doctorName: user?.name })
        await fetchAppointments({ doctorName: user?.name })
      } else {
        // For admin/employee, fetch all without filters
        await fetchAppointments()
      }
    }

    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, user])

  // Since API handles filtering, use appointments directly
  // But we still need to handle sorting and pagination
  const filteredAppointments = appointments || []

  // Check if any filter is active
  const hasActiveFilters = filters.date || filters.status !== '' || filters.patientName || filters.doctorName

  // Helper function to apply filters and fetch from API
  const applyFilters = async (newFilters) => {
    setFilters(newFilters)
    setPage(0)

    // Build API filter object (only include non-empty filters)
    const apiFilters = {}
    if (newFilters.date) {
      // Format date as YYYY/MM/DD for backend
      const formattedDate = `${newFilters.date.getFullYear()}/${(newFilters.date.getMonth() + 1).toString().padStart(2, '0')}/${newFilters.date.getDate().toString().padStart(2, '0')}`
      apiFilters.date = formattedDate
    }
    if (newFilters.status) {
      apiFilters.status = newFilters.status
    }
    if (newFilters.patientName) {
      apiFilters.patientName = newFilters.patientName
    }
    if (newFilters.doctorName) {
      apiFilters.doctorName = newFilters.doctorName
    }

    await fetchAppointments(apiFilters)
  }

  // Debounced fetch for text inputs - directly calls fetchAppointments
  const debouncedFetch = useCallback(
    debounce(() => {
      const apiFilters = {}
      const currentFilters = filtersRef.current

      if (currentFilters.date) {
        const formattedDate = `${currentFilters.date.getFullYear()}/${(currentFilters.date.getMonth() + 1).toString().padStart(2, '0')}/${currentFilters.date.getDate().toString().padStart(2, '0')}`
        apiFilters.date = formattedDate
      }
      if (currentFilters.status) {
        apiFilters.status = currentFilters.status
      }
      if (currentFilters.patientName) {
        apiFilters.patientName = currentFilters.patientName
      }
      if (currentFilters.doctorName) {
        apiFilters.doctorName = currentFilters.doctorName
      }

      fetchAppointments(apiFilters)
    }, 500),
    [fetchAppointments]
  )

  // Clear all filters
  const clearFilters = async () => {
    const clearedFilters = {
      date: null,
      status: '',
      patientName: '',
      doctorName: '',
    }
    await applyFilters(clearedFilters)
  }

  // Sort appointments
  const sortedAppointments = React.useMemo(() => {
    const stabilized = filteredAppointments.map((el, index) => [el, index])
    stabilized.sort((a, b) => {
      const aData = a[0]
      const bData = b[0]
      const aValue = aData[orderBy]
      const bValue = bData[orderBy]

      let comparison = 0
      if (aValue == null) comparison = 1
      else if (bValue == null) comparison = -1
      else if (orderBy === 'appointmentdatetime') {
        const aDate = new Date(aValue)
        const bDate = new Date(bValue)
        comparison = aDate < bDate ? -1 : aDate > bDate ? 1 : 0
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase())
      } else {
        comparison = aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      }

      return order === 'asc' ? comparison : -comparison
    })
    return stabilized.map((el) => el[0])
  }, [filteredAppointments, orderBy, order])

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const createSortHandler = (property) => () => {
    handleSort(property)
  }

  const paginatedAppointments = sortedAppointments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleDelete = async () => {
    if (deleteDialog.appointment) {
      const success = await deleteAppointment(deleteDialog.appointment.id)
      if (success) {
        setDeleteDialog({ open: false, appointment: null })
      }
    }
  }

  const openDeleteDialog = (appointment) => {
    setDeleteDialog({ open: true, appointment })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
      case 'SCHEDULE':
        return 'info'
      case 1:
      case 'DONE':
        return 'success'
      case 2:
      case 'CANCEL':
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
      case 'SCHEDULE':
        return 'Scheduled'
      case 1:
      case 'DONE':
        return 'Completed'
      case 2:
      case 'CANCEL':
        return 'Cancelled'
      default:
        return status
    }
  }

  const headCells = [
    { id: 'appointmentdatetime', label: 'Date & Time' },
    { id: 'patient_name', label: 'Patient' },
    { id: 'doctor_name', label: 'Doctor' },
    { id: 'status', label: 'Status' },
    ...(canEdit ? [{ id: 'actions', label: 'Actions', sortable: false }] : []),
  ]

  const activeFilterCount = [
    filters.date,
    filters.status !== '' ? filters.status : null,
    filters.patientName,
    filters.doctorName,
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
            Appointments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {canModify ? 'Manage' : canEdit ? 'View & Update' : 'View'} appointments ({filteredAppointments.length} of {(appointments || []).length})
          </Typography>
        </Box>
        {canModify && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate('/appointments/new')}
          >
            Schedule Appointment
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          {/* Filter Section */}
          <Box sx={{ mb: 3 }}>
            {/* Header */}
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 2,
              }}
            >
              <Typography variant="h6" fontWeight={600} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                Filters
                {activeFilterCount > 0 && (
                  <Chip
                    label={`${activeFilterCount} active`}
                    size="small"
                    color="primary"
                    sx={{ fontSize: '0.75rem' }}
                  />
                )}
              </Typography>
              {hasActiveFilters && (
                <Button
                  variant="text"
                  size="small"
                  startIcon={<ClearIcon />}
                  onClick={clearFilters}
                  color="secondary"
                >
                  Clear All
                </Button>
              )}
            </Box>

            {/* Filters Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date"
                    value={filters.date}
                    onChange={(newValue) => {
                      applyFilters({ ...filters, date: newValue })
                    }}
                    format="MMM dd, yyyy"
                    desktopModeMediaQuery="@media (hover: none)"
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        size: 'small',
                      },
                      actionBar: {
                        actions: ['clear', 'today'],
                      },
                    }}
                    closeOnSelect
                  />
                </LocalizationProvider>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Status</InputLabel>
                  <Select
                    label="Status"
                    value={filters.status}
                    onChange={(e) => {
                      applyFilters({ ...filters, status: e.target.value })
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="SCHEDULE">Scheduled</MenuItem>
                    <MenuItem value="DONE">Completed</MenuItem>
                    <MenuItem value="CANCEL">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Patient Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.patientName}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, patientName: e.target.value }))
                    debouncedFetch()
                  }}
                  placeholder="Search patient..."
                />
              </Grid>

              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  label="Doctor Name"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.doctorName}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, doctorName: e.target.value }))
                    debouncedFetch()
                  }}
                  placeholder="Search doctor..."
                />
              </Grid>
            </Grid>

            {/* Active Filters Summary */}
            {hasActiveFilters && (
              <Alert
                severity="info"
                sx={{
                  mt: 2,
                  borderRadius: 1,
                  '& .MuiAlert-message': {
                    py: 0.5,
                  },
                }}
              >
                <Typography variant="body2">
                  Found <strong>{filteredAppointments.length}</strong> appointment{filteredAppointments.length !== 1 ? 's' : ''} matching your filters
                </Typography>
              </Alert>
            )}
          </Box>

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
                    <TableCell colSpan={canEdit ? 5 : 4} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canEdit ? 5 : 4} align="center">
                      <Typography color="text.secondary">
                        {hasActiveFilters ? 'No appointments match your filters' : 'No appointments found'}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedAppointments.map((appointment) => (
                    <TableRow key={appointment.id} hover>
                      <TableCell>
                        {appointment.appointmentdatetime
                          ? format(
                              new Date(appointment.appointmentdatetime),
                              'MMM dd, yyyy HH:mm'
                            )
                          : 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {appointment.patient_name || appointment.patientName || 'N/A'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        {appointment.doctor_name || appointment.doctorName || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={getStatusLabel(appointment.status)}
                          color={getStatusColor(appointment.status)}
                          size="small"
                        />
                      </TableCell>
                      {canEdit && (
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                          {canDelete && (
                            <IconButton
                              color="error"
                              onClick={() => openDeleteDialog(appointment)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          )}
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
            count={sortedAppointments.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, appointment: null })}
      >
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment? This action cannot
            be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, appointment: null })}
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

export default AppointmentList
