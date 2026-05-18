import React from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Divider,
  Button,
  Avatar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  People as PeopleIcon,
  LocalHospital as DoctorIcon,
  Event as AppointmentIcon,
  Security as InsuranceIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Notes as NotesIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { useNavigate, useLocation } from 'react-router-dom'
import { useApp } from '../contexts/AppContext'

const drawerWidth = 240
const collapsedDrawerWidth = 64

// Role-based navigation configuration
const getNavigationItems = (role) => {
  const allItems = [
    { text: 'Dashboard', path: '/dashboard', icon: <DashboardIcon />, roles: ['ADMIN', 'EMPLOYEE', 'DOCTOR'] },
    { text: 'Patients', path: '/patients', icon: <PeopleIcon />, roles: ['ADMIN', 'EMPLOYEE', 'DOCTOR'] },
    { text: 'Appointments', path: '/appointments', icon: <AppointmentIcon />, roles: ['ADMIN', 'EMPLOYEE', 'DOCTOR'] },
    { text: 'Insurance', path: '/insurance', icon: <InsuranceIcon />, roles: ['ADMIN'] },
    { text: 'Users', path: '/users', icon: <PeopleIcon />, roles: ['ADMIN'] }
  ]

  return allItems.filter(item => item.roles.includes(role))
}

