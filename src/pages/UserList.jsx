import React, { useEffect, useState, useCallback, useRef } from 'react'
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
import { debounce } from 'lodash'
import Table from '../components/Table'

const UserList = () => {
  const navigate = useNavigate()
  const { users, fetchUsers, deleteUser, loading, user, usersPagination } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userItem: null })

  // Filter states
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: '',
  })

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Ref to track latest filters for debounce
  const filtersRef = useRef(filters)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  useEffect(() => {
    fetchUsers({ pageNum: 0, pageSize: 5 })
  }, [fetchUsers])

  const handleDelete = async () => {
    if (deleteDialog.userItem) {
      const success = await deleteUser(deleteDialog.userItem.id)
      if (success) {
        setDeleteDialog({ open: false, userItem: null })
      }
    }
  }

  const openDeleteDialog = (userItem) => {
    setDeleteDialog({ open: true, userItem })
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'error'
      case 'DOCTOR':
        return 'success'
      case 'EMPLOYEE':
        return 'info'
      default:
        return 'default'
    }
  }

  // Define columns
  const columns = [
    {
      id: 'name',
      label: 'Name',
      cellSx: { fontWeight: 500 },
    },
    {
      id: 'email',
      label: 'Email',
    },
    {
      id: 'role',
      label: 'Role',
      chip: (row, value) => ({
        label: value,
        color: getRoleColor(value),
      }),
    },
    {
      id: 'specialization',
      label: 'Specialization',
      format: (value) => value || '-',
    },
  ]

  // Define actions
  const actions = [
    {
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (userItem) => navigate(`/users/${userItem.id}/edit`),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: openDeleteDialog,
      disabled: (userItem) => userItem.id === user?.id,
    },
  ]

  // Define filters for table
  const tableFilters = {
    name: {
      value: filters.name,
      type: 'text',
      label: 'Name',
    },
    email: {
      value: filters.email,
      type: 'text',
      label: 'Email',
    },
    role: {
      value: filters.role,
      type: 'select',
      label: 'Role',
      options: [
        { value: 'ADMIN', label: 'Admin' },
        { value: 'DOCTOR', label: 'Doctor' },
        { value: 'EMPLOYEE', label: 'Employee' },
      ],
    },
  }

  // Handle filter change
  const handleFilterChange = async (newFilters) => {
    setFilters(newFilters)

    // Build API filters
    const apiFilters = { pageNum: 0, pageSize: rowsPerPage }
    if (newFilters.name) apiFilters.name = newFilters.name
    if (newFilters.email) apiFilters.email = newFilters.email
    if (newFilters.role) apiFilters.role = newFilters.role

    setPage(0)
    await fetchUsers(apiFilters)
  }

  // Clear all filters
  const handleClearFilters = async () => {
    const emptyFilters = {
      name: '',
      email: '',
      role: '',
    }

    setFilters(emptyFilters)
    setPage(0)
    await fetchUsers({ pageNum: 0, pageSize: rowsPerPage })
  }

  // Handle page change
  const handleChangePage = async (event, newPage) => {
    setPage(newPage)

    const apiFilters = {
      pageNum: newPage,
      pageSize: rowsPerPage,
    }

    if (filters.name) apiFilters.name = filters.name
    if (filters.email) apiFilters.email = filters.email
    if (filters.role) apiFilters.role = filters.role

    await fetchUsers(apiFilters)
  }

  // Handle rows per page change
  const handleChangeRowsPerPage = async (event) => {
    const newPageSize = parseInt(event.target.value, 10)

    const apiFilters = {
      pageNum: 0,
      pageSize: newPageSize,
    }

    if (filters.name) apiFilters.name = filters.name
    if (filters.email) apiFilters.email = filters.email
    if (filters.role) apiFilters.role = filters.role

    setRowsPerPage(newPageSize)
    setPage(0)
    await fetchUsers(apiFilters)
  }

  return (
    <Box sx={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <Table
        title="Users"
        columns={columns}
        data={users || []}
        loading={loading}
        filters={tableFilters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
        actions={actions}
        pagination={true}
        page={page}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[5, 10, 25, 50]}
        totalCount={usersPagination.totalElements}
        serverSidePagination={true}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        onAddClick={{
          label: 'Create User',
          icon: <AddIcon />,
          onClick: () => navigate('/users/new'),
        }}
        emptyMessage="No users found."
        sx={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, userItem: null })}
      >
        <DialogTitle>Delete User</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete user "{deleteDialog.userItem?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog({ open: false, userItem: null })}>
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

export default UserList
