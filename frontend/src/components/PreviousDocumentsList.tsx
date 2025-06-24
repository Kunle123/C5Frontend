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

interface Application {
  id: string;
  role_title: string;
  created_at: string;
}

interface PreviousDocumentsListProps {
  token: string;
}

// Token expiry check (JWT)
function isTokenExpired(token: string): boolean {
  try {
    const [, payload] = token.split('.');
    const decoded = JSON.parse(atob(payload));
    if (!decoded.exp) return false;
    return Date.now() >= decoded.exp * 1000;
  } catch {
    return true;
  }
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
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setError(null);
    fetch("/api/applications", { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) {
          let errMsg = `Failed to fetch applications (${res.status})`;
          try {
            const err = await res.json();
            errMsg = err.message || err.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(apps => {
        console.log('Fetched applications:', apps);
        setApplications(apps);
      })
      .catch(err => setError(err.message || 'Failed to fetch applications'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = (id: string, type: 'cv' | 'cover-letter') => {
    const endpoint = `/api/applications/${id}/${type}`;
    downloadBase64Docx(endpoint, token).catch(err => alert(err.message || err));
  };

  if (loading) return <Box textAlign="center" py={8}><Spinner size="lg" /></Box>;
  if (error) return <Alert status="error" my={4}><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4} color="brand.700">Previously Generated Applications</Heading>
      {applications.length === 0 ? (
        <Text color="gray.500" mb={6}>No applications found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
          {applications.map(app => (
            <Card key={app.id || app.role_title}>
              <VStack align="start" spacing={2} w="100%">
                <Text fontWeight={700} fontSize="lg">{app.role_title}</Text>
                <Text fontSize="sm" color="gray.500">
                  {app.created_at ? `Created: ${new Date(app.created_at).toLocaleString()}` : ''}
                </Text>
                {app.id ? (
                  <HStack spacing={4} mt={2}>
                    <Button
                      leftIcon={<FaDownload />}
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => handleDownload(app.id, 'cv')}
                    >
                      Download CV
                    </Button>
                    <Button
                      leftIcon={<FaDownload />}
                      colorScheme="purple"
                      variant="solid"
                      onClick={() => handleDownload(app.id, 'cover-letter')}
                    >
                      Download Cover Letter
                    </Button>
                  </HStack>
                ) : (
                  <Text color="red.500" fontWeight={600} mt={2}>No valid application ID found.</Text>
                )}
              </VStack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default PreviousDocumentsList; 