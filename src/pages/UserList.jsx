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
  Grid,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  TablePagination,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { debounce } from 'lodash'

const UserList = () => {
  const navigate = useNavigate()
  const { users, fetchUsers, deleteUser, loading, user, usersPagination } = useApp()
  const [deleteDialog, setDeleteDialog] = useState({ open: false, userItem: null })

  // Get user role - only ADMIN can access this page
  const userRole = user?.role || 'EMPLOYEE'

  // Filter states with pagination
  const [filters, setFilters] = useState({
    name: '',
    email: '',
    role: '',
    pageNum: 0,
    pageSize: 5,
  })

  // Ref to track latest filters for debounce
  const filtersRef = useRef(filters)
  useEffect(() => {
    filtersRef.current = filters
  }, [filters])

  // Pagination state (synced with filters)
  const page = filters.pageNum
  const rowsPerPage = filters.pageSize

  useEffect(() => {
    fetchUsers({ pageNum: 0, pageSize: 5 })
  }, [fetchUsers])

  // Check if any filter is active
  const hasActiveFilters = filters.name || filters.email || filters.role

  // Debounced fetch for text inputs
  const debouncedFetch = useCallback(
    debounce(() => {
      const apiFilters = {}
      const currentFilters = filtersRef.current

      if (currentFilters.name) {
        apiFilters.name = currentFilters.name
      }
      if (currentFilters.email) {
        apiFilters.email = currentFilters.email
      }
      if (currentFilters.role) {
        apiFilters.role = currentFilters.role
      }

      // Always include pagination parameters
      apiFilters.pageNum = 0
      apiFilters.pageSize = currentFilters.pageSize

      setFilters(prev => ({ ...prev, pageNum: 0 }))
      fetchUsers(apiFilters)
    }, 500),
    [fetchUsers]
  )

  // Apply filters for dropdowns (immediate)
  const applyFilters = async (updatedFilters = {}) => {
    const apiFilters = {}
    const mergedFilters = { ...filters, ...updatedFilters }

    if (mergedFilters.name) {
      apiFilters.name = mergedFilters.name
    }
    if (mergedFilters.email) {
      apiFilters.email = mergedFilters.email
    }
    if (mergedFilters.role) {
      apiFilters.role = mergedFilters.role
    }

    // Reset to first page when filters change
    apiFilters.pageNum = 0
    apiFilters.pageSize = mergedFilters.pageSize

    setFilters(prev => ({ ...prev, pageNum: 0, ...updatedFilters }))
    await fetchUsers(apiFilters)
  }

  // Helper function to clear all filters
  const clearFilters = async () => {
    const emptyFilters = {
      name: '',
      email: '',
      role: '',
      pageNum: 0,
      pageSize: filters.pageSize,
    }
    setFilters(emptyFilters)
    await fetchUsers({ pageNum: 0, pageSize: filters.pageSize })
  }

  // Use users directly since API handles filtering and pagination
  const filteredUsers = users || []

  // Pagination - fetch from server
  const handleChangePage = async (event, newPage) => {
    const apiFilters = {
      pageNum: newPage,
      pageSize: filters.pageSize,
    }

    // Add existing filters
    if (filters.name) apiFilters.name = filters.name
    if (filters.email) apiFilters.email = filters.email
    if (filters.role) apiFilters.role = filters.role

    setFilters(prev => ({ ...prev, pageNum: newPage }))
    await fetchUsers(apiFilters)
  }

  const handleChangeRowsPerPage = async (event) => {
    const newPageSize = parseInt(event.target.value, 10)
    const apiFilters = {
      pageNum: 0,
      pageSize: newPageSize,
    }

    // Add existing filters
    if (filters.name) apiFilters.name = filters.name
    if (filters.email) apiFilters.email = filters.email
    if (filters.role) apiFilters.role = filters.role

    setFilters(prev => ({ ...prev, pageNum: 0, pageSize: newPageSize }))
    await fetchUsers(apiFilters)
  }

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

  const activeFilterCount = [
    filters.name,
    filters.email,
    filters.role,
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
            Users
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage user accounts ({usersPagination.totalElements} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/users/new')}
        >
          Create User
        </Button>
      </Box>

      <Card>
        <CardContent>
          {/* Filters Section */}
          <Box sx={{ mb: 3 }}>
            {/* Filter Header */}
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
                  Filters
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

            {/* Filters Grid */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Name"
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
              <Grid item xs={12} sm={6} md={4}>
                <TextField
                  label="Email"
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={filters.email}
                  onChange={(e) => {
                    setFilters(prev => ({ ...prev, email: e.target.value }))
                    debouncedFetch()
                  }}
                  placeholder="Search by email..."
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    value={filters.role}
                    onChange={(e) => {
                      const value = e.target.value
                      setFilters({ ...filters, role: value })
                      applyFilters({ role: value })
                    }}
                  >
                    <MenuItem value="">All Roles</MenuItem>
                    <MenuItem value="ADMIN">Admin</MenuItem>
                    <MenuItem value="DOCTOR">Doctor</MenuItem>
                    <MenuItem value="EMPLOYEE">Employee</MenuItem>
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
                  Found <strong>{usersPagination.totalElements}</strong> user{usersPagination.totalElements !== 1 ? 's' : ''} matching your criteria
                </Typography>
              </Alert>
            )}
          </Box>

          <Divider sx={{ mb: 2 }} />

          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Role</TableCell>
                  <TableCell>Specialization</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      <Typography color="text.secondary">
                        No users found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((userItem) => (
                    <TableRow key={userItem.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {userItem.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{userItem.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={userItem.role}
                          size="small"
                          color={getRoleColor(userItem.role)}
                        />
                      </TableCell>
                      <TableCell>
                        {userItem.specialization || '-'}
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/users/${userItem.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(userItem)}
                          disabled={userItem.id === user?.id}
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
            count={usersPagination.totalElements}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

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
          <Button
            onClick={() => setDeleteDialog({ open: false, userItem: null })}
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

export default UserList
