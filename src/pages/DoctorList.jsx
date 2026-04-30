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
  Chip,
  TablePagination,
  TableSortLabel,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const DoctorList = () => {
  const navigate = useNavigate()
  const { doctors, fetchDoctors, deleteDoctor, loading } = useApp()
  const [searchTerm, setSearchTerm] = useState('')
  const [deleteDialog, setDeleteDialog] = useState({ open: false, doctor: null })

  // Pagination state
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  // Sorting state
  const [orderBy, setOrderBy] = useState('name')
  const [order, setOrder] = useState('asc')

  useEffect(() => {
    fetchDoctors()
  }, [fetchDoctors])

  // Filter doctors based on search term
  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doctor.specialization?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort doctors
  const sortedDoctors = React.useMemo(() => {
    const stabilized = filteredDoctors.map((el, index) => [el, index])
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
  }, [filteredDoctors, orderBy, order])

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

  const paginatedDoctors = sortedDoctors.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  const handleDelete = async () => {
    if (deleteDialog.doctor) {
      const success = await deleteDoctor(deleteDialog.doctor.id)
      if (success) {
        setDeleteDialog({ open: false, doctor: null })
      }
    }
  }

  const openDeleteDialog = (doctor) => {
    setDeleteDialog({ open: true, doctor })
  }

  const getSpecializationColor = (specialization) => {
    switch (specialization) {
      case 'CARDIOLOGIST':
        return 'error'
      case 'PHISHIYO':
        return 'success'
      case 'PHYCHOLOGIST':
        return 'warning'
      default:
        return 'default'
    }
  }

  const headCells = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'specialization', label: 'Specialization' },
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
            Doctors
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage doctor records ({filteredDoctors.length} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/doctors/new')}
        >
          Add Doctor
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
              placeholder="Search doctors..."
              variant="outlined"
              size="small"
              fullWidth
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setPage(0)
              }}
            />
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
                    <TableCell colSpan={4} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedDoctors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Typography color="text.secondary">
                        No doctors found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedDoctors.map((doctor) => (
                    <TableRow key={doctor.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>{doctor.name}</Typography>
                      </TableCell>
                      <TableCell>{doctor.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={doctor.specialization}
                          color={getSpecializationColor(doctor.specialization)}
                          size="small"
                        />
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/doctors/${doctor.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(doctor)}
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
            count={sortedDoctors.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, doctor: null })}
      >
        <DialogTitle>Delete Doctor</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete doctor "{deleteDialog.doctor?.name}"?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, doctor: null })}
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

export default DoctorList
