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
  Center,
  Image,
} from '@chakra-ui/react';
import { API_GATEWAY_BASE } from '../api/careerArkApi';

function EmptyState({ section, onUpload }: { section: string, onUpload?: () => void }) {
  const sectionNames: Record<string, string> = {
    work_experience: 'work experience',
    education: 'education',
    skills: 'skills',
    projects: 'projects',
    certifications: 'certifications',
    training: 'training',
  };
  const imgSrc = `/empty-${section}.svg`;
  return (
    <Center flexDir="column" py={8} color="gray.400">
      <Image src={imgSrc} alt={`No ${sectionNames[section]} illustration`} boxSize="120px" mb={2} fallback={<span style={{fontSize: 64}}>📄</span>} />
      <Text mb={2}>No {sectionNames[section]} found.</Text>
      {onUpload && <Button colorScheme="blue" onClick={onUpload}>Upload CV</Button>}
    </Center>
  );
}

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
      xhr.open('POST', '/api/career-ark/cv', true);
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
                const res = await fetch(`https://api-gw-production.up.railway.app/api/career-ark/cv/status/${data.taskId}`, {
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
      const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
      // Fetch the user's profile
      const userRes = await fetch(`${API_GATEWAY_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) throw new Error('Failed to fetch user');
      const user = await userRes.json();
      // Fetch all sections using the userId
      const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${user.id}/all_sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Ark data');
      const data = await res.json();
      setArcData(data);
    } catch (err: any) {
      setArcError(err?.message || 'Failed to fetch Ark data');
    } finally {
      setArcLoading(false);
    }
  };
  useEffect(() => {
    fetchArcData();
  }, [token]);

  // Helper to get details array from item
  const getDetails = (item: any) => {
    if (Array.isArray(item.details) && item.details.length > 0) return item.details;
    if (typeof item.description === 'string' && item.description.trim().length > 0) {
      return item.description.split(/\r?\n/).map((s: string) => s.trim()).filter(Boolean);
    }
    return [];
  };

  const sortByEndDate = (arr: any[]): any[] => {
    return [...arr].sort((a, b) => {
      const aDate = a.end_date || a.start_date || '';
      const bDate = b.end_date || b.start_date || '';
      return bDate.localeCompare(aDate);
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
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.title} @ {item.company}</Text>
                    <Text fontSize="sm" color="gray.600">{item.start_date} - {item.end_date || 'Present'}</Text>
                    {getDetails(item).length > 0 && (
                      <ul style={{ marginLeft: 16 }}>
                        {getDetails(item).map((d: string, i: number) => (
                          <li key={i}><Text fontSize="sm">{d}</Text></li>
                        ))}
                      </ul>
                    )}
                  </Box>
                ))
              ) : (
                <EmptyState section="work_experience" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Education */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Education</Heading>
              {Array.isArray(arcData.education) && arcData.education.length > 0 ? (
                sortByEndDate(arcData.education).map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.degree} @ {item.institution}</Text>
                    <Text fontSize="sm" color="gray.600">{item.start_date} - {item.end_date || 'Present'}</Text>
                    {item.field && <Text fontSize="sm" color="gray.500">Field: {item.field}</Text>}
                    {getDetails(item).length > 0 && (
                      <ul style={{ marginLeft: 16 }}>
                        {getDetails(item).map((d: string, i: number) => (
                          <li key={i}><Text fontSize="sm">{d}</Text></li>
                        ))}
                      </ul>
                    )}
                  </Box>
                ))
              ) : (
                <EmptyState section="education" onUpload={handleUploadClick} />
              )}
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
              ) : (
                <EmptyState section="training" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Skills */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Skills</Heading>
              {Array.isArray(arcData.skills) && arcData.skills.length > 0 ? (
                <Box>{arcData.skills.map((s: string, i: number) => <Text as="span" key={i} mr={2} bg="blue.50" px={2} py={1} borderRadius="md">{s}</Text>)}</Box>
              ) : (
                <EmptyState section="skills" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Projects */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Projects</Heading>
              {Array.isArray(arcData.projects) && arcData.projects.length > 0 ? (
                arcData.projects.map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.name || item.title}</Text>
                    <Text fontSize="sm" color="gray.600">{item.description}</Text>
                  </Box>
                ))
              ) : (
                <EmptyState section="projects" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Certifications */}
            <Box mb={6}>
              <Heading size="sm" mb={2}>Certifications</Heading>
              {Array.isArray(arcData.certifications) && arcData.certifications.length > 0 ? (
                arcData.certifications.map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Text fontWeight="bold">{item.name || item.title}</Text>
                    <Text fontSize="sm" color="gray.600">{item.issuer} {item.year ? `(${item.year})` : item.date ? `(${item.date})` : ''}</Text>
                  </Box>
                ))
              ) : (
                <EmptyState section="certifications" onUpload={handleUploadClick} />
              )}
            </Box>
          </>
        ) : null}
      </Box>
    </Box>
  );
};

export default CareerArkV2; 