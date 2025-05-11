import React, { useEffect, useState, useRef } from 'react';
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  VStack,
  Divider,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  HStack,
  Progress,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, EditIcon } from '@chakra-ui/icons';
import { getUser, uploadCV } from '../api';
import { getArcData, getCVStatus, addWorkExperience, updateWorkExperience } from '../api/careerArkApi';

const sectionTitles = {
  work_experience: 'Career History',
  education: 'Education',
  training: 'Training',
};

const CareerArk: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [arcData, setArcData] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<'work_experience' | 'education' | 'training'>('work_experience');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [polling, setPolling] = useState(false);
  const [summary, setSummary] = useState<any>(null);
  const token: string = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
  const toast = useToast();
  const [addTitle, setAddTitle] = useState('');
  const [addCompany, setAddCompany] = useState('');
  const [addStartDate, setAddStartDate] = useState('');
  const [addEndDate, setAddEndDate] = useState('');
  const [addDetails, setAddDetails] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editCompany, setEditCompany] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDetails, setEditDetails] = useState('');
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUser(token),
      getArcData(),
    ])
      .then(([userData, arcData]) => {
        setUser(userData);
        setArcData(arcData);
        setError('');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [token]);

  // Group items by type for left pane
  const grouped: Record<string, any[]> = {
    work_experience: arcData?.work_experience || [],
    education: arcData?.education || [],
    training: arcData?.training || [],
  };

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
      const data = await uploadCV(file, token);
      setTaskId(data.taskId);
      setStatus('pending');
      setPolling(true);
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
            // Optionally, refresh arcData here
          }
        } catch {
          // ignore
        }
      };
      poll();
      interval = setInterval(poll, 2000);
    }
    return () => clearInterval(interval);
  }, [polling, taskId]);

  // When selectedIdx changes, reset edit state
  useEffect(() => {
    if (selectedIdx !== null && grouped[selectedSection][selectedIdx]) {
      const entry = grouped[selectedSection][selectedIdx];
      setEditTitle(entry.title || entry.positionTitle || '');
      setEditCompany(entry.company || '');
      setEditStartDate(entry.start_date || entry.startDate || '');
      setEditEndDate(entry.end_date || entry.endDate || '');
      setEditDetails((entry.details || []).join('\n'));
      setEditError('');
      setEditLoading(false);
      setEditMode(false);
    } else {
      setEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, selectedSection]);

  return (
    <Box minH="100vh" bg="gray.50">
      {/* User Info Header */}
      <Box w="100%" bg="white" py={3} boxShadow="sm" borderBottom="1px solid #e2e8f0">
        <Flex align="center" justify="space-between" maxW="1200px" mx="auto">
          <Box>
            <Heading size="md">{user?.name || ''}</Heading>
            <Text fontSize="sm">{user?.address || ''}</Text>
            <Text fontSize="sm">{user?.phone || ''}</Text>
          </Box>
          <Box textAlign="right">
            <Text fontWeight="bold" as="span">DOB: </Text>
            <Text as="span" fontSize="sm">{user?.dob || ''}</Text>
            <br />
            <Text fontWeight="bold" as="span">Email: </Text>
            <Text as="span" fontSize="sm">{user?.email || ''}</Text>
          </Box>
        </Flex>
      </Box>
      {/* Main Two-Column Layout */}
      <Flex maxW="1200px" mx="auto" flex={1} minH="calc(100vh - 120px)" gap={6}>
        {/* Left Sidebar */}
        <Box w={{ base: '100%', md: '320px' }} bg="white" borderRadius="lg" boxShadow="md" p={4} h="100%" minH={0} overflowY="auto">
          <Button variant="outline" colorScheme="blue" w="100%" mb={4} onClick={handleUploadClick}>Import a CV</Button>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading || polling}
          />
          {Object.entries(sectionTitles).map(([key, label]) => (
            <Box key={key} mb={6}>
              <HStack justify="space-between" align="center" mb={2}>
                <Text fontWeight="bold" fontSize="lg" color="brand.500">{label}</Text>
                <IconButton aria-label={`Add ${label}`} icon={<AddIcon />} size="sm" variant="ghost" onClick={() => setSelectedIdx(null)} />
              </HStack>
              <VStack spacing={1} align="stretch">
                {grouped[key]?.length > 0 ? grouped[key].map((item: any, idx: number) => (
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
        <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={8} minH={0} h="100%" overflowY="auto">
          {loading ? (
            <Spinner />
          ) : error ? (
            <Alert status="error"><AlertIcon />{error}</Alert>
          ) : selectedIdx !== null && grouped[selectedSection][selectedIdx] ? (
            <Box>
              <HStack justify="space-between" align="center" mb={2}>
                <Heading size="lg" mb={1}>{grouped[selectedSection][selectedIdx].title || grouped[selectedSection][selectedIdx].positionTitle || grouped[selectedSection][selectedIdx].degree || grouped[selectedSection][selectedIdx].name}</Heading>
                <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" variant="ghost" onClick={() => setEditMode(true)} />
              </HStack>
              {grouped[selectedSection][selectedIdx].company || grouped[selectedSection][selectedIdx].institution || grouped[selectedSection][selectedIdx].org ? (
                <Text fontWeight="semibold" color="gray.700" mb={1}>{grouped[selectedSection][selectedIdx].company || grouped[selectedSection][selectedIdx].institution || grouped[selectedSection][selectedIdx].org}</Text>
              ) : null}
              <Text fontSize="sm" color="gray.500" mb={4}>{grouped[selectedSection][selectedIdx].start_date || grouped[selectedSection][selectedIdx].startDate || ''} - {grouped[selectedSection][selectedIdx].end_date || grouped[selectedSection][selectedIdx].endDate || ''}</Text>
              <Divider mb={4} />
              <VStack align="start" spacing={3}>
                {grouped[selectedSection][selectedIdx].details && grouped[selectedSection][selectedIdx].details.length > 0 ? (
                  grouped[selectedSection][selectedIdx].details.map((d: string, i: number) => (
                    <Text as="li" key={i} ml={4} fontSize="md">{d}</Text>
                  ))
                ) : grouped[selectedSection][selectedIdx].description ? (
                  <Text fontSize="md">{grouped[selectedSection][selectedIdx].description}</Text>
                ) : (
                  <Text fontSize="sm" color="gray.400">No details available.</Text>
                )}
              </VStack>
            </Box>
          ) : selectedIdx !== null && editMode && selectedSection === 'work_experience' ? (
            <Box as="form" w="100%" maxW="500px" mx="auto"
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setEditLoading(true);
                setEditError('');
                try {
                  const entry = grouped[selectedSection][selectedIdx];
                  await updateWorkExperience(entry.id, {
                    title: editTitle,
                    company: editCompany,
                    start_date: editStartDate,
                    end_date: editEndDate || null,
                    details: editDetails.split('\n').map(s => s.trim()).filter(Boolean),
                  });
                  const arcData = await getArcData();
                  setArcData(arcData);
                  setEditMode(false);
                  toast({ status: 'success', title: 'Work experience updated!' });
                } catch (err: any) {
                  setEditError(err?.message || 'Failed to update work experience');
                } finally {
                  setEditLoading(false);
                }
              }}
            >
              <Heading size="md" mb={4}>Edit Work Experience</Heading>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text mb={1} fontWeight={600}>Title</Text>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Title"
                    value={editTitle}
                    onChange={e => setEditTitle(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Company</Text>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Company"
                    value={editCompany}
                    onChange={e => setEditCompany(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Start Date</Text>
                  <input
                    type="date"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Start Date"
                    value={editStartDate}
                    onChange={e => setEditStartDate(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>End Date</Text>
                  <input
                    type="date"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="End Date (leave blank if current)"
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Details</Text>
                  <textarea
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }}
                    placeholder="Details (one per line)"
                    value={editDetails}
                    onChange={e => setEditDetails(e.target.value)}
                  />
                </Box>
                {editError && <Text color="red.500">{editError}</Text>}
                <HStack>
                  <Button colorScheme="blue" type="submit" isLoading={editLoading} isDisabled={!editTitle || !editCompany || !editStartDate}>
                    Save
                  </Button>
                  <Button onClick={() => setEditMode(false)} isDisabled={editLoading} variant="ghost">Cancel</Button>
                </HStack>
              </VStack>
            </Box>
          ) : (
            <Box as="form" w="100%" maxW="500px" mx="auto"
              onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                e.preventDefault();
                setAddLoading(true);
                setAddError('');
                try {
                  // Only handle work_experience for now
                  if (selectedSection === 'work_experience') {
                    await addWorkExperience({
                      title: addTitle,
                      company: addCompany,
                      start_date: addStartDate,
                      end_date: addEndDate || null,
                      details: addDetails.split('\n').map(s => s.trim()).filter(Boolean),
                    });
                    // Refresh data
                    const arcData = await getArcData();
                    setArcData(arcData);
                    // Reset form
                    setAddTitle('');
                    setAddCompany('');
                    setAddStartDate('');
                    setAddEndDate('');
                    setAddDetails('');
                    setSelectedIdx(arcData.work_experience.length); // select the new entry
                    toast({ status: 'success', title: 'Work experience added!' });
                  }
                } catch (err: any) {
                  setAddError(err?.message || 'Failed to add work experience');
                } finally {
                  setAddLoading(false);
                }
              }}
            >
              <Heading size="md" mb={4}>New Entry</Heading>
              <VStack spacing={4} align="stretch">
                <Box>
                  <Text mb={1} fontWeight={600}>Title</Text>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Title"
                    value={addTitle}
                    onChange={e => setAddTitle(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Company</Text>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Company"
                    value={addCompany}
                    onChange={e => setAddCompany(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Start Date</Text>
                  <input
                    type="date"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Start Date"
                    value={addStartDate}
                    onChange={e => setAddStartDate(e.target.value)}
                    required
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>End Date</Text>
                  <input
                    type="date"
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="End Date (leave blank if current)"
                    value={addEndDate}
                    onChange={e => setAddEndDate(e.target.value)}
                  />
                </Box>
                <Box>
                  <Text mb={1} fontWeight={600}>Details</Text>
                  <textarea
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }}
                    placeholder="Details (one per line)"
                    value={addDetails}
                    onChange={e => setAddDetails(e.target.value)}
                  />
                </Box>
                {addError && <Text color="red.500">{addError}</Text>}
                <Button colorScheme="blue" type="submit" isLoading={addLoading} isDisabled={!addTitle || !addCompany || !addStartDate}>
                  Save
                </Button>
              </VStack>
            </Box>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default CareerArk; 