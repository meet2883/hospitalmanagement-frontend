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
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
  Security as InsuranceIcon,
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'
import { format } from 'date-fns'

const Dashboard = () => {
  const navigate = useNavigate()
  const {
    patients,
    doctors,
    appointments,
    insurances,
    fetchPatients,
    fetchDoctors,
    fetchAppointments,
    fetchInsurances,
  } = useApp()

  // Pagination state for recent appointments
  const [appointmentsPage, setAppointmentsPage] = useState(0)
  const [appointmentsRowsPerPage, setAppointmentsRowsPerPage] = useState(5)

  useEffect(() => {
    fetchPatients()
    fetchDoctors()
    fetchAppointments()
    fetchInsurances()
  }, [fetchPatients, fetchDoctors, fetchAppointments, fetchInsurances])

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2',
      path: '/patients',
    },
    {
      title: 'Total Doctors',
      value: doctors.length,
      icon: <DoctorIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0',
      path: '/doctors',
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
    <Box>
      <Typography variant="h4" gutterBottom fontWeight={600}>
        Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" gutterBottom>
        Welcome to Hospital Management System
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.title}>
            <Card
              sx={{
                cursor: 'pointer',
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: 4,
                },
              }}
              onClick={() => navigate(stat.path)}
            >
              <CardContent>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {stat.title}
                    </Typography>
                    <Typography variant="h4" fontWeight={600}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      backgroundColor: `${stat.color}20`,
                      borderRadius: 2,
                      p: 1.5,
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
      </Grid>

      <Grid container spacing={3} sx={{ mt: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
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
              <>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Date & Time</TableCell>
                        <TableCell>Patient</TableCell>
                        <TableCell>Doctor</TableCell>
                        <TableCell>Status</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentAppointments.map((appointment) => (
                        <TableRow key={appointment.id} hover>
                          <TableCell>
                            {appointment.appointmentdatetime
                              ? format(
                                  new Date(appointment.appointmentdatetime),
                                  'MMM dd, yyyy HH:mm'
                                )
                              : 'N/A'}
                          </TableCell>
                          <TableCell>{appointment.patientName || appointment.patient_name || 'N/A'}</TableCell>
                          <TableCell>{appointment.doctorName || appointment.doctor_name || 'N/A'}</TableCell>
                          <TableCell>
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
                  sx={{ borderTop: '1px solid', borderColor: 'divider', mt: 2 }}
                />
              </>
            ) : (
              <Typography variant="body2" color="text.secondary">
                No appointments found
              </Typography>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom fontWeight={600}>
              Quick Stats
            </Typography>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Active Doctors
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {doctors.length}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Registered Patients
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {patients.length}
              </Typography>
            </Box>
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" color="text.secondary">
                Total Appointments
              </Typography>
              <Typography variant="h5" fontWeight={600}>
                {appointments.length}
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard
