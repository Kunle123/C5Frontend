import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api';

const Signup: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);
    try {
      const res = await register({ name, email, password });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    } catch (err: any) {
      let msg = 'Signup failed';
      if (err?.error) msg = err.error;
      if (err?.detail) msg = err.detail;
      if (typeof err === 'string') msg = err;
      setError(msg);
      console.log('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <Paper elevation={3} sx={{ p: 5, minWidth: 340, maxWidth: 400 }}>
        <Typography variant="h4" gutterBottom>Sign Up</Typography>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Name"
              value={name}
              onChange={e => setName(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              fullWidth
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              fullWidth
              required
            />
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">Signup successful! Redirecting to login...</Alert>}
            <Button type="submit" variant="contained" color="primary" size="large" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Sign Up'}
            </Button>
            <Typography variant="body2" sx={{ textAlign: 'center' }}>
              Already have an account?{' '}
              <MuiLink component={Link} to="/login" underline="hover">
                Login
              </MuiLink>
            </Typography>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default Signup; 