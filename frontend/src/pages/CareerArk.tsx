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
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { getUser, uploadCV } from '../api';
import { getArcData, getCVStatus, addWorkExperience, updateWorkExperience, addEducation, updateEducation, addTraining, updateTraining } from '../api/careerArkApi';
import { useDisclosure } from '@chakra-ui/react';
import { FiKey } from 'react-icons/fi';
import { format, parse, isValid, compareDesc } from 'date-fns';

const sectionTitles = {
  work_experience: 'Career History',
  education: 'Education',
  training: 'Training',
};

const CareerArk: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [allSections, setAllSections] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<'work_experience' | 'education' | 'training'>('work_experience');
  const [selectedIdx, setSelectedIdx] = useState<string | null>(null);
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
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [mobileDetailMode, setMobileDetailMode] = useState(false);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const recallBtnBottom = useBreakpointValue({ base: '80px', md: '40px' });
  const recallBtnRight = useBreakpointValue({ base: '16px', md: '40px' });
  const modalSize = useBreakpointValue({ base: 'xs', md: 'md' });
  // Add state for education
  const [addInstitution, setAddInstitution] = useState('');
  const [addDegree, setAddDegree] = useState('');
  const [addEduStartDate, setAddEduStartDate] = useState('');
  const [addEduEndDate, setAddEduEndDate] = useState('');
  const [addEduDetails, setAddEduDetails] = useState('');
  // Add state for training
  const [addTrainingName, setAddTrainingName] = useState('');
  const [addProvider, setAddProvider] = useState('');
  const [addTrainingDate, setAddTrainingDate] = useState('');
  const [addTrainingDetails, setAddTrainingDetails] = useState('');
  // Edit state for education
  const [editInstitution, setEditInstitution] = useState('');
  const [editDegree, setEditDegree] = useState('');
  const [editEduStartDate, setEditEduStartDate] = useState('');
  const [editEduEndDate, setEditEduEndDate] = useState('');
  const [editEduDetails, setEditEduDetails] = useState('');
  // Edit state for training
  const [editTrainingName, setEditTrainingName] = useState('');
  const [editProvider, setEditProvider] = useState('');
  const [editTrainingDate, setEditTrainingDate] = useState('');
  const [editTrainingDetails, setEditTrainingDetails] = useState('');
  const [profileId, setProfileId] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getUser(token)
      .then(userData => {
        setUser(userData);
        // Assume userData.profile_id is available, otherwise fetch or set
        setProfileId(userData.profile_id);
        return fetch(`/api/career-ark/profiles/${userData.profile_id}/all_sections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      })
      .then(res => res.json())
      .then(data => {
        setAllSections(data);
        setError('');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, [token]);

  // Helper: robust date sort for work experience and education
  const parseDate = (d: string) => {
    if (!d) return new Date(0);
    if (d === 'Present') return new Date(3000, 0, 1);
    // Try MMM YYYY, YYYY, fallback
    let parsed = parse(d, 'MMM yyyy', new Date());
    if (!isValid(parsed)) parsed = parse(d, 'yyyy', new Date());
    if (!isValid(parsed)) parsed = new Date(d);
    return isValid(parsed) ? parsed : new Date(0);
  };
  const sortByEndDateDesc = (arr: any[]) =>
    [...arr].sort((a, b) => compareDesc(parseDate(a.end_date), parseDate(b.end_date)));

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
      // Use XMLHttpRequest for progress
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', 'https://api-gw-production.up.railway.app/api/arc/cv', true);
      xhr.setRequestHeader('Authorization', `Bearer ${token}`);
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setUploadProgress(Math.round((event.loaded / event.total) * 60)); // up to 60%
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
                const statusData = await getCVStatus(data.taskId);
                setStatus(statusData.status);
                if (statusData.status === 'completed') {
                  setUploadProgress(100);
                  setPolling(false);
                  setSummary(statusData.extractedDataSummary || null);
                  // Refresh Ark data
                  const arcData = await getArcData();
                  setAllSections(arcData);
                  toast({ status: 'success', title: 'CV imported and Ark updated!' });
                } else if (statusData.status === 'failed') {
                  setPolling(false);
                  setUploadError('CV extraction failed.');
                } else if (pollCount < 30) { // poll up to 1 minute
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

  // Update setEditFormFromEntry to robustly handle details for work experience
  const setEditFormFromEntry = (entry: any) => {
    if (selectedSection === 'work_experience') {
      setEditTitle(entry.title || entry.positionTitle || '');
      setEditCompany(entry.company || '');
      setEditStartDate(entry.start_date || entry.startDate || '');
      setEditEndDate(entry.end_date || entry.endDate || '');
      // Fix: join details array or fallback to description string
      if (Array.isArray(entry.details)) {
        setEditDetails(entry.details.join('\n'));
      } else if (typeof entry.description === 'string') {
        setEditDetails(entry.description);
      } else {
        setEditDetails('');
      }
    } else if (selectedSection === 'education') {
      setEditInstitution(entry.institution || entry.institutionName || '');
      setEditDegree(entry.degree || '');
      setEditEduStartDate(entry.start_date || entry.startDate || '');
      setEditEduEndDate(entry.end_date || entry.endDate || '');
      setEditEduDetails((entry.details || entry.relevantCoursework || []).join('\n'));
    } else if (selectedSection === 'training') {
      setEditTrainingName(entry.name || '');
      setEditProvider(entry.provider || '');
      setEditTrainingDate(entry.date || '');
      setEditTrainingDetails((entry.details || []).join('\n'));
    }
  };

  // When selectedIdx changes, reset edit state
  useEffect(() => {
    if (selectedIdx !== null && allSections[selectedSection]) {
      const entry = allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx));
      if (entry) {
        setEditFormFromEntry(entry);
        setEditError('');
        setEditLoading(false);
      } else {
        // setEditMode(false);
      }
    } else {
      // setEditMode(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIdx, selectedSection]);

  // When a list item is tapped on mobile, show detail view
  const handleListItemClick = (section: any, entryId: string | number) => {
    setSelectedSection(section);
    setSelectedIdx(entryId);
    setEditMode(false);
    if (isMobile) setMobileDetailMode(true);
  };

  // When back is pressed on mobile, return to list view
  const handleBack = () => {
    setMobileDetailMode(false);
    setEditMode(false);
  };

  // On mount, check for missing keywords in localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ark-missing-keywords');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMissingKeywords(parsed);
          onOpen();
        }
        localStorage.removeItem('ark-missing-keywords');
      }
    } catch {}
    // eslint-disable-next-line
  }, []);

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
      {/* Responsive Layout */}
      <Flex maxW="1200px" mx="auto" flex={1} h="calc(100vh - 80px)" minH="calc(100vh - 80px)" gap={6} direction={{ base: 'column', md: 'row' }}>
        {/* List/Sidebar View */}
        {(!isMobile || !mobileDetailMode) && (
          <Box w={{ base: '100%', md: '320px' }} bg="white" borderRadius="lg" boxShadow="md" p={4} h="100%" minH={0} display="flex" flexDirection="column" maxH="100%">
            <Button variant="outline" colorScheme="blue" w="100%" mb={4} onClick={handleUploadClick} isLoading={uploading}>Import a CV</Button>
            {uploading && (
              <Progress value={uploadProgress} size="sm" colorScheme="blue" mb={2} />
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading || polling}
            />
            <Box flex={1} minH={0} overflowY="auto">
              {Object.entries(sectionTitles).map(([key, label]) => (
                <Box key={key} mb={6}>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontWeight="bold" fontSize="lg" color="brand.500">{label}</Text>
                    <IconButton aria-label={`Add ${label}`} icon={<AddIcon />} size="sm" variant="ghost" onClick={() => setSelectedIdx(null)} />
                  </HStack>
                  <VStack spacing={1} align="stretch">
                    {allSections && Array.isArray(allSections[key]) && allSections[key].length > 0 ? (
                      sortByEndDateDesc(allSections[key]).map((item: any, idx: number) => (
                        <Box
                          key={item.id || idx}
                          p={2}
                          borderRadius="md"
                          bg={selectedSection === key && selectedIdx === (item.id || idx) ? 'brand.100' : 'gray.50'}
                          _hover={{ bg: 'brand.50', cursor: 'pointer' }}
                          onClick={() => handleListItemClick(key, item.id || idx)}
                        >
                          <Text fontWeight="semibold">{item.title || item.positionTitle || item.degree || item.name}</Text>
                          <Text fontSize="sm" color="gray.600">{item.company || item.institution || item.org || ''}</Text>
                          <Text fontSize="xs" color="gray.500">{item.start_date || item.startDate || ''} - {item.end_date || item.endDate || ''}</Text>
                        </Box>
                      ))
                    ) : (
                      <Text color="gray.400">No entries yet. Import a CV to get started!</Text>
                    )}
                  </VStack>
                </Box>
              ))}
            </Box>
          </Box>
        )}
        {/* Detail View */}
        {(!isMobile || mobileDetailMode) && (
          <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={8} minH={0} h="100%" overflowY="auto">
            {/* Back button for mobile */}
            {isMobile && (
              <Button leftIcon={<ArrowBackIcon />} mb={4} variant="ghost" onClick={handleBack}>Back</Button>
            )}
            {loading ? (
              <Spinner />
            ) : error && !allSections ? (
              <Alert status="info" mb={4}>
                <AlertIcon />
                Your Career Ark is empty. Import a CV or add entries to get started!
              </Alert>
            ) : !error && allSections && Object.values(allSections).every(
              arr => Array.isArray(arr) && arr.length === 0
            ) ? (
              <Alert status="info" mb={4}>
                <AlertIcon />
                No entries yet. Import a CV to get started!
              </Alert>
            ) : selectedIdx !== null && editMode && selectedSection === 'work_experience' ? (
              <Box as="form" w="100%" maxW="500px" mx="auto"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setEditLoading(true);
                  setEditError('');
                  try {
                    const entry = allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx));
                    if (!entry) {
                      setEditError('This entry is missing an ID and cannot be updated.');
                      setEditLoading(false);
                      return;
                    }
                    await updateWorkExperience(entry.id, {
                      title: editTitle,
                      company: editCompany,
                      start_date: editStartDate,
                      end_date: editEndDate || null,
                      details: editDetails.split('\n').map(s => s.trim()).filter(Boolean),
                    });
                    const arcData = await getArcData();
                    setAllSections(arcData);
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
                      type="text"
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                      placeholder="e.g. Mar 2020"
                      value={editStartDate}
                      onChange={e => setEditStartDate(e.target.value)}
                      required
                    />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>End Date</Text>
                    <input
                      type="text"
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                      placeholder="e.g. Dec 2020 or Present"
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
            ) : selectedIdx !== null && editMode && selectedSection === 'education' ? (
              <Box as="form" w="100%" maxW="500px" mx="auto"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setEditLoading(true);
                  setEditError('');
                  try {
                    const entry = allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx));
                    if (!entry) {
                      setEditError('This entry is missing an ID and cannot be updated.');
                      setEditLoading(false);
                      return;
                    }
                    await updateEducation(entry.id, {
                      institution: editInstitution,
                      degree: editDegree,
                      start_date: editEduStartDate,
                      end_date: editEduEndDate || null,
                      details: editEduDetails.split('\n').map(s => s.trim()).filter(Boolean),
                    });
                    const arcData = await getArcData();
                    setAllSections(arcData);
                    setEditMode(false);
                    toast({ status: 'success', title: 'Education updated!' });
                  } catch (err: any) {
                    setEditError(err?.message || 'Failed to update education');
                  } finally {
                    setEditLoading(false);
                  }
                }}
              >
                <Heading size="md" mb={4}>Edit Education</Heading>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={1} fontWeight={600}>Institution</Text>
                    <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Institution" value={editInstitution} onChange={e => setEditInstitution(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Degree</Text>
                    <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Degree" value={editDegree} onChange={e => setEditDegree(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Start Date</Text>
                    <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2018-09-01" value={editEduStartDate} onChange={e => setEditEduStartDate(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>End Date</Text>
                    <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2022-06-30 or Present" value={editEduEndDate} onChange={e => setEditEduEndDate(e.target.value)} />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Details</Text>
                    <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" value={editEduDetails} onChange={e => setEditEduDetails(e.target.value)} />
                  </Box>
                  {editError && <Text color="red.500">{editError}</Text>}
                  <HStack>
                    <Button colorScheme="blue" type="submit" isLoading={editLoading} isDisabled={!editInstitution || !editDegree || !editEduStartDate}>Save</Button>
                    <Button onClick={() => setEditMode(false)} isDisabled={editLoading} variant="ghost">Cancel</Button>
                  </HStack>
                </VStack>
              </Box>
            ) : selectedIdx !== null && editMode && selectedSection === 'training' ? (
              <Box as="form" w="100%" maxW="500px" mx="auto"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setEditLoading(true);
                  setEditError('');
                  try {
                    const entry = allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx));
                    if (!entry) {
                      setEditError('This entry is missing an ID and cannot be updated.');
                      setEditLoading(false);
                      return;
                    }
                    await updateTraining(entry.id, {
                      name: editTrainingName,
                      provider: editProvider,
                      date: editTrainingDate,
                      details: editTrainingDetails.split('\n').map(s => s.trim()).filter(Boolean),
                    });
                    const arcData = await getArcData();
                    setAllSections(arcData);
                    setEditMode(false);
                    toast({ status: 'success', title: 'Training updated!' });
                  } catch (err: any) {
                    setEditError(err?.message || 'Failed to update training');
                  } finally {
                    setEditLoading(false);
                  }
                }}
              >
                <Heading size="md" mb={4}>Edit Training</Heading>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text mb={1} fontWeight={600}>Name</Text>
                    <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Training Name" value={editTrainingName} onChange={e => setEditTrainingName(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Provider</Text>
                    <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Provider" value={editProvider} onChange={e => setEditProvider(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Date</Text>
                    <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2023-04-15" value={editTrainingDate} onChange={e => setEditTrainingDate(e.target.value)} required />
                  </Box>
                  <Box>
                    <Text mb={1} fontWeight={600}>Details</Text>
                    <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" value={editTrainingDetails} onChange={e => setEditTrainingDetails(e.target.value)} />
                  </Box>
                  {editError && <Text color="red.500">{editError}</Text>}
                  <HStack>
                    <Button colorScheme="blue" type="submit" isLoading={editLoading} isDisabled={!editTrainingName || !editProvider || !editTrainingDate}>Save</Button>
                    <Button onClick={() => setEditMode(false)} isDisabled={editLoading} variant="ghost">Cancel</Button>
                  </HStack>
                </VStack>
              </Box>
            ) : selectedIdx !== null && allSections[selectedSection] ? (
              <Box>
                <HStack justify="space-between" align="center" mb={2}>
                  <Heading size="lg" mb={1}>{allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.title || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.positionTitle || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.degree || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.name}</Heading>
                  <IconButton aria-label="Edit" icon={<EditIcon />} size="sm" variant="ghost" onClick={() => {
                    const entry = allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx));
                    if (entry) {
                      setEditFormFromEntry(entry);
                      setEditMode(true);
                    }
                  }} />
                </HStack>
                {allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.company || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.institution || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.org ? (
                  <Text fontWeight="semibold" color="gray.700" mb={1}>{allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.company || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.institution || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.org}</Text>
                ) : null}
                <Text fontSize="sm" color="gray.500" mb={4}>{allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.start_date || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.startDate || ''} - {allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.end_date || allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.endDate || ''}</Text>
                <Divider mb={4} />
                <VStack align="start" spacing={3}>
                  {allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.details && allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.details.length > 0 ? (
                    allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.details.map((d: string, i: number) => (
                      <Text as="li" key={i} ml={4} fontSize="md">{d}</Text>
                    ))
                  ) : allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.description ? (
                    <Text fontSize="md">{allSections[selectedSection].find((e: any) => e.id === selectedIdx || String(e.id) === String(selectedIdx))?.description}</Text>
                  ) : (
                    <Text fontSize="sm" color="gray.400">No details available.</Text>
                  )}
                </VStack>
              </Box>
            ) : (
              <Box as="form" w="100%" maxW="500px" mx="auto"
                onSubmit={async (e: React.FormEvent<HTMLFormElement>) => {
                  e.preventDefault();
                  setAddLoading(true);
                  setAddError('');
                  try {
                    if (selectedSection === 'work_experience') {
                      await addWorkExperience({
                        title: addTitle,
                        company: addCompany,
                        start_date: addStartDate,
                        end_date: addEndDate || null,
                        details: addDetails.split('\n').map(s => s.trim()).filter(Boolean),
                      });
                    } else if (selectedSection === 'education') {
                      await addEducation({
                        institution: addInstitution,
                        degree: addDegree,
                        start_date: addEduStartDate,
                        end_date: addEduEndDate || null,
                        details: addEduDetails.split('\n').map(s => s.trim()).filter(Boolean),
                      });
                    } else if (selectedSection === 'training') {
                      await addTraining({
                        name: addTrainingName,
                        provider: addProvider,
                        date: addTrainingDate,
                        details: addTrainingDetails.split('\n').map(s => s.trim()).filter(Boolean),
                      });
                    }
                    // Refresh data
                    const arcData = await getArcData();
                    setAllSections(arcData);
                    // Reset all add form state
                    setAddTitle(''); setAddCompany(''); setAddStartDate(''); setAddEndDate(''); setAddDetails('');
                    setAddInstitution(''); setAddDegree(''); setAddEduStartDate(''); setAddEduEndDate(''); setAddEduDetails('');
                    setAddTrainingName(''); setAddProvider(''); setAddTrainingDate(''); setAddTrainingDetails('');
                    // Select the new entry
                    if (selectedSection === 'work_experience') setSelectedIdx(arcData.work_experience.length.toString());
                    if (selectedSection === 'education') setSelectedIdx(arcData.education.length.toString());
                    if (selectedSection === 'training') setSelectedIdx(arcData.training.length.toString());
                    toast({ status: 'success', title: `${sectionTitles[selectedSection]} added!` });
                    setEditMode(false);
                  } catch (err: any) {
                    setAddError(err?.message || `Failed to add ${sectionTitles[selectedSection]}`);
                  } finally {
                    setAddLoading(false);
                  }
                }}
              >
                <Heading size="md" mb={4}>New Entry</Heading>
                <VStack spacing={4} align="stretch">
                  {selectedSection === 'work_experience' && (
                    <>
                      <Box>
                        <Text mb={1} fontWeight={600}>Title</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Title" value={addTitle} onChange={e => setAddTitle(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Company</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Company" value={addCompany} onChange={e => setAddCompany(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Start Date</Text>
                        <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. Mar 2020" value={addStartDate} onChange={e => setAddStartDate(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>End Date</Text>
                        <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. Dec 2020 or Present" value={addEndDate} onChange={e => setAddEndDate(e.target.value)} />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Details</Text>
                        <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" value={addDetails} onChange={e => setAddDetails(e.target.value)} />
                      </Box>
                    </>
                  )}
                  {selectedSection === 'education' && (
                    <>
                      <Box>
                        <Text mb={1} fontWeight={600}>Institution</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Institution" value={addInstitution} onChange={e => setAddInstitution(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Degree</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Degree" value={addDegree} onChange={e => setAddDegree(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Start Date</Text>
                        <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2018-09-01" value={addEduStartDate} onChange={e => setAddEduStartDate(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>End Date</Text>
                        <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2022-06-30 or Present" value={addEduEndDate} onChange={e => setAddEduEndDate(e.target.value)} />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Details</Text>
                        <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" value={addEduDetails} onChange={e => setAddEduDetails(e.target.value)} />
                      </Box>
                    </>
                  )}
                  {selectedSection === 'training' && (
                    <>
                      <Box>
                        <Text mb={1} fontWeight={600}>Name</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Training Name" value={addTrainingName} onChange={e => setAddTrainingName(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Provider</Text>
                        <input style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="Provider" value={addProvider} onChange={e => setAddProvider(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Date</Text>
                        <input type="text" style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }} placeholder="e.g. 2023-04-15" value={addTrainingDate} onChange={e => setAddTrainingDate(e.target.value)} required />
                      </Box>
                      <Box>
                        <Text mb={1} fontWeight={600}>Details</Text>
                        <textarea style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 80 }} placeholder="Details (one per line)" value={addTrainingDetails} onChange={e => setAddTrainingDetails(e.target.value)} />
                      </Box>
                    </>
                  )}
                  {addError && <Text color="red.500">{addError}</Text>}
                  <Button colorScheme="blue" type="submit" isLoading={addLoading} isDisabled={
                    (selectedSection === 'work_experience' && (!addTitle || !addCompany || !addStartDate)) ||
                    (selectedSection === 'education' && (!addInstitution || !addDegree || !addEduStartDate)) ||
                    (selectedSection === 'training' && (!addTrainingName || !addProvider || !addTrainingDate))
                  }>
                    Save
                  </Button>
                </VStack>
              </Box>
            )}
          </Box>
        )}
      </Flex>
      {missingKeywords.length > 0 && (
        <>
          <Modal isOpen={isOpen} onClose={onClose} isCentered size={modalSize} motionPreset="slideInBottom">
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Missing Keywords from Job Description</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text mb={2}>The following keywords were missing from your Ark profile for the last job you applied to. Consider adding them for a better match.</Text>
                <HStack wrap="wrap" gap={2} mb={4}>
                  {missingKeywords.map((k, idx) => (
                    <Box as="span" key={k + idx} px={3} py={1} borderRadius="md" bg="red.100" color="red.700" fontWeight={600} fontSize="md">{k}</Box>
                  ))}
                </HStack>
                <Text fontSize="sm" color="gray.500">Edit your Ark data to include these keywords if relevant.</Text>
              </ModalBody>
            </ModalContent>
          </Modal>
          {/* Floating recall button, mobile-friendly */}
          {!isOpen && (
            <IconButton
              aria-label="Show missing keywords"
              icon={<FiKey />}
              colorScheme="red"
              size="lg"
              position="fixed"
              bottom={recallBtnBottom}
              right={recallBtnRight}
              zIndex={1500}
              borderRadius="full"
              boxShadow="lg"
              onClick={onOpen}
              _hover={{ bg: 'red.400' }}
              _active={{ bg: 'red.500' }}
            />
          )}
        </>
      )}
      <Accordion allowMultiple>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">Skills</Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* Add Skill Form */}
            <Box mb={4}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!profileId || !addTitle.trim()) return;
                setAddLoading(true);
                setAddError('');
                try {
                  const res = await fetch(`/api/career-ark/profiles/${profileId}/skills`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: addTitle.trim(), description: addDetails.trim() }),
                  });
                  if (!res.ok) throw new Error('Failed to add skill');
                  // Refresh skills
                  const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(r => r.json());
                  setAllSections(updated);
                  setAddTitle('');
                  setAddDetails('');
                  toast({ status: 'success', title: 'Skill added!' });
                } catch (err: any) {
                  setAddError(err?.message || 'Failed to add skill');
                } finally {
                  setAddLoading(false);
                }
              }}>
                <VStack align="start" spacing={2}>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Skill name"
                    value={addTitle}
                    onChange={e => setAddTitle(e.target.value)}
                    required
                  />
                  <textarea
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 60 }}
                    placeholder="Description"
                    value={addDetails}
                    onChange={e => setAddDetails(e.target.value)}
                  />
                  <Button colorScheme="blue" type="submit" isLoading={addLoading} isDisabled={!addTitle.trim()}>Add</Button>
                  {addError && <Text color="red.500">{addError}</Text>}
                </VStack>
              </form>
            </Box>
            {/* Skills List and Edit Skill Inline */}
            {allSections && Array.isArray(allSections.skills) && allSections.skills.length > 0 ? (
              <VStack align="start" spacing={2}>
                {allSections.skills.map((skill: any, idx: number) => (
                  <HStack key={skill.id || idx} w="100%">
                    <Box flex={1}>
                      <Text fontWeight="semibold">{skill.name}</Text>
                      <Text fontSize="sm" color="gray.600">{skill.description}</Text>
                    </Box>
                    <Button size="xs" onClick={() => {
                      setEditMode(true);
                      setEditTitle(skill.name);
                      setEditDetails(skill.description);
                      setSelectedIdx(skill.id);
                    }}>Edit</Button>
                    <Button size="xs" colorScheme="red" onClick={async () => {
                      if (!skill.id) return;
                      setEditLoading(true);
                      try {
                        const res = await fetch(`/api/career-ark/skills/${skill.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (!res.ok) throw new Error('Failed to delete skill');
                        // Refresh skills
                        const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                          headers: { Authorization: `Bearer ${token}` },
                        }).then(r => r.json());
                        setAllSections(updated);
                        toast({ status: 'success', title: 'Skill deleted!' });
                      } catch (err: any) {
                        toast({ status: 'error', title: err?.message || 'Failed to delete skill' });
                      } finally {
                        setEditLoading(false);
                      }
                    }}>Delete</Button>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text color="gray.400">No skills yet. You can add skills above.</Text>
            )}
            {/* Edit Skill Inline */}
            {editMode && selectedIdx !== null && allSections && allSections.skills[selectedIdx] && (
              <Box mt={4}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!allSections.skills[selectedIdx].id || !editTitle.trim()) return;
                  setEditLoading(true);
                  setEditError('');
                  try {
                    const res = await fetch(`/api/career-ark/skills/${allSections.skills[selectedIdx].id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({ name: editTitle.trim(), description: editDetails.trim() }),
                    });
                    if (!res.ok) throw new Error('Failed to update skill');
                    // Refresh skills
                    const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                      headers: { Authorization: `Bearer ${token}` },
                    }).then(r => r.json());
                    setAllSections(updated);
                    setEditMode(false);
                    setEditTitle('');
                    setEditDetails('');
                    setSelectedIdx(null);
                    toast({ status: 'success', title: 'Skill updated!' });
                  } catch (err: any) {
                    setEditError(err?.message || 'Failed to update skill');
                  } finally {
                    setEditLoading(false);
                  }
                }}>
                  <VStack align="start" spacing={2}>
                    <input
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                      placeholder="Edit skill name"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                    />
                    <textarea
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 60 }}
                      placeholder="Edit description"
                      value={editDetails}
                      onChange={e => setEditDetails(e.target.value)}
                    />
                    <Button colorScheme="blue" type="submit" isLoading={editLoading} isDisabled={!editTitle.trim()}>Save</Button>
                    <Button onClick={() => { setEditMode(false); setEditTitle(''); setEditDetails(''); setSelectedIdx(null); }} isDisabled={editLoading}>Cancel</Button>
                    {editError && <Text color="red.500">{editError}</Text>}
                  </VStack>
                </form>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <AccordionButton>
            <Box flex="1" textAlign="left">Projects</Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={4}>
            {/* Add Project Form */}
            <Box mb={4}>
              <form onSubmit={async (e) => {
                e.preventDefault();
                if (!profileId || !addTitle.trim()) return;
                setAddLoading(true);
                setAddError('');
                try {
                  const res = await fetch(`/api/career-ark/profiles/${profileId}/projects`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                      'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({ name: addTitle.trim(), description: addDetails.trim() }),
                  });
                  if (!res.ok) throw new Error('Failed to add project');
                  // Refresh projects
                  const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                    headers: { Authorization: `Bearer ${token}` },
                  }).then(r => r.json());
                  setAllSections(updated);
                  setAddTitle('');
                  setAddDetails('');
                  toast({ status: 'success', title: 'Project added!' });
                } catch (err: any) {
                  setAddError(err?.message || 'Failed to add project');
                } finally {
                  setAddLoading(false);
                }
              }}>
                <VStack align="start" spacing={2}>
                  <input
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                    placeholder="Project name"
                    value={addTitle}
                    onChange={e => setAddTitle(e.target.value)}
                    required
                  />
                  <textarea
                    style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 60 }}
                    placeholder="Description"
                    value={addDetails}
                    onChange={e => setAddDetails(e.target.value)}
                  />
                  <Button colorScheme="blue" type="submit" isLoading={addLoading} isDisabled={!addTitle.trim()}>Add</Button>
                  {addError && <Text color="red.500">{addError}</Text>}
                </VStack>
              </form>
            </Box>
            {/* Projects List and Edit Project Inline */}
            {allSections && Array.isArray(allSections.projects) && allSections.projects.length > 0 ? (
              <VStack align="start" spacing={2}>
                {allSections.projects.map((project: any, idx: number) => (
                  <HStack key={project.id || idx} w="100%">
                    <Box flex={1}>
                      <Text fontWeight="semibold">{project.name}</Text>
                      <Text fontSize="sm" color="gray.600">{project.description}</Text>
                    </Box>
                    <Button size="xs" onClick={() => {
                      setEditMode(true);
                      setEditTitle(project.name);
                      setEditDetails(project.description);
                      setSelectedIdx(project.id);
                    }}>Edit</Button>
                    <Button size="xs" colorScheme="red" onClick={async () => {
                      if (!project.id) return;
                      setEditLoading(true);
                      try {
                        const res = await fetch(`/api/career-ark/projects/${project.id}`, {
                          method: 'DELETE',
                          headers: { Authorization: `Bearer ${token}` },
                        });
                        if (!res.ok) throw new Error('Failed to delete project');
                        // Refresh projects
                        const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                          headers: { Authorization: `Bearer ${token}` },
                        }).then(r => r.json());
                        setAllSections(updated);
                        toast({ status: 'success', title: 'Project deleted!' });
                      } catch (err: any) {
                        toast({ status: 'error', title: err?.message || 'Failed to delete project' });
                      } finally {
                        setEditLoading(false);
                      }
                    }}>Delete</Button>
                  </HStack>
                ))}
              </VStack>
            ) : (
              <Text color="gray.400">No projects yet. You can add projects above.</Text>
            )}
            {/* Edit Project Inline */}
            {editMode && selectedIdx !== null && allSections && allSections.projects[selectedIdx] && (
              <Box mt={4}>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!allSections.projects[selectedIdx].id || !editTitle.trim()) return;
                  setEditLoading(true);
                  setEditError('');
                  try {
                    const res = await fetch(`/api/career-ark/projects/${allSections.projects[selectedIdx].id}`, {
                      method: 'PUT',
                      headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                      },
                      body: JSON.stringify({ name: editTitle.trim(), description: editDetails.trim() }),
                    });
                    if (!res.ok) throw new Error('Failed to update project');
                    // Refresh projects
                    const updated = await fetch(`/api/career-ark/profiles/${profileId}/all_sections`, {
                      headers: { Authorization: `Bearer ${token}` },
                    }).then(r => r.json());
                    setAllSections(updated);
                    setEditMode(false);
                    setEditTitle('');
                    setEditDetails('');
                    setSelectedIdx(null);
                    toast({ status: 'success', title: 'Project updated!' });
                  } catch (err: any) {
                    setEditError(err?.message || 'Failed to update project');
                  } finally {
                    setEditLoading(false);
                  }
                }}>
                  <VStack align="start" spacing={2}>
                    <input
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0' }}
                      placeholder="Edit project name"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      required
                    />
                    <textarea
                      style={{ width: '100%', padding: 8, borderRadius: 6, border: '1px solid #CBD5E0', minHeight: 60 }}
                      placeholder="Edit description"
                      value={editDetails}
                      onChange={e => setEditDetails(e.target.value)}
                    />
                    <Button colorScheme="blue" type="submit" isLoading={editLoading} isDisabled={!editTitle.trim()}>Save</Button>
                    <Button onClick={() => { setEditMode(false); setEditTitle(''); setEditDetails(''); setSelectedIdx(null); }} isDisabled={editLoading}>Cancel</Button>
                    {editError && <Text color="red.500">{editError}</Text>}
                  </VStack>
                </form>
              </Box>
            )}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </Box>
  );
};

export default CareerArk; 