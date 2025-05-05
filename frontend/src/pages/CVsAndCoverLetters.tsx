import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Paper, Stepper, Step, StepLabel, TextField, Stack, Button, CircularProgress, Alert, Chip, MenuItem } from '@mui/material';
import { listCVs, uploadCV, deleteCV, downloadCV, getCurrentUser } from '../api';
import { optimizeCV as aiOptimizeCV, extractKeywords, analyzeCV as aiAnalyzeCV } from '../api/aiApi';
import { useNavigate } from 'react-router-dom';
import { getArcData, generateApplicationMaterials } from '../api/careerArkApi';

const steps = [
  'Paste Job Description',
  'Review Arc Data',
  'Analyse & Optimise',
];

type KeywordAnalysisEntry = { keyword: string, status: 'green' | 'amber' | 'red' };

const Application: React.FC = () => {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState<any>(null);
  const token = localStorage.getItem('token') || '';
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Multi-step state
  const [step, setStep] = useState(0);
  const [jobDesc, setJobDesc] = useState('');
  const [cvContent, setCVContent] = useState('');
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);
  const [keywords, setKeywords] = useState<string[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [analyzingSections, setAnalyzingSections] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [optimizedCV, setOptimizedCV] = useState('');
  const [optimizedCL, setOptimizedCL] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const [arcData, setArcData] = useState<any>(null);
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysisEntry[]>([]);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    listCVs(token)
      .then(data => setCVs(data))
      .catch(err => setError(err.message || 'Failed to load CVs'))
      .finally(() => setLoading(false));
    getCurrentUser(token).then(setUser).catch(() => setUser(null));
  }, [token]);

  const handleUploadCV = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    setUploadSuccess('');
    setLoading(true);
    try {
      await uploadCV(file, token);
      // Refresh the CV list from the backend
      const updatedCVs = await listCVs(token);
      setCVs(updatedCVs);
      setUploadSuccess('CV uploaded successfully!');
    } catch (err: any) {
      setUploadError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
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
    setDownloading(true);
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
      setDownloading(false);
    }
  };
  const handleExtractKeywords = async () => {
    setExtracting(true);
    setError('');
    try {
      const result = await extractKeywords(jobDesc);
      setKeywords(result.keywords || []);
    } catch (err: any) {
      setError(err.message || 'Keyword extraction failed');
    } finally {
      setExtracting(false);
    }
  };
  const handleAnalyze = async () => {
    setError('');
    if (!jobDesc || !cvContent) {
      setError('Please paste a job description and select a base CV.');
      return;
    }
    setLoading(true);
    try {
      const result = await aiAnalyzeCV({ cv_id: cvContent });
      setMissingKeywords(result.missingKeywords || []);
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };
  const handleAddKeyword = (keyword: string) => {
    setCVContent(prev => prev + ' ' + keyword);
    setMissingKeywords(prev => prev.filter(k => k !== keyword));
  };
  const handleAddAll = () => {
    setCVContent(prev => prev + ' ' + missingKeywords.join(' '));
    setMissingKeywords([]);
  };
  const handleAnalyzeSections = async () => {
    setAnalyzingSections(true);
    setError('');
    try {
      const result = await aiAnalyzeCV({ cv_id: cvContent });
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || 'Section analysis failed');
    } finally {
      setAnalyzingSections(false);
    }
  };
  const handleOptimize = async () => {
    setOptimizing(true);
    setError('');
    try {
      const targets = [
        {
          section: 'full',
          content: cvContent,
          target_job: jobDesc,
          tone: 'professional',
          keywords: missingKeywords,
        },
      ];
      const result = await aiOptimizeCV({ cv_id: cvContent, targets });
      const optimizedSection = result.optimized_sections?.[0];
      setOptimizedCV(optimizedSection?.optimized_content || '');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'AI optimization failed');
    } finally {
      setOptimizing(false);
    }
  };
  const handleNextFromJobDesc = async () => {
    setError('');
    if (!jobDesc) {
      setError('Please paste a job description.');
      return;
    }
    const token = localStorage.getItem('token') || '';
    if (!token) {
      setError('You must be logged in to extract keywords. Please log in again.');
      return;
    }
    setLoading(true);
    try {
      // 1. Extract keywords from job description
      let kwResult;
      try {
        kwResult = await extractKeywords(jobDesc, token);
      } catch (err: any) {
        setError('Sorry, we could not extract keywords from your job description. Please check your input or try again later.');
        console.error('Keyword extraction failed:', err);
        setLoading(false);
        return;
      }
      const keywords = (kwResult.keywords || []).slice(0, 20); // Limit to 20 keywords for user-friendliness
      // 2. Fetch Arc data
      let data;
      try {
        data = await getArcData();
      } catch (err: any) {
        setError('Sorry, we could not load your Ark profile. Please try again later.');
        console.error('Arc data fetch failed:', err);
        setLoading(false);
        return;
      }
      setArcData(data);
      // 3. Analyze keywords against Arc data
      const arcText = JSON.stringify(data).toLowerCase();
      const now = new Date();
      const keywordStatuses = keywords.map((kw: string) => {
        const kwLower = kw.toLowerCase();
        let green = false, amber = false;
        if (data.work_experience) {
          for (const exp of data.work_experience) {
            const end = exp.end_date || exp.endDate || '';
            const endYear = end ? parseInt((end + '').slice(0, 4)) : now.getFullYear();
            if ((exp.description && exp.description.toLowerCase().includes(kwLower)) ||
                (exp.title && exp.title.toLowerCase().includes(kwLower)) ||
                (exp.skills && exp.skills.join(' ').toLowerCase().includes(kwLower))) {
              if (now.getFullYear() - endYear <= 5) green = true;
              else amber = true;
            }
          }
        }
        if (!green && data.skills && data.skills.length > 0) {
          for (const skill of data.skills) {
            if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
                (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
              green = true;
            }
          }
        }
        if (!green && !amber && arcText.includes(kwLower)) amber = true;
        return { keyword: kw, status: green ? 'green' : amber ? 'amber' : 'red' };
      });
      setKeywordAnalysis(keywordStatuses);
      // 4. Calculate match score
      const greenCount = keywordStatuses.filter((k: KeywordAnalysisEntry) => k.status === 'green').length;
      const match = keywords.length > 0 ? Math.round((greenCount / keywords.length) * 100) : null;
      setMatchScore(match);
      setStep(1);
    } catch (err: any) {
      setError('Sorry, something went wrong. Please try again or contact support.');
      console.error('Unexpected error in job description analysis:', err);
    } finally {
      setLoading(false);
    }
  };
  const handleAnalyzeAndOptimize = async () => {
    setOptimizing(true);
    setError('');
    try {
      const result = await generateApplicationMaterials(jobDesc, arcData);
      setOptimizedCV(result.cv || '');
      setOptimizedCL(result.coverLetter || '');
      setStep(3);
    } catch (err: any) {
      setError(err.message || 'AI optimization failed');
    } finally {
      setOptimizing(false);
    }
  };

  return (
    <Box sx={{ py: 6, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 4 }}>
        CVs & Cover Letters
      </Typography>
      <Paper elevation={4} sx={{ p: 4, mb: 6, maxWidth: 700, mx: 'auto' }}>
        <Stepper activeStep={step} alternativeLabel sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {step === 0 && (
          <Stack spacing={3}>
            <Typography variant="h5" gutterBottom>
              Paste a job description to get your optimised CV and cover letter.
            </Typography>
            <TextField
              label="Paste Job Description"
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              multiline
              minRows={3}
              fullWidth
              required
            />
            <Button variant="contained" color="primary" onClick={handleNextFromJobDesc} disabled={!jobDesc}>
              Next: Review Arc Data
            </Button>
          </Stack>
        )}
        {step === 1 && (
          arcData && Object.keys(arcData).length > 0 ? (
            <Stack spacing={3}>
              <Typography variant="h6">Your Arc Data (Profile)</Typography>
              <Paper sx={{ p: 2, bgcolor: 'grey.50', maxHeight: 300, overflow: 'auto' }}>
                <pre style={{ fontSize: 14 }}>{JSON.stringify(arcData, null, 2)}</pre>
              </Paper>
              {keywordAnalysis.length > 0 && (
                <Box>
                  <Typography variant="subtitle1">Keyword Match Analysis</Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    {keywordAnalysis.map(function(k: KeywordAnalysisEntry, idx: number) {
                      return (
                        <span key={k.keyword + idx} style={{
                          background: k.status === 'green' ? '#c8e6c9' : k.status === 'amber' ? '#fff9c4' : '#ffcdd2',
                          color: k.status === 'red' ? '#b71c1c' : k.status === 'amber' ? '#ff6f00' : '#256029',
                          borderRadius: 8,
                          padding: '4px 10px',
                          fontWeight: 600,
                          fontSize: 15,
                          border: '1px solid #eee',
                          display: 'inline-block',
                        }}>{k.keyword}</span>
                      );
                    })}
                  </Box>
                  {matchScore !== null && (
                    <Typography variant="h6" sx={{ color: matchScore >= 80 ? 'green' : matchScore >= 50 ? 'orange' : 'red' }}>
                      Match Score: {matchScore}%
                    </Typography>
                  )}
                </Box>
              )}
              {Object.values(arcData).every(v => v == null || (Array.isArray(v) && v.length === 0)) && (
                <Alert severity="warning">
                  Your Ark profile is empty. Please upload a CV or add data in The Ark before proceeding.
                </Alert>
              )}
              <Button variant="contained" color="primary" onClick={() => setStep(2)}>
                Next: Analyse & Optimise
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => window.open('/career-ark', '_blank')}>
                Edit in The Ark
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Alert severity="warning">
                You need to create your Arc profile before generating applications.<br />
                Please go to The Ark and complete your profile.
              </Alert>
              <Button variant="contained" color="primary" onClick={() => window.open('/career-ark', '_blank')}>
                Go to The Ark
              </Button>
              <Button variant="outlined" color="secondary" onClick={() => setStep(0)}>
                Back
              </Button>
            </Stack>
          )
        )}
        {step === 2 && arcData && (
          <Stack spacing={3}>
            <Typography variant="subtitle1">Ready to generate your optimised CV and cover letter using your Arc profile and the job description?</Typography>
            <Button variant="contained" color="secondary" onClick={handleAnalyzeAndOptimize} disabled={optimizing}>
              {optimizing ? <CircularProgress size={24} /> : 'Optimise with AI'}
            </Button>
          </Stack>
        )}
        {step === 3 && (
          <Stack spacing={3}>
            <Alert severity="success">Optimized CV and cover letter generated!</Alert>
            <Typography variant="h6">Optimized CV</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{optimizedCV}</Typography>
            </Paper>
            <Typography variant="h6">Optimized Cover Letter</Typography>
            <Paper sx={{ p: 2, bgcolor: 'grey.50' }}>
              <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap' }}>{optimizedCL}</Typography>
            </Paper>
            <Button variant="text" sx={{ mt: 2 }} onClick={() => { setStep(0); setJobDesc(''); setArcData(null); setOptimizedCV(''); setOptimizedCL(''); }}>Optimise for Another Job</Button>
          </Stack>
        )}
        {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      </Paper>
    </Box>
  );
};

export default Application; 