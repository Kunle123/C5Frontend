import React, { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Button,
  Input,
  Stack,
  Divider,
  Alert,
  AlertIcon,
  useColorModeValue,
  Spinner,
  Textarea,
} from '@chakra-ui/react';
import { login, register } from '../api';
import { uploadCV, getArcData, generateApplicationMaterials } from '../api/careerArkApi';

const TestAppJourneys: React.FC = () => {
  // Auth
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginResult, setLoginResult] = useState<any>(null);
  const [signupResult, setSignupResult] = useState<any>(null);
  // CV Upload
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [cvUploadResult, setCvUploadResult] = useState<any>(null);
  // Arc Data
  const [arcData, setArcData] = useState<any>(null);
  // Generate Application
  const [jobAdvert, setJobAdvert] = useState('');
  const [genResult, setGenResult] = useState<any>(null);
  // General
  const [error, setError] = useState('');

  // Auth handlers
  const handleSignup = async () => {
    setError(''); setSignupResult(null);
    try {
      const res = await register({ email, password });
      setSignupResult(res);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Signup failed');
    }
  };
  const handleLogin = async () => {
    setError(''); setLoginResult(null);
    try {
      const res = await login({ email, password });
      localStorage.setItem('token', res.token);
      setLoginResult(res);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Login failed');
    }
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoginResult(null);
    setSignupResult(null);
    setArcData(null);
    setCvUploadResult(null);
    setGenResult(null);
    setError('');
  };

  // CV Upload
  const handleUploadCV = async () => {
    setError(''); setCvUploadResult(null);
    if (!cvFile) { setError('No file selected'); return; }
    try {
      const res = await uploadCV(cvFile);
      setCvUploadResult(res);
    } catch (err: any) {
      setError(err?.error || err?.message || 'CV upload failed');
    }
  };

  // Arc Data
  const handleFetchArcData = async () => {
    setError(''); setArcData(null);
    try {
      const res = await getArcData();
      setArcData(res);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to fetch Arc data');
    }
  };

  // Generate Application
  const handleGenerate = async () => {
    setError(''); setGenResult(null);
    try {
      const arc = arcData || await getArcData();
      const res = await generateApplicationMaterials(jobAdvert, arc);
      setGenResult(res);
    } catch (err: any) {
      setError(err?.error || err?.message || 'Failed to generate application');
    }
  };

  return (
    <Box py={6} maxW="700px" mx="auto">
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" mb={6}>
        <Heading as="h2" size="lg" fontWeight={700} mb={4} textAlign="center">
          Test Application Journeys
        </Heading>
        <Divider my={3} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">1. Signup / Login</Heading>
          <Input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <Input placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
          <Stack direction="row" spacing={2}>
            <Button colorScheme="blue" onClick={handleSignup}>Sign Up</Button>
            <Button colorScheme="blue" variant="outline" onClick={handleLogin}>Log In</Button>
            <Button colorScheme="red" variant="outline" onClick={handleLogout}>Log Out</Button>
          </Stack>
          {signupResult && <Alert status="success"><AlertIcon />Signup: {JSON.stringify(signupResult)}</Alert>}
          {loginResult && <Alert status="success"><AlertIcon />Login: {JSON.stringify(loginResult)}</Alert>}
        </Stack>
        <Divider my={3} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">2. Upload CV</Heading>
          <Button as="label" colorScheme="blue" variant="outline">
            Select CV File
            <input type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setCvFile(e.target.files?.[0] || null)} />
          </Button>
          {cvFile && <Text>Selected: {cvFile.name}</Text>}
          <Button colorScheme="blue" onClick={handleUploadCV} isDisabled={!cvFile}>Upload CV</Button>
          {cvUploadResult && <Alert status="success"><AlertIcon />Upload: {JSON.stringify(cvUploadResult)}</Alert>}
        </Stack>
        <Divider my={3} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">3. Fetch Arc Data</Heading>
          <Button colorScheme="blue" onClick={handleFetchArcData}>Fetch Arc Data</Button>
          {arcData && <Alert status="info" whiteSpace="pre-wrap" maxH={200} overflowY="auto"><AlertIcon />{JSON.stringify(arcData, null, 2)}</Alert>}
        </Stack>
        <Divider my={3} />
        <Stack spacing={3}>
          <Heading as="h3" size="md">4. Generate Application Materials</Heading>
          <Textarea placeholder="Job Advert" value={jobAdvert} onChange={e => setJobAdvert(e.target.value)} minH={100} />
          <Button colorScheme="blue" onClick={handleGenerate}>Generate CV & Cover Letter</Button>
          {genResult && <Alert status="success" whiteSpace="pre-wrap" maxH={200} overflowY="auto"><AlertIcon />{JSON.stringify(genResult, null, 2)}</Alert>}
        </Stack>
        {error && <Alert status="error" mt={3}><AlertIcon />{error}</Alert>}
      </Box>
    </Box>
  );
};

export default TestAppJourneys; 