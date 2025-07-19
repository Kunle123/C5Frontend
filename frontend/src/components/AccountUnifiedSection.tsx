import React from 'react';
import {
  Box,
  Heading,
  Divider,
  Stack,
  Text,
} from '@chakra-ui/react';
import ProfileSection from './ProfileSection';
import SubscriptionSection from './SubscriptionSection';

const AccountUnifiedSection: React.FC = () => {
  return (
    <Box bg="gray.50" minH="100vh" py={8} px={2}>
      <Box maxW="800px" mx="auto">
        <Heading as="h1" size="xl" mb={2} textAlign="center" color="brown.700" fontWeight={700}>
          Account Settings
        </Heading>
        <Text textAlign="center" color="brown.300" fontSize="lg" mb={8}>
          Manage your profile and subscription preferences
        </Text>
        <Box display="flex" flexDirection="column" alignItems="center" gap={8}>
          <Box bg="white" boxShadow="lg" borderRadius="xl" p={8} mb={0} maxW="600px" w="100%">
            <Heading as="h2" size="lg" mb={1} color="brown.600" fontWeight={700}>
              <span role="img" aria-label="profile">👤</span> Profile Information
            </Heading>
            <Text color="brown.300" fontSize="md" mb={6}>
              Update your personal details and contact information
            </Text>
            <ProfileSection />
          </Box>
          <Box bg="white" boxShadow="lg" borderRadius="xl" p={8} maxW="600px" w="100%">
            <Heading as="h2" size="lg" mb={1} color="brown.600" fontWeight={700}>
              <span role="img" aria-label="subscription">📄</span> Subscription & Billing
            </Heading>
            <Text color="brown.300" fontSize="md" mb={6}>
              Manage your subscription plan and billing information
            </Text>
            <SubscriptionSection />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AccountUnifiedSection; 