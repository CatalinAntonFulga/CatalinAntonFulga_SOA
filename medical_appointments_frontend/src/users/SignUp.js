import React, { useState } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    const bodyContent = `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&email=${encodeURIComponent(email)}`;
    fetch('http://localhost:8080/api/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: bodyContent,
    })
    .then(response => response.json())
    .then(data => {
      localStorage.setItem('token', data.jwt);
      navigate('/');
    })
    .catch(error => {
      console.error('Signup error:', error);
    });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Typography component="h1" variant="h5">Sign up</Typography>
      <form onSubmit={handleSignUp}>
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
          name="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          variant="outlined"
          margin="normal"
          required
          fullWidth
          name="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          color="primary"
        >
          Sign Up
        </Button>
        <Button
          fullWidth
          variant="text"
          onClick={() => navigate('/')}
        >
          Already have an account? Sign In
        </Button>
      </form>
    </Container>
  );
}

export default SignUp;
