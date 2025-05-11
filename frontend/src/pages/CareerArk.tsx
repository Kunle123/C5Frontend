import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
  Flex,
  Button,
  Heading,
  Text,
  Stack,
  Divider,
  useColorModeValue,
  Spinner,
  Alert,
  AlertIcon,
  Progress,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { NotificationContext } from '../App';
import { AddIcon } from '@chakra-ui/icons';
import { getUser, uploadCV } from '../api';
import { getCVStatus, getArcData } from '../api/careerArkApi';

const sectionTitles = {
  work_experience: 'Career History',
  education: 'Education',
  training: 'Training',
};

const API_BASE = 'https://api-gw-production.up.railway.app/api/arc';

const CareerArk: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [summary, setSummary] = useState<any>(null);
  const [polling, setPolling] = useState(false);
  const [arcData, setArcData] = useState<any>(null);
  const [arcError, setArcError] = useState('');
  const [user, setUser] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<'work_experience' | 'education' | 'training'>('work_experience');
  const [selectedIdx, setSelectedIdx] = useState(0);
  const { notify } = React.useContext(NotificationContext);
  const token: string = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';

  useEffect(() => {
    if (token) {
      getUser(token).then(setUser).catch(() => setUser(null));
    }
  }, [token]);

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
    try {
      const data = await uploadCV(file, token || '');
      setTaskId(data.taskId);
      setStatus('pending');
      setPolling(true);
      notify('CV uploaded. Processing started.', 'success');
    } catch (err: any) {
      setUploadError(err?.error || err?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  // Poll for status
  useEffect(() => {
    let interval: any;
    if (polling && taskId) {
      const poll = async () => {
        try {
          const data = await getCVStatus(taskId);
          setStatus(data.status);
          if (data.status === 'completed' || data.status === 'failed') {
            setPolling(false);
            setSummary(data.extractedDataSummary || null);
            notify(
              data.status === 'completed' ? 'CV processing complete.' : 'CV processing failed.',
              data.status === 'completed' ? 'success' : 'error'
            );
            if (data.status === 'completed') {
              fetchArcData();
            }
          }
        } catch {
          // ignore
        }
      };
      poll();
      interval = setInterval(poll, 2000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [polling, taskId, notify]);

  // Fetch Arc data
  const fetchArcData = async () => {
    setArcError('');
    try {
      const data = await getArcData();
      setArcData(data);
    } catch (err: any) {
      setArcError(err?.error || err?.message || 'Failed to fetch Arc data');
    }
  };

  useEffect(() => {
    fetchArcData();
    // eslint-disable-next-line
  }, []);

  // Group data for left pane
  const grouped: Record<string, any[]> = {
    work_experience: arcData?.work_experience || [],
    education: arcData?.education || [],
    training: arcData?.training || [],
  };

  // Get selected item
  const selectedList = grouped[selectedSection];
  const selectedItem = selectedList && selectedList[selectedIdx];

  return (
    <Box minH="100vh" bg={useColorModeValue('gray.50', 'gray.900')}>
      {/* Top User Info Bar */}
      <Box w="100%" bg="gray.100" px={{ base: 4, md: 12 }} py={4} boxShadow="sm" display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Heading size="md">{user?.name || 'Your Name'}</Heading>
          <Text fontSize="sm">{user?.address || 'Address'}</Text>
          <Text fontSize="sm">{user?.phone || 'Phone'}</Text>
        </Box>
        <Box textAlign="right">
          <Text fontWeight="bold" as="span">DOB: </Text>
          <Text as="span" fontSize="sm">{user?.dob || ''}</Text>
          <br />
          <Text fontWeight="bold" as="span">Email: </Text>
          <Text as="span" fontSize="sm">{user?.email || ''}</Text>
        </Box>
        <Button colorScheme="blue" onClick={handleUploadClick} isLoading={uploading} ml={8}>
          Import CV
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleFileChange}
          disabled={uploading || polling}
        />
      </Box>
      {/* Main Two-Column Layout */}
      <Flex direction={{ base: 'column', md: 'row' }} maxW="1200px" mx="auto" mt={8} gap={6}>
        {/* Left Sidebar */}
        <Box w={{ base: '100%', md: '320px' }} bg="white" borderRadius="lg" boxShadow="md" p={4} mb={{ base: 4, md: 0 }}>
          {Object.entries(sectionTitles).map(([key, label]) => (
            <Box key={key} mb={6}>
              <Text fontWeight="bold" fontSize="lg" color="brand.500" mb={2}>{label}</Text>
              <VStack spacing={1} align="stretch">
                {(grouped as any)[key]?.length > 0 ? (grouped as any)[key].map((item: any, idx: number) => (
                  <Box
                    key={item.id || idx}
                    p={2}
                    borderRadius="md"
                    bg={selectedSection === key && selectedIdx === idx ? 'brand.100' : 'gray.50'}
                    _hover={{ bg: 'brand.50', cursor: 'pointer' }}
                    onClick={() => { setSelectedSection(key as any); setSelectedIdx(idx); }}
                  >
                    <Text fontWeight="semibold">{item.title || item.positionTitle || item.degree || item.name}</Text>
                    <Text fontSize="sm" color="gray.600">{item.company || item.institution || item.org || ''}</Text>
                    <Text fontSize="xs" color="gray.500">{item.start_date || item.startDate || ''} - {item.end_date || item.endDate || ''}</Text>
                  </Box>
                )) : (
                  <Text fontSize="sm" color="gray.400">No entries</Text>
                )}
              </VStack>
            </Box>
          ))}
        </Box>
        {/* Right Detail Pane */}
        <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={8} minH="400px">
          {uploadError && <Alert status="error" mb={4}><AlertIcon />{uploadError}</Alert>}
          {arcError && <Alert status="error" mb={4}><AlertIcon />{arcError}</Alert>}
          {uploading && <Progress size="xs" isIndeterminate mb={4} />}
          {selectedItem ? (
            <Box>
              <Heading size="lg" mb={1}>{selectedItem.title || selectedItem.positionTitle || selectedItem.degree || selectedItem.name}</Heading>
              {selectedItem.company || selectedItem.institution || selectedItem.org ? (
                <Text fontWeight="semibold" color="gray.700" mb={1}>{selectedItem.company || selectedItem.institution || selectedItem.org}</Text>
              ) : null}
              <Text fontSize="sm" color="gray.500" mb={4}>{selectedItem.start_date || selectedItem.startDate || ''} - {selectedItem.end_date || selectedItem.endDate || ''}</Text>
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {selectedItem.details && selectedItem.details.length > 0 ? (
                  selectedItem.details.map((d: string, i: number) => (
                    <Text as="li" key={i} ml={4} fontSize="md">{d}</Text>
                  ))
                ) : selectedItem.description ? (
                  <Text fontSize="md">{selectedItem.description}</Text>
                ) : (
                  <Text fontSize="sm" color="gray.400">No details available.</Text>
                )}
              </VStack>
            </Box>
          ) : (
            <Text fontSize="md" color="gray.400">Select an item from the left to view details.</Text>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CareerArk; 