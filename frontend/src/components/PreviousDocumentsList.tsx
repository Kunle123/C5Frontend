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
  const [exports, setExports] = useState<any[]>([]);
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
    fetch('/api/export', { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) {
          let errMsg = `Failed to fetch exports (${res.status})`;
          try {
            const err = await res.json();
            errMsg = err.message || err.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(data => {
        setExports(data.exports || []);
      })
      .catch(err => setError(err.message || 'Failed to fetch exports'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleDownload = (downloadUrl: string) => {
    fetch(downloadUrl, { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) throw new Error('Failed to download file');
        const blob = await res.blob();
        const contentDisposition = res.headers.get('Content-Disposition');
        let filename = 'exported_cv.docx';
        if (contentDisposition) {
          const match = contentDisposition.match(/filename="(.+)"/);
          if (match) filename = match[1];
        }
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      })
      .catch(err => alert(err.message || err));
  };

  if (loading) return <Box textAlign="center" py={8}><Spinner size="lg" /></Box>;
  if (error) return <Alert status="error" my={4}><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4} color="brand.700">Exported CVs</Heading>
      {exports.length === 0 ? (
        <Text color="gray.500" mb={6}>No exported CVs found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
          {exports.map(exp => (
            <Card key={exp.id}>
              <VStack align="start" spacing={2} w="100%">
                <Text fontWeight={700} fontSize="lg">CV ID: {exp.cv_id}</Text>
                <Text fontSize="sm" color="gray.500">
                  {exp.created_at ? `Created: ${new Date(exp.created_at).toLocaleString()}` : ''}
                </Text>
                <Text fontSize="sm" color="gray.500">Format: {exp.format}</Text>
                <Text fontSize="sm" color={exp.status === 'completed' ? 'green.600' : exp.status === 'failed' ? 'red.600' : 'orange.600'}>
                  Status: {exp.status}
                </Text>
                {exp.status === 'completed' && exp.download_url ? (
                  <HStack spacing={4} mt={2}>
                    <Button
                      colorScheme="blue"
                      variant="solid"
                      onClick={() => handleDownload(exp.download_url)}
                    >
                      Download
                    </Button>
                  </HStack>
                ) : (
                  <Text color="gray.400" fontWeight={600} mt={2}>Not ready for download</Text>
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