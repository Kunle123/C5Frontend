import React from 'react';
import { Box } from '@chakra-ui/react';
import AccountUnifiedSection from '../components/AccountUnifiedSection';

const Account: React.FC = () => {
  return (
    <Box py={6} maxW="700px" mx="auto">
      <AccountUnifiedSection />
    </Box>
  );
};

export default Account; 