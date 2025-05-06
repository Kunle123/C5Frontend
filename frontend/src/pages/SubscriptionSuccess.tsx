import React from 'react';
import { Box, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SubscriptionSuccess: React.FC = () => (
  <Box py={8} display="flex" flexDirection="column" alignItems="center">
    <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" maxW={500} textAlign="center">
      <Heading as="h2" size="lg" mb={4}>Subscription Successful!</Heading>
      <Text fontSize="lg" mb={6}>
        Thank you for subscribing! Your account has been upgraded and you now have access to premium features.
      </Text>
      <Button as={Link} to="/dashboard" colorScheme="blue" size="lg">
        Go to Dashboard
      </Button>
    </Box>
  </Box>
);

export default SubscriptionSuccess; 