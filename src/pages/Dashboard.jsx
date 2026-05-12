import React, { useEffect, useState } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  TablePagination,
  Button,
} from '@mui/material'
import {
  People as PeopleIcon,
  Event as AppointmentIcon,
  Security as InsuranceIcon,
  AssignmentInd as AssignmentIndIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'

const Dashboard = () => {
  const navigate = useNavigate()
  const {
    patients,
    appointments,
    insurances,
    fetchPatients,
    fetchAppointments,
    fetchInsurances,
  } = useApp()

  // Pagination state for recent appointments
  const [appointmentsPage, setAppointmentsPage] = useState(0)
  const [appointmentsRowsPerPage, setAppointmentsRowsPerPage] = useState(5)

  useEffect(() => {
    fetchPatients()
    fetchAppointments()
    fetchInsurances()
  }, [fetchPatients, fetchAppointments, fetchInsurances])

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      path: '/patients',
    },
    {
      title: 'Appointments',
      value: appointments.length,
      icon: <AppointmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32',
      path: '/appointments',
    },
    {
      title: 'Insurance Plans',
      value: insurances.length,
      icon: <InsuranceIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02',
      path: '/insurance',
    },
    {
      title: 'Create User',
      value: '+',
      icon: <AssignmentIndIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/users/new',
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 0:
        return 'info'
      case 1:
        return 'success'
      case 2:
        return 'error'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return 'Scheduled'
      case 1:
        return 'Completed'
      case 2:
        return 'Cancelled'
      default:
        return status
    }
  }

  const recentAppointments = appointments.slice(
    appointmentsPage * appointmentsRowsPerPage,
    appointmentsPage * appointmentsRowsPerPage + appointmentsRowsPerPage
  )

  return (
    <Box sx={{ height: 'calc(100vh - 120px)', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" fontWeight={600} sx={{ mb: 0.5 }}>
          Dashboard
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Welcome to Hospital Management System
        </Typography>
      </Box>

      <Grid container spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                height: '100%',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent sx={{ p: 2 }}>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h5" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      borderRadius: 2,
                      p: 1,
                      color: stat.color,
                    }}
                  >
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}

        <Grid item xs={12} sx={{ flex: 1, minHeight: 0 }}>
          <Paper sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={600}>
                Recent Appointments
              </Typography>
              <Button
                size="small"
                onClick={() => navigate('/appointments')}
              >
                View All
              </Button>
            </Box>
            {appointments.length > 0 ? (
              <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
                <TableContainer sx={{ flex: 1, overflow: 'auto' }}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ backgroundColor: 'transparent', fontWeight: 600 }}>Date & Time</TableCell>
                        <TableCell sx={{ backgroundColor: 'transparent', fontWeight: 600 }}>Patient</TableCell>
                        <TableCell sx={{ backgroundColor: 'transparent', fontWeight: 600 }}>Doctor</TableCell>
                        <TableCell sx={{ backgroundColor: 'transparent', fontWeight: 600 }}>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentAppointments.map((appointment) => (
                        <TableRow key={appointment.id} hover sx={{ '&:hover': { backgroundColor: 'action.hover' } }}>
                          <TableCell sx={{ backgroundColor: 'transparent' }}>
                            {appointment.appointmentdatetime
                              ? format(
                                  new Date(appointment.appointmentdatetime),
                                  'MMM dd, yyyy HH:mm'
                                )
                              : 'N/A'}
                          </TableCell>
                          <TableCell sx={{ backgroundColor: 'transparent' }}>{appointment.patientName || appointment.patient_name || 'N/A'}</TableCell>
                          <TableCell sx={{ backgroundColor: 'transparent' }}>{appointment.doctorName || appointment.doctor_name || 'N/A'}</TableCell>
                          <TableCell sx={{ backgroundColor: 'transparent' }}>
                            <Chip
                              label={getStatusLabel(appointment.status)}
                              color={getStatusColor(appointment.status)}
                              size="small"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25]}
                  component="div"
                  count={appointments.length}
                  rowsPerPage={appointmentsRowsPerPage}
                  page={appointmentsPage}
                  onPageChange={(e, newPage) => setAppointmentsPage(newPage)}
                  onRowsPerPageChange={(e) => {
                    setAppointmentsRowsPerPage(parseInt(e.target.value, 10))
                    setAppointmentsPage(0)
                  }}
                  sx={{ borderTop: '1px solid', borderColor: 'divider', flexShrink: 0 }}
                />
              </Box>
            ) : (
              <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  No appointments found
                </Typography>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
