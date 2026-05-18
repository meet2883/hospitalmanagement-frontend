import React, { useState, useCallback, useRef, useEffect } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Chip,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { debounce } from 'lodash'
import Table from '../components/Table'

const PatientList = () => {
  const navigate = useNavigate()
  const { patients, fetchPatients, deletePatient, loading, user, patientsPagination } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, patient: null })

  // Get user role
  const userRole = user?.role || 'EMPLOYEE'
  const canModify = userRole === 'ADMIN' || userRole === 'EMPLOYEE'

  // Filter states with pagination
  const [filters, setFilters] = useState({
    name: '',
    phoneNumber: '',
    gender: '',
    bloodgroup: '',
  })

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('patientName')
  const [order, setOrder] = useState('asc')

  // Ref to track latest filters for debounce
  const filtersRef = useRef(filters)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Initial fetch
  useEffect(() => {
    fetchPatients({ pageNum: 0, pageSize: 5 })
  }, [fetchPatients])

  // Build API filters from state
  const buildApiFilters = (pageNum = page, pageSize = rowsPerPage) => {
    const apiFilters = { pageNum, pageSize }

    if (filters.name) apiFilters.name = filters.name
    if (filters.phoneNumber) apiFilters.phoneNumber = filters.phoneNumber
    if (filters.gender) apiFilters.gender = filters.gender
    if (filters.bloodgroup) apiFilters.bloodgroup = filters.bloodgroup

    return apiFilters
  }

  // Debounced fetch for text inputs
  const debouncedFetch = useCallback(
    debounce(() => {
      const currentFilters = filtersRef.current
      const apiFilters = {
        pageNum: 0,
        pageSize: rowsPerPage,
      }

      if (currentFilters.name) apiFilters.name = currentFilters.name
      if (currentFilters.phoneNumber) apiFilters.phoneNumber = currentFilters.phoneNumber
      if (currentFilters.gender) apiFilters.gender = currentFilters.gender
      if (currentFilters.bloodgroup) apiFilters.bloodgroup = currentFilters.bloodgroup

      setPage(0)
      fetchPatients(apiFilters)
    }, 500),
    [fetchPatients, rowsPerPage]
  )

  // Handle filter change
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters)

    // Build API filters
    const apiFilters = { pageNum: 0, pageSize: rowsPerPage }

    if (newFilters.name) apiFilters.name = newFilters.name
    if (newFilters.phoneNumber) apiFilters.phoneNumber = newFilters.phoneNumber
    if (newFilters.gender) apiFilters.gender = newFilters.gender
    if (newFilters.bloodgroup) apiFilters.bloodgroup = newFilters.bloodgroup

    setPage(0)
    await fetchPatients(apiFilters)
  }

  // Clear all filters
  const handleClearFilters = async () => {
    const emptyFilters = {
      name: '',
      phoneNumber: '',
      gender: '',
      bloodgroup: '',
    }

    setFilters(emptyFilters)
    setPage(0)
    await fetchPatients({ pageNum: 0, pageSize: rowsPerPage })
  }

  // Handle page change
  const handleChangePage = async (event, newPage) => {
    setPage(newPage)
    await fetchPatients(buildApiFilters(newPage, rowsPerPage))
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = async (event) => {
    const newPageSize = parseInt(event.target.value, 10)
    setRowsPerPage(newPageSize)
    setPage(0)
    await fetchPatients(buildApiFilters(0, newPageSize))
  }

  // Handle delete
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

  // Sort patients (client-side sorting on top of server data)
  const sortedPatients = React.useMemo(() => {
    const patientsToSort = [...patients]

    patientsToSort.sort((a, b) => {
      const aValue = a[orderBy]
      const bValue = b[orderBy]

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

    return patientsToSort
  }, [patients, orderBy, order])

  // Define columns
  const columns = [
    {
      id: 'patientName',
      label: 'Name',
      cellSx: { fontWeight: 500 },
    },
    {
      id: 'age',
      label: 'Age',
      format: (value) => value || 'N/A',
    },
    {
      id: 'gender',
      label: 'Gender',
      format: (value) => value || 'N/A',
    },
    {
      id: 'phoneNumber',
      label: 'Phone',
      format: (value) => value || 'N/A',
    },
    {
      id: 'bloodGroup',
      label: 'Blood Group',
      render: (row, value) => {
        if (!value) return 'N/A'
        return <Chip label={value} size="small" color="error" />
      },
    },
    {
      id: 'insurance',
      label: 'Insurance',
      format: (value, row) => row.insurance?.policyName || 'None',
    },
  ]

  // Define actions
  const actions = [
    {
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (patient) => navigate(`/patients/${patient.id}/edit`),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: (patient) => openDeleteDialog(patient),
    },
  ]

  // Define filters for table
  const tableFilters = {
    name: {
      value: filters.name,
      type: 'text',
      label: 'Patient Name',
    },
    phoneNumber: {
      value: filters.phoneNumber,
      type: 'text',
      label: 'Phone Number',
    },
    gender: {
      value: filters.gender,
      type: 'select',
      label: 'Gender',
      options: [
        { value: 'Male', label: 'Male' },
        { value: 'Female', label: 'Female' },
        { value: 'Other', label: 'Other' },
      ],
    },
    bloodgroup: {
      value: filters.bloodgroup,
      type: 'select',
      label: 'Blood Group',
      options: [
        { value: 'A+', label: 'A+' },
        { value: 'A-', label: 'A-' },
        { value: 'B+', label: 'B+' },
        { value: 'B-', label: 'B-' },
        { value: 'AB+', label: 'AB+' },
        { value: 'AB-', label: 'AB-' },
        { value: 'O+', label: 'O+' },
        { value: 'O-', label: 'O-' },
      ],
    },
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Table
        title="Patients"
        columns={columns}
        data={sortedPatients}
        loading={loading}
        filters={tableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={canModify ? actions : null}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalCount={patientsPagination.totalElements}
        serverSidePagination={true}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onAddClick={canModify ? {
          label: 'Add Patient',
          icon: <AddIcon />,
          onClick: () => navigate('/patients/new'),
        } : null}
        emptyMessage="No patients found. Add your first patient to get started."
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, patient: null })}
      >
        <DialogTitle>Delete Patient</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete patient "{deleteDialog.patient?.patientName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, patient: null })}>
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
