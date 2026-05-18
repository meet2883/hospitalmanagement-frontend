import React, { useState } from 'react'
import {
  Box,
  Paper,
  Typography,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  Grid,
  Divider,
  Button,
} from '@mui/material'
import {
  FilterList as FilterListIcon,
  Clear as ClearIcon,
} from '@mui/icons-material'

const Table = ({
  // Data
  data = [],
  columns = [],
  loading = false,

  // Title & Actions
  title = '',
  titleAction = null,
  onAddClick = null,

  // Pagination
  pagination = true,
  page = 0,
  rowsPerPage = 5,
  rowsPerPageOptions = [5, 10, 25, 50],
  totalCount = data.length,
  onPageChange,
  onRowsPerPageChange,
  serverSidePagination = false,

  // Filters
  filters = null, // { key: { value: '', type: 'text'|'select', options: [], label: '' } }
  onFilterChange = null,
  onClearFilters = null,
  filterDebounceMs = 500,

  // Empty State
  emptyMessage = 'No data found',
  showEmptyState = true,

  // Actions Column
  actions = null, // Array of action objects: { label, icon, onClick, color, showCondition, disabled }
  actionsColumnLabel = 'Actions',

  // Other
  onRowClick = null,
  size = 'medium',
  sx = {},
}) => {
  const [localFilters, setLocalFilters] = useState({})
  const [debounceTimer, setDebounceTimer] = useState(null)

  // Handle filter change with debounce
  const handleFilterChange = (key, value) => {
    // Update local state immediately for smooth typing
    setLocalFilters(prev => ({ ...prev, [key]: value }))

    if (onFilterChange) {
      // Clear existing timer
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }

      // Set new timer
      const timer = setTimeout(() => {
        onFilterChange({ ...localFilters, [key]: value })
      }, filterDebounceMs)

      setDebounceTimer(timer)
    }
  }

  // Handle select filter change (immediate)
  const handleSelectFilterChange = (key, value) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }))

    if (onFilterChange) {
      onFilterChange({ ...localFilters, [key]: value })
    }
  }

  // Get current filter value from controlled source
  const getFilterValue = (key) => {
    // Use localFilters first (for immediate updates), then fallback to props
    if (localFilters[key] !== undefined) {
      return localFilters[key]
    }
    return filters?.[key]?.value || ''
  }

  // Clear all filters
  const handleClearFilters = () => {
    setLocalFilters({})

    if (onClearFilters) {
      onClearFilters()
    } else if (onFilterChange) {
      onFilterChange({})
    }
  }

  // Check if any filter is active
  const hasActiveFilters = filters
    ? Object.values(filters).some(filter => filter.value)
    : Object.values(localFilters).some(value => value)

  // Get active filter count
  const activeFilterCount = filters
    ? Object.values(filters).filter(filter => filter.value).length
    : Object.values(localFilters).filter(value => value).length

  // Render cell content based on column configuration
  const renderCellContent = (column, row) => {
    const value = row[column.id]

    if (column.render) {
      return column.render(row, value)
    }

    if (column.chip) {
      const chipConfig = typeof column.chip === 'function'
        ? column.chip(row, value)
        : { label: value, color: column.chip.color || 'default' }

      return (
        <Chip
          label={chipConfig.label || value}
          size="small"
          color={chipConfig.color}
          {...chipConfig.props}
        />
      )
    }

    if (column.format) {
      return column.format(value, row)
    }

    return value || '-'
  }

  // Render action buttons
  const renderActions = (row) => {
    if (!actions || actions.length === 0) return null

    return (
      <Box sx={{ display: 'flex', gap: 0.5 }}>
        {actions.map((action, index) => {
          // Check if action should be shown
          if (action.showCondition && !action.showCondition(row)) {
            return null
          }

          // Check if action should be disabled
          const isDisabled = action.disabled ? action.disabled(row) : false

          return (
            <IconButton
              key={index}
              size="small"
              color={action.color || 'primary'}
              onClick={(e) => {
                e.stopPropagation()
                action.onClick(row)
              }}
              disabled={isDisabled}
              title={action.label || ''}
            >
              {action.icon}
            </IconButton>
          )
        })}
      </Box>
    )
  }

  // Render filters section
  const renderFilters = () => {
    if (!filters || Object.keys(filters).length === 0) {
      return null
    }

    const filterKeys = Object.keys(filters)

    return (
      <Box sx={{ mb: 1, flexShrink: 0 }}>
        {/* Filter Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <FilterListIcon color="primary" sx={{ fontSize: '1.25rem' }} />
            <Typography variant="subtitle2" fontWeight={600}>
              Filters
            </Typography>
            {activeFilterCount > 0 && (
              <Chip
                label={activeFilterCount}
                size="small"
                color="primary"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20, minWidth: 20, '& .MuiChip-label': { px: 0.5 } }}
              />
            )}
          </Box>
          {hasActiveFilters && (
            <Button
              variant="text"
              size="small"
              startIcon={<ClearIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleClearFilters}
              color="primary"
              sx={{ fontSize: '0.75rem', textTransform: 'none', minWidth: 'auto', py: 0.5 }}
            >
              Clear
            </Button>
          )}
        </Box>

        {/* Filters Grid */}
        <Grid container spacing={1}>
          {filterKeys.map((key) => {
            const filterConfig = filters[key]
            const isSelect = filterConfig.type === 'select'

            if (isSelect) {
              return (
                <Grid item xs={12} sm={6} md={3} key={key}>
                  <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: '0.8rem' }}>{filterConfig.label}</InputLabel>
                    <Select
                      label={filterConfig.label}
                      value={getFilterValue(key)}
                      onChange={(e) => handleSelectFilterChange(key, e.target.value)}
                      sx={{ fontSize: '0.85rem' }}
                    >
                      <MenuItem value="">All</MenuItem>
                      {filterConfig.options?.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              )
            }

            return (
              <Grid item xs={12} sm={6} md={3} key={key}>
                <TextField
                  label={filterConfig.label}
                  variant="outlined"
                  size="small"
                  fullWidth
                  value={getFilterValue(key)}
                  onChange={(e) => handleFilterChange(key, e.target.value)}
                  placeholder={`Search ${filterConfig.label.toLowerCase()}...`}
                  InputLabelProps={{ sx: { fontSize: '0.8rem' } }}
                  InputProps={{ sx: { fontSize: '0.85rem' } }}
                />
              </Grid>
            )
          })}
        </Grid>

        {/* Active Filters Summary */}
        {hasActiveFilters && totalCount !== undefined && (
          <Box
            sx={{
              mt: 1,
              py: 0.5,
              px: 1,
              borderRadius: 1,
              backgroundColor: 'success.lighter',
              color: 'success.dark',
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
            }}
          >
            <Typography variant="caption" fontWeight={500}>
              Found <strong>{totalCount}</strong> record{totalCount !== 1 ? 's' : ''}
            </Typography>
          </Box>
        )}
      </Box>
    )
  }

  return (
    <Box sx={{ ...sx, display: 'flex', flexDirection: 'column' }}>
      {/* Title Section */}
      {(title || titleAction || onAddClick) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1,
            flexShrink: 0,
          }}
        >
          <Box>
            {title && (
              <>
                <Typography variant="h5" fontWeight={600}>
                  {title}
                </Typography>
                {totalCount !== undefined && (
                  <Typography variant="caption" color="text.secondary">
                    {totalCount} total records
                  </Typography>
                )}
              </>
            )}
          </Box>
          {titleAction || (onAddClick && (
            <Button
              variant="contained"
              size="small"
              startIcon={onAddClick.icon}
              onClick={onAddClick.onClick}
            >
              {onAddClick.label}
            </Button>
          ))}
        </Box>
      )}

      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          overflow: 'hidden',
          p: 1.5,
          minHeight: 0,
        }}
      >
        {/* Filters Section */}
        {renderFilters()}

        {/* Table */}
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, overflow: 'hidden' }}>
          <TableContainer
            sx={{
              flex: 1,
              overflow: 'auto',
            }}
          >
            <MuiTable size={size} stickyHeader>
              <TableHead>
                <TableRow>
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align || 'left'}
                      sx={{
                        fontWeight: 600,
                        backgroundColor: 'background.paper',
                        width: column.width,
                        minWidth: column.minWidth,
                      }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  {actions && actions.length > 0 && (
                    <TableCell
                      align="center"
                      sx={{ fontWeight: 600, backgroundColor: 'background.paper' }}
                    >
                      {actionsColumnLabel}
                    </TableCell>
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (actions ? 1 : 0)}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      <Typography color="text.secondary">Loading...</Typography>
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length + (actions ? 1 : 0)}
                      align="center"
                      sx={{ py: 3 }}
                    >
                      {showEmptyState ? (
                        <Typography color="text.secondary">
                          {emptyMessage}
                        </Typography>
                      ) : null}
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, index) => (
                    <TableRow
                      key={row.id || index}
                      hover={!!onRowClick}
                      onClick={onRowClick ? () => onRowClick(row) : undefined}
                      sx={{
                        cursor: onRowClick ? 'pointer' : 'default',
                        backgroundColor: 'transparent',
                        '&:hover': onRowClick ? {
                          backgroundColor: 'action.hover',
                        } : undefined,
                      }}
                    >
                      {columns.map((column) => (
                        <TableCell
                          key={column.id}
                          align={column.align || 'left'}
                          sx={{
                            backgroundColor: 'transparent',
                            ...column.cellSx,
                          }}
                        >
                          {renderCellContent(column, row)}
                        </TableCell>
                      ))}
                      {actions && actions.length > 0 && (
                        <TableCell align="center" sx={{ backgroundColor: 'transparent' }}>
                          {renderActions(row)}
                        </TableCell>
                      )}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </MuiTable>
          </TableContainer>
        </Box>

        {/* Pagination */}
        {pagination && (
          <TablePagination
            rowsPerPageOptions={rowsPerPageOptions}
            component="div"
            count={serverSidePagination ? totalCount : data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={onPageChange}
            onRowsPerPageChange={onRowsPerPageChange}
            sx={{ borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}
          />
        )}
      </Paper>
    </Box>
  )
}

export default Table
