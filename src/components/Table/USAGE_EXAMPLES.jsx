/**
 * Table Component - Usage Examples
 *
 * This file demonstrates how to use the reusable Table component
 */

import Table from './index'
import { Edit as EditIcon, Delete as DeleteIcon, Visibility as ViewIcon } from '@mui/icons-material'

// ==================== EXAMPLE 1: Basic Table ====================
export const BasicTableExample = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
  ]

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER' },
  ]

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
    />
  )
}

// ==================== EXAMPLE 2: Table with Custom Cell Rendering ====================
export const CustomRenderExample = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'status', label: 'Status',
      chip: (row, value) => ({
        label: value,
        color: value === 'Active' ? 'success' : 'error'
      })
    },
    { id: 'joinedDate', label: 'Joined Date',
      format: (value) => new Date(value).toLocaleDateString()
    },
  ]

  const data = [
    { id: 1, name: 'John Doe', status: 'Active', joinedDate: '2024-01-15' },
    { id: 2, name: 'Jane Smith', status: 'Inactive', joinedDate: '2024-02-20' },
  ]

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
    />
  )
}

// ==================== EXAMPLE 3: Table with Actions ====================
export const WithActionsExample = () => {
  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
  ]

  const data = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'ADMIN' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'USER' },
  ]

  const actions = [
    {
      icon: <ViewIcon />,
      label: 'View',
      color: 'info',
      onClick: (row) => console.log('View:', row),
    },
    {
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (row) => console.log('Edit:', row),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: (row) => console.log('Delete:', row),
      showCondition: (row) => row.role !== 'ADMIN', // Hide delete for ADMIN
    },
  ]

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
      actions={actions}
    />
  )
}

// ==================== EXAMPLE 4: Table with Filters ====================
export const WithFiltersExample = () => {
  const [filters, setFilters] = useState({
    name: { value: '', type: 'text', label: 'Name' },
    role: { value: '', type: 'select', label: 'Role', options: [
      { value: 'ADMIN', label: 'Admin' },
      { value: 'USER', label: 'User' },
    ]},
  })

  const [data, setData] = useState([])

  const handleFilterChange = async (newFilters) => {
    setFilters(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(newFilters).map(([k, v]) => [k, { ...prev[k], value: v }])
      )
    }))

    // Fetch filtered data
    // await fetchData(newFilters)
  }

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
  ]

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={() => {
        setFilters({
          name: { value: '', type: 'text', label: 'Name' },
          role: { value: '', type: 'select', label: 'Role', options: filters.role.options },
        })
      }}
    />
  )
}

// ==================== EXAMPLE 5: Table with Pagination (Client-side) ====================
export const WithPaginationExample = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
  ]

  const allData = [
    // ... 100 items
  ]

  // Client-side pagination
  const paginatedData = allData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  )

  return (
    <Table
      title="Users"
      columns={columns}
      data={paginatedData}
      pagination={true}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={allData.length}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
      }}
    />
  )
}

// ==================== EXAMPLE 6: Table with Server-side Pagination ====================
export const WithServerPaginationExample = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [data, setData] = useState([])
  const [totalCount, setTotalCount] = useState(0)

  const columns = [
    { id: 'name', label: 'Name' },
    { id: 'email', label: 'Email' },
    { id: 'role', label: 'Role' },
  ]

  const fetchData = async () => {
    // API call with pagination params
    // const response = await api.get(`/users?pageNum=${page}&pageSize=${rowsPerPage}`)
    // setData(response.data.content)
    // setTotalCount(response.data.totalElements)
  }

  useEffect(() => {
    fetchData()
  }, [page, rowsPerPage])

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
      loading={false}
      pagination={true}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      serverSidePagination={true}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
      }}
    />
  )
}

