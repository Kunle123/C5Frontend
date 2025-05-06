import React from 'react';
import { Box, Heading, Text, Button, useColorModeValue } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

const SubscriptionCancel: React.FC = () => (
  <Box py={8} display="flex" flexDirection="column" alignItems="center">
    <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" maxW={500} textAlign="center">
      <Heading as="h2" size="lg" mb={4}>Subscription Not Completed</Heading>
      <Text fontSize="lg" mb={6}>
        Your subscription was not completed. You can try again or choose a different plan.
      </Text>
      <Button as={Link} to="/pricing" colorScheme="blue" size="lg">
        Return to Pricing
      </Button>
    </Box>
  </Box>
);

export default SubscriptionCancel; 