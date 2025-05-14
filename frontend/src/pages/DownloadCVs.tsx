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
  useToast,
} from '@chakra-ui/react';
import { FaFileDownload, FaFilePdf, FaFileWord } from 'react-icons/fa';

const DownloadCVs: React.FC = () => {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const token = localStorage.getItem('token') || '';
  const toast = useToast();

  useEffect(() => {
    setLoading(true);
    setError('');
    fetch('/api/cvs?limit=5&source=wizard', {
      headers: { 'Authorization': `Bearer ${token}` },
    })
      .then(res => res.ok ? res.json() : res.json().then(e => Promise.reject(e)))
      .then(data => setCVs(data))
      .catch(err => setError(err.message || 'Failed to load CVs'))
      .finally(() => setLoading(false));
  }, [token]);

  const downloadCV = async (cvId: string, format: string) => {
    setDownloadingId(`${cvId}-${format}`);
    try {
      const response = await fetch(`/api/cvs/${cvId}/download?format=${format}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!response.ok) {
        toast({ status: 'error', title: `Download failed (${response.status})` });
        setDownloadingId(null);
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `CV.${format}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      toast({ status: 'error', title: err?.message || 'Download failed' });
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <Box py={8} maxW="800px" mx="auto">
      <Heading as="h2" size="xl" fontWeight={800} mb={6} textAlign="center" color="brand.700">
        Your CV Library
      </Heading>
      <Text mb={8} textAlign="center" color="gray.600" fontSize="lg">
        Download your CVs in your preferred format. Click a button to download as PDF, DOCX, or RTF.
      </Text>
      {loading ? (
        <Box textAlign="center"><Spinner size="lg" /></Box>
      ) : error ? (
        <Alert status="error"><AlertIcon />{error}</Alert>
      ) : cvs.length === 0 ? (
        <Box textAlign="center" color="gray.500" py={12}>
          <Text fontSize="xl">No CVs found.</Text>
          <Text fontSize="md">Use the Application Wizard to create your first CV!</Text>
        </Box>
      ) : (
        <Stack spacing={6}>
          {cvs.map(cv => (
            <Box key={cv.id} p={6} borderWidth={1} borderRadius="lg" boxShadow="md" bg="white" display="flex" flexDirection={{ base: 'column', md: 'row' }} alignItems={{ md: 'center' }} justifyContent="space-between" gap={4}>
              <Box>
                <Text fontWeight={700} fontSize="lg" color="brand.800">{cv.title || 'Untitled CV'}</Text>
                <Text fontSize="sm" color="gray.500">Created: {cv.createdAt ? new Date(cv.createdAt).toLocaleString() : 'Unknown'}</Text>
              </Box>
              <HStack spacing={3}>
                <Button
                  leftIcon={<FaFilePdf />}
                  colorScheme="red"
                  variant="outline"
                  size="md"
                  isLoading={downloadingId === `${cv.id}-pdf`}
                  onClick={() => downloadCV(cv.id, 'pdf')}
                >
                  PDF
                </Button>
                <Button
                  leftIcon={<FaFileWord />}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  isLoading={downloadingId === `${cv.id}-docx`}
                  onClick={() => downloadCV(cv.id, 'docx')}
                >
                  DOCX
                </Button>
                <Button
                  leftIcon={<FaFileDownload />}
                  colorScheme="gray"
                  variant="outline"
                  size="md"
                  isLoading={downloadingId === `${cv.id}-rtf`}
                  onClick={() => downloadCV(cv.id, 'rtf')}
                >
                  RTF
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