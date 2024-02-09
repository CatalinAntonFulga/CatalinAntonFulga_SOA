import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Modal, TextField, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  useEffect(() => {
    const doctorName = jwtDecode(localStorage.getItem('token')).sub;
    fetchAppointments(doctorName);
  }, []);

  const fetchAppointments = (doctorName) => {
    fetch(`http://localhost:8081/api/appointments/by-doctor?name=${doctorName}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setAppointments);
  };

  const handleOpenModal = (appointment) => {
    setCurrentAppointment(appointment);
    setDescription(appointment.description);
    setDate(appointment.timestamp.split('T')[0]);
    setTime(appointment.timestamp.split('T')[1].substring(0, 5));
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleUpdateAppointment = (e) => {
    e.preventDefault();
    const appointmentDate = new Date(`${date}T${time}`);
    fetch(`http://localhost:8081/api/appointments/update?id=${currentAppointment.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        ...currentAppointment,
        description,
        timestamp: appointmentDate.toISOString(),
      }),
    })
      .then((res) => {
        if (res.ok) {
          fetchAppointments(jwtDecode(localStorage.getItem('token')).sub);
          handleCloseModal();
        } else {
          console.error('Failed to update appointment');
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
          setAppointments(appointments.filter(appointment => appointment.id !== appointmentId));
        } else {
          console.error('Failed to delete appointment');
        }
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Doctor Dashboard</Typography>
      {appointments.map((appointment) => (
        <Box key={appointment.id} my={2} p={2} border={1} borderColor="grey.300" borderRadius="borderRadius">
          <Typography variant="h6">{appointment.description}</Typography>
          <Typography variant="body1">Patient: {appointment.patient}</Typography>
          <Typography variant="body2">Date: {new Date(appointment.timestamp).toLocaleDateString()}</Typography>
          <Typography variant="body2">Time: {new Date(appointment.timestamp).toLocaleTimeString()}</Typography>
          <Button
            variant="outlined"
            color="error"
            sx={{ mt: 2, mr: 2 }}
            onClick={() => handleDeleteAppointment(appointment.id)}
          >
            Delete
          </Button>
          <Button
            variant="outlined"
            color="primary"
            sx={{ mt: 2 }}
            onClick={() => handleOpenModal(appointment)}
          >
            Update
          </Button>
        </Box>
      ))}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} component="form" onSubmit={handleUpdateAppointment}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Appointment
          </Typography>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="date"
                label="Date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                margin="normal"
                required
                fullWidth
                type="time"
                label="Time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ mt: 3, mb: 2 }}
          >
            Update
          </Button>
        </Box>
      </Modal>
    </Container>
  );
}

export default DoctorDashboard;
