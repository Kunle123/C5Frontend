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
  filename: string;
  created_at?: string;
  createdAt?: string;
}

interface CoverLetter {
  cover_letter_id: string;
  filename: string;
  created_at?: string;
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
  const [cvs, setCvs] = useState<CV[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);

  useEffect(() => {
    // Token expiry check
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return;
    }
    setLoading(true);
    setError(null);
    setCoverLetterError(null);
    // Use /api/cv for listing CVs (align with working script)
    fetch("/api/cv", { headers: { Authorization: `Bearer ${token}` } })
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
      .then(cvsData => setCvs(cvsData))
      .catch(err => setError(err.message || 'Failed to fetch CVs'));
    // Try to fetch cover letters, but handle if endpoint is missing
    fetch("/api/cover-letter", { headers: { Authorization: `Bearer ${token}` } })
      .then(async res => {
        if (!res.ok) {
          let errMsg = `Failed to fetch cover letters (${res.status})`;
          try {
            const err = await res.json();
            errMsg = err.message || err.error || errMsg;
          } catch {}
          throw new Error(errMsg);
        }
        return res.json();
      })
      .then(coverLettersData => setCoverLetters(coverLettersData))
      .catch(err => setCoverLetterError(err.message || "Cover letter download not available."));
    setLoading(false);
  }, [token]);

  const handleDownloadCV = (cv: CV) => {
    if (!cv.id) return alert("No CV ID found");
    downloadBase64Docx(`/api/cv/${cv.id}/download`, token).catch(err => alert(err.message || err));
  };

  const handleDownloadCoverLetter = (cover_letter_id: string) => {
    downloadBase64Docx(`/api/cover-letter/${cover_letter_id}/download`, token).catch(err => alert(err.message || err));
  };

  if (loading) return <Box textAlign="center" py={8}><Spinner size="lg" /></Box>;
  if (error) return <Alert status="error" my={4}><AlertIcon />{error}</Alert>;

  return (
    <Box>
      <Heading as="h3" size="lg" mb={4} color="brand.700">Previously Generated CVs</Heading>
      {cvs.length === 0 ? (
        <Text color="gray.500" mb={6}>No CVs found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={8}>
          {cvs.map(cv => (
            <Card key={cv.id}>
              <HStack spacing={4} align="center">
                <Icon as={FaFileWord} boxSize={8} color="blue.500" />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight={700} fontSize="lg">{cv.filename}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {cv.created_at || cv.createdAt ? `Created: ${new Date(cv.created_at || cv.createdAt!).toLocaleString()}` : ''}
                  </Text>
                </VStack>
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => handleDownloadCV(cv)}
                >
                  Download
                </Button>
              </HStack>
            </Card>
          ))}
        </SimpleGrid>
      )}
      <Divider my={6} />
      <Heading as="h3" size="lg" mb={4} color="brand.700">Previously Generated Cover Letters</Heading>
      {coverLetterError ? (
        <Text color="gray.500" mb={6}>{coverLetterError}</Text>
      ) : coverLetters.length === 0 ? (
        <Text color="gray.500" mb={6}>No cover letters found.</Text>
      ) : (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {coverLetters.map(cl => (
            <Card key={cl.cover_letter_id}>
              <HStack spacing={4} align="center">
                <Icon as={FaFileWord} boxSize={8} color="green.500" />
                <VStack align="start" spacing={1} flex={1}>
                  <Text fontWeight={700} fontSize="lg">{cl.filename}</Text>
                  <Text fontSize="sm" color="gray.500">
                    {cl.created_at ? `Created: ${new Date(cl.created_at).toLocaleString()}` : ''}
                  </Text>
                </VStack>
                <Button
                  leftIcon={<FaDownload />}
                  colorScheme="green"
                  variant="solid"
                  onClick={() => handleDownloadCoverLetter(cl.cover_letter_id)}
                >
                  Download
                </Button>
              </HStack>
            </Card>
          ))}
        </SimpleGrid>
      )}
    </Box>
  );
};

export default PreviousDocumentsList; 