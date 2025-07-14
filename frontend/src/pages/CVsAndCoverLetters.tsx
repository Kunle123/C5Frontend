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
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  IconButton,
  useBreakpointValue,
  Tabs,
  TabList,
  TabPanels,
  TabPanel,
  Tab,
} from '@chakra-ui/react';
import { listCVs, uploadCV, deleteCV, downloadCV, getCurrentUser } from '../api';
import { optimizeCV as aiOptimizeCV, extractKeywords, analyzeCV as aiAnalyzeCV } from '../api/aiApi';
import { useNavigate } from 'react-router-dom';
import { getArcData, generateApplicationMaterials, saveGeneratedCV } from '../api/careerArkApi';
import { FiKey } from 'react-icons/fi';

const steps = [
  'Paste Job Description',
  'Review Arc Data',
  'Simple review CV and cover letter',
];

type KeywordAnalysisEntry = { keyword: string, status: 'green' | 'amber' | 'red' };

const Application: React.FC = () => {
  const [cvs, setCVs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
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

  // New options for CV creation
  const [numPages, setNumPages] = useState(2);
  const [includeKeywords, setIncludeKeywords] = useState(true);
  const [includeRelevantExperience, setIncludeRelevantExperience] = useState(true);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalNumPages, setModalNumPages] = useState(numPages);
  const [modalIncludeKeywords, setModalIncludeKeywords] = useState(includeKeywords);
  const [modalIncludeRelevantExperience, setModalIncludeRelevantExperience] = useState(includeRelevantExperience);
  const [pendingGenerate, setPendingGenerate] = useState(false);

  // Responsive placement for recall button
  const recallBtnBottom = useBreakpointValue({ base: '80px', md: '40px' });
  const recallBtnRight = useBreakpointValue({ base: '16px', md: '40px' });
  const modalSize = useBreakpointValue({ base: 'xs', md: 'md' });

  // Add a ref to prevent double re-analysis
  const hasReanalyzedRef = useRef(false);

  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');

  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
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
      // Construct profile with only required fields
      const profile = {
        work_experience: arcData.work_experience || [],
        education: arcData.education || [],
        skills: arcData.skills || [],
        projects: arcData.projects || [],
        certifications: arcData.certifications || [],
      };
      const result = await extractKeywords(profile, jobDesc, token);
      setKeywords(result.keywords || []);
      if (result.thread_id) setThreadId(result.thread_id);
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
      // 1. Fetch Arc data (profile)
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
      // 2. Extract keywords from job description
      let kwResult;
      try {
        kwResult = await extractKeywords(data, jobDesc, token);
      } catch (err: any) {
        setError('Sorry, we could not extract keywords from your job description. Please check your input or try again later.');
        console.error('Keyword extraction failed:', err);
        setLoading(false);
        return;
      }
      const keywords = (Array.isArray(kwResult) ? kwResult : kwResult.keywords || []).slice(0, 20); // Limit to 20 keywords for user-friendliness
      setKeywords(keywords);
      // 3. Analyze keywords against ALL Arc data sections
      const arcText = JSON.stringify(data).toLowerCase();
      const now = new Date();
      const keywordStatuses = keywords.map((kw: string) => {
        const kwLower = kw.toLowerCase();
        let status: 'green' | 'amber' | 'red' = 'red';
        // 1. Work Experience
        if (data.work_experience) {
          for (const exp of data.work_experience) {
            let isRecent = false;
            if (exp.end_date || exp.endDate) {
              const end = exp.end_date || exp.endDate;
              if (/^present$/i.test((end || '').trim())) {
                isRecent = true;
              } else {
                const parsed = parseInt((end + '').slice(0, 4));
                if (!isNaN(parsed) && (new Date().getFullYear() - parsed <= 5)) {
                  isRecent = true;
                }
              }
            }
            // If end_date is missing or invalid, treat as old (not recent)
            if ((exp.description && exp.description.toLowerCase().includes(kwLower)) ||
                (exp.title && exp.title.toLowerCase().includes(kwLower)) ||
                (exp.skills && exp.skills.join(' ').toLowerCase().includes(kwLower))) {
              if (isRecent) {
                status = 'green';
                break;
              } else {
                status = 'amber';
              }
            }
          }
        }
        // 2. Skills (amber if not green)
        if (status !== 'green' && data.skills && data.skills.length > 0) {
          for (const skill of data.skills) {
            if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
                (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
              status = 'amber';
            }
          }
        }
        // 3. Other sections (amber if not green)
        if (status !== 'green' && status !== 'amber' && arcText.includes(kwLower)) status = 'amber';
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
    setSaveSuccess('');
    setSaveError('');
    try {
      // Always construct the profile from arcData
      const profile = {
        work_experience: arcData.work_experience || [],
        education: arcData.education || [],
        skills: arcData.skills || [],
        projects: arcData.projects || [],
        certifications: arcData.certifications || [],
      };
      let result;
      result = await generateApplicationMaterials(
        profile,
        jobDesc,
        keywords,
        threadId || undefined
      );
      if (result.thread_id && !threadId) setThreadId(result.thread_id);
      setOptimizedCV(result.cv || '');
      setOptimizedCL(result.cover_letter || result.coverLetter || '');
      setStep(3);
      // Ensure result.cv is a non-empty string before saving
      if (!result.cv || typeof result.cv !== 'string' || !result.cv.trim()) {
        setSaveError('Generated CV is empty. Please try again.');
        return;
      }
      // Log outgoing payload for debugging
      const roleTitle = jobDesc.split('\n')[0].slice(0, 80) || 'Untitled Role';
      const payload = {
        role_title: roleTitle,
        job_description: jobDesc,
        cv_text: result.cv,
        cover_letter_text: result.cover_letter || result.coverLetter || ''
      };
      console.log('Saving generated application to /api/applications with payload:', payload);
      try {
        await saveGeneratedCV(payload);
        setSaveSuccess('Generated CV and cover letter saved successfully!');
      } catch (saveErr: any) {
        setSaveError(saveErr.message || 'Failed to save generated CV and cover letter');
      }
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
            let status: 'green' | 'amber' | 'red' = 'red';
            // 1. Work Experience
            if (data.work_experience) {
              for (const exp of data.work_experience) {
                let isRecent = false;
                if (exp.end_date || exp.endDate) {
                  const end = exp.end_date || exp.endDate;
                  if (/^present$/i.test((end || '').trim())) {
                    isRecent = true;
                  } else {
                    const parsed = parseInt((end + '').slice(0, 4));
                    if (!isNaN(parsed) && (new Date().getFullYear() - parsed <= 5)) {
                      isRecent = true;
                    }
                  }
                }
                // If end_date is missing or invalid, treat as old (not recent)
                if ((exp.description && exp.description.toLowerCase().includes(kwLower)) ||
                    (exp.title && exp.title.toLowerCase().includes(kwLower)) ||
                    (exp.skills && exp.skills.join(' ').toLowerCase().includes(kwLower))) {
                  if (isRecent) {
                    status = 'green';
                    break;
                  } else {
                    status = 'amber';
                  }
                }
              }
            }
            // 2. Skills (amber if not green)
            if (status !== 'green' && data.skills && data.skills.length > 0) {
              for (const skill of data.skills) {
                if ((typeof skill === 'string' && skill.toLowerCase().includes(kwLower)) ||
                    (skill.skillName && skill.skillName.toLowerCase().includes(kwLower))) {
                  status = 'amber';
                }
              }
            }
            // 3. Other sections (amber if not green)
            if (status !== 'green' && status !== 'amber' && arcText.includes(kwLower)) status = 'amber';
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

  // When modal is confirmed, update main options and proceed
  const handleModalOk = () => {
    setNumPages(modalNumPages);
    setIncludeKeywords(modalIncludeKeywords);
    setIncludeRelevantExperience(modalIncludeRelevantExperience);
    onClose();
    setTimeout(() => handleAnalyzeAndOptimize(), 0); // Proceed with generation
  };

  return (
    <Box py={6} maxW="900px" mx="auto">
      <Heading as="h2" size="lg" fontWeight={700} textAlign="center" mb={4}>
        CVs & Cover Letters
      </Heading>
      <Box bg={useColorModeValue('white', 'gray.800')} boxShadow="lg" p={8} borderRadius="lg" mb={6} maxW={700} mx="auto">
        <HStack justify="center" mb={6} spacing={12}>
          {steps.map((label, idx) => {
            const isActive = step === idx;
            return (
              <VStack key={label} spacing={1} align="center">
                <Box
                  w={8}
                  h={8}
                  borderRadius="full"
                  bg={isActive ? 'blue.800' : 'gray.300'}
                  color={isActive ? 'white' : 'gray.700'}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontWeight="bold"
                  fontSize="lg"
                >
                  {idx + 1}
                </Box>
                <Text fontSize="sm" color={isActive ? 'blue.800' : 'gray.500'} fontWeight={isActive ? 700 : 400}>
                  {label}
                </Text>
              </VStack>
            );
          })}
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
            <Button colorScheme="blue" onClick={handleNextFromJobDesc} isDisabled={!jobDesc.trim() || loading || extracting}>
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
              <Button variant="outline" colorScheme="gray" onClick={() => {
                if (Array.isArray(keywordAnalysis)) {
                  const missing = keywordAnalysis.filter(k => k.status === 'red').map(k => k.keyword);
                  localStorage.setItem('ark-missing-keywords', JSON.stringify(missing));
                  // Store all keywords for CareerArk modal
                  localStorage.setItem('ark-keywords', JSON.stringify(keywordAnalysis.map(k => k.keyword)));
                }
                navigate('/career-ark');
              }}>
                Edit Ark Data
              </Button>
              <Button colorScheme="blue" isDisabled={optimizing} onClick={() => {
                setModalNumPages(numPages);
                setModalIncludeKeywords(includeKeywords);
                setModalIncludeRelevantExperience(includeRelevantExperience);
                onOpen();
              }}>
                {optimizing ? <Spinner size="sm" mr={2} /> : null}Generate CV & Cover Letter
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
            <Text fontWeight="semibold">View CV and Cover Letter</Text>
            <Box>
              <Tabs colorScheme="purple" variant="line" isFitted>
                <TabList mb={4}>
                  <Tab fontWeight="bold">CV</Tab>
                  <Tab fontWeight="bold">Cover Letter</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <Heading as="h4" size="md" mb={2}>Optimized CV</Heading>
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      fontFamily="'Times New Roman', Times, serif"
                      fontSize="md"
                      whiteSpace="pre-line"
                      minH={200}
                    >
                      {optimizedCV}
                    </Box>
                  </TabPanel>
                  <TabPanel>
                    <Heading as="h4" size="md" mb={2}>Optimized Cover Letter</Heading>
                    <Box
                      p={4}
                      borderWidth="1px"
                      borderRadius="md"
                      bg={useColorModeValue('gray.50', 'gray.700')}
                      fontFamily="'Times New Roman', Times, serif"
                      fontSize="md"
                      whiteSpace="pre-line"
                      minH={150}
                    >
                      {optimizedCL}
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
            <Button colorScheme="green" size="lg" mt={2} onClick={() => navigate('/download-cvs')}>
              Go to Download CVs Page
            </Button>
          </Stack>
        )}
        {saveSuccess && <Alert status="success" mt={2}><AlertIcon />{saveSuccess}</Alert>}
        {saveError && <Alert status="error" mt={2}><AlertIcon />{saveError}</Alert>}
        {error && <Alert status="error" mt={2}><AlertIcon />{error}</Alert>}
      </Box>
      {/* CV Options Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>CV Options</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <Stack direction="row" spacing={4} align="center">
                <Text>Pages:</Text>
                <Button colorScheme={modalNumPages === 2 ? 'blue' : 'gray'} onClick={() => setModalNumPages(2)}>2</Button>
                <Button colorScheme={modalNumPages === 3 ? 'blue' : 'gray'} onClick={() => setModalNumPages(3)}>3</Button>
                <Button colorScheme={modalNumPages === 4 ? 'blue' : 'gray'} onClick={() => setModalNumPages(4)}>4</Button>
              </Stack>
              <Stack direction="row" spacing={4} align="center">
                <Text>Include Keywords:</Text>
                <Button colorScheme={modalIncludeKeywords ? 'blue' : 'gray'} variant={modalIncludeKeywords ? 'solid' : 'outline'} onClick={() => setModalIncludeKeywords(true)}>Yes</Button>
                <Button colorScheme={!modalIncludeKeywords ? 'blue' : 'gray'} variant={!modalIncludeKeywords ? 'solid' : 'outline'} onClick={() => setModalIncludeKeywords(false)}>No</Button>
              </Stack>
              <Stack direction="row" spacing={4} align="center">
                <Text>Include Relevant Experience:</Text>
                <Button colorScheme={modalIncludeRelevantExperience ? 'blue' : 'gray'} variant={modalIncludeRelevantExperience ? 'solid' : 'outline'} onClick={() => setModalIncludeRelevantExperience(true)}>Yes</Button>
                <Button colorScheme={!modalIncludeRelevantExperience ? 'blue' : 'gray'} variant={!modalIncludeRelevantExperience ? 'solid' : 'outline'} onClick={() => setModalIncludeRelevantExperience(false)}>No</Button>
              </Stack>
            </Stack>
          </ModalBody>
          <ModalFooter justifyContent="center">
            <Button colorScheme="blue" onClick={handleModalOk}>
              OK
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Application; 