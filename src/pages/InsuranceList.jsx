import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import Table from '../components/Table'

const InsuranceList = () => {
  const navigate = useNavigate()
  const { insurances, fetchInsurances, deleteInsurance, loading } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, insurance: null })

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('policyName')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    fetchInsurances()
  }, [fetchInsurances])

  // Filter and sort insurances
  const filteredInsurances = React.useMemo(() => {
    let result = [...(insurances || [])]

    // Apply search filter
    if (searchTerm) {
      result = result.filter((insurance) =>
        insurance.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        insurance.policyProvider?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Sort
    result.sort((a, b) => {
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

    return result
  }, [insurances, searchTerm, orderBy, order])

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

  // Define columns
  const columns = [
    {
      id: 'policyName',
      label: 'Policy Name',
      cellSx: { fontWeight: 500 },
    },
    {
      id: 'policyProvider',
      label: 'Provider',
    },
  ]

  // Define actions
  const actions = [
    {
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (insurance) => navigate(`/insurance/${insurance.id}/edit`),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: openDeleteDialog,
    },
  ]

  // Define filters for table
  const tableFilters = {
    search: {
      value: searchTerm,
      type: 'text',
      label: 'Search',
    },
  }

  // Handle filter change
  const handleFilterChange = (newFilters) => {
    setSearchTerm(newFilters.search || '')
    setPage(0)
  }

  // Clear filters
  const handleClearFilters = () => {
    setSearchTerm('')
    setPage(0)
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
        title="Insurance Plans"
        columns={columns}
        data={filteredInsurances}
        loading={loading}
        filters={tableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={actions}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalCount={filteredInsurances.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onAddClick={{
          label: 'Add Insurance Plan',
          icon: <AddIcon />,
          onClick: () => navigate('/insurance/new'),
        }}
        emptyMessage="No insurance plans found."
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, insurance: null })}
      >
        <DialogTitle>Delete Insurance Plan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete insurance plan "{deleteDialog.insurance?.policyName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, insurance: null })}>
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
