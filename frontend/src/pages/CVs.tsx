import React, { useEffect, useState, useRef } from 'react';
import { Box, Heading, Text, Input, Button, Alert, Spinner, Stack, Badge, useColorModeValue, Textarea } from '@chakra-ui/react';
import { listCVs, uploadCV, deleteCV, downloadCV } from '../api';
import { useNavigate } from 'react-router-dom';

const steps = [
  'Job Description',
  'Contact Details',
  'Professional Summary',
  'Work Experience',
  'Education',
  'Skills',
  'Review & Save',
];

const CVs: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [jobDescription, setJobDescription] = useState('');
  const [contact, setContact] = useState('');
  const [summary, setSummary] = useState('');
  const [experience, setExperience] = useState('');
  const [education, setEducation] = useState('');
  const [skills, setSkills] = useState('');
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const token = localStorage.getItem('token') || '';
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const cardBg = useColorModeValue('white', 'gray.800');
  const cardShadow = useColorModeValue('md', 'dark-lg');

  useEffect(() => {
    setLoading(true);
    setError('');
    listCVs(token)
      .then(data => setCVs(data))
      .catch(err => setError(err.message || 'Failed to load CVs'))
      .finally(() => setLoading(false));
  }, [token]);

  const handleNext = () => setActiveStep((prev) => prev + 1);
  const handleBack = () => setActiveStep((prev) => prev - 1);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const res = await fetch('https://api-gw-production.up.railway.app/cvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          jobDescription,
          contact,
          summary,
          experience,
          education,
          skills,
        }),
      });
      if (!res.ok) throw await res.json();
      const newCV = await res.json();
      setCVs(prev => [...prev, newCV]);
      setSuccess('CV saved!');
      setTimeout(() => navigate('/cvs'), 1200);
    } catch (err: any) {
      setError(err.message || 'Failed to save CV');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    setUploading(true);
    setError('');
    setSuccess('');
    try {
      const file = e.target.files[0];
      await uploadCV(file, token);
      setSuccess('CV uploaded successfully!');
      // Refresh list
      const data = await listCVs(token);
      setCVs(data);
    } catch (err: any) {
      setError(err.message || 'Failed to upload CV');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async (id: string) => {
    setDeletingId(id);
    setError('');
    try {
      await deleteCV(id, token);
      setCVs(cvs.filter(cv => cv.id !== id));
    } catch (err: any) {
      setError(err.message || 'Failed to delete CV');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadCV = async (id: string) => {
    setDownloadingId(id);
    setError('');
    try {
      await downloadCV(id, token);
    } catch (err: any) {
      setError(err.message || 'Failed to download CV');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste Job Description"
            required
            mb={4}
            rows={4}
          />
        );
      case 1:
        return (
          <Input
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Contact Details"
            required
            mb={4}
          />
        );
      case 2:
        return (
          <Textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Professional Summary"
            required
            mb={4}
            rows={3}
          />
        );
      case 3:
        return (
          <Textarea
            value={experience}
            onChange={(e) => setExperience(e.target.value)}
            placeholder="Work Experience"
            required
            mb={4}
            rows={3}
          />
        );
      case 4:
        return (
          <Textarea
            value={education}
            onChange={(e) => setEducation(e.target.value)}
            placeholder="Education"
            required
            mb={4}
            rows={2}
          />
        );
      case 5:
        return (
          <Input
            type="text"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder="Skills (comma separated)"
            required
            mb={4}
          />
        );
      case 6:
        return (
          <Box mb={4}>
            <Heading as="h6" size="md" mb={2}>Review Your CV</Heading>
            <Text mb={2}>Job Description:</Text>
            <Text>{jobDescription}</Text>
            <Text mb={2}>Contact:</Text>
            <Text>{contact}</Text>
            <Text mb={2}>Summary:</Text>
            <Text>{summary}</Text>
            <Text mb={2}>Experience:</Text>
            <Text>{experience}</Text>
            <Text mb={2}>Education:</Text>
            <Text>{education}</Text>
            <Text mb={2}>Skills:</Text>
            <Text>{skills}</Text>
            <Text color="gray.500" mt={2}>
              [Template selection, ATS score, and real-time preview coming soon!]
            </Text>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box py={8} maxW="700px" mx="auto">
      <Badge colorScheme="green" mb={4} fontSize="lg">Chakra UI: Migrated</Badge>
      <Heading as="h2" size="xl" mb={6} textAlign="center">My CVs</Heading>
      <Box mb={6}>
        <Button
          colorScheme="brand"
          onClick={() => fileInputRef.current?.click()}
          isLoading={uploading}
          mb={2}
        >
          Upload New CV
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleUploadCV}
        />
        {error && <Alert status="error" mt={2}>{error}</Alert>}
        {success && <Alert status="success" mt={2}>{success}</Alert>}
      </Box>
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}><Spinner /></Box>
      ) : (
        <Stack spacing={4}>
          {cvs.length === 0 ? (
            <Text color="gray.500">No CVs found. Upload your first CV!</Text>
          ) : (
            cvs.map(cv => (
              <Box key={cv.id} bg={cardBg} boxShadow={cardShadow} p={4} borderRadius="md" display="flex" alignItems="center" justifyContent="space-between">
                <Text fontWeight={600}>{cv.name}</Text>
                <Box>
                  <Button size="sm" colorScheme="blue" mr={2} isLoading={downloadingId === cv.id} onClick={() => handleDownloadCV(cv.id)}>
                    Download
                  </Button>
                  <Button size="sm" colorScheme="red" isLoading={deletingId === cv.id} onClick={() => handleDeleteCV(cv.id)}>
                    Delete
                  </Button>
                </Box>
              </Box>
            ))
          )}
        </Stack>
      )}
    </Box>
  );
};

export default CVs; 