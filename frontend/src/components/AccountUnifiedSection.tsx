import React from 'react';
import {
  Box,
  Heading,
  Divider,
  Stack,
} from '@chakra-ui/react';
import ProfileSection from './ProfileSection';
import SubscriptionSection from './SubscriptionSection';

const AccountUnifiedSection: React.FC = () => {
  return (
    <Box bg="white" boxShadow="lg" borderRadius="xl" p={8} maxW="600px" mx="auto">
      <Stack spacing={8}>
        <Box>
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Profile
          </Heading>
          <ProfileSection />
        </Box>
        <Divider />
        <Box>
          <Heading as="h2" size="lg" mb={4} textAlign="center">
            Subscription & Billing
          </Heading>
          <SubscriptionSection />
        </Box>
      </Stack>
    </Box>
  );
};

export default AccountUnifiedSection; 