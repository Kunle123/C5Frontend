import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Stack,
  Button,
  Input,
  Textarea,
  Spinner,
  Alert,
  AlertIcon,
  Divider,
  Badge,
  useColorModeValue,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useBreakpointValue,
} from '@chakra-ui/react';
import { listCVs, uploadCV, deleteCV, downloadCV, getCurrentUser } from '../api';
import { optimizeCV as aiOptimizeCV, extractKeywords, analyzeCV as aiAnalyzeCV } from '../api/aiApi';
import { useNavigate } from 'react-router-dom';
import { getArcData, generateApplicationMaterials } from '../api/careerArkApi';
import { FiKey } from 'react-icons/fi';

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
  const [arcData, setArcData] = useState<any>({});
  const [keywordAnalysis, setKeywordAnalysis] = useState<KeywordAnalysisEntry[]>([]);
  const [matchScore, setMatchScore] = useState<number | null>(null);

  const { isOpen, onOpen, onClose } = useDisclosure();

  // Responsive placement for recall button
  const recallBtnBottom = useBreakpointValue({ base: '80px', md: '40px' });
  const recallBtnRight = useBreakpointValue({ base: '16px', md: '40px' });
  const modalSize = useBreakpointValue({ base: 'xs', md: 'md' });

  // Add a ref to prevent double re-analysis
  const hasReanalyzedRef = useRef(false);

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
      // Patch: handle both array and object return from extractKeywords
      const keywords = (Array.isArray(kwResult) ? kwResult : kwResult.keywords || []).slice(0, 20); // Limit to 20 keywords for user-friendliness
      // 2. Fetch Arc data
      let data;
      try {
        data = await getArcData();
      } catch (err: any) {
        setError('Sorry, we could not load your Career Ark profile. Please try again later.');
        console.error('Arc data fetch failed:', err);
        setLoading(false);
        return;
      }
      setArcData(data);
      // 3. Analyze keywords against ALL Arc data sections
      const arcText = JSON.stringify(data).toLowerCase();
      const now = new Date();
      const keywordStatuses = keywords.map((kw: string) => {
        const kwLower = kw.toLowerCase();
        let green = false, amber = false;
        // Work Experience
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
        // Skills
        if (!green && data.skills && data.skills.length > 0) {
          for (const skill of data.skills) {
            if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
                (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
              green = true;
            }
          }
        }
        // Education, Projects, Certifications, Training, etc.
        if (!green && !amber && arcText.includes(kwLower)) amber = true;
        let status: 'green' | 'amber' | 'red' = 'red';
        if (green) status = 'green';
        else if (amber) status = 'amber';
        return { keyword: kw, status };
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

  // Show modal automatically if there are missing keywords and user hasn't dismissed it
  useEffect(() => {
    if (
      step === 1 &&
      Array.isArray(keywordAnalysis) &&
      keywordAnalysis.some(k => k.status === 'red') &&
      !isOpen
    ) {
      onOpen();
    }
    // eslint-disable-next-line
  }, [step, keywordAnalysis]);

  // Auto re-analyze if Ark was updated in Career Ark page
  useEffect(() => {
    if (step === 1 && localStorage.getItem('ark-updated') === 'true' && !hasReanalyzedRef.current) {
      // Only re-analyze once per update
      hasReanalyzedRef.current = true;
      localStorage.removeItem('ark-updated');
      // Re-run the keyword analysis logic
      (async () => {
        setLoading(true);
        setError('');
        try {
          // 1. Use existing keywords and jobDesc
          // 2. Fetch latest Ark data
          const data = await getArcData();
          setArcData(data);
          // 3. Analyze keywords against ALL Arc data sections
          const arcText = JSON.stringify(data).toLowerCase();
          const now = new Date();
          const keywordStatuses = keywords.map((kw: string) => {
            const kwLower = kw.toLowerCase();
            let green = false, amber = false;
            // Work Experience
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
            // Skills
            if (!green && data.skills && data.skills.length > 0) {
              for (const skill of data.skills) {
                if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
                    (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
                  green = true;
                }
              }
            }
            // Education, Projects, Certifications, Training, etc.
            if (!green && !amber && arcText.includes(kwLower)) amber = true;
            let status: 'green' | 'amber' | 'red' = 'red';
            if (green) status = 'green';
            else if (amber) status = 'amber';
            return { keyword: kw, status };
          });
          setKeywordAnalysis(keywordStatuses);
          // 4. Calculate match score
          const greenCount = keywordStatuses.filter((k: KeywordAnalysisEntry) => k.status === 'green').length;
          const match = keywords.length > 0 ? Math.round((greenCount / keywords.length) * 100) : null;
          setMatchScore(match);
        } catch (err: any) {
          setError('Sorry, something went wrong. Please try again or contact support.');
        } finally {
          setLoading(false);
        }
      })();
    }
    // Reset ref if user goes back to step 0
    if (step === 0) hasReanalyzedRef.current = false;
    // eslint-disable-next-line
  }, [step]);

  return (
    <Box py={6} maxW="900px" mx="auto">
      <Heading as="h2" size="lg" fontWeight={700} textAlign="center" mb={4}>
        CVs & Cover Letters
      </Heading>
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" mb={6} maxW={700} mx="auto">
        <HStack justify="center" mb={6} spacing={4}>
          {steps.map((label, idx) => (
            <VStack key={label} spacing={1} align="center">
              <Box
                w={8}
                h={8}
                borderRadius="full"
                bg={step === idx ? 'blue.500' : 'gray.300'}
                color={step === idx ? 'white' : 'gray.700'}
                display="flex"
                alignItems="center"
                justifyContent="center"
                fontWeight="bold"
                fontSize="lg"
              >
                {idx + 1}
              </Box>
              <Text fontSize="sm" color={step === idx ? 'blue.500' : 'gray.500'}>{label}</Text>
            </VStack>
          ))}
        </HStack>
        {step === 0 && (
          <Stack spacing={3}>
            <Heading as="h3" size="md">Paste a job description to get your optimised CV and cover letter.</Heading>
            <Textarea
              placeholder="Paste Job Description"
              value={jobDesc}
              onChange={e => setJobDesc(e.target.value)}
              minH={100}
              required
            />
            <Button colorScheme="blue" onClick={handleNextFromJobDesc} isDisabled={!jobDesc || loading || extracting}>
              {(loading || extracting) && <Spinner size="sm" mr={2} />}Next: Review Arc Data
            </Button>
          </Stack>
        )}
        {step === 1 && (
          !!arcData && typeof arcData === 'object' && Object.keys(arcData).length > 0 ? (
            <Stack spacing={3}>
              <Heading as="h3" size="md">Keyword Match Analysis</Heading>
              {Array.isArray(keywordAnalysis) && keywordAnalysis.length > 0 && (
                <Box>
                  <Text fontWeight="semibold" mb={1}>Keyword Match Analysis</Text>
                  <HStack wrap="wrap" gap={2} mb={2}>
                    {keywordAnalysis.map((k, idx) => (
                      <Badge
                        key={k.keyword + idx}
                        colorScheme={k.status === 'green' ? 'green' : k.status === 'amber' ? 'yellow' : 'red'}
                        px={3}
                        py={1}
                        borderRadius="md"
                        fontSize="md"
                        fontWeight={600}
                      >
                        {k.keyword}
                      </Badge>
                    ))}
                  </HStack>
                  {matchScore !== null && (
                    <Heading as="h4" size="sm" color={matchScore >= 80 ? 'green.500' : matchScore >= 50 ? 'orange.500' : 'red.500'}>
                      Match Score: {matchScore}%
                    </Heading>
                  )}
                </Box>
              )}
              {Object.values(arcData).every(v => v == null || (Array.isArray(v) && v.length === 0)) && (
                <Alert status="warning">
                  <AlertIcon />Your Career Ark profile is empty. Please upload a CV or add data in Career Ark before proceeding.
                </Alert>
              )}
              <Button variant="outline" colorScheme="gray" onClick={() => {
                if (Array.isArray(keywordAnalysis)) {
                  const missing = keywordAnalysis.filter(k => k.status === 'red').map(k => k.keyword);
                  localStorage.setItem('ark-missing-keywords', JSON.stringify(missing));
                }
                navigate('/career-ark');
              }}>
                Edit Ark Data
              </Button>
              <Button colorScheme="blue" onClick={async () => {
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
              }} isLoading={optimizing}>
                Generate CV & Cover Letter
              </Button>
            </Stack>
          ) : (
            <Stack spacing={3}>
              <Alert status="warning">
                <AlertIcon />You need to create your Career Ark profile before generating applications.<br />
                Please go to Career Ark and complete your profile.
              </Alert>
              <Button colorScheme="blue" onClick={() => window.open('/career-ark', '_blank')}>
                Go to Career Ark
              </Button>
              <Button variant="outline" colorScheme="gray" onClick={() => setStep(0)}>
                Back
              </Button>
            </Stack>
          )
        )}
        {step === 2 && arcData && (
          <Stack spacing={3}>
            <Text fontWeight="semibold">Ready to generate your optimised CV and cover letter using your Career Ark profile and the job description?</Text>
          </Stack>
        )}
        {step === 3 && (
          <Stack spacing={3}>
            <Alert status="success"><AlertIcon />Optimized CV and cover letter generated!</Alert>
            <Heading as="h4" size="md">Optimized CV</Heading>
            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <Text whiteSpace="pre-wrap">{optimizedCV}</Text>
            </Box>
            <Heading as="h4" size="md">Optimized Cover Letter</Heading>
            <Box p={4} bg={useColorModeValue('gray.50', 'gray.700')} borderRadius="md">
              <Text whiteSpace="pre-wrap">{optimizedCL}</Text>
            </Box>
            <Button variant="outline" colorScheme="gray" onClick={() => {
              if (Array.isArray(keywordAnalysis)) {
                const missing = keywordAnalysis.filter(k => k.status === 'red').map(k => k.keyword);
                localStorage.setItem('ark-missing-keywords', JSON.stringify(missing));
              }
              navigate('/career-ark');
            }}>
              Edit Ark Data
            </Button>
            <Button colorScheme="green" size="lg" mt={2} onClick={() => navigate('/download-cvs')}>
              Go to Download CVs Page
            </Button>
          </Stack>
        )}
        {error && <Alert status="error" mt={2}><AlertIcon />{error}</Alert>}
      </Box>
    </Box>
  );
};

export default Application; 