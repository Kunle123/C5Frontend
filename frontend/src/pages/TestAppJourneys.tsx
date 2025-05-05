import React, { useState } from 'react';
import { Box, Button, Typography, Paper, TextField, Stack, Divider, Alert } from '@mui/material';
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
    <Box sx={{ py: 6, maxWidth: 700, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 5, mb: 6 }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          Test Application Journeys
        </Typography>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          <Typography variant="h6">1. Signup / Login</Typography>
          <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} fullWidth />
          <TextField label="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} fullWidth />
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleSignup}>Sign Up</Button>
            <Button variant="contained" color="primary" onClick={handleLogin}>Log In</Button>
            <Button variant="outlined" color="secondary" onClick={handleLogout}>Log Out</Button>
          </Stack>
          {signupResult && <Alert severity="success">Signup: {JSON.stringify(signupResult)}</Alert>}
          {loginResult && <Alert severity="success">Login: {JSON.stringify(loginResult)}</Alert>}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          <Typography variant="h6">2. Upload CV</Typography>
          <Button variant="outlined" component="label">
            Select CV File
            <input type="file" accept=".pdf,.doc,.docx" hidden onChange={e => setCvFile(e.target.files?.[0] || null)} />
          </Button>
          {cvFile && <Typography>Selected: {cvFile.name}</Typography>}
          <Button variant="contained" onClick={handleUploadCV} disabled={!cvFile}>Upload CV</Button>
          {cvUploadResult && <Alert severity="success">Upload: {JSON.stringify(cvUploadResult)}</Alert>}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          <Typography variant="h6">3. Fetch Arc Data</Typography>
          <Button variant="contained" onClick={handleFetchArcData}>Fetch Arc Data</Button>
          {arcData && <Alert severity="info" sx={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(arcData, null, 2)}</Alert>}
        </Stack>
        <Divider sx={{ my: 3 }} />
        <Stack spacing={3}>
          <Typography variant="h6">4. Generate Application Materials</Typography>
          <TextField label="Job Advert" value={jobAdvert} onChange={e => setJobAdvert(e.target.value)} fullWidth multiline minRows={3} />
          <Button variant="contained" onClick={handleGenerate}>Generate CV & Cover Letter</Button>
          {genResult && <Alert severity="success" sx={{ whiteSpace: 'pre-wrap', maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(genResult, null, 2)}</Alert>}
        </Stack>
        {error && <Alert severity="error" sx={{ mt: 3 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default TestAppJourneys; 