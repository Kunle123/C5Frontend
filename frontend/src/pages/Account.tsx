import React from 'react';
import { Box } from '@chakra-ui/react';
import ProfileSection from '../components/ProfileSection';
import SubscriptionSection from '../components/SubscriptionSection';

const Account: React.FC = () => {
  return (
    <Box py={6} maxW="700px" mx="auto">
      <ProfileSection />
      <SubscriptionSection />
    </Box>
  );
};

export default Account; 