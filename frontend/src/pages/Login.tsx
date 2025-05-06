import React, { useState } from 'react';
import { Box, Heading, Text, Input, Button, Link as ChakraLink, Stack, Alert, Spinner, useColorModeValue } from '@chakra-ui/react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../api';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

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
    <Box py={8} minH="80vh" display="flex" alignItems="center" justifyContent="center">
      <Box bg={cardBg} boxShadow={cardShadow} p={8} maxW={400} w="100%" borderRadius="xl">
        <Heading as="h1" size="lg" textAlign="center" fontWeight={700} mb={6}>
          Login
        </Heading>
        {showAuthMsg && <Alert status="warning" mb={2}>You must be logged in to access this page.</Alert>}
        {error && <Alert status="error" mb={2}>{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Box>
              <Text mb={1} fontWeight={600}>Email</Text>
              <Input
                placeholder="Email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Box>
            <Box>
              <Text mb={1} fontWeight={600}>Password</Text>
              <Input
                placeholder="Password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Box>
            <Button type="submit" colorScheme="brand" size="lg" fontWeight={700} isLoading={loading} loadingText="Logging in" w="100%">
              Login
            </Button>
          </Stack>
        </form>
        <Text fontSize="sm" textAlign="center" mt={6}>
          Don't have an account?{' '}
          <ChakraLink as={Link} to="/signup" color="brand.500" fontWeight={600} _hover={{ textDecoration: 'underline' }}>
            Sign up
          </ChakraLink>
        </Text>
      </Box>
    </Box>
  );
};

export default Login; 