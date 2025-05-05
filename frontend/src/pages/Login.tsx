import React, { useState } from 'react';
import { Box, Typography, TextField, Button, Link as MuiLink, Stack, Paper, CircularProgress, Alert } from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.token);
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Login failed';
      if (err?.error) msg = err.error;
      if (err?.detail) msg = err.detail;
      if (typeof err === 'string') msg = err;
      setError(msg);
      console.log('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Show message if redirected from protected route
  const params = new URLSearchParams(location.search);
  const showAuthMsg = params.get('reason') === 'auth';

  return (
    <Box sx={{ py: 8, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper elevation={4} sx={{ p: 5, maxWidth: 400, width: '100%' }}>
        <Typography variant="h4" align="center" fontWeight={700} gutterBottom>
          Login
        </Typography>
        {showAuthMsg && <Alert severity="warning" sx={{ mb: 2 }}>You must be logged in to access this page.</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              fullWidth
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              fullWidth
            />
            <Button type="submit" variant="contained" color="primary" fullWidth disabled={loading}>
              {loading ? <CircularProgress size={24} /> : 'Login'}
            </Button>
          </Stack>
        </form>
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Don't have an account?{' '}
          <MuiLink component={Link} to="/signup">
            Sign up
          </MuiLink>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login; 