import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, TextField, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

function PatientDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const patientName = jwtDecode(localStorage.getItem('token')).sub; // Assuming 'sub' contains the patient's name
    fetchAppointments(patientName);
  }, []);

  const fetchAppointments = (patientName) => {
    fetch(`http://localhost:8081/api/appointments/by-patient?name=${patientName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setAppointments);
  };

  const handleAddAppointment = (e) => {
    e.preventDefault();
    const appointmentDate = new Date(`${date}T${time}`);
    const patientName = jwtDecode(localStorage.getItem('token')).sub;

    fetch('http://localhost:8081/api/appointments/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        patient: patientName,
        doctor,
        description,
        timestamp: appointmentDate.toISOString(),
        address: 'N/A',
      }),
    })
      .then((res) => {
        if (res.ok) {
          fetchAppointments(patientName);
          setDoctor('');
          setDescription('');
          setDate('');
          setTime('');
        } else {
          console.error('Failed to add appointment');
        }
      });
  };

  const handleDeleteAppointment = (appointmentId) => {
    fetch(`http://localhost:8081/api/appointments/delete?id=${appointmentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          const updatedAppointments = appointments.filter(appointment => appointment.id !== appointmentId);
          setAppointments(updatedAppointments);
        } else {
          console.error('Failed to delete appointment');
        }
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Patient Dashboard</Typography>
      
      <Box component="form" onSubmit={handleAddAppointment} noValidate sx={{ mb: 4 }}>
        <Typography variant="h6">Add New Appointment</Typography>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              autoComplete="doctor-name"
              name="doctor"
              required
              fullWidth
              id="doctor"
              label="Doctor Name"
              autoFocus
              value={doctor}
              onChange={(e) => setDoctor(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              required
              fullWidth
              id="description"
              label="Description"
              name="description"
              autoComplete="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="date"
              label="Date"
              type="date"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="time"
              label="Time"
              type="time"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add Appointment
            </Button>
          </Grid>
        </Grid>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>Your Appointments</Typography>
      {appointments.map((appointment) => (
        <Box key={appointment.id} my={2} p={2} border={1} borderColor="grey.300" borderRadius="borderRadius">
          <Typography variant="h6">{appointment.description}</Typography>
          <Typography variant="body1">Doctor: {appointment.doctor}</Typography>
          <Typography variant="body2">Date: {new Date(appointment.timestamp).toLocaleDateString()}</Typography>
          <Typography variant="body2">Time: {new Date(appointment.timestamp).toLocaleTimeString()}</Typography>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2 }}
            onClick={() => handleDeleteAppointment(appointment.id)}
          >
            Delete Appointment
          </Button>
        </Box>
      ))}
    </Container>
  );
}

export default PatientDashboard;
