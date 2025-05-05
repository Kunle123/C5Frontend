import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Button, Stack, Chip, Divider, Table, TableHead, TableRow, TableCell, TableBody, CircularProgress, Alert } from '@mui/material';
import { getUser, getSubscription, getPaymentMethods, getPaymentHistory, cancelSubscription, addPaymentMethod, deletePaymentMethod, setDefaultPaymentMethod, getUserIdFromToken } from '../api';

const Account: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [billing, setBilling] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [pmLoading, setPmLoading] = useState(false);
  const [pmActionId, setPmActionId] = useState<string | null>(null);
  const token = localStorage.getItem('token') || '';
  const userId = getUserIdFromToken(token);

  if (!userId) return <Box sx={{ py: 6, textAlign: 'center' }}><Alert severity="error">Invalid or missing user ID in JWT. Please log in again.</Alert></Box>;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      try {
        const userData = await getUser(token);
        setUser(userData);
        if (!userId) throw new Error('Invalid user ID');
        const subData = await getSubscription(userId, token);
        setSubscription(subData);
        const billingData = await getPaymentHistory(userId, token);
        setBilling(billingData);
        const methods = await getPaymentMethods(userId, token);
        setPaymentMethods(methods);
      } catch (err: any) {
        setError(err.message || 'Failed to load account info');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token, userId]);

  const handleCancel = async () => {
    if (!subscription?.id) return;
    setCancelling(true);
    setError('');
    try {
      await cancelSubscription(subscription.id, token);
      setSubscription({ ...subscription, status: 'Canceled' });
    } catch (err: any) {
      setError(err.message || 'Cancel failed');
    } finally {
      setCancelling(false);
    }
  };

  // Payment method actions
  const handleAddPaymentMethod = async () => {
    if (!userId) return;
    setPmLoading(true);
    setError('');
    try {
      const result = await addPaymentMethod(token);
      if (result.url) {
        window.location.href = result.url;
      } else {
        const methods = await getPaymentMethods(userId, token);
        setPaymentMethods(methods);
      }
    } catch (err: any) {
      setError(err.message || 'Add payment method failed');
    } finally {
      setPmLoading(false);
    }
  };

  const handleDeletePaymentMethod = async (id: string) => {
    setPmActionId(id);
    setError('');
    try {
      await deletePaymentMethod(id, token);
      setPaymentMethods(prev => prev.filter(pm => pm.id !== id));
    } catch (err: any) {
      setError(err.message || 'Delete payment method failed');
    } finally {
      setPmActionId(null);
    }
  };

  const handleSetDefaultPaymentMethod = async (id: string) => {
    if (!userId) return;
    setPmActionId(id);
    setError('');
    try {
      await setDefaultPaymentMethod(id, token);
      const methods = await getPaymentMethods(userId, token);
      setPaymentMethods(methods);
    } catch (err: any) {
      setError(err.message || 'Set default failed');
    } finally {
      setPmActionId(null);
    }
  };

  if (loading) return <Box sx={{ py: 6, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ py: 6, textAlign: 'center' }}><Alert severity="error">{error}</Alert></Box>;

  return (
    <Box sx={{ py: 6, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Account & Subscription</Typography>
      <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6">User Info</Typography>
        <Typography>Name: {user?.name}</Typography>
        <Typography>Email: {user?.email}</Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">Current Plan</Typography>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Chip label={subscription?.plan_name || 'None'} color="primary" />
          <Typography>Renewal: {subscription?.renewal_date || 'N/A'}</Typography>
          <Chip label={subscription?.status || 'Inactive'} color={subscription?.status === 'Active' ? 'success' : 'warning'} />
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="contained" color="primary">Upgrade</Button>
          <Button variant="outlined" color="primary">Downgrade</Button>
        </Stack>
        <Button variant="text" color="error" sx={{ mt: 2 }} onClick={handleCancel} disabled={cancelling || subscription?.status !== 'Active'}>
          {cancelling ? <CircularProgress size={18} /> : 'Cancel Subscription'}
        </Button>
        <Typography color="text.secondary" sx={{ mt: 1 }}>
          [Retention offer or feedback form coming soon!]
        </Typography>
      </Paper>
      <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Billing History</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {billing.map((bill, idx) => (
              <TableRow key={bill.id || idx}>
                <TableCell>{bill.date || bill.created_at}</TableCell>
                <TableCell>{bill.amount}</TableCell>
                <TableCell>{bill.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Paper elevation={1} sx={{ p: 4 }}>
        <Typography variant="h6" gutterBottom>Payment Methods</Typography>
        <Button variant="contained" color="primary" onClick={handleAddPaymentMethod} disabled={pmLoading} sx={{ mb: 2 }}>
          {pmLoading ? <CircularProgress size={18} /> : 'Add Payment Method'}
        </Button>
        {paymentMethods.length === 0 ? (
          <Typography color="text.secondary">No payment methods on file.</Typography>
        ) : (
          <ul>
            {paymentMethods.map((pm: any) => (
              <li key={pm.id} style={{ marginBottom: 8 }}>
                {pm.brand} ****{pm.last4} (exp {pm.exp_month}/{pm.exp_year}) {pm.is_default && <strong>[Default]</strong>}
                <Button size="small" color="error" onClick={() => handleDeletePaymentMethod(pm.id)} disabled={pmActionId === pm.id} sx={{ ml: 2 }}>
                  {pmActionId === pm.id ? <CircularProgress size={14} /> : 'Delete'}
                </Button>
                {!pm.is_default && (
                  <Button size="small" color="primary" onClick={() => handleSetDefaultPaymentMethod(pm.id)} disabled={pmActionId === pm.id} sx={{ ml: 1 }}>
                    {pmActionId === pm.id ? <CircularProgress size={14} /> : 'Set Default'}
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </Paper>
    </Box>
  );
};

export default Account; 