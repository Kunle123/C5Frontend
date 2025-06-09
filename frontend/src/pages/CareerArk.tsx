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
  Center,
  Image,
  Input,
  Textarea,
  Badge,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { getUser, uploadCV } from '../api';
import { getArcData, getCVStatus, addWorkExperience, updateWorkExperience, addEducation, updateEducation, addTraining, updateTraining, deleteWorkExperience, deleteEducation, deleteTraining, deleteSkill, deleteProject, deleteCertification } from '../api/careerArkApi';
import { useDisclosure } from '@chakra-ui/react';
import { FiKey } from 'react-icons/fi';
import { format, parse, isValid, compareDesc } from 'date-fns';

const sectionTitles = {
  work_experience: 'Career History',
  education: 'Education',
  training: 'Training',
};

const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';

type KeywordStatus = { keyword: string, status: 'green' | 'amber' | 'red' };

function EmptyState({ section, onUpload }: { section: string, onUpload?: () => void }) {
  const sectionNames: Record<string, string> = {
    work_experience: 'work experience',
    education: 'education',
    skills: 'skills',
    projects: 'projects',
    certifications: 'certifications',
    training: 'training',
  };
  return (
    <Center flexDir="column" py={8} color="gray.400">
      <Text mb={2}>No entries yet.</Text>
      {onUpload && <Button colorScheme="blue" onClick={onUpload}>Upload CV</Button>}
    </Center>
  );
}

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
  const [showRecallBtn, setShowRecallBtn] = useState(false);
  const [keywordStatuses, setKeywordStatuses] = useState<KeywordStatus[]>([]);

  useEffect(() => {
    setLoading(true);
    const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
    if (!token) {
      setError('Not authenticated');
      setLoading(false);
      return;
    }
    // Fetch the user's profile using the correct endpoint, always bypassing cache
    fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me`, {
      headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch profile');
        return res.json();
      })
      .then(profile => {
        setUser(profile); // Store the profile object
        setProfileId(profile.id);
        // Now fetch all sections using the profileId, always bypassing cache
        return fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profile.id}/all_sections`, {
          headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
        });
      })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sections');
        return res.json();
      })
      .then(data => {
        setAllSections(data);
        setWorkExperience(Array.isArray(data.work_experience) ? data.work_experience : []);
        setEducation(Array.isArray(data.education) ? data.education : []);
        setTraining(Array.isArray(data.training) ? data.training : []);
        setSkills(Array.isArray(data.skills) ? data.skills : []);
        setProjects(Array.isArray(data.projects) ? data.projects : []);
        setCertifications(Array.isArray(data.certifications) ? data.certifications : []);
        setError('');
      })
      .catch(() => setError('Failed to load data'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading && workExperience && workExperience.length > 0 && (!selectedIdx || selectedSection !== 'work_experience')) {
      setSelectedSection('work_experience');
      setSelectedIdx(workExperience[0].id || '0');
    }
    // eslint-disable-next-line
  }, [loading, workExperience]);

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
                  const arcRes = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/all_sections`, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      'Cache-Control': 'no-cache',
                    },
                  });
                  if (arcRes.ok) {
                    const arcData = await arcRes.json();
                    setAllSections(arcData);
                    setWorkExperience(Array.isArray(arcData.work_experience) ? arcData.work_experience : []);
                    setEducation(Array.isArray(arcData.education) ? arcData.education : []);
                    setTraining(Array.isArray(arcData.training) ? arcData.training : []);
                    setSkills(Array.isArray(arcData.skills) ? arcData.skills : []);
                    setProjects(Array.isArray(arcData.projects) ? arcData.projects : []);
                    setCertifications(Array.isArray(arcData.certifications) ? arcData.certifications : []);
                    // Auto-select first available entry
                    const sectionOrder = ['work_experience', 'education', 'training', 'skills', 'projects', 'certifications'];
                    for (const sec of sectionOrder) {
                      const arr = arcData[sec];
                      if (Array.isArray(arr) && arr.length > 0) {
                        setSelectedSection(sec);
                        setSelectedIdx(arr[0].id || '0');
                        break;
                      }
                    }
                    toast({ status: 'success', title: 'CV imported and Ark updated! Your data is now available.' });
                  } else {
                    setUploadError('Failed to update Ark');
                  }
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
          setShowRecallBtn(false);
        }
        localStorage.removeItem('ark-missing-keywords');
      }
    } catch {}
    // eslint-disable-next-line
  }, []);

  // Show recall button when modal is closed and there are missing keywords
  useEffect(() => {
    if (!isOpen && missingKeywords.length > 0) {
      setShowRecallBtn(true);
    } else {
      setShowRecallBtn(false);
    }
  }, [isOpen, missingKeywords]);

  // ... after sortWorkExp and sortEducation ...
  const sectionDataMap: Record<string, any[]> = {
    work_experience: sortWorkExp(workExperience),
    education: sortEducation(education),
    training: training,
    skills: skills,
    projects: projects,
    certifications: certifications,
  };

  // Helper to analyze keywords against Ark data
  const analyzeKeywords = (keywords: string[], arkData: any): KeywordStatus[] => {
    const arcText = JSON.stringify(arkData).toLowerCase();
    const now = new Date();
    return keywords.map((kw: string) => {
      const kwLower = kw.toLowerCase();
      let status: 'green' | 'amber' | 'red' = 'red';
      // Work Experience
      if (arkData.work_experience) {
        for (const exp of arkData.work_experience) {
          let isRecent = false;
          if (exp.end_date) {
            if (/^present$/i.test((exp.end_date || '').trim())) {
              isRecent = true;
            } else {
              const parsed = parseInt((exp.end_date + '').slice(0, 4));
              if (!isNaN(parsed) && (new Date().getFullYear() - parsed <= 5)) {
                isRecent = true;
              }
            }
          }
          // If end_date is missing or invalid, treat as old (not recent)
          if ((exp.description && exp.description.toLowerCase().includes(kwLower)) ||
              (exp.title && exp.title.toLowerCase().includes(kwLower)) ||
              (exp.skills && exp.skills.join(' ').toLowerCase().includes(kwLower))) {
            if (isRecent) {
              status = 'green';
              break;
            } else {
              status = 'amber';
            }
          }
        }
      }
      // Skills (amber if not green)
      if (status !== 'green' && arkData.skills && arkData.skills.length > 0) {
        for (const skill of arkData.skills) {
          if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
              (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
            status = 'amber';
          }
        }
      }
      // Education, Projects, Certifications, Training, etc. (amber if not green)
      if (status !== 'green' && !status && arcText.includes(kwLower)) status = 'amber';
      return { keyword: kw, status };
    });
  };

  // Function to reload and analyze keywords when modal is opened
  const reloadKeywordStatuses = async () => {
    try {
      const storedKeywords = localStorage.getItem('ark-keywords');
      if (!storedKeywords) {
        setKeywordStatuses([]);
        return;
      }
      const keywords: string[] = JSON.parse(storedKeywords);
      // Fetch latest Ark data
      const token = localStorage.getItem('token') || '';
      const profileRes = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!profileRes.ok) throw new Error('Failed to fetch profile');
      const profile = await profileRes.json();
      const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profile.id}/all_sections`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch Ark data');
      const arkData = await res.json();
      setKeywordStatuses(analyzeKeywords(keywords, arkData));
    } catch {
      setKeywordStatuses([]);
    }
  };

  // When modal is opened, reload and analyze keywords
  useEffect(() => {
    if (isOpen) {
      reloadKeywordStatuses();
    }
    // eslint-disable-next-line
  }, [isOpen]);

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
          {polling && (
            <Box mb={2} textAlign="center">
              <Spinner size="sm" color="blue.500" mr={2} />
              <Text as="span" fontSize="sm" color="blue.600">Processing more data…</Text>
            </Box>
          )}
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
                    if (!data || data.length === 0) return <EmptyState section={section} onUpload={section === 'work_experience' ? handleUploadClick : undefined} />;
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
              if (editMode) {
                // Editable form for each section
                switch (section) {
                  case 'work_experience':
                    return (
                      <Box>
                        <Heading size="lg" mb={2}>Edit Work Experience</Heading>
                        <Input placeholder="Company" value={editCompany} onChange={e => setEditCompany(e.target.value)} mb={2} />
                        <Input placeholder="Title" value={editTitle} onChange={e => setEditTitle(e.target.value)} mb={2} />
                        <Input placeholder="Start Date" value={editStartDate} onChange={e => setEditStartDate(e.target.value)} mb={2} />
                        <Input placeholder="End Date" value={editEndDate} onChange={e => setEditEndDate(e.target.value)} mb={2} />
                        <Textarea placeholder="Description" value={editDetails} onChange={e => setEditDetails(e.target.value)} mb={2} minH={100} />
                        {editError && <Alert status="error" mb={2}><AlertIcon />{editError}</Alert>}
                        <HStack mt={2}>
                          <Button colorScheme="green" isLoading={editLoading} onClick={async () => {
                            setEditLoading(true);
                            setEditError('');
                            try {
                              await updateWorkExperience(item.id, {
                                company: editCompany,
                                title: editTitle,
                                start_date: editStartDate,
                                end_date: editEndDate,
                                description: editDetails,
                              });
                              // Always re-fetch latest work experience after update
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/work_experience`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const latest = await res.json();
                              setWorkExperience(Array.isArray(latest) ? latest : []);
                              localStorage.setItem('ark-updated', 'true');
                              setEditMode(false);
                              toast({ status: 'success', title: 'Work experience updated' });
                            } catch (err: any) {
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                // Auto-refresh
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/work_experience`, { headers: { Authorization: `Bearer ${token}` } });
                                const latest = await res.json();
                                setWorkExperience(Array.isArray(latest) ? latest : []);
                                setEditMode(false);
                              } else {
                                setEditError(err?.error || err?.message || 'Update failed');
                              }
                            } finally {
                              setEditLoading(false);
                            }
                          }}>Save</Button>
                          <Button onClick={() => setEditMode(false)}>Cancel</Button>
                        </HStack>
                      </Box>
                    );
                  case 'education':
                    return (
                      <Box>
                        <Heading size="lg" mb={2}>Edit Education</Heading>
                        <Input placeholder="Institution" value={editInstitution} onChange={e => setEditInstitution(e.target.value)} mb={2} />
                        <Input placeholder="Degree" value={editDegree} onChange={e => setEditDegree(e.target.value)} mb={2} />
                        <Input placeholder="Start Date" value={editEduStartDate} onChange={e => setEditEduStartDate(e.target.value)} mb={2} />
                        <Input placeholder="End Date" value={editEduEndDate} onChange={e => setEditEduEndDate(e.target.value)} mb={2} />
                        <Textarea placeholder="Description" value={editEduDetails} onChange={e => setEditEduDetails(e.target.value)} mb={2} minH={100} />
                        {editError && <Alert status="error" mb={2}><AlertIcon />{editError}</Alert>}
                        <HStack mt={2}>
                          <Button colorScheme="green" isLoading={editLoading} onClick={async () => {
                            setEditLoading(true);
                            setEditError('');
                            try {
                              await updateEducation(item.id, {
                                institution: editInstitution,
                                degree: editDegree,
                                start_date: editEduStartDate,
                                end_date: editEduEndDate,
                                description: editEduDetails,
                              });
                              // Always re-fetch latest education after update
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/education`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const latest = await res.json();
                              setEducation(Array.isArray(latest) ? latest : []);
                              localStorage.setItem('ark-updated', 'true');
                              setEditMode(false);
                              toast({ status: 'success', title: 'Education updated' });
                            } catch (err: any) {
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                // Auto-refresh
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/education`, {
                                  headers: { Authorization: `Bearer ${token}` },
                                });
                                const latest = await res.json();
                                setEducation(Array.isArray(latest) ? latest : []);
                                setEditMode(false);
                              } else {
                                setEditError(err?.error || err?.message || 'Update failed');
                              }
                            } finally {
                              setEditLoading(false);
                            }
                          }}>Save</Button>
                          <Button onClick={() => setEditMode(false)}>Cancel</Button>
                        </HStack>
                      </Box>
                    );
                  case 'training':
                    return (
                      <Box>
                        <Heading size="lg" mb={2}>Edit Training</Heading>
                        <Input placeholder="Name" value={editTrainingName} onChange={e => setEditTrainingName(e.target.value)} mb={2} />
                        <Input placeholder="Provider" value={editProvider} onChange={e => setEditProvider(e.target.value)} mb={2} />
                        <Input placeholder="Date" value={editTrainingDate} onChange={e => setEditTrainingDate(e.target.value)} mb={2} />
                        <Textarea placeholder="Details" value={editTrainingDetails} onChange={e => setEditTrainingDetails(e.target.value)} mb={2} minH={100} />
                        {editError && <Alert status="error" mb={2}><AlertIcon />{editError}</Alert>}
                        <HStack mt={2}>
                          <Button colorScheme="green" isLoading={editLoading} onClick={async () => {
                            setEditLoading(true);
                            setEditError('');
                            try {
                              await updateTraining(item.id, {
                                name: editTrainingName,
                                provider: editProvider,
                                date: editTrainingDate,
                                details: editTrainingDetails,
                              });
                              // Always re-fetch latest training after update
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/training`, {
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const latest = await res.json();
                              setTraining(Array.isArray(latest) ? latest : []);
                              localStorage.setItem('ark-updated', 'true');
                              setEditMode(false);
                              toast({ status: 'success', title: 'Training updated' });
                            } catch (err: any) {
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                // Auto-refresh
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/training`, { headers: { Authorization: `Bearer ${token}` } });
                                const latest = await res.json();
                                setTraining(Array.isArray(latest) ? latest : []);
                                setEditMode(false);
                              } else {
                                setEditError(err?.error || err?.message || 'Update failed');
                              }
                            } finally {
                              setEditLoading(false);
                            }
                          }}>Save</Button>
                          <Button onClick={() => setEditMode(false)}>Cancel</Button>
                        </HStack>
                      </Box>
                    );
                  default:
                    return <Text>Edit not supported for this section yet.</Text>;
                }
              }
              // Non-edit mode (view)
              switch (section) {
                case 'work_experience':
                  return (
                    <Box>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="lg">{item.company}</Heading>
                        <HStack>
                          <Button onClick={() => setEditMode(true)} colorScheme="blue" size="sm">Edit</Button>
                          <Button onClick={async () => {
                            try {
                              console.log('Deleting work experience', item.id);
                              await deleteWorkExperience(item.id);
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/work_experience`, { headers: { Authorization: `Bearer ${token}` } });
                              const latest = await res.json();
                              setWorkExperience(Array.isArray(latest) ? latest : []);
                              setSelectedIdx(latest[0]?.id || null);
                              toast({ status: 'success', title: 'Work experience deleted' });
                            } catch (err: any) {
                              console.log('Delete error', err);
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/work_experience`, { headers: { Authorization: `Bearer ${token}` } });
                                const latest = await res.json();
                                setWorkExperience(Array.isArray(latest) ? latest : []);
                                setSelectedIdx(latest[0]?.id || null);
                              } else {
                                toast({ status: 'error', title: err?.error || err?.message || 'Delete failed' });
                              }
                            }
                          }} colorScheme="red" size="sm">Delete</Button>
                        </HStack>
                      </Flex>
                      <Text fontWeight="semibold" fontSize="lg">{item.title}</Text>
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.start_date} – {item.end_date}</Text>
                      <Text whiteSpace="pre-line" fontSize="md">
                        {item.description && item.description.length > 300 ? <ShowMoreText text={item.description} /> : item.description}
                      </Text>
                    </Box>
                  );
                case 'education':
                  return (
                    <Box>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="lg">{item.institution}</Heading>
                        <HStack>
                          <Button onClick={() => setEditMode(true)} colorScheme="blue" size="sm">Edit</Button>
                          <Button onClick={async () => {
                            try {
                              console.log('Deleting education', item.id);
                              await deleteEducation(item.id);
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/education`, { headers: { Authorization: `Bearer ${token}` } });
                              const latest = await res.json();
                              setEducation(Array.isArray(latest) ? latest : []);
                              setSelectedIdx(latest[0]?.id || null);
                              toast({ status: 'success', title: 'Education deleted' });
                            } catch (err: any) {
                              console.log('Delete error', err);
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/education`, { headers: { Authorization: `Bearer ${token}` } });
                                const latest = await res.json();
                                setEducation(Array.isArray(latest) ? latest : []);
                                setSelectedIdx(latest[0]?.id || null);
                              } else {
                                toast({ status: 'error', title: err?.error || err?.message || 'Delete failed' });
                              }
                            }
                          }} colorScheme="red" size="sm">Delete</Button>
                        </HStack>
                      </Flex>
                      <Text fontWeight="semibold" fontSize="lg">{item.degree}</Text>
                      {item.field && <Text color="gray.500" fontSize="sm">{item.field}</Text>}
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.start_date} – {item.end_date}</Text>
                      {item.description && (
                        <Text whiteSpace="pre-line" fontSize="md">
                          {item.description.length > 300 ? <ShowMoreText text={item.description} /> : item.description}
                        </Text>
                      )}
                    </Box>
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
                    <Box>
                      <Flex justify="space-between" align="center" mb={2}>
                        <Heading size="lg">{item.name}</Heading>
                        <HStack>
                          <Button onClick={() => setEditMode(true)} colorScheme="blue" size="sm">Edit</Button>
                          <Button onClick={async () => {
                            try {
                              console.log('Deleting training', item.id);
                              await deleteTraining(item.id);
                              const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/training`, { headers: { Authorization: `Bearer ${token}` } });
                              const latest = await res.json();
                              setTraining(Array.isArray(latest) ? latest : []);
                              setSelectedIdx(latest[0]?.id || null);
                              toast({ status: 'success', title: 'Training deleted' });
                            } catch (err: any) {
                              console.log('Delete error', err);
                              if (err?.status === 404 || err?.message?.includes('404')) {
                                toast({ status: 'error', title: 'This entry no longer exists. Refreshing data...' });
                                const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profileId}/training`, { headers: { Authorization: `Bearer ${token}` } });
                                const latest = await res.json();
                                setTraining(Array.isArray(latest) ? latest : []);
                                setSelectedIdx(latest[0]?.id || null);
                              } else {
                                toast({ status: 'error', title: err?.error || err?.message || 'Delete failed' });
                              }
                            }
                          }} colorScheme="red" size="sm">Delete</Button>
                        </HStack>
                      </Flex>
                      <Text fontWeight="semibold" fontSize="lg">{item.provider}</Text>
                      <Text color="gray.600" fontSize="sm" mb={1}>{item.date}</Text>
                      {item.details && (
                        <Text whiteSpace="pre-line" fontSize="md">
                          {Array.isArray(item.details) ? item.details.join('\n') : item.details}
                        </Text>
                      )}
                    </Box>
                  );
                default:
                  return null;
              }
            })()
          )}
        </Box>
      </Flex>
      {/* Modal overlay for missing keywords */}
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Keyword Status for This Job</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {keywordStatuses.length > 0 ? (
              <VStack spacing={2} align="stretch">
                <Text mb={2}>Status of all keywords from the job description:</Text>
                <HStack wrap="wrap" gap={2} mb={2}>
                  {keywordStatuses.map((kw, idx) => (
                    <Badge key={kw.keyword + idx} colorScheme={kw.status === 'green' ? 'green' : kw.status === 'amber' ? 'yellow' : 'red'} px={3} py={1} borderRadius="md" fontSize="md" fontWeight={600}>{kw.keyword}</Badge>
                  ))}
                </HStack>
              </VStack>
            ) : (
              <Text>No keywords found for this job. Start from the Application Wizard to analyze keywords.</Text>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
      {/* Floating recall button */}
      {showRecallBtn && (
        <IconButton
          icon={<FiKey size={28} />}
          aria-label="Show missing keywords"
          position="fixed"
          bottom={recallBtnBottom}
          right={recallBtnRight}
          zIndex={2000}
          colorScheme="red"
          bg="red.500"
          color="white"
          borderRadius="full"
          boxShadow="lg"
          size="xl"
          onClick={onOpen}
          _hover={{ bg: 'red.600' }}
        />
      )}
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