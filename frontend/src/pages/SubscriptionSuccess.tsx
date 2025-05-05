import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const SubscriptionSuccess: React.FC = () => (
  <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Paper elevation={4} sx={{ p: 5, maxWidth: 500, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Subscription Successful!</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Thank you for subscribing! Your account has been upgraded and you now have access to premium features.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/dashboard">
        Go to Dashboard
      </Button>
    </Paper>
  </Box>
);

export default SubscriptionSuccess; 