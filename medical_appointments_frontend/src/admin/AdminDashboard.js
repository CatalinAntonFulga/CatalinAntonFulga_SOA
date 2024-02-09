import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Container, Grid, TextField, Modal } from '@mui/material';
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

function AdminDashboard() {
  const [view, setView] = useState('appointments');
  const [appointments, setAppointments] = useState([]);
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (view === 'appointments') {
      fetchAppointments();
    } else {
      fetchUsers();
    }
  }, [view]);

  const fetchAppointments = () => {
    fetch('http://localhost/api/appointments', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setAppointments);
  };

  const fetchUsers = () => {
    fetch('http://localhost/api/users/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers);
  };

  const handleOpenModal = (user) => {
    setCurrentUser(user);
    setUsername(user.username);
    setPassword(user.password);
    setEmail(user.email);
    setRole(user.role);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddOrUpdateUser = (e) => {
    e.preventDefault();
    const method = currentUser.id ? 'PUT' : 'POST';
    const url = currentUser.id
      ? `http://localhost/api/users/update?id=${currentUser.id}`
      : 'http://localhost/api/users/admin/users';

    fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        username,
        password,
        email,
        role,
      }),
    })
      .then((res) => {
        if (res.ok) {
          fetchUsers();
          handleCloseModal();
        } else {
          console.error('Failed to add or update user');
        }
      });
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://localhost/api/users/delete?id=${userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          setUsers(users.filter(user => user.id !== userId));
        } else {
          console.error('Failed to delete user');
        }
      });
  };

  return (
    <Container>
      <Typography variant="h4" sx={{ mb: 4 }}>Admin Dashboard</Typography>
      <Box sx={{ mb: 2 }}>
        <Button variant="contained" sx={{ mr: 2 }} onClick={() => setView('appointments')}>Appointments</Button>
        <Button variant="contained" onClick={() => setView('users')}>Users</Button>
      </Box>

      {view === 'appointments' && appointments.map((appointment) => (
        <Box key={appointment.id} my={2} p={2} border={1} borderColor="grey.300" borderRadius="borderRadius">
          <Typography variant="h6">{appointment.description}</Typography>
          <Typography variant="body1">Doctor: {appointment.doctor}</Typography>
          <Typography variant="body1">Patient: {appointment.patient}</Typography>
        </Box>
      ))}

      {view === 'users' && (
        <>
          <Button variant="outlined" color="primary" sx={{ mb: 2 }} onClick={() => handleOpenModal({})}>Add New User</Button>
          {users.map((user) => (
            <Box key={user.id} my={2} p={2} border={1} borderColor="grey.300" borderRadius="borderRadius">
              <Typography variant="h6">Username: {user.username}</Typography>
              <Typography variant="body1">Email: {user.email}</Typography>
              <Typography variant="body1">Role: {user.role}</Typography>
              <Box mt={2}>
                <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleOpenModal(user)}>Edit</Button>
                <Button variant="outlined" color="secondary" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
              </Box>
            </Box>
          ))}
        </>
      )}

      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ mb: 2 }}>
            {currentUser.id ? 'Edit User' : 'Add New User'}
          </Typography>
          <Box component="form" onSubmit={handleAddOrUpdateUser} noValidate>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 3, mb: 2 }}
            >
              {currentUser.id ? 'Update User' : 'Add User'}
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
