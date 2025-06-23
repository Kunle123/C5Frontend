import React from 'react';
import { Box, Heading, Text } from '@chakra-ui/react';
import PreviousDocumentsList from '../components/PreviousDocumentsList';

const DownloadCVs: React.FC = () => {
  const token = localStorage.getItem('token') || '';

  return (
    <Box py={8} maxW="800px" mx="auto">
      <Heading as="h2" size="xl" fontWeight={800} mb={6} textAlign="center" color="brand.700">
        Download Your CVs & Cover Letters
      </Heading>
      <Text mb={8} textAlign="center" color="gray.600" fontSize="lg">
        Download your previously generated CVs and cover letters as DOCX files.
      </Text>
      <PreviousDocumentsList token={token} />
    </Box>
  );
};

export default DownloadCVs; 