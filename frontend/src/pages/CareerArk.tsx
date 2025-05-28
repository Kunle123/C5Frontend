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

const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';

const CareerArk: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);
  const [allSections, setAllSections] = useState<any>(null);
  const [selectedSection, setSelectedSection] = useState<string>('work_experience');
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
  const [workExperience, setWorkExperience] = useState<any[]>([]);
  const [education, setEducation] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [sectionError, setSectionError] = useState<string>('');
  const [training, setTraining] = useState<any[]>([]);

  // Move this block:
  // const sectionDataMap: Record<string, any[]> = { ... };
  // to after the sortWorkExp and sortEducation function declarations.

  useEffect(() => {
    async function fetchSections() {
      setLoading(true);
      setSectionError('');
      try {
        const token = localStorage.getItem('token') || '';
        const profileRes = await fetch('/api/career-ark/profiles/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error('Failed to fetch profile');
        const profile = await profileRes.json();
        setUser(profile);
        setProfileId(profile.id);
        // Fetch each section
        const [we, edu, trn, skl, prj, cert] = await Promise.all([
          fetch(`/api/career-ark/profiles/${profile.id}/work_experience`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`/api/career-ark/profiles/${profile.id}/education`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`/api/career-ark/profiles/${profile.id}/training`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`/api/career-ark/profiles/${profile.id}/skills`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`/api/career-ark/profiles/${profile.id}/projects`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
          fetch(`/api/career-ark/profiles/${profile.id}/certifications`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
        ]);
        setWorkExperience(Array.isArray(we) ? we : []);
        setEducation(Array.isArray(edu) ? edu : []);
        setTraining(Array.isArray(trn) ? trn : []);
        setSkills(Array.isArray(skl) ? skl : []);
        setProjects(Array.isArray(prj) ? prj : []);
        setCertifications(Array.isArray(cert) ? cert : []);
        setError('');
      } catch (err: any) {
        setSectionError(err?.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  const sortWorkExp = (arr: any[]) => {
    return [...arr].sort((a, b) => {
      if (a.end_date === 'Present') return -1;
      if (b.end_date === 'Present') return 1;
      const parse = (d: string) => Date.parse(d + '-01') || 0;
      return parse(b.end_date) - parse(a.end_date);
    });
  };
  const sortEducation = (arr: any[]) => {
    return [...arr].sort((a, b) => {
      const parse = (d: string) => Date.parse((d || '') + '-01') || 0;
      return parse(b.end_date) - parse(a.end_date);
    });
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
    setUploadProgress(10);
    try {
      const token = localStorage.getItem('token') || '';
      const formData = new FormData();
      formData.append('file', file);
      const xhr = new XMLHttpRequest();
      xhr.open('POST', `${API_GATEWAY_BASE}/api/career-ark/cv`, true);
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
                const statusData = await getCVStatus(data.taskId);
                setStatus(statusData.status);
                if (statusData.status === 'completed') {
                  setUploadProgress(100);
                  setPolling(false);
                  setSummary(statusData.extractedDataSummary || null);
                  // Refresh Ark data, bypassing cache
                  const arcRes = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me/all_sections`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Cache-Control': 'no-cache',
                    },
                  });
                  if (arcRes.ok) {
                    const arcData = await arcRes.json();
                    setAllSections(arcData);
                  }
                  toast({ status: 'success', title: 'CV imported and Ark updated!' });
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

  const setEditFormFromEntry = (entry: any) => {
    if (selectedSection === 'work_experience') {
      setEditTitle(entry.title || entry.positionTitle || '');
      setEditCompany(entry.company || '');
      setEditStartDate(entry.start_date || entry.startDate || '');
      setEditEndDate(entry.end_date || entry.endDate || '');
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

  const handleListItemClick = (section: any, entryId: string | number) => {
    setSelectedSection(section);
    setSelectedIdx(String(entryId));
    setEditMode(false);
    if (isMobile) setMobileDetailMode(true);
  };

  const handleBack = () => {
    setMobileDetailMode(false);
    setEditMode(false);
  };

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

  // ... after sortWorkExp and sortEducation ...
  const sectionDataMap: Record<string, any[]> = {
    work_experience: sortWorkExp(workExperience),
    education: sortEducation(education),
    training: training,
    skills: skills,
    projects: projects,
    certifications: certifications,
  };

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
      <Flex maxW="1200px" mx="auto" flex={1} h="calc(100vh - 80px)" minH="calc(100vh - 80px)" gap={6} direction={{ base: 'column', md: 'row' }}>
        {/* Sidebar */}
        <Box w={{ base: '100%', md: '320px' }} bg="white" borderRadius="lg" boxShadow="md" p={4} h="100%" minH={0} display="flex" flexDirection="column" maxH="100%">
          <Button variant="outline" colorScheme="blue" w="100%" mb={4} onClick={handleUploadClick} isLoading={uploading}>Import a CV</Button>
          {uploading && <Progress value={uploadProgress} size="sm" colorScheme="blue" mb={2} />}
          <input type="file" accept=".pdf,.doc,.docx" style={{ display: 'none' }} ref={fileInputRef} onChange={handleFileChange} disabled={uploading || polling} />
          <Box flex={1} minH={0} overflowY="auto">
            {/* Section Navigation and List */}
            {['work_experience', 'education', 'training', 'skills', 'projects', 'certifications'].map(section => (
              <Box key={section} mb={6}>
                <HStack justify="space-between" align="center" mb={2}>
                  <Text fontWeight="bold" fontSize="lg" color="brand.500" onClick={() => setSelectedSection(section as string)} style={{ cursor: 'pointer' }}>
                    {section.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </Text>
                </HStack>
                <VStack spacing={1} align="stretch">
                  {(() => {
                    const data = sectionDataMap[section as string];
                    if (!data || data.length === 0) return <Text color="gray.400">No {section.replace('_', ' ')} found.</Text>;
                    return data.map((item: any, idx: number) => (
                      <Box
                        key={item.id || idx}
                        p={2}
                        borderRadius="md"
                        bg={selectedSection === section && selectedIdx === (item.id || idx) ? 'brand.100' : 'gray.50'}
                        _hover={{ bg: 'brand.50', cursor: 'pointer' }}
                        onClick={() => { setSelectedSection(section as string); setSelectedIdx(item.id || idx); }}
                      >
                        {/* Render summary for each section */}
                        {section === 'work_experience' && (
                          <>
                            <Text fontWeight="semibold">{item.company}</Text>
                            <Text fontSize="sm" color="gray.600">{item.title}</Text>
                            <Text fontSize="xs" color="gray.500">{item.start_date} - {item.end_date}</Text>
                          </>
                        )}
                        {section === 'education' && (
                          <>
                            <Text fontWeight="semibold">{item.institution}</Text>
                            <Text fontSize="sm" color="gray.600">{item.degree}</Text>
                            <Text fontSize="xs" color="gray.500">{item.start_date} - {item.end_date}</Text>
                          </>
                        )}
                        {section === 'skills' && (
                          <Box px={2} py={1} borderRadius="md" bg="blue.50" color="blue.700" fontWeight={600} fontSize="md">{item.skill || item.name}</Box>
                        )}
                        {section === 'projects' && (
                          <Text fontWeight="semibold">{item.name}</Text>
                        )}
                        {section === 'certifications' && (
                          <Text fontWeight="semibold">{item.name}</Text>
                        )}
                        {section === 'training' && (
                          <Text fontWeight="semibold">{item.name}</Text>
                        )}
                      </Box>
                    ));
                  })()}
                </VStack>
              </Box>
            ))}
          </Box>
        </Box>
        {/* Detail View */}
        <Box flex={1} bg="white" borderRadius="lg" boxShadow="md" p={8} minH={0} h="100%" overflowY="auto">
          {sectionError && <Alert status="error" mb={4}><AlertIcon />{sectionError}</Alert>}
          {loading ? <Spinner /> : (
            selectedIdx && (() => {
              const section = selectedSection as string;
              const data = sectionDataMap[section];
              const item = data.find((e: any) => e.id === selectedIdx);
              if (!item) return <Text color="gray.400">No details available.</Text>;
              switch (section) {
                case 'work_experience':
                  return (
                    <>
                      <Heading size="lg">{item.company}</Heading>
                      <Text fontWeight="semibold" fontSize="lg">{item.title}</Text>
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.start_date} – {item.end_date}</Text>
                      <Text whiteSpace="pre-line" fontSize="md">
                        {item.description && item.description.length > 300 ? <ShowMoreText text={item.description} /> : item.description}
                      </Text>
                    </>
                  );
                case 'education':
                  return (
                    <>
                      <Heading size="lg">{item.institution}</Heading>
                      <Text fontWeight="semibold" fontSize="lg">{item.degree}</Text>
                      {item.field && <Text color="gray.500" fontSize="sm">{item.field}</Text>}
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.start_date} – {item.end_date}</Text>
                      {item.description && (
                        <Text whiteSpace="pre-line" fontSize="md">
                          {item.description.length > 300 ? <ShowMoreText text={item.description} /> : item.description}
                        </Text>
                      )}
                    </>
                  );
                case 'skills':
                  return (
                    <HStack wrap="wrap" spacing={2} mb={6}>
                      <Box px={3} py={1} borderRadius="md" bg="blue.50" color="blue.700" fontWeight={600} fontSize="md">{item.skill || item.name}</Box>
                    </HStack>
                  );
                case 'projects':
                  return (
                    <>
                      <Heading size="lg">{item.name}</Heading>
                      <Text fontSize="md" whiteSpace="pre-line">{item.description}</Text>
                    </>
                  );
                case 'certifications':
                  return (
                    <>
                      <Heading size="lg">{item.name}</Heading>
                      <Text fontSize="sm" color="gray.600">
                        {item.issuer && <span>{item.issuer} </span>}
                        {item.year && <span>({item.year})</span>}
                      </Text>
                    </>
                  );
                case 'training':
                  return (
                    <>
                      <Heading size="lg">{item.name}</Heading>
                      <Text fontWeight="semibold" fontSize="lg">{item.provider}</Text>
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.date}</Text>
                      {item.details && (
                        <Text whiteSpace="pre-line" fontSize="md">
                          {Array.isArray(item.details) ? item.details.join('\n') : item.details}
                        </Text>
                      )}
                    </>
                  );
                default:
                  return null;
              }
            })()
          )}
        </Box>
      </Flex>
    </Box>
  );
};

// ShowMoreText component for truncating long descriptions
function ShowMoreText({ text }: { text: string }) {
  const [showMore, setShowMore] = useState(false);
  if (text.length <= 300) return <>{text}</>;
  return (
    <span>
      {showMore ? text : text.slice(0, 300) + '...'}{' '}
      <Button variant="link" size="sm" colorScheme="blue" onClick={() => setShowMore(v => !v)}>
        {showMore ? 'Show less' : 'Show more'}
      </Button>
    </span>
  );
}

export default CareerArk; 