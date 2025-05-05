import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, TextField, Stack, Button, Chip } from '@mui/material';

const statusColor = (status: string) => {
  switch (status) {
    case 'Sent': return 'primary';
    case 'Interview': return 'info';
    case 'Offer': return 'success';
    case 'Rejected': return 'error';
    default: return 'default';
  }
};

const Applications: React.FC = () => {
  const [search, setSearch] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token') || '';
    setLoading(true);
    fetch('https://api-gw-production.up.railway.app/applications', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))
      .then(data => setApplications(data))
      .catch(err => setError(err.message || 'Failed to load applications'))
      .finally(() => setLoading(false));
  }, []);

  const filtered = applications.filter(app =>
    app.job.toLowerCase().includes(search.toLowerCase()) ||
    app.company.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <Box sx={{ py: 6, textAlign: 'center' }}><Typography>Loading...</Typography></Box>;
  if (error) return <Box sx={{ py: 6, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ py: 6, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>My Applications</Typography>
      <TextField
        label="Search Applications"
        variant="outlined"
        size="small"
        value={search}
        onChange={e => setSearch(e.target.value)}
        sx={{ mb: 2, width: '100%' }}
      />
      <Paper elevation={1} sx={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ padding: 12, textAlign: 'left' }}>Job Title</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Company</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Date Applied</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(app => (
              <tr key={app.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: 12 }}>{app.job}</td>
                <td style={{ padding: 12 }}>{app.company}</td>
                <td style={{ padding: 12 }}>{app.date}</td>
                <td style={{ padding: 12 }}>
                  <Chip label={app.status} color={statusColor(app.status)} />
                </td>
                <td style={{ padding: 12 }}>
                  <Stack direction="row" spacing={1}>
                    <Button size="small" variant="outlined">View</Button>
                    <Button size="small" variant="outlined">Edit</Button>
                    <Button size="small" variant="outlined" color="error">Withdraw</Button>
                    <Button size="small" variant="contained" color="primary">Track</Button>
                  </Stack>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>
    </Box>
  );
};

export default Applications; 