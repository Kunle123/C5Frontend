import React from 'react';
import { Box, Heading, Text, Button, SimpleGrid, VStack, Stack, useColorModeValue, Divider } from '@chakra-ui/react';

const plans = [
  {
    name: 'Free',
    price: '£0',
    description: 'Get started with 3 credits per month. Ideal for occasional users.',
    cta: 'Start Free',
    color: 'blue',
    credits: '3 credits/month',
    type: 'free',
  },
  {
    name: 'Top-up',
    price: '£29.99',
    description: 'One-off purchase. Instantly add 50 credits to your account. No subscription required.',
    cta: 'Buy 50 Credits',
    color: 'teal',
    credits: '50 credits (one-off)',
    type: 'topup',
  },
  {
    name: 'Monthly',
    price: '£24.99/mo',
    description: 'Receive 50 credits immediately, plus 3 credits per day. Perfect for active job seekers.',
    cta: 'Subscribe Monthly',
    color: 'purple',
    credits: '50 credits + 3/day',
    type: 'monthly',
  },
  {
    name: 'Annual',
    price: '£199/year',
    description: '33% discount. Receive 50 credits per month plus 5 credits per day. Best value for power users.',
    cta: 'Subscribe Annually',
    color: 'orange',
    credits: '50/month + 5/day',
    type: 'annual',
  },
];

const Pricing: React.FC = () => {
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardBorder = useColorModeValue('gray.200', 'gray.700');
  return (
    <Box py={8} maxW="1100px" mx="auto">
      <Heading as="h2" size="xl" textAlign="center" mb={2}>Pricing Plans</Heading>
      <Text fontSize="lg" textAlign="center" color="gray.500" mb={6}>
      Choose the plan that fits your job search needs. Upgrade anytime.
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6} mb={6}>
      {plans.map(plan => (
          <Box
            key={plan.name}
            bg={cardBg}
            borderWidth={plan.name === 'Pro' ? '2px' : '1px'}
            borderColor={plan.name === 'Pro' ? 'purple.500' : cardBorder}
            borderRadius="lg"
            boxShadow={plan.name === 'Pro' ? 'lg' : 'md'}
            p={6}
            maxW={{ base: '100%', md: '400px' }}
            mx="auto"
          >
            <VStack spacing={3} align="stretch">
              <Heading as="h3" size="md" color={plan.color + '.500'}>{plan.name}</Heading>
              <Text fontSize="3xl" color="blue.500" fontWeight="bold">{plan.price}</Text>
              <Text>{plan.description}</Text>
              <Button
                colorScheme={plan.color}
                variant={plan.name === 'Pro' ? 'solid' : 'outline'}
                size="lg"
                fontWeight={600}
                w="100%"
              >
                {plan.cta}
              </Button>
            </VStack>
          </Box>
      ))}
      </SimpleGrid>
      <Box mt={8} p={8} bg={useColorModeValue('gray.100', 'gray.700')} borderRadius="lg" textAlign="center">
        <Heading as="h4" size="md" mb={2}>Questions about pricing or need a custom plan?</Heading>
        <Button colorScheme="blue" variant="outline" size="lg">Contact Us</Button>
      </Box>
  </Box>
);
};

export default Pricing; 