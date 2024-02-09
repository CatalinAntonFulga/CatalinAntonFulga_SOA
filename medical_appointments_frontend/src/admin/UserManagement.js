import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Modal, TextField, Grid } from '@mui/material';
import { jwtDecode } from 'jwt-decode';

const modalStyle = {
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

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    fetch('http://localhost:8080/api/users/all', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then(setUsers);
  };

  const handleOpenModal = (user = {}) => {
    setCurrentUser(user);
    setUsername(user.username || '');
    setPassword('');
    setEmail(user.email || '');
    setRole(user.role || '');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleSaveUser = (e) => {
    e.preventDefault();
    const method = currentUser.id ? 'PUT' : 'POST';
    const url = currentUser.id ? `http://localhost:8080/api/users/update?id=${currentUser.id}` : 'http://localhost:8080/api/users/admin/users';

    fetch(url, {
      method: method,
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
          console.error('Failed to save user');
        }
      });
  };

  const handleDeleteUser = (userId) => {
    fetch(`http://localhost:8080/api/users/delete?id=${userId}`, {
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
    <Box>
      <Typography variant="h5" sx={{ mb: 2 }}>User Management</Typography>
      <Button variant="contained" onClick={() => handleOpenModal()}>Add New User</Button>
      {users.map((user) => (
        <Box key={user.id} my={2} display="flex" justifyContent="space-between" alignItems="center">
          <Typography>{user.username} - {user.role}</Typography>
          <Box>
            <Button variant="contained" color="info" sx={{ mr: 1 }} onClick={() => handleOpenModal(user)}>Edit</Button>
            <Button variant="contained" color="error" onClick={() => handleDeleteUser(user.id)}>Delete</Button>
          </Box>
        </Box>
      ))}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {currentUser.id ? 'Edit User' : 'Add New User'}
          </Typography>
          <form onSubmit={handleSaveUser}>
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
              sx={{ mt: 3, mb: 2 }}
            >
              Save
            </Button>
          </form>
        </Box>
      </Modal>
    </Box>
  );
}

export default UserManagement;
