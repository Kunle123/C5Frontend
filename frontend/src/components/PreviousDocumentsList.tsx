import React, { useEffect, useState } from "react";
import {
  Box,
  Heading,
  Text,
  Button,
  Stack,
  HStack,
  VStack,
  Icon,
  Alert,
  AlertIcon,
  useColorModeValue,
  SimpleGrid,
  Divider,
  Spinner,
} from '@chakra-ui/react';
import { FaFileWord, FaDownload } from 'react-icons/fa';

interface CV {
  id: string;
  created_at: string;
  job_title?: string;
  company?: string;
  company_name?: string;
  cover_letter_available?: boolean;
  cover_letter_download_url?: string;
  metadata?: {
    name: string;
  };
}

interface PreviousDocumentsListProps {
  token: string;
}

function downloadBase64Docx(endpoint: string, token: string) {
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(async res => {
      if (!res.ok) {
        let errMsg = `Failed to fetch document (${res.status})`;
        try {
          const err = await res.json();
          errMsg = err.message || err.error || errMsg;
        } catch {}
        throw new Error(errMsg);
      }
      return res.json();
    })
    .then(data => {
      if (!data.filedata) throw new Error("No filedata in response");
      const byteCharacters = atob(data.filedata);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename || "document.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
}

const Card = ({ children }: { children: React.ReactNode }) => (
  <Box
    p={5}
    borderWidth={1}
    borderRadius="lg"
    boxShadow="md"
    bg={useColorModeValue('white', 'gray.800')}
    mb={4}
    w="100%"
  >
    {children}
  </Box>
);

const PreviousDocumentsList: React.FC<PreviousDocumentsListProps> = ({ token }) => {
  const [cvs, setCVs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setError(null);
    fetch('/api/cvs', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) {
          let errMsg = `Failed to fetch CVs (${res.status})`;
          try {
            const err = await res.json();
            errMsg = err.message || err.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setCVs(data || []);
      })
      .catch(err => setError(err.message || 'Failed to fetch CVs'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownloadCV = (cvId: string) => {
    downloadBase64Docx(`/api/cv/${cvId}/download`, token).catch(err => alert(err.message || err));
  };
  const handleDownloadCoverLetter = (url: string) => {
    downloadBase64Docx(url, token).catch(err => alert(err.message || err));
  };

  if (loading) return <Box textAlign="center" py={8}><Spinner size="lg" /></Box>;
  if (error) return <Alert status="error" my={4}><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4} color="brand.700">Your CVs</Heading>
      {cvs.length === 0 ? (
        <Text color="gray.500" mb={6}>No CVs found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
          {cvs.filter(cv => cv.metadata?.name === "Generated CV").map(cv => (
            <Card key={cv.id}>
              <Box maxW="400px" mx="auto" w="100%">
                <VStack align="start" spacing={2} w="100%">
                  <Text fontWeight={700} fontSize="xl">
                    {cv.job_title || 'Unknown Job Title'}
                  </Text>
                  <Text fontWeight={500} fontSize="md" color="gray.600">
                    {cv.company_name || 'Unknown Company'}
                  </Text>
                  <Text fontSize="sm" color="gray.500">
                    {cv.created_at ? `Created: ${new Date(cv.created_at).toLocaleString()}` : ''}
                  </Text>
                  <Box w="100%" mt={2}>
                    <VStack spacing={2} w="100%" align="stretch">
                      <Button
                        colorScheme="blue"
                        variant="solid"
                        leftIcon={<FaDownload />}
                        w="100%"
                        minW="140px"
                        onClick={() => handleDownloadCV(cv.id)}
                      >
                        Download CV
                      </Button>
                      <Button
                        colorScheme="teal"
                        variant="outline"
                        leftIcon={<FaFileWord />}
                        w="100%"
                        minW="140px"
                        onClick={() => cv.cover_letter_available && cv.cover_letter_download_url ? handleDownloadCoverLetter(cv.cover_letter_download_url) : null}
                        isDisabled={!cv.cover_letter_available || !cv.cover_letter_download_url}
                        title={!cv.cover_letter_available ? 'No cover letter available for this CV' : ''}
                      >
                        Download Cover Letter
                      </Button>
                    </VStack>
                  </Box>
                </VStack>
              </Box>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default PreviousDocumentsList; 