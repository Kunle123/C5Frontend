import React, { useState } from 'react';
import { Box, Heading, Text, Input, Button, Link as ChakraLink, Stack, Alert, useColorModeValue } from '@chakra-ui/react';
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
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

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
    <Box display="flex" justifyContent="center" alignItems="center" minH="70vh">
      <Box bg={cardBg} boxShadow={cardShadow} p={8} minW={340} maxW={400} w="100%" borderRadius="xl">
        <Heading as="h1" size="lg" textAlign="center" fontWeight={700} mb={6}>
          Sign Up
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <Box>
              <Text mb={1} fontWeight={600}>Name</Text>
              <Input
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                autoComplete="name"
              />
            </Box>
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
                autoComplete="new-password"
              />
            </Box>
            {error && <Alert status="error">{error}</Alert>}
            {success && <Alert status="success">Signup successful! Redirecting to login...</Alert>}
            <Button type="submit" colorScheme="brand" size="lg" fontWeight={700} isLoading={loading} loadingText="Signing up" w="100%">
              Sign Up
            </Button>
            <Text fontSize="sm" textAlign="center">
              Already have an account?{' '}
              <ChakraLink as={Link} to="/login" color="brand.500" fontWeight={600} _hover={{ textDecoration: 'underline' }}>
                Login
              </ChakraLink>
            </Text>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default Signup; 