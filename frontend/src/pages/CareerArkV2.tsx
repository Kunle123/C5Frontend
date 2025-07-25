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
import { addWorkExperience, updateWorkExperience, deleteWorkExperience } from '../api/careerArkApi';

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
                <Button leftIcon={<AddIcon />} size="sm" colorScheme="blue" onClick={() => { setForm({ company: '', title: '', start_date: '', end_date: '', description: '' }); setShowAddModal(true); }}>Add</Button>
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
                        <Button size="xs" leftIcon={<EditIcon />} onClick={() => { setEditItem(item); setForm({ company: item.company, title: item.title, start_date: item.start_date, end_date: item.end_date, description: Array.isArray(item.details) ? item.details.join('\n') : (item.description || '') }); setShowEditModal(true); }}>Edit</Button>
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
              if (!editItem) return;
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
    </Box>
  );
};

export default CareerArkV2; 