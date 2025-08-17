import React, { useState, useRef, useContext } from 'react';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { extractKeywords, generateCV } from '../api/aiApi';
import { useEffect } from 'react';
import { CreditsContext } from '../context/CreditsContext';

interface Keyword {
  text: string;
  status: 'match' | 'partial' | 'missing';
}

interface GenerationOptions {
  pages: 2 | 3 | 4;
  includeKeywords: boolean;
  includeRelevantExperience: boolean;
}

// TypeScript types for PII-free profile and assistant response
interface PIIFreeProfile {
  experience?: any[];
  education?: any[];
  skills?: any[];
  certifications?: any[];
  projects?: any[];
  training?: any[];
  // Add other non-PII fields as needed
}

interface AssistantResponse {
  name: string;
  contact_info: string[] | string;
  summary?: string;
  experience?: any[];
  education?: any[];
  certifications?: any[];
  core_competencies?: string[];
  cover_letter?: string;
  // ...other fields
}

// Utility to sanitize experience descriptions
function sanitizeExperienceDescriptions(experiences: any[]): any[] {
  return experiences.map(exp => {
    let desc = exp.description;
    if (Array.isArray(desc)) {
      desc = desc.map((d: string) => d.replace(/•/g, '').trim());
    } else if (typeof desc === 'string') {
      desc = desc.replace(/•/g, '').trim();
    }
    return { ...exp, description: desc };
  });
}

// Add the transformCVResponseToSections utility at the top or in a utils file
function transformCVResponseToSections(data: any) {
  const sections = [];
  if (data.experience && Array.isArray(data.experience)) {
    sections.push({
      type: 'experience',
      title: 'Professional Experience',
      items: data.experience.map((exp: any) => ({
        ...exp,
        bullets: Array.isArray(exp.description)
          ? exp.description.map((b: string) => b.replace(/•/g, '').trim())
          : (exp.description ? [exp.description.replace(/•/g, '').trim()] : [])
      }))
    });
  }
  if (data.education && Array.isArray(data.education)) {
    sections.push({
      type: 'education',
      title: 'Education',
      items: data.education
    });
  }
  // Add more sections as needed
  return { sections };
}