// ==================== EXAMPLE 7: Complete Example (All Features) ====================
export const CompleteExample = () => {
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const [filters, setFilters] = useState({
    name: { value: '', type: 'text', label: 'Name' },
    email: { value: '', type: 'text', label: 'Email' },
    role: { value: '', type: 'select', label: 'Role', options: [
      { value: 'ADMIN', label: 'Admin' },
      { value: 'DOCTOR', label: 'Doctor' },
      { value: 'EMPLOYEE', label: 'Employee' },
    ]},
  })

  const columns = [
    {
      id: 'name',
      label: 'Name',
      cellSx: { fontWeight: 500 },
    },
    { id: 'email', label: 'Email' },
    {
      id: 'role',
      label: 'Role',
      chip: (row, value) => ({
        label: value,
        color: value === 'ADMIN' ? 'error' : value === 'DOCTOR' ? 'success' : 'info',
      }),
    },
  ]

  const actions = [
    {
      icon: <EditIcon />,
      label: 'Edit',
      color: 'primary',
      onClick: (row) => console.log('Edit:', row.id),
    },
    {
      icon: <DeleteIcon />,
      label: 'Delete',
      color: 'error',
      onClick: (row) => console.log('Delete:', row.id),
      disabled: (row) => row.id === 1, // Disable delete for first user
    },
  ]

  const handleFilterChange = async (newFilters) => {
    // Update filters state and fetch data
    setFilters(prev => ({
      ...prev,
      ...Object.fromEntries(
        Object.entries(newFilters).map(([k, v]) => [k, { ...prev[k], value: v }])
      )
    }))

    // Fetch filtered data from server
    setPage(0) // Reset to first page
  }

  const handleClearFilters = () => {
    setFilters({
      name: { value: '', type: 'text', label: 'Name' },
      email: { value: '', type: 'text', label: 'Email' },
      role: { value: '', type: 'select', label: 'Role', options: filters.role.options },
    })
    setPage(0)
  }

  return (
    <Table
      title="Users"
      columns={columns}
      data={data}
      loading={loading}
      filters={filters}
      onFilterChange={handleFilterChange}
      onClearFilters={handleClearFilters}
      actions={actions}
      pagination={true}
      page={page}
      rowsPerPage={rowsPerPage}
      totalCount={totalCount}
      serverSidePagination={true}
      onPageChange={(e, newPage) => setPage(newPage)}
      onRowsPerPageChange={(e) => {
        setRowsPerPage(parseInt(e.target.value, 10))
        setPage(0)
      }}
      onAddClick={{
        label: 'Add User',
        icon: <AddIcon />,
        onClick: () => console.log('Add new user'),
      }}
      emptyMessage="No users found. Create your first user to get started."
    />
  )
}

/*
 * ==================== PROP REFERENCE ====================
 *
 * DATA PROPS:
 * - data: Array of row objects
 * - columns: Array of column definitions
 *   - id: string (required) - Field name in data object
 *   - label: string (required) - Column header text
 *   - align: 'left' | 'center' | 'right' (default: 'left')
 *   - width: string - Fixed width
 *   - minWidth: string - Minimum width
 *   - chip: function | object - Render as Chip
 *   - format: function - Custom formatter
 *   - render: function - Custom cell renderer
 *   - cellSx: object - Custom cell styles
 *
 * ACTIONS:
 * - actions: Array of action objects
 *   - icon: React node (required)
 *   - label: string - Tooltip text
 *   - color: string - Icon color
 *   - onClick: function(row) (required)
 *   - showCondition: function(row) - Show/hide action
 *   - disabled: function(row) - Enable/disable action
 *
 * FILTERS:
 * - filters: Object with filter configurations
 *   - key: { value, type, label, options (for select) }
 *   - type: 'text' | 'select'
 *
 * PAGINATION:
 * - pagination: boolean (default: true)
 * - page: number
 * - rowsPerPage: number
 * - totalCount: number
 * - serverSidePagination: boolean
 * - onPageChange: function(event, page)
 * - onRowsPerPageChange: function(event)
 *
 * OTHER:
 * - title: string
 * - onAddClick: { label, icon, onClick }
 * - loading: boolean
 * - emptyMessage: string
 * - onRowClick: function(row)
 * - size: 'small' | 'medium'
 * - sx: object - Custom container styles
 */
