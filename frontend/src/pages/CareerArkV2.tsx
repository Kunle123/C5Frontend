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
  Input,
  Textarea,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  VStack,
  HStack,
  useDisclosure,
} from '@chakra-ui/react';
import { AddIcon, EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { API_GATEWAY_BASE } from '../api/careerArkApi';
import { addWorkExperience, updateWorkExperience, deleteWorkExperience, addEducation, updateEducation, deleteEducation, addTraining, updateTraining, deleteTraining, addSkill, updateSkill, deleteSkill, addProject, updateProject, deleteProject, addCertification, updateCertification, deleteCertification } from '../api/careerArkApi';

const sectionList = [
  { key: 'work_experience', label: 'Work Experience' },
  { key: 'education', label: 'Education' },
  { key: 'training', label: 'Training' },
  { key: 'skills', label: 'Skills' },
  { key: 'projects', label: 'Projects' },
  { key: 'certifications', label: 'Certifications' },
];

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
  const [activeSection, setActiveSection] = useState('work_experience');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);
  const [form, setForm] = useState({ company: '', title: '', start_date: '', end_date: '', description: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [profile, setProfile] = useState<any>(null);
  const [profileError, setProfileError] = useState('');

  // Education CRUD state
  const [showAddEduModal, setShowAddEduModal] = useState(false);
  const [showEditEduModal, setShowEditEduModal] = useState(false);
  const [editEduItem, setEditEduItem] = useState<any>(null);
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' });
  const [eduFormLoading, setEduFormLoading] = useState(false);
  const [eduFormError, setEduFormError] = useState('');
  // Training CRUD state
  const [showAddTrainingModal, setShowAddTrainingModal] = useState(false);
  const [showEditTrainingModal, setShowEditTrainingModal] = useState(false);
  const [editTrainingItem, setEditTrainingItem] = useState<any>(null);
  const [trainingForm, setTrainingForm] = useState({ name: '', provider: '', date: '', details: '' });
  const [trainingFormLoading, setTrainingFormLoading] = useState(false);
  const [trainingFormError, setTrainingFormError] = useState('');

  // Skills CRUD state
  const [skillInput, setSkillInput] = useState('');
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillError, setSkillError] = useState('');
  // Projects CRUD state
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(false);
  const [editProjectItem, setEditProjectItem] = useState<any>(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [projectFormLoading, setProjectFormLoading] = useState(false);
  const [projectFormError, setProjectFormError] = useState('');
  // Certifications CRUD state
  const [showAddCertModal, setShowAddCertModal] = useState(false);
  const [showEditCertModal, setShowEditCertModal] = useState(false);
  const [editCertItem, setEditCertItem] = useState<any>(null);
  const [certForm, setCertForm] = useState({ name: '', issuer: '', year: '' });
  const [certFormLoading, setCertFormLoading] = useState(false);
  const [certFormError, setCertFormError] = useState('');

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
            // Poll for extraction completion using setInterval
            let pollCount = 0;
            const interval = setInterval(async () => {
              try {
                const res = await fetch(`https://api-gw-production.up.railway.app/api/career-ark/cv/status/${data.taskId}`, {
                  headers: { Authorization: `Bearer ${token}` },
                });
                const statusData = await res.json();
                setStatus(statusData.status);
                if (
                  statusData.status === 'completed' ||
                  statusData.status === 'completed_with_errors' ||
                  statusData.status === 'failed'
                ) {
                  setPolling(false);
                  clearInterval(interval);
                  if (statusData.status === 'completed') {
                    setUploadProgress(100);
                    setSummary(statusData.extractedDataSummary || null);
                    fetchArcData();
                    toast({ status: 'success', title: 'CV imported and processed!' });
                  } else if (statusData.status === 'completed_with_errors') {
                    setUploadError('CV processed with errors: ' + (statusData.error || 'Unknown error'));
                    setSummary(statusData.extractedDataSummary || null);
                  } else if (statusData.status === 'failed') {
                    setUploadError(statusData.error || 'CV extraction failed.');
                  }
                } else if (pollCount >= 20) { // ~1 minute
                  setPolling(false);
                  setUploadError('CV extraction timed out.');
                  clearInterval(interval);
                }
                pollCount++;
              } catch {
                setPolling(false);
                setUploadError('Failed to check CV extraction status.');
                clearInterval(interval);
              } finally {
                setUploading(false);
              }
            }, 3000); // poll every 3 seconds
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

  // Fetch Arc data and user profile
  const fetchArcData = async () => {
    setArcLoading(true);
    setArcError('');
    setProfileError('');
    try {
      const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
      // Fetch the user's profile
      const userRes = await fetch(`${API_GATEWAY_BASE}/api/user/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!userRes.ok) {
        setProfileError('User profile not found. Please complete your profile before using Career Ark.');
        setProfile(null);
        setArcData(null);
        return;
      }
      const user = await userRes.json();
      setProfile(user);
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

  // Defensive: Block modal opening if profile is missing
  const openAddModal = () => {
    if (!profile || !profile.id) {
      setFormError('Cannot add work experience: user profile is missing.');
      return;
    }
    setForm({ company: '', title: '', start_date: '', end_date: '', description: '' });
    setShowAddModal(true);
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
            {/* Section navigation */}
            <Box mb={8}>
              <HStack spacing={4} justify="center">
                {sectionList.map(sec => (
                  <Button
                    key={sec.key}
                    variant={activeSection === sec.key ? 'solid' : 'ghost'}
                    colorScheme={activeSection === sec.key ? 'blue' : 'gray'}
                    onClick={() => setActiveSection(sec.key)}
                  >
                    {sec.label}
                  </Button>
                ))}
              </HStack>
            </Box>
            {/* Work Experience */}
            <Box mb={6} id="work_experience">
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">Work Experience</Heading>
                <Button leftIcon={<AddIcon />} size="sm" colorScheme="blue" onClick={openAddModal}>Add</Button>
              </Flex>
              {Array.isArray(arcData?.work_experience) && arcData.work_experience.length > 0 ? (
                sortByEndDate(arcData.work_experience).map((item, idx) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Flex justify="space-between" align="center">
                      <Box>
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
                      <HStack>
                        <Button size="xs" leftIcon={<EditIcon />} 
                          onClick={() => { 
                            console.log('Opening edit modal for item:', item);
                            console.log('Item ID:', item.id);
                            setEditItem(item); 
                            setForm({ company: item.company, title: item.title, start_date: item.start_date, end_date: item.end_date, description: Array.isArray(item.details) ? item.details.join('\n') : (item.description || '') }); 
                            setShowEditModal(true); 
                          }}
                          isDisabled={!item.id}
                          title={!item.id ? 'Cannot edit: missing ID' : ''}
                        >Edit</Button>
                        <Button size="xs" leftIcon={<DeleteIcon />} colorScheme="red" onClick={async () => { setFormLoading(true); try { await deleteWorkExperience(item.id); fetchArcData(); toast({ status: 'success', title: 'Deleted' }); } catch (err: any) { toast({ status: 'error', title: err.message || 'Delete failed' }); } finally { setFormLoading(false); } }}>Delete</Button>
                      </HStack>
                    </Flex>
                  </Box>
                ))
              ) : (
                <EmptyState section="work_experience" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Education */}
            <Box mb={6} id="education">
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">Education</Heading>
                <Button leftIcon={<AddIcon />} size="sm" colorScheme="blue" onClick={() => { setEduForm({ institution: '', degree: '', field: '', start_date: '', end_date: '', description: '' }); setShowAddEduModal(true); }}>Add</Button>
              </Flex>
              {Array.isArray(arcData?.education) && arcData.education.length > 0 ? (
                sortByEndDate(arcData.education).map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Flex justify="space-between" align="center">
                      <Box>
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
                      <HStack>
                        <Button size="xs" leftIcon={<EditIcon />} onClick={() => { setEditEduItem(item); setEduForm({ institution: item.institution, degree: item.degree, field: item.field || '', start_date: item.start_date, end_date: item.end_date, description: Array.isArray(item.details) ? item.details.join('\n') : (item.description || '') }); setShowEditEduModal(true); }}>Edit</Button>
                        <Button size="xs" leftIcon={<DeleteIcon />} colorScheme="red" onClick={async () => { setEduFormLoading(true); try { await deleteEducation(item.id); fetchArcData(); toast({ status: 'success', title: 'Deleted' }); } catch (err: any) { toast({ status: 'error', title: err.message || 'Delete failed' }); } finally { setEduFormLoading(false); } }}>Delete</Button>
                      </HStack>
                    </Flex>
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
            <Box mb={6} id="skills">
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">Skills</Heading>
                <HStack>
                  <Input size="sm" placeholder="Add skill" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyDown={async e => { if (e.key === 'Enter' && skillInput.trim()) { setSkillLoading(true); setSkillError(''); try { await addSkill({ name: skillInput.trim() }); setSkillInput(''); fetchArcData(); toast({ status: 'success', title: 'Skill added' }); } catch (err: any) { setSkillError(err.message || 'Add failed'); } finally { setSkillLoading(false); } } }} />
                  <Button size="sm" colorScheme="blue" isLoading={skillLoading} onClick={async () => { if (!skillInput.trim()) return; setSkillLoading(true); setSkillError(''); try { await addSkill({ name: skillInput.trim() }); setSkillInput(''); fetchArcData(); toast({ status: 'success', title: 'Skill added' }); } catch (err: any) { setSkillError(err.message || 'Add failed'); } finally { setSkillLoading(false); } }}>Add</Button>
                </HStack>
              </Flex>
              {skillError && <Alert status="error"><AlertIcon />{skillError}</Alert>}
              {Array.isArray(arcData?.skills) && arcData.skills.length > 0 ? (
                <Box>{arcData.skills.map((s: any, i: number) => <Button key={s.id || i} size="sm" variant="outline" colorScheme="blue" mr={2} mb={2} onClick={async () => { setSkillLoading(true); try { await deleteSkill(s.id); fetchArcData(); toast({ status: 'success', title: 'Skill removed' }); } catch (err: any) { toast({ status: 'error', title: err.message || 'Delete failed' }); } finally { setSkillLoading(false); } }}>{s.name || s.skill || s}</Button>)}</Box>
              ) : (
                <EmptyState section="skills" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Projects */}
            <Box mb={6} id="projects">
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">Projects</Heading>
                <Button leftIcon={<AddIcon />} size="sm" colorScheme="blue" onClick={() => { setProjectForm({ name: '', description: '' }); setShowAddProjectModal(true); }}>Add</Button>
              </Flex>
              {Array.isArray(arcData?.projects) && arcData.projects.length > 0 ? (
                arcData.projects.map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text fontSize="sm" color="gray.600">{item.description}</Text>
                      </Box>
                      <HStack>
                        <Button size="xs" leftIcon={<EditIcon />} onClick={() => { setEditProjectItem(item); setProjectForm({ name: item.name, description: item.description }); setShowEditProjectModal(true); }}>Edit</Button>
                        <Button size="xs" leftIcon={<DeleteIcon />} colorScheme="red" onClick={async () => { setProjectFormLoading(true); try { await deleteProject(item.id); fetchArcData(); toast({ status: 'success', title: 'Deleted' }); } catch (err: any) { toast({ status: 'error', title: err.message || 'Delete failed' }); } finally { setProjectFormLoading(false); } }}>Delete</Button>
                      </HStack>
                    </Flex>
                  </Box>
                ))
              ) : (
                <EmptyState section="projects" onUpload={handleUploadClick} />
              )}
            </Box>
            {/* Certifications */}
            <Box mb={6} id="certifications">
              <Flex justify="space-between" align="center" mb={2}>
                <Heading size="sm">Certifications</Heading>
                <Button leftIcon={<AddIcon />} size="sm" colorScheme="blue" onClick={() => { setCertForm({ name: '', issuer: '', year: '' }); setShowAddCertModal(true); }}>Add</Button>
              </Flex>
              {Array.isArray(arcData?.certifications) && arcData.certifications.length > 0 ? (
                arcData.certifications.map((item: any, idx: number) => (
                  <Box key={item.id || idx} mb={3} p={3} borderRadius="md" bg="gray.50">
                    <Flex justify="space-between" align="center">
                      <Box>
                        <Text fontWeight="bold">{item.name}</Text>
                        <Text fontSize="sm" color="gray.600">{item.issuer} {item.year ? `(${item.year})` : ''}</Text>
                      </Box>
                      <HStack>
                        <Button size="xs" leftIcon={<EditIcon />} onClick={() => { setEditCertItem(item); setCertForm({ name: item.name, issuer: item.issuer, year: item.year }); setShowEditCertModal(true); }}>Edit</Button>
                        <Button size="xs" leftIcon={<DeleteIcon />} colorScheme="red" onClick={async () => { setCertFormLoading(true); try { await deleteCertification(item.id); fetchArcData(); toast({ status: 'success', title: 'Deleted' }); } catch (err: any) { toast({ status: 'error', title: err.message || 'Delete failed' }); } finally { setCertFormLoading(false); } }}>Delete</Button>
                      </HStack>
                    </Flex>
                  </Box>
                ))
              ) : (
                <EmptyState section="certifications" onUpload={handleUploadClick} />
              )}
            </Box>
          </>
        ) : null}
      </Box>
      {/* Add Modal */}
      <Modal isOpen={showAddModal} onClose={() => setShowAddModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Work Experience</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <Input placeholder="Start Date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input placeholder="End Date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              <Textarea placeholder="Description (one per line)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {formError && <Alert status="error"><AlertIcon />{formError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={formLoading} onClick={async () => {
              if (!profile || !profile.id) {
                setFormError('Cannot add work experience: user profile is missing.');
                return;
              }
              setFormLoading(true); setFormError('');
              try {
                await addWorkExperience({ ...form, description: form.description.split('\n').filter(Boolean) });
                setShowAddModal(false); fetchArcData(); toast({ status: 'success', title: 'Added' });
              } catch (err: any) {
                setFormError(err.message || 'Add failed');
              } finally {
                setFormLoading(false);
              }
            }}>Add</Button>
            <Button onClick={() => setShowAddModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Edit Modal */}
      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Work Experience</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Company" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} />
              <Input placeholder="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
              <Input placeholder="Start Date" value={form.start_date} onChange={e => setForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input placeholder="End Date" value={form.end_date} onChange={e => setForm(f => ({ ...f, end_date: e.target.value }))} />
              <Textarea placeholder="Description (one per line)" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              {formError && <Alert status="error"><AlertIcon />{formError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={formLoading} onClick={async () => {
              console.log('Attempting to update work experience. editItem:', editItem);
              console.log('editItem.id:', editItem?.id);
              if (!profile || !profile.id) {
                setFormError('Cannot update work experience: user profile is missing.');
                return;
              }
              if (!editItem || !editItem.id) {
                setFormError('Invalid work experience ID. Please try again.');
                return;
              }
              setFormLoading(true); setFormError('');
              try {
                await updateWorkExperience(editItem.id, { ...form, description: form.description.split('\n').filter(Boolean) });
                setShowEditModal(false); fetchArcData(); toast({ status: 'success', title: 'Updated' });
              } catch (err: any) {
                setFormError(err.message || 'Update failed');
              } finally {
                setFormLoading(false);
              }
            }}>Save</Button>
            <Button onClick={() => setShowEditModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Add Education Modal */}
      <Modal isOpen={showAddEduModal} onClose={() => setShowAddEduModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Education</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Institution" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} />
              <Input placeholder="Degree" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} />
              <Input placeholder="Field" value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} />
              <Input placeholder="Start Date" value={eduForm.start_date} onChange={e => setEduForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input placeholder="End Date" value={eduForm.end_date} onChange={e => setEduForm(f => ({ ...f, end_date: e.target.value }))} />
              <Textarea placeholder="Description (one per line)" value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} />
              {eduFormError && <Alert status="error"><AlertIcon />{eduFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={eduFormLoading} onClick={async () => {
              setEduFormLoading(true); setEduFormError('');
              try {
                await addEducation({ ...eduForm, description: eduForm.description.split('\n').filter(Boolean) });
                setShowAddEduModal(false); fetchArcData(); toast({ status: 'success', title: 'Added' });
              } catch (err: any) {
                setEduFormError(err.message || 'Add failed');
              } finally {
                setEduFormLoading(false);
              }
            }}>Add</Button>
            <Button onClick={() => setShowAddEduModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Edit Education Modal */}
      <Modal isOpen={showEditEduModal} onClose={() => setShowEditEduModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Education</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Institution" value={eduForm.institution} onChange={e => setEduForm(f => ({ ...f, institution: e.target.value }))} />
              <Input placeholder="Degree" value={eduForm.degree} onChange={e => setEduForm(f => ({ ...f, degree: e.target.value }))} />
              <Input placeholder="Field" value={eduForm.field} onChange={e => setEduForm(f => ({ ...f, field: e.target.value }))} />
              <Input placeholder="Start Date" value={eduForm.start_date} onChange={e => setEduForm(f => ({ ...f, start_date: e.target.value }))} />
              <Input placeholder="End Date" value={eduForm.end_date} onChange={e => setEduForm(f => ({ ...f, end_date: e.target.value }))} />
              <Textarea placeholder="Description (one per line)" value={eduForm.description} onChange={e => setEduForm(f => ({ ...f, description: e.target.value }))} />
              {eduFormError && <Alert status="error"><AlertIcon />{eduFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={eduFormLoading} onClick={async () => {
              if (!editEduItem || !editEduItem.id) {
                setEduFormError('Invalid education ID. Please try again.');
                return;
              }
              setEduFormLoading(true); setEduFormError('');
              try {
                await updateEducation(editEduItem.id, { ...eduForm, description: eduForm.description.split('\n').filter(Boolean) });
                setShowEditEduModal(false); fetchArcData(); toast({ status: 'success', title: 'Updated' });
              } catch (err: any) {
                setEduFormError(err.message || 'Update failed');
              } finally {
                setEduFormLoading(false);
              }
            }}>Save</Button>
            <Button onClick={() => setShowEditEduModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Add Training Modal */}
      <Modal isOpen={showAddTrainingModal} onClose={() => setShowAddTrainingModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Training</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Training Name" value={trainingForm.name} onChange={e => setTrainingForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Provider" value={trainingForm.provider} onChange={e => setTrainingForm(f => ({ ...f, provider: e.target.value }))} />
              <Input placeholder="Date" value={trainingForm.date} onChange={e => setTrainingForm(f => ({ ...f, date: e.target.value }))} />
              <Textarea placeholder="Details (one per line)" value={trainingForm.details} onChange={e => setTrainingForm(f => ({ ...f, details: e.target.value }))} />
              {trainingFormError && <Alert status="error"><AlertIcon />{trainingFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={trainingFormLoading} onClick={async () => {
              setTrainingFormLoading(true); setTrainingFormError('');
              try {
                await addTraining({ ...trainingForm, details: trainingForm.details.split('\n').filter(Boolean) });
                setShowAddTrainingModal(false); fetchArcData(); toast({ status: 'success', title: 'Added' });
              } catch (err: any) {
                setTrainingFormError(err.message || 'Add failed');
              } finally {
                setTrainingFormLoading(false);
              }
            }}>Add</Button>
            <Button onClick={() => setShowAddTrainingModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Edit Training Modal */}
      <Modal isOpen={showEditTrainingModal} onClose={() => setShowEditTrainingModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Training</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Training Name" value={trainingForm.name} onChange={e => setTrainingForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Provider" value={trainingForm.provider} onChange={e => setTrainingForm(f => ({ ...f, provider: e.target.value }))} />
              <Input placeholder="Date" value={trainingForm.date} onChange={e => setTrainingForm(f => ({ ...f, date: e.target.value }))} />
              <Textarea placeholder="Details (one per line)" value={trainingForm.details} onChange={e => setTrainingForm(f => ({ ...f, details: e.target.value }))} />
              {trainingFormError && <Alert status="error"><AlertIcon />{trainingFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={trainingFormLoading} onClick={async () => {
              if (!editTrainingItem || !editTrainingItem.id) {
                setTrainingFormError('Invalid training ID. Please try again.');
                return;
              }
              setTrainingFormLoading(true); setTrainingFormError('');
              try {
                await updateTraining(editTrainingItem.id, { ...trainingForm, details: trainingForm.details.split('\n').filter(Boolean) });
                setShowEditTrainingModal(false); fetchArcData(); toast({ status: 'success', title: 'Updated' });
              } catch (err: any) {
                setTrainingFormError(err.message || 'Update failed');
              } finally {
                setTrainingFormLoading(false);
              }
            }}>Save</Button>
            <Button onClick={() => setShowEditTrainingModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Add Project Modal */}
      <Modal isOpen={showAddProjectModal} onClose={() => setShowAddProjectModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} />
              <Textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />
              {projectFormError && <Alert status="error"><AlertIcon />{projectFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={projectFormLoading} onClick={async () => {
              setProjectFormLoading(true); setProjectFormError('');
              try {
                await addProject(projectForm);
                setShowAddProjectModal(false); fetchArcData(); toast({ status: 'success', title: 'Added' });
              } catch (err: any) {
                setProjectFormError(err.message || 'Add failed');
              } finally {
                setProjectFormLoading(false);
              }
            }}>Add</Button>
            <Button onClick={() => setShowAddProjectModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Edit Project Modal */}
      <Modal isOpen={showEditProjectModal} onClose={() => setShowEditProjectModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Project</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Project Name" value={projectForm.name} onChange={e => setProjectForm(f => ({ ...f, name: e.target.value }))} />
              <Textarea placeholder="Description" value={projectForm.description} onChange={e => setProjectForm(f => ({ ...f, description: e.target.value }))} />
              {projectFormError && <Alert status="error"><AlertIcon />{projectFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={projectFormLoading} onClick={async () => {
              if (!editProjectItem || !editProjectItem.id) {
                setProjectFormError('Invalid project ID. Please try again.');
                return;
              }
              setProjectFormLoading(true); setProjectFormError('');
              try {
                await updateProject(editProjectItem.id, projectForm);
                setShowEditProjectModal(false); fetchArcData(); toast({ status: 'success', title: 'Updated' });
              } catch (err: any) {
                setProjectFormError(err.message || 'Update failed');
              } finally {
                setProjectFormLoading(false);
              }
            }}>Save</Button>
            <Button onClick={() => setShowEditProjectModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Add Certification Modal */}
      <Modal isOpen={showAddCertModal} onClose={() => setShowAddCertModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Certification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Certification Name" value={certForm.name} onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Issuer" value={certForm.issuer} onChange={e => setCertForm(f => ({ ...f, issuer: e.target.value }))} />
              <Input placeholder="Year" value={certForm.year} onChange={e => setCertForm(f => ({ ...f, year: e.target.value }))} />
              {certFormError && <Alert status="error"><AlertIcon />{certFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={certFormLoading} onClick={async () => {
              setCertFormLoading(true); setCertFormError('');
              try {
                await addCertification(certForm);
                setShowAddCertModal(false); fetchArcData(); toast({ status: 'success', title: 'Added' });
              } catch (err: any) {
                setCertFormError(err.message || 'Add failed');
              } finally {
                setCertFormLoading(false);
              }
            }}>Add</Button>
            <Button onClick={() => setShowAddCertModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Edit Certification Modal */}
      <Modal isOpen={showEditCertModal} onClose={() => setShowEditCertModal(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Certification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={3} align="stretch">
              <Input placeholder="Certification Name" value={certForm.name} onChange={e => setCertForm(f => ({ ...f, name: e.target.value }))} />
              <Input placeholder="Issuer" value={certForm.issuer} onChange={e => setCertForm(f => ({ ...f, issuer: e.target.value }))} />
              <Input placeholder="Year" value={certForm.year} onChange={e => setCertForm(f => ({ ...f, year: e.target.value }))} />
              {certFormError && <Alert status="error"><AlertIcon />{certFormError}</Alert>}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} isLoading={certFormLoading} onClick={async () => {
              if (!editCertItem || !editCertItem.id) {
                setCertFormError('Invalid certification ID. Please try again.');
                return;
              }
              setCertFormLoading(true); setCertFormError('');
              try {
                await updateCertification(editCertItem.id, certForm);
                setShowEditCertModal(false); fetchArcData(); toast({ status: 'success', title: 'Updated' });
              } catch (err: any) {
                setCertFormError(err.message || 'Update failed');
              } finally {
                setCertFormLoading(false);
              }
            }}>Save</Button>
            <Button onClick={() => setShowEditCertModal(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Show profile error if missing */}
      {profileError && (
        <Alert status="error" mt={4}><AlertIcon />{profileError}</Alert>
      )}
    </Box>
  );
};

export default CareerArkV2; 