// Utility to convert Blob to base64
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      resolve(result.split(',')[1]); // Remove data:...;base64, prefix
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Add a utility to render the structured CV as JSX
function renderStructuredCV(cvData: any) {
  if (!cvData) return <div>No CV data available.</div>;
  return (
    <div className="space-y-4">
      {cvData.name && <h2 className="text-2xl font-bold">{cvData.name}</h2>}
      {cvData.contact_info && Array.isArray(cvData.contact_info) && (
        <div className="text-sm text-muted-foreground">{cvData.contact_info.filter(Boolean).join(' | ')}</div>
      )}
      {cvData.summary && <p className="mt-2 text-base">{cvData.summary}</p>}
      {cvData.experience && Array.isArray(cvData.experience) && cvData.experience.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Professional Experience</h3>
          <ul className="space-y-2">
            {cvData.experience.map((exp: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{exp.job_title}{exp.company ? `, ${exp.company}` : ''}{exp.dates ? `, ${exp.dates}` : ''}</div>
                {exp.bullets && Array.isArray(exp.bullets) && (
                  <ul className="list-disc list-inside ml-4">
                    {exp.bullets.map((b: string, i: number) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cvData.education && Array.isArray(cvData.education) && cvData.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Education</h3>
          <ul className="space-y-2">
            {cvData.education.map((edu: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{edu.degree}{edu.institution ? `, ${edu.institution}` : ''}{edu.year ? `, ${edu.year}` : ''}</div>
                {edu.location && <div className="text-sm text-muted-foreground">{edu.location}</div>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {cvData.certifications && Array.isArray(cvData.certifications) && cvData.certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Certifications</h3>
          <ul className="list-disc list-inside ml-4">
            {cvData.certifications.map((cert: string, idx: number) => (
              <li key={idx}>{cert}</li>
            ))}
          </ul>
        </div>
      )}
      {cvData.core_competencies && Array.isArray(cvData.core_competencies) && cvData.core_competencies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Core Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.core_competencies.map((comp: string, idx: number) => (
              <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">{comp}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Add a validation utility for structuredCV
function validateCVData(cv: any): string | null {
  if (!cv) return 'No CV data available';
  if (!cv.name) return 'Missing candidate name';
  if (!cv.contact_info || !Array.isArray(cv.contact_info) || cv.contact_info.length === 0) return 'Missing contact information';
  if (!cv.experience || !Array.isArray(cv.experience) || cv.experience.length === 0) return 'Missing work experience';
  return null;
}

// Utility to build a PII-free profile
function buildPIIFreeProfile(profile: any, arcData: any): PIIFreeProfile {
  return {
    experience: arcData?.work_experience || [],
    education: arcData?.education || [],
    skills: arcData?.skills || [],
    certifications: arcData?.certifications || [],
    projects: arcData?.projects || [],
    training: arcData?.training || [],
    // Add other non-PII fields as needed
  };
}

// Utility to check for PII in outgoing assistant payload (dev only)
function containsPII(obj: any): boolean {
  if (!obj) return false;
  const piiFields = ['name', 'email', 'phone', 'address', 'linkedin', 'address_line1', 'city_state_postal'];
  for (const key of Object.keys(obj)) {
    if (piiFields.includes(key.toLowerCase())) return true;
    if (typeof obj[key] === 'object' && containsPII(obj[key])) return true;
  }
  return false;
}

const ApplicationWizard = () => {
  const { toast } = useToast();
  const { refreshCredits } = useContext(CreditsContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState<Keyword[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    pages: 2,
    includeKeywords: true,
    includeRelevantExperience: true,
  });
  const [generatedCV, setGeneratedCV] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [profile, setProfile] = useState<any>(null);
  const [arcData, setArcData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  // Add a new state to hold the structured CV data
  const [structuredCV, setStructuredCV] = useState<any>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  // Fetch user profile and arc data on mount
  useEffect(() => {
    const fetchProfileAndArc = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        // 1. Get user profile
        const profileRes = await fetch('https://api-gw-production.up.railway.app/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!profileRes.ok) throw new Error('Failed to fetch user profile');
        const userProfile = await profileRes.json();
        setProfile(userProfile);
        // 2. Get arc data
        const arcRes = await fetch(`https://api-gw-production.up.railway.app/api/career-ark/profiles/${userProfile.id}/all_sections`, {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (!arcRes.ok) throw new Error('Failed to fetch arc data');
        const arc = await arcRes.json();
        setArcData(arc);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile/arc data');
      }
    };
    fetchProfileAndArc();
  }, []);

  // Reset to step 1 if coming from menu
  useEffect(() => {
    if (localStorage.getItem('resetApplyStep') === 'true') {
      setCurrentStep(1);
      setJobDescription('');
      setExtractedKeywords([]);
      setMatchScore(0);
      setJobTitle('');
      setCompanyName('');
      setGeneratedCV('');
      setGeneratedCoverLetter('');
      setThreadId(null);
      localStorage.removeItem('resetApplyStep');
    }
  }, []);

  // Fetch credits on mount and after generation
  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const res = await fetch('https://api-gw-production.up.railway.app/api/user/credits', {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch credits');
      const data = await res.json();
      // setCredits(data); // This line is removed as credits are now managed by context
    } catch {}
  };
  useEffect(() => { fetchCredits(); }, []);

  // Helper to merge profile and arc data
  const getMergedProfile = () => {
    if (!profile || !arcData) return null;
    return {
      ...profile,
      work_experience: arcData.work_experience || [],
      education: arcData.education || [],
      skills: arcData.skills || [],
      projects: arcData.projects || [],
      certifications: arcData.certifications || [],
      training: arcData.training || [],
    };
  };

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Arc Data & Keywords' },
    { number: 3, title: 'Generate Documents' },
    { number: 4, title: 'Review & Download' },
  ];

  // Replace handleJobDescriptionNext with real API call
  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setError(null);
    // Mark application as submitted in localStorage
    localStorage.setItem('hasSubmittedApplication', 'true');
    setCurrentStep(2);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const mergedProfile = getMergedProfile();
      if (!mergedProfile) throw new Error('Profile data not loaded');
      // Build PII-free profile for assistant
      const piiFreeProfile = buildPIIFreeProfile(profile, arcData);
      // Dev-mode validation for PII
      if (process.env.NODE_ENV === 'development' && containsPII(piiFreeProfile)) {
        // eslint-disable-next-line no-console
        console.warn('PII detected in assistant payload!', piiFreeProfile);
      }
      const result = await extractKeywords(piiFreeProfile, jobDescription, token);
      if (result.thread_id && !threadId) {
        setThreadId(result.thread_id);
      }
      setExtractedKeywords((result.keywords || []).map((text: string) => ({ text, status: 'match' })));
      setMatchScore(result.match_percentage || 0);
      setJobTitle(result.job_title || '');
      setCompanyName(result.company_name || '');
    } catch (err: any) {
      setError(err.message || 'Keyword extraction failed');
      toast({ title: 'Error', description: err.message || 'Keyword extraction failed' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Refactored handleGenerate: only generate and preview, do not upload DOCX yet
  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowOptionsModal(false);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const mergedProfile = getMergedProfile();
      if (!mergedProfile) throw new Error('Profile data not loaded');
      let payload;
      if (threadId) {
        payload = {
          action: 'generate_cv',
          thread_id: threadId
        };
      } else {
        payload = {
          action: 'generate_cv',
          profile: mergedProfile,
          job_description: jobDescription
        };
      }
      // Generate both CV and Cover Letter in one call
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to generate documents');
      const data = await res.json();
      if (data.thread_id && !threadId) {
        setThreadId(data.thread_id);
      }
      setGeneratedCV(data.cv || '');
      setGeneratedCoverLetter(data.cover_letter || '');
      setJobTitle(data.job_title || '');
      setCompanyName(data.company_name || '');
      setStructuredCV(data); // Store structured data
      // Advance to preview step (step 3)
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'Document generation failed');
      toast({ title: 'Error', description: err.message || 'Document generation failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  // New handler: after preview, user clicks 'Save & Download' to generate/upload DOCX and persist CV
  const handleSaveAndDownload = async () => {
    // Validate all required fields before proceeding
    const validationError = validateCVData(structuredCV);
    if (validationError) {
      setError(validationError);
      toast({ title: 'Error', description: validationError });
      console.error('CV validation failed:', validationError, structuredCV);
      return;
    }
    setIsGenerating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      // Debug log the payload
      console.log('Sending structuredCV to /api/cv/generate-docx:', structuredCV);
      // Use the latest structuredCV from state for DOCX generation
      // 2. POST structured JSON to /api/cv/generate-docx to get the DOCX
      let docxBlob = null;
      try {
        const docxRes = await fetch('/api/cv/generate-docx', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(structuredCV),
        });
        if (!docxRes.ok) throw new Error('Failed to generate DOCX');
        docxBlob = await docxRes.blob();
      } catch (e) {
        setError('Failed to generate DOCX');
        setIsGenerating(false);
        toast({ title: 'Error', description: 'Failed to generate DOCX' });
        return;
      }
      // Ensure uniqueJobTitle and uniqueCompanyName are defined and checked for duplicates
      let uniqueJobTitle = jobTitle || '';
      let uniqueCompanyName = companyName || '';
      try {
        const existingRes = await fetch('/api/cv', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        if (existingRes.ok) {
          const existingCVs = await existingRes.json();
          const sameTitleCount = existingCVs.filter((cv: any) =>
            (cv.job_title || '') === uniqueJobTitle && (cv.company_name || '') === uniqueCompanyName
          ).length;
          if (sameTitleCount > 0) {
            uniqueJobTitle = `${uniqueJobTitle} (${sameTitleCount + 1})`;
          }
        }
      } catch (e) {
        // If fetch fails, just proceed with the original job title
      }
      // Convert DOCX Blob to base64
      const cvDocxB64 = await blobToBase64(docxBlob);
      // If you have a cover letter DOCX, convert and add cover_letter_docx_b64 as well
      // Build payload for persistence: include all required fields from structuredCV
      const payload: any = {
        cv_docx_b64: cvDocxB64,
        ...structuredCV,
        name: jobTitle || structuredCV?.name || '',
        job_title: uniqueJobTitle,
        company_name: uniqueCompanyName,
      };
      // POST the JSON payload to /api/cv
      const persistRes = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      if (!persistRes.ok) {
        let errorMsg = 'Failed to save CV';
        try {
          const error = await persistRes.json();
          errorMsg = error.detail || error.message || errorMsg;
        } catch {}
        setError(errorMsg);
        toast({ title: 'Error', description: errorMsg });
        throw new Error(errorMsg);
      }
      toast({ title: 'Documents Generated & Saved', description: 'Your CV and cover letter have been generated and saved!' });
      setCurrentStep(4);
      // Deduct a credit after successful generation
      try {
        const creditRes = await fetch('https://api-gw-production.up.railway.app/api/user/credits/use', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'generate_cv' }),
        });
        if (!creditRes.ok) {
          setShowOutOfCreditsModal(true);
          await refreshCredits();
          return;
        }
        await refreshCredits();
      } catch {
        setShowOutOfCreditsModal(true);
      }
    } catch (err: any) {
      setError(err.message || 'Document save failed');
      toast({ title: 'Error', description: err.message || 'Document save failed' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Keyword extraction handler
  const handleExtractKeywords = async (profile: any, jobDescription: string) => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      let payload;
      if (threadId) {
        payload = {
          action: 'extract_keywords',
          thread_id: threadId
        };
      } else {
        payload = {
          action: 'extract_keywords',
          profile,
          job_description: jobDescription
        };
      }
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Keyword extraction failed');
      const data = await res.json();
      if (data.thread_id && !threadId) setThreadId(data.thread_id);
      setExtractedKeywords(data.keywords || []);
    } catch (err: any) {
      setError(err.message || 'Failed to extract keywords');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getKeywordColor = (status: Keyword['status']) => {
    switch (status) {
      case 'match': return 'success';
      case 'partial': return 'warning';
      case 'missing': return 'destructive';
      default: return 'secondary';
    }
  };

  const getKeywordIcon = (status: Keyword['status']) => {
    switch (status) {
      case 'match': return <CheckCircle className="w-3 h-3" />;
      case 'partial': return <AlertCircle className="w-3 h-3" />;
      case 'missing': return <XCircle className="w-3 h-3" />;
    }
  };

  // Add useEffect to handle redirect after generation
  // Remove the useEffect that auto-redirects after generation

  const handleApplyUpdates = async () => {
    setIsUpdating(true);
    // Do not close the modal immediately
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      if (!threadId) throw new Error('No thread ID available');
      // Prepare keypoints arrays
      const cv_keypoints = cvUpdateRequest
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      const cover_letter_keypoints = coverLetterUpdateRequest
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.length > 0);
      // Map generationOptions.pages to string
      let cv_length = '2_to_3_pages';
      if (generationOptions.pages === 2) cv_length = '2_pages';
      if (generationOptions.pages === 3) cv_length = '3_pages';
      if (generationOptions.pages === 4) cv_length = '4_pages';
      // Build payload
      const payload = {
        action: 'update_cv',
        thread_id: threadId,
        cv_keypoints,
        cover_letter_keypoints,
        cv_length,
      };
      // Send to backend
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to update documents');
      const data = await res.json();
      setGeneratedCV(data.cv || '');
      setGeneratedCoverLetter(data.cover_letter || '');
      setStructuredCV(data); // update preview
      setShowUpdateModal(false);
      setCvUpdateRequest('');
      setCoverLetterUpdateRequest('');
      toast({ title: 'Documents Updated', description: 'Your CV and cover letter have been updated with your requests!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to update documents' });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {step.number}
                </div>
                <span className={`ml-2 text-sm ${
                  currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${
                    currentStep > step.number ? 'bg-primary' : 'bg-muted'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <Progress value={(currentStep / steps.length) * 100} className="w-full" />
        </div>
        {/* Step 1: Paste Job Description */}
        {currentStep === 1 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Paste Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                Paste the job description below to get started. We'll analyze it to optimize your CV and cover letter.
              </p>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px]"
              />
              <Button 
                onClick={handleJobDescriptionNext}
                disabled={!jobDescription.trim()}
                className="w-full"
              >
                Next: Review Arc Data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}
        {/* Step 2: Review Arc Data & Keywords */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Keyword Analysis</span>
                  {jobTitle && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{jobTitle}</div>
                      <div className="text-sm text-muted-foreground">{companyName}</div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isAnalyzing ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center space-y-2">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                      <p className="text-muted-foreground">Analyzing job description...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Match Score</h3>
                      <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold ${
                          matchScore >= 70 ? 'text-green-600' : 
                          matchScore >= 50 ? 'text-yellow-600' : 'text-red-600'
                        }`}>
                          {matchScore}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Extracted Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        {extractedKeywords.map((keyword, index) => (
                          <Badge
                            key={index}
                            variant={getKeywordColor(keyword.status)}
                            className="flex items-center gap-1"
                          >
                            {getKeywordIcon(keyword.status)}
                            {keyword.text}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <Button
                      onClick={handleGenerate}
                      className="w-full"
                      disabled={isGenerating}
                    >
                      Generate CV & Cover Letter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
        {isGenerating && currentStep === 2 && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-lg p-8 flex flex-col items-center min-w-[320px]">
              <svg className="animate-spin h-8 w-8 text-primary mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              <div className="space-y-2 text-center">
                <div className="font-semibold text-lg">Generating your application...</div>
                <ul className="text-sm text-muted-foreground space-y-1 mt-2">
                  <li>• Curating expertise</li>
                  <li>• Comparing expertise to job advert</li>
                  <li>• Generating CV</li>
                  <li>• Generating cover letter</li>
                </ul>
              </div>
            </div>
          </div>
        )}
        {/* Step 3: Preview Generated Documents */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Preview Generated Documents</span>
                  {jobTitle && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{jobTitle}</div>
                      <div className="text-sm text-muted-foreground">{companyName}</div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Info message about placeholders */}
                <div className="mb-4 text-info text-sm font-semibold bg-blue-50 border border-blue-200 rounded p-2">
                  For your privacy, personal details like your name and contact info are never sent to our AI provider. Placeholders (e.g., {'{{CANDIDATE_NAME}}'}) will be replaced with your real details in the final document.
                </div>
                {error && (
                  <div className="mb-4 text-destructive text-sm font-semibold">{error}</div>
                )}
                <Tabs defaultValue="cv" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cv">Optimized CV</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cv" className="space-y-4">
                    {renderStructuredCV(structuredCV)}
                  </TabsContent>
                  <TabsContent value="cover-letter" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm">{generatedCoverLetter}</pre>
                    </div>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowUpdateModal(true)}
                    className="flex-1"
                    type="button"
                  >
                    Request Updates
                  </Button>
                  <Button
                    onClick={handleSaveAndDownload}
                    className="flex-1"
                    disabled={isGenerating || !!validateCVData(structuredCV)}
                    type="button"
                  >
                    {isGenerating ? 'Saving...' : 'Save & Download'}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Step 4: Review & Download */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Generated Documents</span>
                  {jobTitle && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{jobTitle}</div>
                      <div className="text-sm text-muted-foreground">{companyName}</div>
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="cv" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cv">Optimized CV</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cv" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                      {structuredCV ? (
                        renderStructuredCV(structuredCV)
                      ) : (
                        <div className="text-muted-foreground text-sm">No CV available.</div>
                      )}
                    </div>
                  </TabsContent>
                  <TabsContent value="cover-letter" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                      {generatedCoverLetter ? (
                        <pre className="whitespace-pre-wrap text-sm">{generatedCoverLetter}</pre>
                      ) : (
                        <div className="text-muted-foreground text-sm">No cover letter available.</div>
                      )}
                    </div>
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download Cover Letter
                    </Button>
                  </TabsContent>
                </Tabs>
                <div className="flex gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Analysis
                  </Button>
                  <Button
                    onClick={() => window.location.href = '/my-cvs-new'}
                    className="flex-1"
                  >
                    Go to Download CVs Page
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
        {/* Loading state for step 3 */}
        {currentStep === 3 && isGenerating && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">Generating Your Documents</h3>
                <p className="text-muted-foreground">
                  Please wait while we create your optimized CV and cover letter...
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      {/* Generation Options Modal */}
      <Dialog open={showOptionsModal} onOpenChange={setShowOptionsModal}>
        <DialogContent aria-describedby="application-wizard-modal-desc">
          <DialogHeader>
            <DialogTitle>Generation Options</DialogTitle>
          </DialogHeader>
          <div id="application-wizard-modal-desc" className="space-y-6 py-4">
            <div>
              <h4 className="font-medium mb-3">Number of Pages</h4>
              <div className="flex gap-2">
                {[2, 3, 4].map((pages) => (
                  <Button
                    key={pages}
                    variant={generationOptions.pages === pages ? "default" : "outline"}
                    onClick={() => setGenerationOptions(prev => ({ ...prev, pages: pages as 2 | 3 | 4 }))}
                  >
                    {pages} Pages
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label htmlFor="keywords" className="font-medium">
                  Include Keywords
                </label>
                <Switch
                  id="keywords"
                  checked={generationOptions.includeKeywords}
                  onCheckedChange={(checked) => 
                    setGenerationOptions(prev => ({ ...prev, includeKeywords: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <label htmlFor="experience" className="font-medium">
                  Include Relevant Experience
                </label>
                <Switch
                  id="experience"
                  checked={generationOptions.includeRelevantExperience}
                  onCheckedChange={(checked) => 
                    setGenerationOptions(prev => ({ ...prev, includeRelevantExperience: checked }))
                  }
                />
              </div>
            </div>
            <Button onClick={handleGenerate} className="w-full">
              Generate Documents
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Out of Credits Modal */}
      <Dialog open={showOutOfCreditsModal} onOpenChange={setShowOutOfCreditsModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Out of Credits</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 text-center">
            <p className="text-lg text-destructive font-semibold">You have run out of credits.</p>
            <p className="text-muted-foreground">Please visit the pricing page to top up or upgrade your plan.</p>
            <Button className="w-full" onClick={() => window.location.href = '/pricing'}>Go to Pricing</Button>
          </div>
        </DialogContent>
      </Dialog>
      {/* Request Updates Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Document Updates</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <p className="text-muted-foreground">
              Provide specific updates you'd like to see in your CV and cover letter. The AI will incorporate your requests into the documents.
            </p>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  CV Updates
                </label>
                <Textarea
                  placeholder="e.g., Please include worked at Space X on a project whilst at NASA..."
                  value={cvUpdateRequest}
                  onChange={(e) => setCvUpdateRequest(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isUpdating}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Cover Letter Updates
                </label>
                <Textarea
                  placeholder="e.g., Mention my experience with machine learning projects..."
                  value={coverLetterUpdateRequest}
                  onChange={(e) => setCoverLetterUpdateRequest(e.target.value)}
                  className="min-h-[100px]"
                  disabled={isUpdating}
                />
              </div>
            </div>
            {isUpdating && (
              <div className="flex flex-col items-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-2"></div>
                <div className="text-muted-foreground text-sm">Applying your updates, please wait...</div>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowUpdateModal(false)} className="flex-1" type="button" disabled={isUpdating}>
                Cancel
              </Button>
              <Button onClick={handleApplyUpdates} disabled={isUpdating || !cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim()} className="flex-1" type="button">
                Apply Updates
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationWizard; 