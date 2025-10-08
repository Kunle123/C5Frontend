import React, { useState, useRef, useContext, useEffect } from 'react';
import { logger } from '../utils/logger';
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
import { CreditsContext } from '../context/CreditsContext';
import { saveJobApplication, createApplicationHistory } from '../api';

interface Keyword {
  text: string;
  status: 'green' | 'amber' | 'red';
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
  if (!cvData || typeof cvData !== 'object') return <div>No CV data available.</div>;
  return (
    <div className="space-y-4">
      {cvData.name && <h2 className="text-2xl font-bold">{cvData.name}</h2>}
      {cvData.contact_info && Array.isArray(cvData.contact_info) && (
        <div className="text-sm text-muted-foreground">{cvData.contact_info.filter(Boolean).join(' | ')}</div>
      )}
      {cvData.summary && cvData.summary.content && <p className="mt-2 text-base">{cvData.summary.content}</p>}

      {/* Achievements */}
      {Array.isArray(cvData.relevant_achievements) && cvData.relevant_achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Relevant Achievements</h3>
          <ul className="list-disc list-inside ml-4">
            {cvData.relevant_achievements.map((a: any, idx: number) => (
              <li key={idx}>{a.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {Array.isArray(cvData.experience) && cvData.experience.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Professional Experience</h3>
          <ul className="space-y-2">
            {cvData.experience.map((exp: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{exp.job_title}{exp.company_name ? `, ${exp.company_name}` : ''}{exp.dates ? `, ${exp.dates}` : ''}</div>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside ml-4">
                    {exp.responsibilities.map((resp: any, i: number) => (
                      <li key={i}>{resp.content}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {Array.isArray(cvData.education) && cvData.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Education</h3>
          <ul className="space-y-2">
            {cvData.education.map((edu: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{edu.degree}{edu.institution ? `, ${edu.institution}` : ''}{edu.year ? `, ${edu.year}` : ''}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {Array.isArray(cvData.certifications) && cvData.certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Certifications</h3>
          <ul className="list-disc list-inside ml-4">
            {cvData.certifications.map((cert: any, idx: number) => (
              <li key={idx}>{cert.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Core Competencies */}
      {Array.isArray(cvData.core_competencies) && cvData.core_competencies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Core Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.core_competencies.map((comp: any, idx: number) => (
              <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">{comp.content}</span>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {cvData.cover_letter && cvData.cover_letter.content && <div className="mt-4"><h3 className="text-lg font-semibold mb-2">Cover Letter</h3><p>{cvData.cover_letter.content}</p></div>}
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
  // When sending to the assistant, always use the placeholder for contact_info
  // per frontend guidance: send as a string, not an array
  return {
    experience: arcData?.work_experience || [],
    education: arcData?.education || [],
    skills: arcData?.skills || [],
    certifications: arcData?.certifications || [],
    projects: arcData?.projects || [],
    training: arcData.training || [],
    // contact_info is omitted here; handled in payload below if needed
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

// Validation for assistant payload (PII-free)
function validatePIIFreeProfile(profile: any): string | null {
  if (!profile) return 'No profile data available';
  if (profile.name) return 'PII detected: name should not be sent to assistant';
  if (profile.contact_info) return 'PII detected: contact_info should not be sent to assistant';
  return null;
}

// Validation for final CV (for persist/download)
function validateFinalCV(cv: any): string | null {
  if (!cv) return 'No CV data available';
  if (!cv.name) return 'Missing candidate name';
  if (!cv.contact_info || !Array.isArray(cv.contact_info) || cv.contact_info.length === 0) return 'Missing contact information';
  if (!cv.experience || !Array.isArray(cv.experience) || cv.experience.length === 0) return 'Missing work experience';
  for (let i = 0; i < (cv.experience?.length || 0); i++) {
    if (!cv.experience[i].job_title) return `Missing job title for experience ${i + 1}`;
  }
  return null;
}

// Utility to inject real name into cover letter signature
function injectNameInCoverLetter(coverLetter: string, realName: string | undefined): string {
  if (!coverLetter) return '';
  if (!realName) return coverLetter;
  return coverLetter.replace(/\{\{CANDIDATE_NAME\}\}/g, realName);
}

// 1. TypeScript interfaces for new CV structure
interface PriorityContent {
  content: string;
  priority: number;
}
interface ExperienceEntry {
  job_title: string;
  company_name?: string;
  dates?: string;
  responsibilities: PriorityContent[];
}
interface EducationEntry extends PriorityContent {
  degree?: string;
  institution?: string;
  year?: string;
}
interface CVData {
  name: string;
  contact_info: string[];
  summary: PriorityContent;
  relevant_achievements?: PriorityContent[];
  experience: ExperienceEntry[];
  core_competencies?: PriorityContent[];
  education?: EducationEntry[];
  certifications?: PriorityContent[];
  cover_letter: PriorityContent;
  trimming_guide?: {
    [key: string]: string;
  };
}

// 2. Filtering utility
function filterByPriority(data: CVData, maxPriority: number): CVData {
  return {
    ...data,
    relevant_achievements: (data.relevant_achievements || []).filter(item => item.priority <= maxPriority),
    experience: (data.experience || []).map(role => ({
      ...role,
      responsibilities: (role.responsibilities || []).filter(item => item.priority <= maxPriority)
    })),
    core_competencies: (data.core_competencies || []).filter(item => item.priority <= maxPriority),
    certifications: (data.certifications || []).filter(item => item.priority <= maxPriority),
    education: (data.education || []).filter(item => item.priority <= maxPriority)
  };
}

logger.log('ApplicationWizard: file loaded');

const ApplicationWizard = () => {
  logger.log('ApplicationWizard: component function called');
  const { toast } = useToast();
  const { refreshCredits } = useContext(CreditsContext);
  // Commenting out all state and effects for minimal test
  // const [currentStep, setCurrentStep] = useState(1);
  // const [jobDescription, setJobDescription] = useState('');
  // const [extractedKeywords, setExtractedKeywords] = useState<Keyword[]>([]);
  // const [matchScore, setMatchScore] = useState(0);
  // const [jobTitle, setJobTitle] = useState('');
  // const [companyName, setCompanyName] = useState('');
  // const [isAnalyzing, setIsAnalyzing] = useState(false);
  // const [isGenerating, setIsGenerating] = useState(false);
  // const [showOptionsModal, setShowOptionsModal] = useState(false);
  // const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
  //   pages: 2,
  //   includeKeywords: true,
  //   includeRelevantExperience: true,
  // });
  // const [generatedCV, setGeneratedCV] = useState('');
  // const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  // const [profile, setProfile] = useState<any>(null);
  // const [arcData, setArcData] = useState<any>(null);
  // const [error, setError] = useState<string | null>(null);
  // const [threadId, setThreadId] = useState<string | null>(null);
  // const [showOutOfCreditsModal, setShowOutOfCreditsModal] = useState(false);
  // Add a new state to hold the structured CV data
  // const [structuredCV, setStructuredCV] = useState<any>(null);
  // const [showUpdateModal, setShowUpdateModal] = useState(false);
  // const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  // const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  // const [isUpdating, setIsUpdating] = useState(false);
  // const [selectedLanguage, setSelectedLanguage] = useState<string>('UK English');
  // Add state for salary, contactName, and contactNumber
  // const [salary, setSalary] = useState('');
  // const [contactName, setContactName] = useState('');
  // const [contactNumber, setContactNumber] = useState('');

  // 3. Add state for maxPriority and section toggles
  // const [maxPriority, setMaxPriority] = useState(2);
  // const [showAchievements, setShowAchievements] = useState(true);
  // const [showCompetencies, setShowCompetencies] = useState(true);
  // const [showCertifications, setShowCertifications] = useState(true);
  // const [showEducation, setShowEducation] = useState(true);

  // useEffect(() => {
  //   logger.log('ApplicationWizard mounted');
  // }, []);

  // useEffect(() => {
  //   logger.log('Current step:', currentStep);
  // }, [currentStep]);

  // useEffect(() => {
  //   if (structuredCV) {
  //     logger.log('structuredCV updated:', structuredCV);
  //   }
  // }, [structuredCV]);

  // useEffect(() => {
  //   if (error) {
  //     logger.error('ApplicationWizard error:', error);
  //   }
  // }, [error]);

  // Fetch user profile and arc data on mount
  // useEffect(() => {
  //   const fetchProfileAndArc = async () => {
  //     try {
  //       setError(null);
  //       const token = localStorage.getItem('token');
  //       if (!token) throw new Error('Not authenticated');
  //       logger.log('Fetching user profile...');
  //       const profileRes = await fetch('https://api-gw-production.up.railway.app/api/user/profile', {
  //         headers: { 'Authorization': `Bearer ${token}` },
  //         credentials: 'include',
  //       });
  //       if (!profileRes.ok) throw new Error('Failed to fetch user profile');
  //       const userProfile = await profileRes.json();
  //       setProfile(userProfile);
  //       logger.log('Fetched user profile:', userProfile);
  //       // 2. Get arc data
  //       logger.log('Fetching arc data...');
  //       const arcRes = await fetch(`https://api-gw-production.up.railway.app/api/v1/users/${userProfile.id}/all_sections`, {
  //         headers: { 'Authorization': `Bearer ${token}` },
  //       });
  //       if (!arcRes.ok) throw new Error('Failed to fetch arc data');
  //       const arc = await arcRes.json();
  //       setArcData(arc);
  //       logger.log('Fetched arc data:', arc);
  //     } catch (err: any) {
  //       setError(err.message || 'Failed to load profile/arc data');
  //       logger.error('Error fetching profile/arc data:', err);
  //     }
  //   };
  //   fetchProfileAndArc();
  // }, []);

  // Reset to step 1 if coming from menu
  // useEffect(() => {
  //   if (localStorage.getItem('resetApplyStep') === 'true') {
  //     setCurrentStep(1);
  //     setJobDescription('');
  //     setExtractedKeywords([]);
  //     setMatchScore(0);
  //     setJobTitle('');
  //     setCompanyName('');
  //     setGeneratedCV('');
  //     setGeneratedCoverLetter('');
  //     setThreadId(null);
  //     localStorage.removeItem('resetApplyStep');
  //   }
  // }, []);

  // Fetch credits on mount and after generation
  // const fetchCredits = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     const res = await fetch('https://api-gw-production.up.railway.app/api/user/credits', {
  //       headers: { 'Authorization': `Bearer ${token}` },
  //       credentials: 'include',
  //     });
  //     if (!res.ok) throw new Error('Failed to fetch credits');
  //     const data = await res.json();
  //     // setCredits(data); // This line is removed as credits are now managed by context
  //   } catch {}
  // };
  // useEffect(() => { fetchCredits(); }, []);

  // Helper to merge profile and arc data
  // const getMergedProfile = () => {
  //   if (!profile || !arcData) return null;
  //   return {
  //     ...profile,
  //     work_experience: arcData.work_experience || [],
  //     education: arcData.education || [],
  //     skills: arcData.skills || [],
  //     projects: arcData.projects || [],
  //     certifications: arcData.certifications || [],
  //     training: arcData.training || [],
  //   };
  // };

  // const steps = [
  //   { number: 1, title: 'Paste Job Description' },
  //   { number: 2, title: 'Review Arc Data & Keywords' },
  //   { number: 3, title: 'Review & Download' },
  // ];

  // Replace handleJobDescriptionNext with real API call
  // const handleJobDescriptionNext = async () => {
  //   if (!jobDescription.trim()) return;
  //   setIsAnalyzing(true);
  //   setError(null);
  //   // Mark application as submitted in localStorage
  //   localStorage.setItem('hasSubmittedApplication', 'true');
  //   setCurrentStep(2);
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     const mergedProfile = getMergedProfile();
  //     if (!mergedProfile) throw new Error('Profile data not loaded');
  //     // Build PII-free profile for assistant
  //     const piiFreeProfile = buildPIIFreeProfile(profile, arcData);
  //     // Dev-mode validation for PII
  //     if (process.env.NODE_ENV === 'development') {
  //       const piiError = validatePIIFreeProfile(piiFreeProfile);
  //       if (piiError) {
  //         // eslint-disable-next-line no-console
  //         logger.warn('PII validation failed:', piiError, piiFreeProfile);
  //       }
  //     }
  //     const result = await extractKeywords(piiFreeProfile, jobDescription, token);
  //     if (result.thread_id && !threadId) {
  //       setThreadId(result.thread_id);
  //     }
  //     setExtractedKeywords((result.keywords || []).map((kw: any) => ({ text: kw.keyword, status: kw.status })));
  //     setMatchScore(result.overall_match_percentage || 0);
  //     setJobTitle(result.job_title || '');
  //     setCompanyName(result.company_name || '');
  //     setSalary(result.salary || '');
  //     setContactName(result.contact_name || '');
  //     setContactNumber(result.contact_number || '');
  //     logger.log('Extracted keywords result:', result);
  //   } catch (err: any) {
  //     setError(err.message || 'Keyword extraction failed');
  //     logger.error('Error extracting keywords:', err);
  //     toast({ title: 'Error', description: err.message || 'Keyword extraction failed' });
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  // Refactored handleGenerate: only generate and preview, do not upload DOCX yet
  // const handleGenerate = async () => {
  //   setIsGenerating(true);
  //   setShowOptionsModal(false);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     const mergedProfile = getMergedProfile();
  //     if (!mergedProfile) throw new Error('Profile data not loaded');
  //     let payload;
  //     if (threadId) {
  //       payload = {
  //         action: 'generate_cv',
  //         thread_id: threadId
  //       };
  //     } else {
  //       // When sending to the assistant, use the placeholder for name and contact_info
  //       // per frontend guidance: send as strings, not arrays
  //       const profileForAI = {
  //         ...buildPIIFreeProfile(profile, arcData),
  //         name: "{{CANDIDATE_NAME}}",
  //         contact_info: "{{CONTACT_INFO}}"
  //       };
  //       payload = {
  //         action: 'generate_cv',
  //         profile: profileForAI,
  //         job_description: jobDescription
  //       };
  //     }
  //     // Generate both CV and Cover Letter in one call
  //     const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: 'include',
  //     });
  //     if (!res.ok) throw new Error('Failed to generate documents');
  //     const data = await res.json();
  //     const normalizedData = {
  //       ...data,
  //       relevant_achievements: Array.isArray(data.relevant_achievements) ? data.relevant_achievements : [],
  //     };
  //     if (normalizedData.thread_id && !threadId) {
  //       setThreadId(normalizedData.thread_id);
  //     }
  //     setGeneratedCV(normalizedData.cv || '');
  //     setGeneratedCoverLetter(normalizedData.cover_letter || '');
  //     setJobTitle(normalizedData.job_title || '');
  //     setCompanyName(normalizedData.company_name || '');
  //     setStructuredCV(normalizedData); // Store structured data
  //     logger.log('Generated CV data:', normalizedData);
  //     // Advance to preview step (step 3)
  //     setCurrentStep(3);
  //   } catch (err: any) {
  //     setError(err.message || 'Document generation failed');
  //     logger.error('Error generating CV:', err);
  //     toast({ title: 'Error', description: err.message || 'Document generation failed' });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // New handler: after preview, user clicks 'Save & Download' to generate/upload DOCX and persist CV
  // const handleSaveAndDownload = async () => {
  //   // Validate all required fields before proceeding
  //   const validationError = validateFinalCV(structuredCV);
  //   if (validationError) {
  //     setError(validationError);
  //     logger.error('CV validation failed:', validationError, structuredCV);
  //     toast({ title: 'Error', description: validationError });
  //     return;
  //   }
  //   setIsGenerating(true);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     // Debug log the payload
  //     logger.log('Sending structuredCV to /api/cv/generate-docx:', structuredCV);
  //     // 1. Generate DOCX blob
  //     const docxRes = await fetch('https://api-gw-production.up.railway.app/api/cv/generate-docx', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(structuredCV),
  //       credentials: 'include',
  //     });
  //     if (!docxRes.ok) throw new Error('Failed to generate DOCX');
  //     const docxBlob = await docxRes.blob();
  //     // 2. Ensure uniqueJobTitle and uniqueCompanyName are defined and checked for duplicates
  //     let uniqueJobTitle = jobTitle || structuredCV?.name || '';
  //     let uniqueCompanyName = companyName || structuredCV?.company_name || '';
  //     try {
  //       const existingRes = await fetch('/api/cv', {
  //         headers: { 'Authorization': `Bearer ${token}` },
  //         credentials: 'include',
  //       });
  //       if (existingRes.ok) {
  //         const existingCVs = await existingRes.json();
  //         const sameTitleCount = existingCVs.filter((cv: any) =>
  //           (cv.job_title || '') === uniqueJobTitle && (cv.company_name || '') === uniqueCompanyName
  //         ).length;
  //         if (sameTitleCount > 0) {
  //           uniqueJobTitle = `${uniqueJobTitle} (${sameTitleCount + 1})`;
  //         }
  //       }
  //     } catch (e) {
  //       // If fetch fails, just proceed with the original job title
  //     }
  //     // 3. Build persist payload
  //     const persistPayload = {
  //       cv_docx_b64: await blobToBase64(docxBlob),
  //       ...structuredCV,
  //       // Use the real user name from the profile, not the job title
  //       name: profile?.name || structuredCV?.name || '',
  //       job_title: uniqueJobTitle,
  //       company_name: uniqueCompanyName,
  //       // If contact_info is present and not a string placeholder, ensure it's an array
  //       contact_info: (structuredCV && typeof structuredCV.contact_info === 'string' && structuredCV.contact_info === "{{CONTACT_INFO}}")
  //         ? "{{CONTACT_INFO}}"
  //         : Array.isArray(structuredCV?.contact_info)
  //           ? structuredCV.contact_info
  //           : [],
  //       // Inject real name in cover letter signature
  //       cover_letter: injectNameInCoverLetter(structuredCV?.cover_letter, profile?.name),
  //     };
  //     logger.log('Persist payload for /api/cv:', persistPayload);
  //     // 4. Persist the CV
  //     const persistRes = await fetch('/api/cv', {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(persistPayload),
  //       credentials: 'include',
  //     });
  //     if (!persistRes.ok) {
  //       let errorMsg = 'Failed to save CV';
  //       try {
  //         const error = await persistRes.json();
  //         errorMsg = error.detail || error.message || errorMsg;
  //       } catch {}
  //       setError(errorMsg);
  //       logger.error('Error saving CV:', errorMsg);
  //       toast({ title: 'Error', description: errorMsg });
  //       throw new Error(errorMsg);
  //     }
  //     toast({ title: 'Documents Generated & Saved', description: 'Your CV and cover letter have been generated and saved!' });
  //     // Deduct a credit after successful generation
  //     try {
  //       const creditRes = await fetch('https://api-gw-production.up.railway.app/api/user/credits/use', {
  //         method: 'POST',
  //         headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
  //         body: JSON.stringify({ action: 'generate_cv' }),
  //         credentials: 'include',
  //       });
  //       if (!creditRes.ok) {
  //         setShowOutOfCreditsModal(true);
  //         await refreshCredits();
  //         return;
  //       }
  //       await refreshCredits();
  //     } catch (e) {
  //       logger.error('Error deducting credits:', e);
  //       setShowOutOfCreditsModal(true);
  //     }
  //     // In handleSaveAndDownload, after successful save (after toast for Documents Generated & Saved)
  //     // Save job application to backend (jobTitle, companyName, jobDescription, appliedAt)
  //     try {
  //       const applicationHistoryPayload = {
  //         job_title: uniqueJobTitle,
  //         company_name: uniqueCompanyName,
  //         job_description: jobDescription,
  //         applied_at: new Date().toISOString(),
  //         salary,
  //         contact_name: contactName,
  //         contact_number: contactNumber,
  //       };
  //       logger.log('POST to application-history endpoint:', 'https://api-gw-production.up.railway.app/api/application-history');
  //       logger.log('POST to application-history payload:', applicationHistoryPayload);
  //       const response = await createApplicationHistory(applicationHistoryPayload, token);
  //       logger.log('Application history response:', response);
  //     } catch (e) {
  //       logger.error('Failed to save job application history', e);
  //     }
  //     window.location.href = '/my-cvs-new';
  //   } catch (err: any) {
  //     setError(err.message || 'Document save failed');
  //     logger.error('Error saving documents:', err);
  //     toast({ title: 'Error', description: err.message || 'Document save failed' });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // Keyword extraction handler
  // const handleExtractKeywords = async (profile: any, jobDescription: string) => {
  //   setIsAnalyzing(true);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     let payload;
  //     if (threadId) {
  //       payload = {
  //         action: 'extract_keywords',
  //         thread_id: threadId
  //       };
  //     } else {
  //       payload = {
  //         action: 'extract_keywords',
  //         profile,
  //         job_description: jobDescription
  //       };
  //     }
  //     const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: 'include',
  //     });
  //     if (!res.ok) throw new Error('Keyword extraction failed');
  //     const data = await res.json();
  //     if (data.thread_id && !threadId) setThreadId(data.thread_id);
  //     setExtractedKeywords(data.keywords || []);
  //   } catch (err: any) {
  //     setError(err.message || 'Failed to extract keywords');
  //   } finally {
  //     setIsAnalyzing(false);
  //   }
  // };

  // const getKeywordColor = (status: Keyword['status']) => {
  //   switch (status) {
  //     case 'green': return 'success';
  //     case 'amber': return 'warning';
  //     case 'red': return 'destructive';
  //     default: return 'secondary';
  //   }
  // };

  // const getKeywordIcon = (status: Keyword['status']) => {
  //   switch (status) {
  //     case 'green': return <CheckCircle className="w-3 h-3" />;
  //     case 'amber': return <AlertCircle className="w-3 h-3" />;
  //     case 'red': return <XCircle className="w-3 h-3" />;
  //   }
  // };

  // Add useEffect to handle redirect after generation
  // Remove the useEffect that auto-redirects after generation

  // const handleApplyUpdates = async () => {
  //   setIsUpdating(true);
  //   // Do not close the modal immediately
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     if (!threadId) throw new Error('No thread ID available');
  //     // Prepare keypoints arrays
  //     const cv_keypoints = cvUpdateRequest
  //       .split('\n')
  //       .map(line => line.trim())
  //       .filter(line => line.length > 0);
  //     const cover_letter_keypoints = coverLetterUpdateRequest
  //       .split('\n')
  //       .map(line => line.trim())
  //       .filter(line => line.length > 0);
  //     // Map generationOptions.pages to string
  //     let cv_length = '2_to_3_pages';
  //     if (generationOptions.pages === 2) cv_length = '2_pages';
  //     if (generationOptions.pages === 3) cv_length = '3_pages';
  //     if (generationOptions.pages === 4) cv_length = '4_pages';
  //     // Build payload
  //     const payload = {
  //       action: 'update_cv',
  //       thread_id: threadId,
  //       cv_keypoints,
  //       cover_letter_keypoints,
  //       cv_length,
  //     };
  //     // Send to backend
  //     const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`,
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: 'include',
  //     });
  //     if (!res.ok) throw new Error('Failed to update documents');
  //     const data = await res.json();
  //     const normalizedData = {
  //       ...data,
  //       relevant_achievements: Array.isArray(data.relevant_achievements) ? data.relevant_achievements : [],
  //     };
  //     // Defensive merge: always preserve previous structuredCV fields
  //     setStructuredCV((prev: any) => ({
  //       ...prev,
  //       ...normalizedData,
  //     }));
  //     setGeneratedCV(normalizedData.cv || '');
  //     setGeneratedCoverLetter(normalizedData.cover_letter || '');
  //     setShowUpdateModal(false);
  //     setCvUpdateRequest('');
  //     setCoverLetterUpdateRequest('');
  //     toast({ title: 'Documents Updated', description: 'Your CV and cover letter have been updated with your requests!' });
  //   } catch (err: any) {
  //     toast({ title: 'Error', description: err.message || 'Failed to update documents' });
  //   } finally {
  //     setIsUpdating(false);
  //   }
  // };

  // const handleGenerateWithLanguage = async () => {
  //   setIsGenerating(true);
  //   setShowOptionsModal(false);
  //   setError(null);
  //   try {
  //     const token = localStorage.getItem('token');
  //     if (!token) throw new Error('Not authenticated');
  //     const mergedProfile = getMergedProfile();
  //     if (!mergedProfile) throw new Error('Profile data not loaded');
  //     // Always include profile and job_description, even if threadId is present
  //     const profileForAI = {
  //       ...buildPIIFreeProfile(profile, arcData),
  //       name: "{{CANDIDATE_NAME}}",
  //       contact_info: "{{CONTACT_INFO}}"
  //     };
  //     const payload = {
  //       action: 'generate_cv',
  //       thread_id: threadId || undefined,
  //       profile: profileForAI,
  //       job_description: jobDescription,
  //       language: selectedLanguage,
  //       numPages: generationOptions.pages,
  //       includeKeywords: generationOptions.includeKeywords,
  //       includeRelevantExperience: generationOptions.includeRelevantExperience,
  //     };
  //     const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `Bearer ${token}`
  //       },
  //       body: JSON.stringify(payload),
  //       credentials: 'include',
  //     });
  //     if (!res.ok) throw new Error('Failed to generate documents');
  //     const data = await res.json();
  //     const normalizedData = {
  //       ...data,
  //       relevant_achievements: Array.isArray(data.relevant_achievements) ? data.relevant_achievements : [],
  //     };
  //     if (normalizedData.thread_id && !threadId) {
  //       setThreadId(normalizedData.thread_id);
  //     }
  //     setGeneratedCV(normalizedData.cv || '');
  //     setGeneratedCoverLetter(normalizedData.cover_letter || '');
  //     setJobTitle(normalizedData.job_title || '');
  //     setCompanyName(normalizedData.company_name || '');
  //     setStructuredCV(normalizedData);
  //     setCurrentStep(3);
  //   } catch (err: any) {
  //     setError(err.message || 'Document generation failed');
  //     logger.error('Error generating CV with language:', err);
  //     toast({ title: 'Error', description: err.message || 'Document generation failed' });
  //   } finally {
  //     setIsGenerating(false);
  //   }
  // };

  // 1. Add useEffect to deduct credits when entering step 3
  // (Removed to prevent double deduction)

  // 2. Add beforeunload warning on step 3 if not saved
  // useEffect(() => {
  //   if (currentStep === 3) {
  //     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
  //       e.preventDefault();
  //       e.returnValue = "Are you sure you want to leave this page before this CV is saved - you won't be able to access it again.";
  //       return e.returnValue;
  //     };
  //     window.addEventListener('beforeunload', handleBeforeUnload);
  //     return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  //   }
  // }, [currentStep]);

  // const filteredCV = filterByPriority(structuredCV, maxPriority);
  // function renderFilteredCV() {
  //   if (!filteredCV || typeof filteredCV !== 'object') return <div>No CV data available.</div>;
  //   return renderStructuredCV({
  //     ...filteredCV,
  //     relevant_achievements: showAchievements && Array.isArray(filteredCV?.relevant_achievements) ? filteredCV.relevant_achievements : [],
  //     core_competencies: showCompetencies && Array.isArray(filteredCV?.core_competencies) ? filteredCV.core_competencies : [],
  //     certifications: showCertifications && Array.isArray(filteredCV?.certifications) ? filteredCV.certifications : [],
  //     education: showEducation && Array.isArray(filteredCV?.education) ? filteredCV.education : [],
  //   });
  // }

  // Log all key state values before rendering
  // logger.log('ApplicationWizard: currentStep', currentStep);
  // logger.log('ApplicationWizard: error', error);
  // logger.log('ApplicationWizard: profile', profile);
  // logger.log('ApplicationWizard: arcData', arcData);
  // logger.log('ApplicationWizard: structuredCV', structuredCV);

  // Early return logs
  // if (error) {
  //   logger.error('ApplicationWizard: returning early due to error', error);
  //   return <div>Error: {error}</div>;
  // }

  // Defensive early return to prevent TypeError on initial render
  // if (structuredCV == null) {
  //   logger.log('ApplicationWizard: structuredCV is null, rendering loading state');
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-16">
        <h1>Apply Flow Minimal Test</h1>
        <div>hello</div>
      </div>
    </div>
  );
};

export default ApplicationWizard; 