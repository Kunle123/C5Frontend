import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Stepper, Step, StepLabel, Button, TextField, Paper, Stack, CircularProgress, Alert } from '@mui/material';
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
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const newCV = await uploadCV(file, token);
      setCVs(prev => [...prev, newCV]);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteCV = async (cvId: string) => {
    setDeletingId(cvId);
    setError('');
    try {
      await deleteCV(cvId, token);
      setCVs(prev => prev.filter(cv => cv.id !== cvId));
    } catch (err: any) {
      setError(err.message || 'Delete failed');
    } finally {
      setDeletingId(null);
    }
  };

  const handleDownloadCV = async (cvId: string) => {
    setDownloadingId(cvId);
    setError('');
    try {
      const data = await downloadCV(cvId, token);
      let fileData, fileName;
      if (data && typeof data === 'object' && data.content) {
        fileData = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        fileName = `${data.name || 'cv'}.json`;
      } else if (data instanceof Blob) {
        fileData = data;
        fileName = 'cv_download';
      } else {
        fileData = new Blob([JSON.stringify(data)], { type: 'application/json' });
        fileName = 'cv.json';
      }
      const url = window.URL.createObjectURL(fileData);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Download failed');
    } finally {
      setDownloadingId(null);
    }
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <TextField
            label="Paste Job Description"
            value={jobDescription}
            onChange={e => setJobDescription(e.target.value)}
            multiline
            minRows={4}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 1:
        return (
          <TextField
            label="Contact Details"
            value={contact}
            onChange={e => setContact(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 2:
        return (
          <TextField
            label="Professional Summary"
            value={summary}
            onChange={e => setSummary(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 3:
        return (
          <TextField
            label="Work Experience"
            value={experience}
            onChange={e => setExperience(e.target.value)}
            multiline
            minRows={3}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 4:
        return (
          <TextField
            label="Education"
            value={education}
            onChange={e => setEducation(e.target.value)}
            multiline
            minRows={2}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 5:
        return (
          <TextField
            label="Skills (comma separated)"
            value={skills}
            onChange={e => setSkills(e.target.value)}
            fullWidth
            required
            sx={{ my: 2 }}
          />
        );
      case 6:
        return (
          <Box sx={{ my: 2 }}>
            <Typography variant="h6">Review Your CV</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Job Description:</Typography>
            <Typography>{jobDescription}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Contact:</Typography>
            <Typography>{contact}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Summary:</Typography>
            <Typography>{summary}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Experience:</Typography>
            <Typography>{experience}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Education:</Typography>
            <Typography>{education}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 2 }}>Skills:</Typography>
            <Typography>{skills}</Typography>
            <Typography color="text.secondary" sx={{ mt: 2 }}>
              [Template selection, ATS score, and real-time preview coming soon!]
            </Typography>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ py: 6, maxWidth: 700, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>Create New CV</Typography>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <form onSubmit={e => { e.preventDefault(); activeStep === steps.length - 1 ? handleSave() : handleNext(); }}>
          {renderStepContent(activeStep)}
          <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
            <Button disabled={activeStep === 0 || saving} onClick={handleBack} variant="outlined">
              Back
            </Button>
            {activeStep < steps.length - 1 ? (
              <Button type="submit" variant="contained" color="primary" disabled={saving}>
                Next
              </Button>
            ) : (
              <Button type="submit" variant="contained" color="secondary" disabled={saving}>
                {saving ? 'Saving...' : 'Save CV'}
              </Button>
            )}
          </Stack>
        </form>
      </Paper>

      {/* My CVs Management Section */}
      <Box sx={{ mt: 8 }}>
        <Typography variant="h5" gutterBottom>My CVs</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          sx={{ mb: 2 }}
        >
          {uploading ? <CircularProgress size={18} /> : 'Upload New CV'}
        </Button>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          style={{ display: 'none' }}
          ref={fileInputRef}
          onChange={handleUploadCV}
        />
        {error && <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ my: 2 }}>{success}</Alert>}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>
        ) : (
          <Paper elevation={1} sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f5f5f5' }}>
                  <th style={{ padding: 12, textAlign: 'left' }}>Name</th>
                  <th style={{ padding: 12, textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cvs.map(cv => (
                  <tr key={cv.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: 12 }}>{cv.name}</td>
                    <td style={{ padding: 12 }}>
                      <Stack direction="row" spacing={1}>
                        <Button size="small" variant="outlined" color="error" onClick={() => handleDeleteCV(cv.id)} disabled={deletingId === cv.id}>
                          {deletingId === cv.id ? <CircularProgress size={14} /> : 'Delete'}
                        </Button>
                        <Button size="small" variant="contained" color="primary" onClick={() => handleDownloadCV(cv.id)} disabled={downloadingId === cv.id}>
                          {downloadingId === cv.id ? <CircularProgress size={14} /> : 'Download'}
                        </Button>
                      </Stack>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Paper>
        )}
      </Box>

      {saving && <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(255,255,255,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={60} /></Box>}
      {loading && <Box sx={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', bgcolor: 'rgba(255,255,255,0.5)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CircularProgress size={60} /></Box>}
    </Box>
  );
};

export default CVs; 