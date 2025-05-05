import React, { useRef, useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Stack, Divider, LinearProgress, Alert } from '@mui/material';
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
    <Box sx={{ py: 6, maxWidth: 900, mx: 'auto' }}>
      <Paper elevation={4} sx={{ p: 5, mb: 6, maxWidth: 700, mx: 'auto' }}>
        <Typography variant="h4" fontWeight={700} gutterBottom align="center">
          The Ark: Build Your Career Profile
        </Typography>
        <Typography variant="subtitle1" align="center" sx={{ mb: 4 }}>
          Add CVs, skills, and experiences to create a comprehensive career profile for future applications.
        </Typography>
        <Stack spacing={4}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Upload a CV
            </Typography>
            <Button variant="contained" color="primary" onClick={handleUploadClick} sx={{ mb: 2 }} disabled={uploading || polling}>
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
            <Typography variant="body2" color="text.secondary">
              Supported formats: PDF, DOC, DOCX
            </Typography>
            {uploadError && <Alert severity="error" sx={{ mt: 2 }}>{uploadError}</Alert>}
            {uploading && <LinearProgress sx={{ mt: 2 }} />}
            {taskId && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2">Processing status: <b>{status}</b></Typography>
                {status !== 'completed' && status !== 'failed' && <LinearProgress sx={{ mt: 1 }} />}
                {summary && (
                  <Box sx={{ mt: 2 }}>
                    <Typography variant="subtitle2">Extracted Data Summary:</Typography>
                    <Typography variant="body2">Work Experience: {summary.workExperienceCount}</Typography>
                    <Typography variant="body2">Skills Found: {summary.skillsFound}</Typography>
                  </Box>
                )}
              </Box>
            )}
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" gutterBottom>
              Your Arc Data
            </Typography>
            {arcError && <Alert severity="error" sx={{ mt: 2 }}>{arcError}</Alert>}
            {!arcError && !arcData && <Typography variant="body2">Loading...</Typography>}
            {arcData && (
              <Box sx={{ mt: 2 }}>
                {arcData.work_experience && arcData.work_experience.length > 0 && (
                  <>
                    <Typography variant="subtitle2">Work Experience</Typography>
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
                    <Typography variant="subtitle2">Education</Typography>
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
                    <Typography variant="subtitle2">Skills</Typography>
                    <ul>
                      {arcData.skills.map((skill: any, idx: number) => (
                        <li key={skill.id || idx}>{typeof skill === 'string' ? skill : skill.skillName || skill.name}</li>
                      ))}
                    </ul>
                  </>
                )}
                {arcData.projects && arcData.projects.length > 0 && (
                  <>
                    <Typography variant="subtitle2">Projects</Typography>
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
                    <Typography variant="subtitle2">Certifications</Typography>
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
            <Typography variant="h6" gutterBottom>
              Add Skills, Projects, Certifications
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Coming soon) Add new items to your Arc profile.
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" gutterBottom>
              CV Processing & Job Analysis Status
            </Typography>
            <Typography variant="body2" color="text.secondary">
              (Coming soon) Track the status of your CV uploads and job analyses.
            </Typography>
          </Box>
          <Divider />
          <Box>
            <Typography variant="h6" gutterBottom>
              Generate Application Materials
            </Typography>
            <Button variant="outlined" color="secondary" disabled>
              Generate CV & Cover Letter (Coming soon)
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>
  );
};

export default CareerArk; 