# Hospital Management System - Frontend

A modern React frontend for the Hospital Management System built with Material UI.

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Material UI (MUI) v5** - Component library
- **React Router v6** - Routing
- **Axios** - HTTP client
- **date-fns** - Date formatting

## Prerequisites

- Node.js 18+ and npm/yarn
- Running Spring Boot backend on port 8080

## Installation

1. Navigate to the frontend directory:
```bash
cd hospitalmanagement-frontend
```

2. Install dependencies:
```bash
npm install
```

## Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Features

- **Dashboard** - Overview with statistics and recent appointments
- **Patient Management** - CRUD operations for patients
- **Doctor Management** - CRUD operations for doctors
- **Appointment Management** - Schedule and manage appointments
- **Insurance Management** - Manage insurance plans

## Project Structure

```
src/
├── components/        # Reusable components
│   ├── AppLayout.jsx # Main layout with navigation
│   └── Snackbar.jsx  # Notification component
├── contexts/         # React Context for state management
│   └── AppContext.jsx
├── pages/            # Page components
│   ├── Dashboard.jsx
│   ├── PatientList.jsx
│   ├── PatientForm.jsx
│   ├── DoctorList.jsx
│   ├── DoctorForm.jsx
│   ├── AppointmentList.jsx
│   ├── AppointmentForm.jsx
│   ├── InsuranceList.jsx
│   └── InsuranceForm.jsx
├── services/         # API service layer
│   ├── patientService.js
│   ├── doctorService.js
│   ├── appointmentService.js
│   └── insuranceService.js
├── utils/            # Utility functions
│   ├── api.js        # Axios configuration
│   └── theme.js      # MUI theme configuration
├── App.jsx           # Main app with routing
└── main.jsx          # Entry point
```

## Backend Integration

The frontend is configured to proxy API requests to the Spring Boot backend running on `http://localhost:8080`. The proxy is set up in `vite.config.js`.

## Design Principles

- Clean, industry-standard design
- Responsive layout that works on all devices
- Consistent color scheme and typography
- User-friendly forms with validation
- Loading states and error handling
- Snackbar notifications for user feedback
