import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  Alert,
  AlertIcon,
  Progress,
  Code,
  useToast,
  Select,
  Input,
  HStack,
  Textarea,
  Radio,
  RadioGroup,
} from '@chakra-ui/react';
import { uploadCV, getCVStatus } from '../api/careerArkApi';

const DEBUG_STAGES = [
  { key: 'text', label: 'Raw Extracted Text', endpoint: '/api/arc/cv/text/' },
  { key: 'ai-raw', label: 'Raw AI Output', endpoint: '/api/arc/cv/ai-raw/' },
  { key: 'ai-combined', label: 'Combined AI Output', endpoint: '/api/arc/cv/ai-combined/' },
  { key: 'ai-filtered', label: 'Filtered AI Output', endpoint: '/api/arc/cv/ai-filtered/' },
  { key: 'arcdata', label: 'Final ArcData', endpoint: '/api/arc/cv/arcdata/' },
];

const API_BASE = 'https://api-gw-production.up.railway.app';

const DebugCVAIResponse: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [taskId, setTaskId] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [polling, setPolling] = useState(false);
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<any>(null);
  const [manualTaskId, setManualTaskId] = useState('');
  const [selectedStage, setSelectedStage] = useState(DEBUG_STAGES[0].key);
  const [stageResult, setStageResult] = useState<any>(null);
  const [stageLoading, setStageLoading] = useState(false);
  const [chunkText, setChunkText] = useState('');
  const [chunkTestLoading, setChunkTestLoading] = useState(false);
  const [chunkTestResult, setChunkTestResult] = useState<any>(null);
  const [chunkTestRaw, setChunkTestRaw] = useState<any>(null);
  const [chunkTestFullResponse, setChunkTestFullResponse] = useState<any>(null);
  const [mode, setMode] = useState<'cv' | 'chunk'>('cv');
  const toast = useToast();

  const effectiveTaskId = manualTaskId || taskId;

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
    setProgress(10);
    try {
      // Upload the CV
      const uploadRes = await uploadCV(file);
      setTaskId(uploadRes.taskId);
      setStatus('pending');
      setPolling(true);
      setProgress(30);
      // Poll for extraction completion
      let pollCount = 0;
      const poll = async () => {
        try {
          const statusData = await getCVStatus(uploadRes.taskId);
          setStatus(statusData.status);
          if (statusData.status === 'completed') {
            setProgress(100);
            setPolling(false);
            setSummary(statusData.extractedDataSummary || null);
            toast({ status: 'success', title: 'CV imported and processed!' });
          } else if (statusData.status === 'failed') {
            setPolling(false);
            setUploadError('CV extraction failed.');
          } else if (pollCount < 30) { // poll up to 1 minute
            setTimeout(poll, 2000);
            pollCount++;
            setProgress(30 + Math.min(60, pollCount * 2));
          } else {
            setPolling(false);
            setUploadError('CV extraction timed out.');
          }
        } catch {
          setPolling(false);
          setUploadError('Failed to check CV extraction status.');
        } finally {
          setUploading(false);
        }
      };
      poll();
    } catch (err: any) {
      setUploadError(err?.error || err?.message || 'Upload failed');
      setUploading(false);
    }
  };

  const handleFetchStage = async () => {
    if (!effectiveTaskId) {
      setStageResult({ error: 'No taskId provided.' });
      return;
    }
    setStageLoading(true);
    setStageResult(null);
    try {
      const token = localStorage.getItem('token') || '';
      const stage = DEBUG_STAGES.find(s => s.key === selectedStage)!;
      const res = await fetch(`${API_BASE}${stage.endpoint}${effectiveTaskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) {
        let errMsg = await res.text();
        setStageResult({ error: errMsg });
      } else {
        // Try to parse as JSON, fallback to text
        const text = await res.text();
        try {
          setStageResult(JSON.parse(text));
        } catch {
          setStageResult(text);
        }
      }
    } catch (err: any) {
      setStageResult({ error: err?.message || 'Failed to fetch stage data.' });
    } finally {
      setStageLoading(false);
    }
  };

  const handleChunkTest = async () => {
    setChunkTestLoading(true);
    setChunkTestResult(null);
    setChunkTestRaw(null);
    setChunkTestFullResponse(null);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${API_BASE}/api/arc/chunk`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: chunkText }),
      });
      if (!res.ok) {
        let errMsg = await res.text();
        setChunkTestResult({ error: errMsg });
        setChunkTestFullResponse({ error: errMsg });
      } else {
        const data = await res.json();
        setChunkTestResult(data.parsed || data.parsed_json || null);
        setChunkTestRaw(data.raw || data.raw_ai_response || null);
        setChunkTestFullResponse(data);
      }
    } catch (err: any) {
      setChunkTestResult({ error: err?.message || 'Failed to test chunk.' });
      setChunkTestFullResponse({ error: err?.message || 'Failed to test chunk.' });
    } finally {
      setChunkTestLoading(false);
    }
  };

  return (
    <Box maxW="700px" mx="auto" py={10}>
      <Heading size="lg" mb={6}>Debug: CV AI Service Pipeline</Heading>
      <RadioGroup value={mode} onChange={val => setMode(val as 'cv' | 'chunk')} mb={6}>
        <HStack spacing={8}>
          <Radio value="cv">Upload CV File</Radio>
          <Radio value="chunk">Test AI Chunk Parsing</Radio>
        </HStack>
      </RadioGroup>
      {mode === 'cv' && (
        <VStack spacing={4} align="stretch">
          <Button onClick={handleUploadClick} colorScheme="blue" isLoading={uploading || polling}>
            Upload CV File
          </Button>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            style={{ display: 'none' }}
            ref={fileInputRef}
            onChange={handleFileChange}
            disabled={uploading || polling}
          />
          {(uploading || polling) && <Progress value={progress} size="sm" colorScheme="blue" />}
          {uploadError && <Alert status="error"><AlertIcon />{uploadError}</Alert>}
          {taskId && (
            <Box>
              <Text fontWeight="bold">Last Uploaded Task ID:</Text>
              <Code>{taskId}</Code>
              <Text>Status: <b>{status}</b></Text>
              {summary && (
                <Box mt={2}>
                  <Text fontWeight="bold">Extracted Data Summary:</Text>
                  <Code whiteSpace="pre" display="block">{JSON.stringify(summary, null, 2)}</Code>
                </Box>
              )}
            </Box>
          )}
          <Box>
            <HStack mb={2}>
              <Input
                placeholder="Enter taskId (or use last uploaded)"
                value={manualTaskId}
                onChange={e => setManualTaskId(e.target.value)}
                width="350px"
              />
              <Select
                value={selectedStage}
                onChange={e => setSelectedStage(e.target.value)}
                width="250px"
              >
                {DEBUG_STAGES.map(stage => (
                  <option key={stage.key} value={stage.key}>{stage.label}</option>
                ))}
              </Select>
              <Button colorScheme="teal" onClick={handleFetchStage} isLoading={stageLoading}>
                Fetch Stage Data
              </Button>
            </HStack>
            {stageResult && (
              <Box mt={2}>
                <Text fontWeight="bold" mb={2}>{DEBUG_STAGES.find(s => s.key === selectedStage)?.label}:</Text>
                <Box maxH="400px" overflowY="auto" borderWidth={1} borderRadius="md" p={3} bg="gray.50">
                  {typeof stageResult === 'string' ? (
                    <Code whiteSpace="pre" display="block">{stageResult}</Code>
                  ) : (
                    <Code whiteSpace="pre" display="block">{JSON.stringify(stageResult, null, 2)}</Code>
                  )}
                </Box>
              </Box>
            )}
          </Box>
        </VStack>
      )}
      {mode === 'chunk' && (
        <Box p={6} borderWidth={1} borderRadius="lg" bg="gray.50">
          <Heading as="h3" size="md" mb={4}>Test AI Chunk Parsing</Heading>
          <Textarea
            placeholder="Paste a chunk of CV text to test AI extraction..."
            value={chunkText}
            onChange={e => setChunkText(e.target.value)}
            minH={100}
            mb={2}
          />
          <Button colorScheme="purple" onClick={handleChunkTest} isLoading={chunkTestLoading} mb={4}>
            Test Chunk with AI
          </Button>
          {chunkTestResult && (
            <Box mb={3}>
              <Text fontWeight="bold" mb={1}>Parsed JSON:</Text>
              <Box maxH="300px" overflowY="auto" borderWidth={1} borderRadius="md" p={3} bg="white">
                <Code whiteSpace="pre" display="block">{JSON.stringify(chunkTestResult, null, 2)}</Code>
              </Box>
            </Box>
          )}
          {chunkTestRaw && (
            <Box mb={3}>
              <Text fontWeight="bold" mb={1}>Raw AI Response:</Text>
              <Box maxH="300px" overflowY="auto" borderWidth={1} borderRadius="md" p={3} bg="white">
                <Code whiteSpace="pre" display="block">{typeof chunkTestRaw === 'string' ? chunkTestRaw : JSON.stringify(chunkTestRaw, null, 2)}</Code>
              </Box>
            </Box>
          )}
          {chunkTestFullResponse && (
            <Box>
              <Text fontWeight="bold" mb={1}>Full Raw Response:</Text>
              <Box maxH="300px" overflowY="auto" borderWidth={1} borderRadius="md" p={3} bg="white">
                <Code whiteSpace="pre" display="block">{JSON.stringify(chunkTestFullResponse, null, 2)}</Code>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default DebugCVAIResponse; 