import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { FaFileDownload } from 'react-icons/fa';

const DownloadCVs: React.FC = () => {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/cv?limit=5&source=wizard', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))
      .then(data => setCVs(data))
      .catch(err => setError(err.message || 'Failed to load CVs'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = (cvId: string) => {
    window.open(`/api/cv/${cvId}/download`, '_blank');
  };

  return (
    <Box py={6} maxW="700px" mx="auto">
      <Heading as="h2" size="lg" fontWeight={700} mb={4} textAlign="center">
        Download Your Recent CVs
      </Heading>
      <Text mb={6} textAlign="center" color="gray.600">
        Here are your last 5 CVs created by the Application Wizard. Click below to download each as an RTF document.
      </Text>
      {loading ? (
        <Box textAlign="center"><Spinner /></Box>
      ) : error ? (
        <Alert status="error"><AlertIcon />{error}</Alert>
      ) : cvs.length === 0 ? (
        <Text textAlign="center" color="gray.500">No CVs found. Use the Application Wizard to create your first CV!</Text>
      ) : (
        <Stack spacing={4}>
          {cvs.map(cv => (
            <Box key={cv.id} p={4} borderWidth={1} borderRadius="md" boxShadow="sm" bg="white">
              <HStack justify="space-between">
                <Box>
                  <Text fontWeight={600}>{cv.title || 'Untitled CV'}</Text>
                  <Text fontSize="sm" color="gray.500">Created: {cv.createdAt ? new Date(cv.createdAt).toLocaleString() : 'Unknown'}</Text>
                </Box>
                <Button leftIcon={<FaFileDownload />} colorScheme="blue" variant="solid" onClick={() => handleDownload(cv.id)}>
                  Download RTF
                </Button>
              </HStack>
            </Box>
          ))}
        </Stack>
      )}
    </Box>
  );
};

export default DownloadCVs; 