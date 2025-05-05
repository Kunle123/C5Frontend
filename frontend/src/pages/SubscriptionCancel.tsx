import React from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { Link } from 'react-router-dom';

const SubscriptionCancel: React.FC = () => (
  <Box sx={{ py: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
    <Paper elevation={4} sx={{ p: 5, maxWidth: 500, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Subscription Not Completed</Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Your subscription was not completed. You can try again or choose a different plan.
      </Typography>
      <Button variant="contained" color="primary" component={Link} to="/pricing">
        Return to Pricing
      </Button>
    </Paper>
  </Box>
);

export default SubscriptionCancel; 