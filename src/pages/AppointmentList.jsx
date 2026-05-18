import React, { useEffect, useState, useCallback, useRef } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
  IconButton,
} from '@mui/material'
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  MedicalServices as MedicalServicesIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'
import { debounce } from 'lodash'
import Table from '../components/Table'

const AppointmentList = () => {
  const navigate = useNavigate()
  const { appointments, fetchAppointments, deleteAppointment, loading, user } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, appointment: null })

  // Get user role
  const userRole = user?.role || 'EMPLOYEE'
  const canEdit = userRole === 'ADMIN' || userRole === 'DOCTOR'
  const canDelete = userRole === 'ADMIN'
  const canModify = userRole === 'ADMIN'
  const canStartConsultation = userRole === 'ADMIN' || userRole === 'DOCTOR'

  // Filter states
  const [filters, setFilters] = useState({
    date: '',
    status: '',
    patientName: '',
    doctorName: '',
    type: '',
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
    const fetchInitialData = async () => {
      if (userRole === "DOCTOR") {
        setFilters(prev => ({ ...prev, doctorName: user?.name || '' }))
        await fetchAppointments({ doctorName: user?.name })
      } else {
        await fetchAppointments()
      }
    }

    fetchInitialData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole, user])

  // Sort appointments (client-side sorting)
  const sortedAppointments = React.useMemo(() => {
    const appointmentsToSort = [...(appointments || [])]

    appointmentsToSort.sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]

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

    return appointmentsToSort
  }, [appointments, orderBy, order])

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

  const handleConsultationClick = (appointment) => {
    if (appointment.status === 'CANCEL' || appointment.status === 2) {
      return
    }

    navigate(`/consultation/${appointment.id}`)
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

  const getTypeColor = (type) => {
    switch (type) {
      case 'NEW_PATIENT':
        return 'info'
      case 'FOLLOW_UP':
        return 'success'
      case 'NEW_DIAGNOSIS':
        return 'warning'
      case 'EMERGENCY':
        return 'error'
      default:
        return 'default'
    }
  }

  const getTypeLabel = (type) => {
    switch (type) {
      case 'NEW_PATIENT':
        return 'New Patient'
      case 'FOLLOW_UP':
        return 'Follow Up'
      case 'NEW_DIAGNOSIS':
        return 'New Diagnosis'
      case 'EMERGENCY':
        return 'Emergency'
      default:
        return type || 'N/A'
    }
  }

  // Define columns
  const columns = [
    {
      id: 'appointmentdatetime',
      label: 'Date & Time',
      format: (value) => {
        if (!value) return 'N/A'
        return format(new Date(value), 'MMM dd, yyyy HH:mm')
      },
    },
    {
      id: 'patient_name',
      label: 'Patient',
      cellSx: { fontWeight: 500 },
      format: (value, row) => row.patient_name || row.patientName || 'N/A',
    },
    {
      id: 'doctor_name',
      label: 'Doctor',
      format: (value, row) => row.doctor_name || row.doctorName || 'N/A',
    },
    {
      id: 'type',
      label: 'Type',
      chip: (row, value) => ({
        label: getTypeLabel(value),
        color: getTypeColor(value),
      }),
    },
    {
      id: 'status',
      label: 'Status',
      chip: (row, value) => ({
        label: getStatusLabel(value),
        color: getStatusColor(value),
      }),
    },
  ]

  // Define actions
  const actions = []

  if (canStartConsultation) {
    actions.push({
      icon: <MedicalServicesIcon />,
      label: (row) => (row.status === 'DONE' || row.status === 1) ? 'View Consultation' : 'Start Consultation',
      color: 'success',
      onClick: handleConsultationClick,
      disabled: (row) => row.status === 'CANCEL' || row.status === 2,
    })
  }

  if (canEdit) {
    actions.push({
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (appointment) => navigate(`/appointments/${appointment.id}/edit`),
    })
  }

  if (canDelete) {
    actions.push({
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: openDeleteDialog,
    })
  }

  // Define filters for table
  const tableFilters = {
    status: {
      value: filters.status,
      type: 'select',
      label: 'Status',
      options: [
        { value: 'SCHEDULE', label: 'Scheduled' },
        { value: 'DONE', label: 'Completed' },
        { value: 'CANCEL', label: 'Cancelled' },
      ],
    },
    type: {
      value: filters.type,
      type: 'select',
      label: 'Type',
      options: [
        { value: 'NEW_PATIENT', label: 'New Patient' },
        { value: 'FOLLOW_UP', label: 'Follow Up' },
        { value: 'NEW_DIAGNOSIS', label: 'New Diagnosis' },
        { value: 'EMERGENCY', label: 'Emergency' },
      ],
    },
    patientName: {
      value: filters.patientName,
      type: 'text',
      label: 'Patient Name',
    },
    doctorName: {
      value: filters.doctorName,
      type: 'text',
      label: 'Doctor Name',
    },
  }

  // Handle filter change
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters)

    // Build API filters
    const apiFilters = {}
    if (newFilters.status) apiFilters.status = newFilters.status
    if (newFilters.type) apiFilters.type = newFilters.type
    if (newFilters.patientName) apiFilters.patientName = newFilters.patientName
    if (newFilters.doctorName) apiFilters.doctorName = newFilters.doctorName

    setPage(0)
    await fetchAppointments(apiFilters)
  }

  // Clear all filters
  const handleClearFilters = async () => {
    const emptyFilters = {
      date: '',
      status: '',
      patientName: '',
      doctorName: '',
      type: '',
    }

    setFilters(emptyFilters)
    setPage(0)
    await fetchAppointments()
  }

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    const newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    setPage(0)
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Table
        title="Appointments"
        columns={columns}
        data={sortedAppointments}
        loading={loading}
        filters={tableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={actions.length > 0 ? actions : null}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalCount={sortedAppointments.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onAddClick={canModify ? {
          label: 'Schedule Appointment',
          icon: <AddIcon />,
          onClick: () => navigate('/appointments/new'),
        } : null}
        emptyMessage="No appointments found."
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, appointment: null })}
      >
        <DialogTitle>Delete Appointment</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this appointment? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, appointment: null })}>
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
