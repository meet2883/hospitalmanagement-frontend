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
  InputAdornment,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'

const AppointmentList = () => {
  const navigate = useNavigate()
  const { appointments, fetchAppointments, deleteAppointment, loading } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })
  const [searchTerm, setSearchTerm] = useState('')

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('appointmentdatetime')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter((appointment) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      appointment.patient_name?.toLowerCase().includes(searchLower) ||
      appointment.doctor_name?.toLowerCase().includes(searchLower) ||
      (appointment.appointmentdatetime &&
        format(new Date(appointment.appointmentdatetime), 'MMM dd, yyyy HH:mm')
          .toLowerCase()
          .includes(searchLower))
    )
  })

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
        // Special handling for date sorting
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
    { id: 'actions', label: 'Actions', sortable: false },
  ]

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
            Manage appointments ({filteredAppointments.length} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/appointments/new')}
        >
          Schedule Appointment
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            placeholder="Search appointments..."
            variant="outlined"
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setPage(0)
            }}
            sx={{ mb: 3 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

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
                    <TableCell colSpan={5} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedAppointments.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">
                        No appointments found
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
