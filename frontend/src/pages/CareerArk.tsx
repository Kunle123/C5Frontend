import React, { useRef, useState, useEffect } from 'react';
import {
  Box,
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
} from '@chakra-ui/react';
import { NotificationContext } from '../App';
import {
  uploadCV,
  getCVStatus,
  getArcData,
  updateArcData,
  generateApplicationMaterials,
  deleteCVTask,
  listCVTasks,
  downloadProcessedCV,
} from '../api/careerArkApi';

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
  const { notify } = React.useContext(NotificationContext);

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
      const data = await uploadCV(file);
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
              // Refresh Arc data after successful processing
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

  return (
    <Box py={6} mt={20} maxW="900px" mx="auto">
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" mb={6} maxW={700} mx="auto">
        <Heading as="h2" size="lg" fontWeight={700} mb={4} textAlign="center">
          The Ark: Build Your Career Profile
        </Heading>
        <Text fontSize="lg" textAlign="center" mb={4}>
          Add CVs, skills, and experiences to create a comprehensive career profile for future applications.
        </Text>
        <Stack spacing={4}>
          <Box>
            <Heading as="h3" size="md" mb={2}>Upload a CV</Heading>
            <Button colorScheme="blue" onClick={handleUploadClick} mb={2} isDisabled={uploading || polling}>
              {uploading ? 'Uploading...' : 'Upload CV'}
            </Button>
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleFileChange}
              disabled={uploading || polling}
            />
            <Text fontSize="sm" color="gray.500">
              Supported formats: PDF, DOC, DOCX
            </Text>
            {uploadError && <Alert status="error" mt={2}><AlertIcon />{uploadError}</Alert>}
            {uploading && <Progress size="xs" isIndeterminate mt={2} />}
            {taskId && (
              <Box mt={2}>
                <Text fontSize="sm">Processing status: <b>{status}</b></Text>
                {status !== 'completed' && status !== 'failed' && <Progress size="xs" isIndeterminate mt={1} />}
                {summary && (
                  <Box mt={2}>
                    <Text fontWeight="bold">Extracted Data Summary:</Text>
                    <Text fontSize="sm">Work Experience: {summary.workExperienceCount}</Text>
                    <Text fontSize="sm">Skills Found: {summary.skillsFound}</Text>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Your Arc Data
            </Heading>
            {arcError && <Alert status="error" mt={2}><AlertIcon />{arcError}</Alert>}
            {!arcError && !arcData && <Text fontSize="sm">Loading...</Text>}
            {arcData && (
              <Box mt={2}>
                {arcData.work_experience && arcData.work_experience.length > 0 && (
                  <>
                    <Text fontWeight="bold">Work Experience</Text>
                    <ul>
                      {arcData.work_experience.map((exp: any, idx: number) => (
                        <li key={exp.id || idx}>
                          <b>{exp.title || exp.positionTitle}</b> at {exp.company || exp.companyName} ({exp.start_date || exp.startDate} - {exp.end_date || exp.endDate || 'Present'})
                          <div>{exp.description}</div>
                          {exp.successes && exp.successes.length > 0 && (
                            <ul>
                              {exp.successes.map((s: string, i: number) => <li key={i}>{s}</li>)}
                            </ul>
                          )}
                          {exp.skills && exp.skills.length > 0 && (
                            <div>Skills: {exp.skills.join(', ')}</div>
                          )}
                          {exp.training && exp.training.length > 0 && (
                            <div>Training: {exp.training.join(', ')}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {arcData.education && arcData.education.length > 0 && (
                  <>
                    <Text fontWeight="bold">Education</Text>
                    <ul>
                      {arcData.education.map((edu: any, idx: number) => (
                        <li key={edu.id || idx}>
                          <b>{edu.degree}</b> at {edu.institution} ({edu.year || edu.start_year || ''})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {arcData.skills && arcData.skills.length > 0 && (
                  <>
                    <Text fontWeight="bold">Skills</Text>
                    <ul>
                      {arcData.skills.map((skill: any, idx: number) => (
                        <li key={skill.id || idx}>{typeof skill === 'string' ? skill : skill.skillName || skill.name}</li>
                      ))}
                    </ul>
                  </>
                )}
                {arcData.projects && arcData.projects.length > 0 && (
                  <>
                    <Text fontWeight="bold">Projects</Text>
                    <ul>
                      {arcData.projects.map((proj: any, idx: number) => (
                        <li key={proj.id || idx}>
                          <b>{proj.name}</b>: {proj.description}
                          {proj.tech && proj.tech.length > 0 && (
                            <div>Tech: {proj.tech.join(', ')}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {arcData.certifications && arcData.certifications.length > 0 && (
                  <>
                    <Text fontWeight="bold">Certifications</Text>
                    <ul>
                      {arcData.certifications.map((cert: any, idx: number) => (
                        <li key={cert.id || idx}>
                          <b>{cert.name}</b> ({cert.issuer}{cert.year ? `, ${cert.year}` : ''})
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                {/* Show raw data for debugging if needed */}
                {/* <pre>{JSON.stringify(arcData, null, 2)}</pre> */}
              </Box>
            )}
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Add Skills, Projects, Certifications
            </Heading>
            <Text fontSize="sm" color="gray.500">
              (Coming soon) Add new items to your Arc profile.
            </Text>
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mb={2}>
              CV Processing & Job Analysis Status
            </Heading>
            <Text fontSize="sm" color="gray.500">
              (Coming soon) Track the status of your CV uploads and job analyses.
            </Text>
          </Box>
          <Divider />
          <Box>
            <Heading as="h3" size="md" mb={2}>
              Generate Application Materials
            </Heading>
            <Button colorScheme="blue" isDisabled>
              Generate CV & Cover Letter (Coming soon)
            </Button>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default CareerArk; 