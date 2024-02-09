import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';


function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    const bodyContent = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
    fetch('http://localhost:8080/api/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyContent,
    })
    .then(response => response.json())
    .then(data => {
      console.log('Logged in successfully:', data);
      localStorage.setItem('token', data.jwt);
      const decodedToken = jwtDecode(data.jwt);
      console.log('Decoded Token:', decodedToken);
      localStorage.setItem('user', JSON.stringify(decodedToken));

      const userRole = decodedToken.role ? decodedToken.role.toLowerCase() : null;
      if (userRole) {
        localStorage.setItem('role', userRole);
        navigate(`/${userRole}Dashboard`);
      } else {
        console.error('Role not found in token');
      }
    })
    .catch(error => {
      console.error('Login error:', error);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">Sign in</Typography>
      <form onSubmit={handleSignIn}>
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          label="Username"
          name="username"
          autoComplete="username"
          autoFocus
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign In
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/signup')}
        >
          Don't have an account? Sign Up
        </Button>
      </form>
    </Container>
  );
}

export default SignIn;