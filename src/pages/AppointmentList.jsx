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

const AppointmentList = () => {
  const navigate = useNavigate()
  const { appointments, fetchAppointments, deleteAppointment, loading, user, fetchAppointmentsByDoctorId } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })

  // Get user role
  const userRole = user?.role || 'EMPLOYEE'
  const canModify = userRole === 'ADMIN'

  // Filter states
  const [filters, setFilters] = useState({
    date: null,
    status: '',
    patientName: '',
    doctorName: '',
  })

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('appointmentdatetime')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    if (userRole === "DOCTOR") {
      fetchAppointmentsByDoctorId(user.id)
    } else {
      fetchAppointments()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, user])

  // Filter appointments based on all filters
  const filteredAppointments = (appointments || []).filter((appointment) => {
    // Date filter (without time)
    if (filters.date) {
      const appointmentDate = appointment.appointmentdatetime
        ? parseISO(appointment.appointmentdatetime)
        : null
      if (appointmentDate) {
        const appointmentDateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate())
        const filterDateOnly = new Date(filters.date.getFullYear(), filters.date.getMonth(), filters.date.getDate())
        if (appointmentDateOnly.getTime() !== filterDateOnly.getTime()) {
          return false
        }
      } else {
        return false
      }
    }

    // Status filter
    if (filters.status !== '') {
      const statusValue = typeof appointment.status === 'number' ? appointment.status :
                          appointment.status === 'SCHEDULE' ? 0 :
                          appointment.status === 'DONE' ? 1 :
                          appointment.status === 'CANCEL' ? 2 : -1
      if (statusValue !== parseInt(filters.status)) {
        return false
      }
    }

    // Patient name filter
    if (filters.patientName) {
      const patientName = (appointment.patient_name || appointment.patientName || '').toLowerCase()
      if (!patientName.includes(filters.patientName.toLowerCase())) {
        return false
      }
    }

    // Doctor name filter
    if (filters.doctorName) {
      const doctorName = (appointment.doctor_name || appointment.doctorName || '').toLowerCase()
      if (!doctorName.includes(filters.doctorName.toLowerCase())) {
        return false
      }
    }

    return true
  })

  // Check if any filter is active
  const hasActiveFilters = filters.date || filters.status !== '' || filters.patientName || filters.doctorName

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      date: null,
      status: '',
      patientName: '',
      doctorName: '',
    })
    setPage(0)
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
    ...(canModify ? [{ id: 'actions', label: 'Actions', sortable: false }] : []),
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
            {canModify ? 'Manage' : 'View'} appointments ({filteredAppointments.length} of {(appointments || []).length})
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
                      setFilters({ ...filters, date: newValue })
                      setPage(0)
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
                      setFilters({ ...filters, status: e.target.value })
                      setPage(0)
                    }}
                  >
                    <MenuItem value="">All</MenuItem>
                    <MenuItem value="0">Scheduled</MenuItem>
                    <MenuItem value="1">Completed</MenuItem>
                    <MenuItem value="2">Cancelled</MenuItem>
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
                    setFilters({ ...filters, patientName: e.target.value })
                    setPage(0)
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
                    setFilters({ ...filters, doctorName: e.target.value })
                    setPage(0)
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
                  <strong>{filteredAppointments.length}</strong> of {(appointments || []).length} appointments match your filters
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
                    <TableCell colSpan={canModify ? 5 : 4} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={canModify ? 5 : 4} align="center">
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
                      {canModify && (
                        <TableCell align="center">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/appointments/${appointment.id}/edit`)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => openDeleteDialog(appointment)}
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
