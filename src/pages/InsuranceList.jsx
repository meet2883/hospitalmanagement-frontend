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
  TablePagination,
  TableSortLabel,
  InputAdornment,
} from '@mui/material'
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

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

  // Filter insurances based on search term
  const filteredInsurances = insurances.filter((insurance) =>
    insurance.policyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    insurance.policyProvider?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Sort insurances
  const sortedInsurances = React.useMemo(() => {
    const stabilized = filteredInsurances.map((el, index) => [el, index])
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
  }, [filteredInsurances, orderBy, order])

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

  const paginatedInsurances = sortedInsurances.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

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

  const headCells = [
    { id: 'policyName', label: 'Policy Name' },
    { id: 'policyProvider', label: 'Provider' },
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
            Insurance Plans
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage insurance plans ({filteredInsurances.length} total)
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/insurance/new')}
        >
          Add Insurance Plan
        </Button>
      </Box>

      <Card>
        <CardContent>
          <TextField
            placeholder="Search insurance plans..."
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
                    <TableCell colSpan={3} align="center">
                      <Typography>Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : sortedInsurances.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} align="center">
                      <Typography color="text.secondary">
                        No insurance plans found
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedInsurances.map((insurance) => (
                    <TableRow key={insurance.id} hover>
                      <TableCell>
                        <Typography fontWeight={500}>
                          {insurance.policyName}
                        </Typography>
                      </TableCell>
                      <TableCell>{insurance.policyProvider}</TableCell>
                      <TableCell align="center">
                        <IconButton
                          color="primary"
                          onClick={() => navigate(`/insurance/${insurance.id}/edit`)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => openDeleteDialog(insurance)}
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
            count={sortedInsurances.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>

      <Dialog
        open={deleteDialog.open}
        onClose={() => setDeleteDialog({ open: false, insurance: null })}
      >
        <DialogTitle>Delete Insurance Plan</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete insurance plan "
            {deleteDialog.insurance?.policyName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDeleteDialog({ open: false, insurance: null })}
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

export default InsuranceList
