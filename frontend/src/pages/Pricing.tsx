import React from 'react';
import { Box, Typography, Card, CardContent, Button, Paper } from '@mui/material';
import { Grid, GridItem } from '@chakra-ui/react';

const plans = [
  {
    name: 'Free',
    price: '$0',
    description: 'Basic CV creation and management. Limited features.',
    cta: 'Get Started',
    color: 'primary',
  },
  {
    name: 'Pro',
    price: '$12/mo',
    description: 'Unlimited CVs, AI optimization, and cover letter generation.',
    cta: 'Upgrade to Pro',
    color: 'secondary',
  },
  {
    name: 'Enterprise',
    price: 'Contact Us',
    description: 'Custom solutions for teams and organizations. Priority support.',
    cta: 'Contact Sales',
    color: 'success',
  },
];

const Pricing: React.FC = () => (
  <Box sx={{ py: 8, maxWidth: 1100, mx: 'auto' }}>
    <Typography variant="h3" align="center" gutterBottom>Pricing Plans</Typography>
    <Typography variant="h6" align="center" color="text.secondary" sx={{ mb: 6 }}>
      Choose the plan that fits your job search needs. Upgrade anytime.
    </Typography>
    <Grid templateColumns="repeat(3, 1fr)" gap={4} mb={6}>
      {plans.map(plan => (
        <GridItem key={plan.name}>
          <Card elevation={plan.name === 'Pro' ? 8 : 3} sx={{ p: 2, border: plan.name === 'Pro' ? '2px solid #1976d2' : undefined, maxWidth: { xs: '100%', md: 400 }, width: '100%', boxSizing: 'border-box', mx: 'auto' }}>
            <CardContent>
              <Typography variant="h5" gutterBottom color={plan.color}>{plan.name}</Typography>
              <Typography variant="h4" color="primary" gutterBottom>{plan.price}</Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>{plan.description}</Typography>
              <Button
                variant={plan.name === 'Pro' ? 'contained' : 'outlined'}
                color={plan.color as any}
                size="large"
                fullWidth
                sx={{ fontWeight: 600 }}
              >
                {plan.cta}
              </Button>
            </CardContent>
          </Card>
        </GridItem>
      ))}
    </Grid>
    <Paper elevation={0} sx={{ mt: 8, p: 4, bgcolor: 'grey.100', textAlign: 'center' }}>
      <Typography variant="h6" gutterBottom>Questions about pricing or need a custom plan?</Typography>
      <Button variant="outlined" color="primary" size="large">Contact Us</Button>
    </Paper>
  </Box>
);

export default Pricing; 