const AppLayout = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [desktopCollapsed, setDesktopCollapsed] = React.useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { user, signOut } = useApp()

  // Get user role (default to EMPLOYEE if not set)
  const userRole = user?.role || 'EMPLOYEE'

  // Get navigation items based on user role
  const navigationItems = React.useMemo(() => getNavigationItems(userRole), [userRole])

  // Calculate current drawer width
  const currentDrawerWidth = isMobile ? drawerWidth : (desktopCollapsed ? collapsedDrawerWidth : drawerWidth)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleDesktopCollapseToggle = () => {
    setDesktopCollapsed(!desktopCollapsed)
  }

  // const handleDrawerToggle = () => {
  //   setMobileOpen(!mobileOpen)
  // }

  const handleNavigation = (path) => {
    navigate(path)
    if (isMobile) {
      setMobileOpen(false)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/signin')
  }

    const drawer = (
    <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Logo/Brand Section */}
      <Toolbar
        sx={{
          minHeight: '48px !important',
          height: 48,
          px: desktopCollapsed ? 1.5 : 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {!desktopCollapsed ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box sx={{
              width: 32,
              height: 32,
              borderRadius: 1.5,
              background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Typography variant="h6" fontWeight={700} color="white" fontSize="1rem">
                H
              </Typography>
            </Box>
            <Typography variant="h6" fontWeight={700} fontSize="1rem" color="primary.main">
              HMS
            </Typography>
          </Box>
        ) : (
          <Box sx={{
            width: 32,
            height: 32,
            borderRadius: 1.5,
            background: 'linear-gradient(135deg, primary.main 0%, primary.dark 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
          }}>
            <Typography variant="h6" fontWeight={700} color="white" fontSize="1rem">
              H
            </Typography>
          </Box>
        )}
      </Toolbar>

      {/* Navigation Items */}
      <List sx={{ flex: 1, py: 1, px: 1 }}>
        {navigationItems.map((item) => {
          const isSelected = location.pathname === item.path
          const listItemButton = (
            <ListItemButton
              selected={isSelected}
              onClick={() => handleNavigation(item.path)}
              sx={{
                justifyContent: desktopCollapsed ? 'center' : 'flex-start',
                px: desktopCollapsed ? 0 : 1.5,
                py: 1,
                my: 0.25,
                borderRadius: 1.5,
                minHeight: 40,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'primary.dark',
                  },
                  '& .MuiListItemIcon-root': {
                    color: 'white',
                  },
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  mr: desktopCollapsed ? 0 : 1.5,
                  justifyContent: 'center',
                  color: isSelected ? 'inherit' : 'text.secondary',
                  fontSize: '1.25rem',
                }}
              >
                {item.icon}
              </ListItemIcon>
              {!desktopCollapsed && (
                <ListItemText
                  primary={item.text}
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      whiteSpace: 'nowrap',
                    },
                  }}
                />
              )}
            </ListItemButton>
          )

          return desktopCollapsed ? (
            <ListItem key={item.text} disablePadding sx={{ display: 'block' }}>
              <Tooltip title={item.text} placement="right" arrow>
                {listItemButton}
              </Tooltip>
            </ListItem>
          ) : (
            <ListItem key={item.text} disablePadding>
              {listItemButton}
            </ListItem>
          )
        })}
      </List>

      {/* Bottom Section: Logout and Collapse */}
      <Box sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
        <List sx={{ py: 1, px: 1 }}>
          {/* Logout */}
          {desktopCollapsed ? (
            <ListItem disablePadding sx={{ display: 'block' }}>
              <Tooltip title="Logout" placement="right" arrow>
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    justifyContent: 'center',
                    px: 0,
                    py: 1,
                    my: 0.25,
                    borderRadius: 1.5,
                    minHeight: 40,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'error.lighter',
                      '& .MuiListItemIcon-root': {
                        color: 'error.main',
                      },
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      justifyContent: 'center',
                      color: 'text.secondary',
                      fontSize: '1.25rem',
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                </ListItemButton>
              </Tooltip>
            </ListItem>
          ) : (
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleLogout}
                sx={{
                  px: 1.5,
                  py: 1,
                  my: 0.25,
                  borderRadius: 1.5,
                  minHeight: 40,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'error.lighter',
                    '& .MuiListItemIcon-root': {
                      color: 'error.main',
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    mr: 1.5,
                    color: 'text.secondary',
                    fontSize: '1.25rem',
                  }}
                >
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText
                  primary="Logout"
                  sx={{
                    '& .MuiTypography-root': {
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                    },
                  }}
                />
              </ListItemButton>
            </ListItem>
          )}

          {/* Collapse Toggle - Desktop Only */}
          {!isMobile && (
            <ListItem disablePadding>
              <ListItemButton
                onClick={handleDesktopCollapseToggle}
                sx={{
                  justifyContent: desktopCollapsed ? 'center' : 'flex-start',
                  px: desktopCollapsed ? 0 : 1.5,
                  py: 1,
                  my: 0.25,
                  borderRadius: 1.5,
                  minHeight: 40,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 'auto',
                    mr: desktopCollapsed ? 0 : 1.5,
                    justifyContent: 'center',
                    color: 'text.secondary',
                    fontSize: '1.25rem',
                  }}
                >
                  {desktopCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </ListItemIcon>
                {!desktopCollapsed && (
                  <ListItemText
                    primary="Collapse"
                    sx={{
                      '& .MuiTypography-root': {
                        fontWeight: 500,
                        fontSize: '0.875rem',
                        color: 'text.secondary',
                      },
                    }}
                  />
                )}
              </ListItemButton>
            </ListItem>
          )}
        </List>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          ml: { md: `${currentDrawerWidth}px` },
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
          boxShadow: 0,
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.paper',
          color: 'text.primary',
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', height: 48 }}>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 1, display: { md: 'none' } }}
          >
            <MenuIcon sx={{ fontSize: '1.25rem' }} />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontSize: '1.1rem', color: 'text.primary' }} fontWeight={600}>
            Hospital Management System
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
              <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.9rem' }}>
                {user?.name?.charAt(0)?.toUpperCase() || <PersonIcon sx={{ fontSize: '0.9rem' }} />}
              </Avatar>
              <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                <Typography variant="body2" fontWeight={500} fontSize="0.85rem" color="text.primary">
                  {user?.name || 'User'}
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7, fontSize: '0.7rem', color: 'text.secondary' }}>
                  {userRole}
                </Typography>
              </Box>
            </Box>
            <Button
              color="primary"
              startIcon={<LogoutIcon sx={{ fontSize: '1rem' }} />}
              onClick={handleLogout}
              sx={{ textTransform: 'none', fontSize: '0.85rem', minWidth: 'auto', px: 1 }}
            >
              <Typography sx={{ display: { xs: 'none', md: 'block' }, fontSize: '0.85rem' }}>Logout</Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{
          width: { md: currentDrawerWidth },
          flexShrink: { md: 0 },
          transition: (theme) => theme.transitions.create('width', {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: currentDrawerWidth,
              borderRight: '1px solid',
              borderColor: 'divider',
              overflowX: 'hidden',
              backgroundColor: 'background.paper',
              transition: (theme) => theme.transitions.create('width', {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.standard,
              }),
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 2,
          width: { md: `calc(100% - ${currentDrawerWidth}px)` },
          minHeight: '100vh',
          backgroundColor: 'background.default',
          transition: (theme) => theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.easeInOut,
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Toolbar sx={{ minHeight: '48px !important', height: 48 }} />
        {children}
      </Box>
    </Box>
  )
}

export default AppLayout
