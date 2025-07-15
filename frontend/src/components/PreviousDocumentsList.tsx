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
  // Add other fields as needed
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
        setCVs(data.cvs || []);
      })
      .catch(err => setError(err.message || 'Failed to fetch CVs'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = (cvId: string) => {
    downloadBase64Docx(`/api/cv/${cvId}/download`, token).catch(err => alert(err.message || err));
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
          {cvs.map(cv => (
            <Card key={cv.id}>
              <VStack align="start" spacing={2} w="100%">
                <Text fontWeight={700} fontSize="lg">CV ID: {cv.id}</Text>
                <Text fontSize="sm" color="gray.500">
                  {cv.created_at ? `Created: ${new Date(cv.created_at).toLocaleString()}` : ''}
                </Text>
                <HStack spacing={4} mt={2}>
                  <Button
                    colorScheme="blue"
                    variant="solid"
                    leftIcon={<FaDownload />}
                    onClick={() => handleDownload(cv.id)}
                  >
                    Download as DOCX
                  </Button>
                </HStack>
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default PreviousDocumentsList; 