import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Divider,
  Alert,
  AlertIcon,
  Input,
  IconButton,
  List,
  ListItem,
  Spinner,
  useColorModeValue,
  HStack,
  Textarea,
} from '@chakra-ui/react';
import { FaFileDownload, FaTrash, FaCopy, FaFilePdf, FaFileWord } from 'react-icons/fa';
import { generateApplicationMaterials, listCVTasks, downloadProcessedCV, deleteCVTask, getArcData } from '../api/careerArkApi';
import { useNavigate } from 'react-router-dom';

const DownloadApplication: React.FC = () => {
  // State for generation
  const [jobAdvert, setJobAdvert] = useState('');
  const [genResult, setGenResult] = useState<any>(null);
  const [genLoading, setGenLoading] = useState(false);
  const [genError, setGenError] = useState('');
  // State for CV tasks
  const [tasks, setTasks] = useState<any[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskError, setTaskError] = useState('');
  const [downloadingTaskId, setDownloadingTaskId] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  // Clipboard
  const [copyMsg, setCopyMsg] = useState('');
  const navigate = useNavigate();

  // Generate application
  const handleGenerate = async () => {
    setGenError(''); setGenResult(null); setGenLoading(true);
    try {
      // Always fetch the latest Arc data before generating
      const arcData = await getArcData();
      const res = await generateApplicationMaterials(jobAdvert, arcData);
      setGenResult(res);
    } catch (err: any) {
      setGenError(err?.error || err?.message || 'Failed to generate application');
    } finally {
      setGenLoading(false);
    }
  };

  // List CV tasks
  const handleListTasks = async () => {
    setTaskError(''); setTasksLoading(true);
    try {
      const res = await listCVTasks();
      setTasks(Array.isArray(res) ? res : (res.tasks || []));
    } catch (err: any) {
      setTaskError(err?.error || err?.message || 'Failed to list CV tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  // Download processed CV
  const handleDownloadCV = async (taskId: string, filename = 'cv.pdf') => {
    setDownloadingTaskId(taskId);
    try {
      const blob = await downloadProcessedCV(taskId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setTaskError('Failed to download CV');
    } finally {
      setDownloadingTaskId(null);
    }
  };

  // Delete CV task
  const handleDeleteTask = async (taskId: string) => {
    setDeletingTaskId(taskId);
    try {
      await deleteCVTask(taskId);
      setTasks(tasks => tasks.filter(t => t.taskId !== taskId));
    } catch (err) {
      setTaskError('Failed to delete task');
    } finally {
      setDeletingTaskId(null);
    }
  };

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopyMsg('Copied!');
    setTimeout(() => setCopyMsg(''), 1500);
  };

  return (
    <Box py={6} maxW="800px" mx="auto">
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" mb={6}>
        <Heading as="h2" size="lg" fontWeight={700} mb={4} textAlign="center">
          Download Application Materials
        </Heading>
        <Divider my={3} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">Generate New Application</Heading>
          <Textarea placeholder="Job Advert" value={jobAdvert} onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setJobAdvert(e.target.value)} minH={100} />
          <Button colorScheme="blue" onClick={handleGenerate} isLoading={genLoading}>
            Generate CV & Cover Letter
          </Button>
          {genError && <Alert status="error"><AlertIcon />{genError}</Alert>}
          {genResult && (
            <Stack spacing={4}>
              <Box bgGradient="linear(to-br, gray.50, blue.50)" p={6} borderRadius="lg" boxShadow="md">
                <HStack justify="space-between" mb={2}>
                  <Heading as="h4" size="md" color="blue.500">Generated CV</Heading>
                  <HStack spacing={2}>
                    <Button leftIcon={<FaFileDownload />} variant="outline" onClick={() => {/* download txt logic */}}>Download TXT</Button>
                    <Button leftIcon={<FaFilePdf />} variant="outline" onClick={() => {/* download pdf logic */}}>Download PDF</Button>
                    <Button leftIcon={<FaFileWord />} variant="outline" onClick={() => {/* download docx logic */}}>Download DOCX</Button>
                    <IconButton aria-label="Copy" icon={<FaCopy />} onClick={() => handleCopy(genResult.cv)} />
                  </HStack>
                </HStack>
                <Divider mb={2} />
                <Box whiteSpace="pre-wrap" fontFamily="serif" fontSize={17} color="gray.800" minH={180}>
                  {genResult.cv}
                </Box>
              </Box>
              <Box bgGradient="linear(to-br, gray.50, yellow.50)" p={6} borderRadius="lg" boxShadow="md">
                <HStack justify="space-between" mb={2}>
                  <Heading as="h4" size="md" color="yellow.600">Generated Cover Letter</Heading>
                  <HStack spacing={2}>
                    <Button leftIcon={<FaFileDownload />} variant="outline" onClick={() => {/* download txt logic */}}>Download TXT</Button>
                    <IconButton aria-label="Copy" icon={<FaCopy />} onClick={() => handleCopy(genResult.coverLetter)} />
                  </HStack>
                </HStack>
                <Divider mb={2} />
                <Box whiteSpace="pre-wrap" fontFamily="serif" fontSize={17} color="gray.800" minH={180}>
                  {genResult.coverLetter}
                </Box>
              </Box>
            </Stack>
          )}
          <Button colorScheme="green" size="lg" mt={2} onClick={() => navigate('/download-cvs')}>
            Go to Download Page
          </Button>
        </Stack>
        <Divider my={4} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">Your CV Tasks</Heading>
          <Button colorScheme="blue" variant="outline" onClick={handleListTasks} isLoading={tasksLoading}>
            List All CV Tasks
          </Button>
          {taskError && <Alert status="error"><AlertIcon />{taskError}</Alert>}
          <List spacing={2}>
            {tasks.map((task) => (
              <ListItem key={task.taskId} display="flex" alignItems="center" justifyContent="space-between" borderBottom="1px solid" borderColor="gray.200" py={2}>
                <Box>
                  <Text fontWeight="bold">Task ID: {task.taskId}</Text>
                  <Text fontSize="sm">Status: {task.status}</Text>
                </Box>
                <HStack spacing={2}>
                  <IconButton aria-label="Download" icon={<FaFileDownload />} onClick={() => handleDownloadCV(task.taskId, `cv_${task.taskId}.pdf`)} isLoading={downloadingTaskId === task.taskId} />
                  <IconButton aria-label="Delete" icon={<FaTrash />} onClick={() => handleDeleteTask(task.taskId)} isLoading={deletingTaskId === task.taskId} />
                </HStack>
              </ListItem>
            ))}
          </List>
        </Stack>
      </Box>
    </Box>
  );
};

export default DownloadApplication; 