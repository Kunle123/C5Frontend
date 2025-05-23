import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Progress,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import dayjs from 'dayjs';

const CareerArkV2: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [uploadError, setUploadError] = useState('');
  const [polling, setPolling] = useState(false);
  const toast = useToast();
  const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
  const [arcData, setArcData] = useState<any>(null);
  const [arcLoading, setArcLoading] = useState(false);
  const [arcError, setArcError] = useState('');

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError('');
    setTaskId(null);
    setStatus('');
    setSummary(null);
    setUploadProgress(10);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api-gw-production.up.railway.app/api/arc/cv', true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 60));
        }
      };
      xhr.onreadystatechange = async () => {
        if (xhr.readyState === 4) {
          if (xhr.status >= 200 && xhr.status < 300) {
            setUploadProgress(70);
            const data = JSON.parse(xhr.responseText);
            setTaskId(data.taskId);
            setStatus('pending');
            setPolling(true);
            // Poll for extraction completion
            let pollCount = 0;
            const poll = async () => {
              try {
                const res = await fetch(`https://api-gw-production.up.railway.app/api/arc/cv/status/${data.taskId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const statusData = await res.json();
                setStatus(statusData.status);
                if (statusData.status === 'completed') {
                  setUploadProgress(100);
                  setPolling(false);
                  setSummary(statusData.extractedDataSummary || null);
                  fetchArcData();
                  toast({ status: 'success', title: 'CV imported and processed!' });
                } else if (statusData.status === 'failed') {
                  setPolling(false);
                  setUploadError(statusData.error || 'CV extraction failed.');
                } else if (pollCount < 30) {
                  setTimeout(poll, 2000);
                  pollCount++;
                  setUploadProgress(70 + Math.min(30, pollCount));
                } else {
                  setPolling(false);
                  setUploadError('CV extraction timed out.');
                }
              } catch {
                setPolling(false);
                setUploadError('Failed to check CV extraction status.');
              } finally {
                setUploading(false);
              }
            };
            poll();
          } else {
            setUploadError('Upload failed');
            setUploading(false);
          }
        }
      };
      xhr.send(formData);
    } catch (err: any) {
      setUploadError(err?.error || err?.message || 'Upload failed');
      setUploading(false);
    }
  };

  // Fetch Arc data
  const fetchArcData = async () => {
    setArcLoading(true);
    setArcError('');
    try {
      const res = await fetch('https://api-gw-production.up.railway.app/api/arc/data', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Arc data');
      const data = await res.json();
      setArcData(data);
    } catch (err: any) {
      setArcError(err?.message || 'Failed to fetch Arc data');
    } finally {
      setArcLoading(false);
    }
  };
  useEffect(() => {
    fetchArcData();
  }, [token]);

  // Helper to parse dates for sorting
  const parseDate = (dateStr: string) => {
    if (!dateStr) return dayjs(0);
    let d = dayjs(dateStr, 'YYYY-MM-DD', true);
    if (d.isValid()) return d;
    d = dayjs(dateStr, 'MMM YYYY', true);
    if (d.isValid()) return d;
    d = dayjs(dateStr);
    return d.isValid() ? d : dayjs(0);
  };

  const sortByEndDate = (arr: any[]) => {
    return [...arr].sort((a, b) => {
      const aDate = parseDate(a.end_date || a.start_date);
      const bDate = parseDate(b.end_date || b.start_date);
      return bDate.valueOf() - aDate.valueOf();
    });
  };

  return (
    <Box minH="100vh" bg="gray.50" p={8}>
      <Box maxW="600px" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md" mb={8}>
        <Heading size="lg" mb={6}>Career Ark – CV Upload (v2)</Heading>
        <Button variant="outline" colorScheme="blue" w="100%" mb={4} onClick={handleUploadClick} isLoading={uploading}>Import a CV</Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading || polling}
        />
        {uploading && (
          <Progress value={uploadProgress} size="sm" colorScheme="blue" mb={2} />
        )}
        {status && (
          <Text mt={2} fontWeight="bold">Status: {status}</Text>
        )}
        {summary && (
          <Box mt={4} p={4} bg="gray.100" borderRadius="md">
            <Text fontWeight="bold">Extracted Data Summary:</Text>
            <pre style={{ fontSize: 14 }}>{JSON.stringify(summary, null, 2)}</pre>
          </Box>
        )}
        {uploadError && (
          <Alert status="error" mt={4}><AlertIcon />{uploadError}</Alert>
        )}
        {polling && status === 'pending' && (
          <Spinner mt={4} />
        )}
      </Box>
      <Box maxW="800px" mx="auto" bg="white" p={8} borderRadius="lg" boxShadow="md">
        <Heading size="md" mb={4}>Your Career Ark Data</Heading>
        {arcLoading ? (
          <Spinner />
        ) : arcError ? (
          <Alert status="error"><AlertIcon />{arcError}</Alert>
        ) : arcData ? (
          <>
            {/* Work Experience */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Work Experience</Heading>
              {Array.isArray(arcData.work_experience) && arcData.work_experience.length > 0 ? (
                sortByEndDate(arcData.work_experience).map((item, idx) => (
                  <Box key={idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.title} @ {item.company}</Text>
                    <Text fontSize="sm" color="gray.600">{item.start_date} - {item.end_date || 'Present'}</Text>
                    {item.details && item.details.length > 0 ? (
                      <ul style={{ marginLeft: 16 }}>
                        {item.details.map((d: string, i: number) => (
                          <li key={i}><Text fontSize="sm">{d}</Text></li>
                        ))}
                      </ul>
                    ) : item.description ? (
                      <Text fontSize="sm">{item.description}</Text>
                    ) : null}
                  </Box>
                ))
              ) : <Text color="gray.400">No work experience found.</Text>}
            </Box>
            {/* Education */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Education</Heading>
              {Array.isArray(arcData.education) && arcData.education.length > 0 ? (
                sortByEndDate(arcData.education).map((item: any, idx: number) => (
                  <Box key={idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.degree} @ {item.institution}</Text>
                    <Text fontSize="sm" color="gray.600">{item.start_date} - {item.end_date || 'Present'}</Text>
                    {item.details && item.details.length > 0 ? (
                      <ul style={{ marginLeft: 16 }}>
                        {item.details.map((d: string, i: number) => (
                          <li key={i}><Text fontSize="sm">{d}</Text></li>
                        ))}
                      </ul>
                    ) : item.description ? (
                      <Text fontSize="sm">{item.description}</Text>
                    ) : null}
                  </Box>
                ))
              ) : <Text color="gray.400">No education found.</Text>}
            </Box>
            {/* Training */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Training</Heading>
              {Array.isArray(arcData.training) && arcData.training.length > 0 ? (
                sortByEndDate(arcData.training).map((item: any, idx: number) => (
                  <Box key={idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.name} @ {item.provider}</Text>
                    <Text fontSize="sm" color="gray.600">{item.date}</Text>
                    {item.details && item.details.length > 0 ? (
                      <ul style={{ marginLeft: 16 }}>
                        {item.details.map((d: string, i: number) => (
                          <li key={i}><Text fontSize="sm">{d}</Text></li>
                        ))}
                      </ul>
                    ) : null}
                  </Box>
                ))
              ) : <Text color="gray.400">No training found.</Text>}
            </Box>
            {/* Skills */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Skills</Heading>
              {Array.isArray(arcData.skills) && arcData.skills.length > 0 ? (
                <Box>{arcData.skills.map((s: string, i: number) => <Text as="span" key={i} mr={2} bg="blue.50" px={2} py={1} borderRadius="md">{s}</Text>)}</Box>
              ) : <Text color="gray.400">No skills found.</Text>}
            </Box>
            {/* Projects */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Projects</Heading>
              {Array.isArray(arcData.projects) && arcData.projects.length > 0 ? (
                arcData.projects.map((item: any, idx: number) => (
                  <Box key={idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.title}</Text>
                    <Text fontSize="sm" color="gray.600">{item.description}</Text>
                  </Box>
                ))
              ) : <Text color="gray.400">No projects found.</Text>}
            </Box>
            {/* Certifications */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Certifications</Heading>
              {Array.isArray(arcData.certifications) && arcData.certifications.length > 0 ? (
                arcData.certifications.map((item: any, idx: number) => (
                  <Box key={idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.name}</Text>
                    <Text fontSize="sm" color="gray.600">{item.issuer} {item.date ? `(${item.date})` : ''}</Text>
                  </Box>
                ))
              ) : <Text color="gray.400">No certifications found.</Text>}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default CareerArkV2; 