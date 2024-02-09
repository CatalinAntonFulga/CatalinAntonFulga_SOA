import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Container, Typography, Box } from '@mui/material';
import SignIn from './users/SignIn';
import SignUp from './users/SignUp';
import AdminDashboard from './admin/AdminDashboard';
import PatientDashboard from './appointments/PatientDashboard';
import DoctorDashboard from './appointments/DoctorDashboard';
import { jwtDecode } from 'jwt-decode';

function App() {
  const token = localStorage.getItem('token');
  let role = '';

  if (token) {
    const decoded = jwtDecode(token);
    role = decoded.role;
  }

  return (
    <Router>
      <Container>
        <Typography variant="h4" component="h1" sx={{ mt: 2, mb: 4, ml: 2 }}>
          Medical Appointment System
        </Typography>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Routes>
            <Route path="/" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/patientPage" element={role === 'Patient' ? <PatientDashboard /> : <Navigate to="/" />} />
            <Route path="/doctorPage" element={role === 'Doctor' ? <DoctorDashboard /> : <Navigate to="/" />} />
            <Route path="/adminPage" element={role === 'Admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Box>
      </Container>
    </Router>
  );
}

export default App;
