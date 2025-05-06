import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  Badge,
  Divider,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  useColorModeValue,
  VStack,
  HStack,
  Flex,
} from '@chakra-ui/react';
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

  if (!userId) return <Box py={6} textAlign="center"><Alert status="error"><AlertIcon />Invalid or missing user ID in JWT. Please log in again.</Alert></Box>;

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

  if (loading) return <Box py={6} textAlign="center"><Spinner /></Box>;
  if (error) return <Box py={6} textAlign="center"><Alert status="error"><AlertIcon />{error}</Alert></Box>;

  return (
    <Box py={6} maxW="700px" mx="auto">
      <Heading as="h2" size="lg" mb={4}>Account & Subscription</Heading>
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="md" borderRadius="lg" p={6} mb={6}>
        <Heading as="h3" size="md" mb={2}>User Info</Heading>
        <Text>Name: {user?.name}</Text>
        <Text>Email: {user?.email}</Text>
        <Divider my={4} />
        <Heading as="h3" size="md" mb={2}>Current Plan</Heading>
        <HStack spacing={4} mb={2}>
          <Badge colorScheme="blue">{subscription?.plan_name || 'None'}</Badge>
          <Text>Renewal: {subscription?.renewal_date || 'N/A'}</Text>
          <Badge colorScheme={subscription?.status === 'Active' ? 'green' : 'yellow'}>{subscription?.status || 'Inactive'}</Badge>
        </HStack>
        <HStack spacing={4} mb={2}>
          <Button colorScheme="blue" variant="solid">Upgrade</Button>
          <Button colorScheme="blue" variant="outline">Downgrade</Button>
        </HStack>
        <Button colorScheme="red" variant="ghost" mt={2} onClick={handleCancel} isDisabled={cancelling || subscription?.status !== 'Active'}>
          {cancelling ? <Spinner size="sm" /> : 'Cancel Subscription'}
        </Button>
        <Text color="gray.500" mt={2} fontSize="sm">[Retention offer or feedback form coming soon!]</Text>
      </Box>
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="sm" borderRadius="lg" p={6} mb={6}>
        <Heading as="h3" size="md" mb={2}>Billing History</Heading>
        <Table size="sm" variant="simple">
          <Thead>
            <Tr>
              <Th>Date</Th>
              <Th>Amount</Th>
              <Th>Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {billing.map((bill, idx) => (
              <Tr key={bill.id || idx}>
                <Td>{bill.date || bill.created_at}</Td>
                <Td>{bill.amount}</Td>
                <Td>{bill.status}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="sm" borderRadius="lg" p={6}>
        <Heading as="h3" size="md" mb={2}>Payment Methods</Heading>
        <Button colorScheme="blue" onClick={handleAddPaymentMethod} isLoading={pmLoading} mb={2}>
          Add Payment Method
        </Button>
        {paymentMethods.length === 0 ? (
          <Text color="gray.500">No payment methods on file.</Text>
        ) : (
          <VStack align="start" spacing={3} mt={2}>
            {paymentMethods.map((pm: any) => (
              <Flex key={pm.id} align="center">
                <Text>{pm.brand} ****{pm.last4} (exp {pm.exp_month}/{pm.exp_year}) {pm.is_default && <strong>[Default]</strong>}</Text>
                <Button size="sm" colorScheme="red" ml={2} onClick={() => handleDeletePaymentMethod(pm.id)} isLoading={pmActionId === pm.id}>
                  Delete
                </Button>
                {!pm.is_default && (
                  <Button size="sm" colorScheme="blue" ml={2} onClick={() => handleSetDefaultPaymentMethod(pm.id)} isLoading={pmActionId === pm.id}>
                    Set Default
                  </Button>
                )}
              </Flex>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default Account; 