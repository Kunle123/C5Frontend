import React, { useState, useEffect } from 'react';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';
import { startSession } from '../api/cvWorkflowApi';
import { UserProfile } from '../api/cvWorkflowTypes';

interface Keyword {
  text: string;
  status: 'match' | 'partial' | 'missing';
}

interface GenerationOptions {
  length: 'short' | 'medium' | 'long';
  sections: {
    achievements: boolean;
    competencies: boolean;
    certifications: boolean;
    education: boolean;
  };
}

interface GeneratedDocuments {
  [key: string]: {
    cv: string;
    coverLetter: string;
  };
}

const BASE_URL = 'https://api-gw-production.up.railway.app';

// Helper to extract user_id from JWT
function getUserIdFromToken(token: string): string | null {
  try {
    const decoded: any = jwtDecode(token);
    return decoded.id || null;
  } catch {
    return null;
  }
}

function renderStructuredCV(cv: any, coverLetter?: any) {
  if (!cv) return <div>No CV data available.</div>;
  // If cv is a stringified JSON, parse it
  let parsedCV = cv;
  if (typeof cv === 'string') {
    try {
      parsedCV = JSON.parse(cv);
    } catch {
      // fallback to raw string
      return <div style={{ whiteSpace: 'pre-line' }}>{cv}</div>;
    }
  }
  return (
    <div>
      {parsedCV.name && <h2>{parsedCV.name}</h2>}
      {parsedCV.contact && (
        <div style={{ marginBottom: '1em' }}>
          {parsedCV.contact.email && <div><strong>Email:</strong> {parsedCV.contact.email}</div>}
          {parsedCV.contact.phone && <div><strong>Phone:</strong> {parsedCV.contact.phone}</div>}
          {parsedCV.contact.location && <div><strong>Location:</strong> {parsedCV.contact.location}</div>}
          {parsedCV.contact.linkedin && <div><strong>LinkedIn:</strong> {parsedCV.contact.linkedin}</div>}
        </div>
      )}
      {/* Professional Summary */}
      {parsedCV.professional_summary?.content && <p><strong>Summary:</strong> {parsedCV.professional_summary.content}</p>}
      {/* Key Achievements */}
      {Array.isArray(parsedCV.key_achievements) && parsedCV.key_achievements.length > 0 && (
        <div>
          <strong>Key Achievements:</strong>
          <ul>
            {parsedCV.key_achievements
              .slice()
              .sort((a: any, b: any) => (a.priority ?? 99) - (b.priority ?? 99))
              .map((a: any, i: number) => <li key={i}>{a.content}</li>)}
          </ul>
        </div>
      )}
      {/* Professional Experience */}
      {Array.isArray(parsedCV.professional_experience) && parsedCV.professional_experience.length > 0 ? (
        <div>
          <strong>Professional Experience:</strong>
          {parsedCV.professional_experience.map((exp: any, i: number) => (
            <div key={i} style={{ marginBottom: '1em' }}>
              <div><strong>{exp.title}</strong> at {exp.company} {exp.dates && <span>({exp.dates})</span>}</div>
              {Array.isArray(exp.bullets) && exp.bullets.length > 0 && (
                <ul>
                  {exp.bullets
                    .slice()
                    .sort((a: any, b: any) => (a.priority ?? 99) - (b.priority ?? 99))
                    .map((b: any, j: number) => <li key={j}>{b.content}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-muted-foreground">No work experience found. Please update your profile to add experience.</div>
      )}
      {/* Core Competencies/Skills */}
      {parsedCV.core_competencies && (
        <div>
          <strong>Core Competencies:</strong>
          <ul>
            {parsedCV.core_competencies.technical_skills && parsedCV.core_competencies.technical_skills.map((c: any, i: number) => (
              <li key={i}>{c.skill || c.job_aligned_skill} ({c.proficiency})</li>
            ))}
            {parsedCV.core_competencies.functional_skills && parsedCV.core_competencies.functional_skills.map((c: any, i: number) => (
              <li key={i + (parsedCV.core_competencies.technical_skills?.length || 0)}>{c.skill || c.job_aligned_skill} ({c.proficiency})</li>
            ))}
          </ul>
        </div>
      )}
      {/* Education */}
      {Array.isArray(parsedCV.education) && parsedCV.education.length > 0 ? (
        <div>
          <strong>Education:</strong>
          <ul>
            {parsedCV.education.map((e: any, i: number) => <li key={i}>{e.degree} - {e.institution} {e.year && `(${e.year})`}</li>)}
          </ul>
        </div>
      ) : (
        <div className="text-muted-foreground">No education history found. Please update your profile to add education.</div>
      )}
      {/* Cover Letter */}
      {coverLetter && (
        <div style={{ marginTop: '2em' }}>
          <strong>Cover Letter:</strong>
          <div style={{ whiteSpace: 'pre-line', marginTop: '0.5em' }}>{coverLetter.full_content || coverLetter.content || coverLetter}</div>
        </div>
      )}
    </div>
  );
}

const ApplicationWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [extractedKeywords, setExtractedKeywords] = useState<Keyword[]>([]);
  const [matchScore, setMatchScore] = useState(0);
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationOptions, setGenerationOptions] = useState<GenerationOptions>({
    length: 'medium',
    sections: {
      achievements: true,
      competencies: true,
      certifications: true,
      education: true,
    },
  });
  const [generatedDocuments, setGeneratedDocuments] = useState<GeneratedDocuments>({});
  const [selectedVariant, setSelectedVariant] = useState<string>('medium-all');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [profile, setProfile] = useState<any>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  // Add state for preview tab
  const [previewTab, setPreviewTab] = useState<'cv' | 'coverLetter'>('cv');

  // Add useEffect to update selectedVariant when generationOptions change
  useEffect(() => {
    const newKey = generateVariantKey(generationOptions.length, generationOptions.sections);
    setSelectedVariant(newKey);
  }, [generationOptions]);

  // On mount, fetch profile and start session
  useEffect(() => {
    if (!profile) {
      const fetchProfileAndStartSession = async () => {
        const token = localStorage.getItem('token') || '';
        const userId = getUserIdFromToken(token);
        if (!userId) return;
        // Fetch full profile
        const res = await fetch(`${BASE_URL}/api/v1/users/${userId}/all_sections`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setProfile(data);
        // Ensure name and email are present (use placeholders if missing)
        const safeProfile: UserProfile = {
          ...data,
          name: data.name || 'Candidate Name',
          email: data.email || 'candidate@email.com',
        };
        // Start session using API client
        try {
          const sessionData = await startSession({ profile: safeProfile, user_id: userId });
          setSessionId(sessionData.session_id);
        } catch (err: any) {
          // Optionally show error toast
          toast({ title: 'Session Error', description: err.detail || err.message || 'Could not start session', variant: 'destructive' });
        }
      };
      fetchProfileAndStartSession();
    }
  }, [profile]);

  // End session on unmount
  useEffect(() => {
    return () => {
      if (sessionId) {
        fetch(`${BASE_URL}/api/v1/cv/session/end`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ session_id: sessionId }),
        });
      }
    };
  }, [sessionId]);

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Keywords' },
    { number: 3, title: 'Preview' },
  ];

  // Step 1: On Next, call /cv/preview with session_id
  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim() || !sessionId) return;
    setIsAnalyzing(true);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${BASE_URL}/api/v1/cv/preview`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, job_description: jobDescription }),
      });
      const data = await res.json();
      // Use new flat structure
      setJobTitle(data.job_title || '');
      setCompanyName(data.company || '');
      // Keyword extraction: use keyword_priority (high/medium/low)
      const extracted: Keyword[] = [];
      if (data.keyword_priority) {
        (data.keyword_priority.high || []).forEach((k: string) => extracted.push({ text: k, status: 'match' }));
        (data.keyword_priority.medium || []).forEach((k: string) => extracted.push({ text: k, status: 'partial' }));
        (data.keyword_priority.low || []).forEach((k: string) => extracted.push({ text: k, status: 'missing' }));
      }
      setExtractedKeywords(extracted);
      // Match score: use profile_analysis.overall_match_score or keyword_match_analysis.keyword_coverage_percentage
      setMatchScore(
        Number(data.profile_analysis?.overall_match_score) ||
        Number(data.keyword_match_analysis?.keyword_coverage_percentage) ||
        0
      );
      setPreviewData(data);
      setCurrentStep(2);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Keyword extraction failed', variant: 'destructive' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const generateVariantKey = (length: string, sections: GenerationOptions['sections']) => {
    const sectionKeys = Object.entries(sections)
      .filter(([_, value]) => value)
      .map(([key, _]) => key)
      .sort()
      .join('-');
    return `${length}-${sectionKeys}`;
  };

  // Step 2: On Generate, call /cv/generate with session_id
  const handleGenerate = async () => {
    if (!sessionId || !previewData) return;
    setIsGenerating(true);
    setCurrentStep(3);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${BASE_URL}/api/v1/cv/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, job_description: jobDescription }),
      });
      const data = await res.json();
      // Parse cv and cover letter if they are stringified JSON
      let parsedCV = data.cv;
      if (typeof parsedCV === 'string') {
        try { parsedCV = JSON.parse(parsedCV); } catch {}
      }
      let parsedCoverLetter = data.cover_letter;
      if (typeof parsedCoverLetter === 'string') {
        try { parsedCoverLetter = JSON.parse(parsedCoverLetter); } catch {}
      }
      const newDocuments: GeneratedDocuments = {
        [selectedVariant]: {
          cv: parsedCV,
          coverLetter: parsedCoverLetter,
        },
      };
      setGeneratedDocuments(newDocuments);
      toast({ title: 'Documents Generated', description: 'Your CV and cover letter have been generated!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'CV generation failed', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRequestUpdates = () => {
    setShowUpdateModal(true);
  };

  // Step 3: On Apply Update, call /cv/update with session_id
  const handleApplyUpdates = async () => {
    if (!sessionId || !generatedDocuments[selectedVariant]) return;
    setIsUpdating(true);
    setShowUpdateModal(false);
    try {
      const token = localStorage.getItem('token') || '';
      const res = await fetch(`${BASE_URL}/api/v1/cv/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          session_id: sessionId,
          currentCV: generatedDocuments[selectedVariant].cv,
          updateRequest: cvUpdateRequest,
          job_description: jobDescription,
        }),
      });
      const data = await res.json();
      setGeneratedDocuments(prev => ({
        ...prev,
        [selectedVariant]: {
          ...prev[selectedVariant],
          cv: data.cv,
          coverLetter: data.cover_letter?.content || data.cover_letter || prev[selectedVariant].coverLetter,
        },
      }));
      setCvUpdateRequest('');
      setCoverLetterUpdateRequest('');
      toast({ title: 'Documents Updated', description: 'Your CV and cover letter have been updated!' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Update failed', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
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

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8 sticky top-16 z-20 bg-background pt-4 pb-2">
          {/* If your header height changes, adjust 'top-16' (64px) accordingly */}
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
        {currentStep === 1 && isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold">Analysing Job Description...</h3>
            <p className="text-muted-foreground">Please wait while we process your job description...</p>
          </div>
        )}
        {currentStep === 1 && !isAnalyzing && (
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
                disabled={!jobDescription.trim() || !profile}
                className="w-full"
              >
                Next: Review Arc Data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Keywords */}
        {currentStep === 2 && isAnalyzing && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
            <h3 className="text-lg font-semibold">Analysing Job Description...</h3>
            <p className="text-muted-foreground">Please wait while we extract keywords and analyse the requirements...</p>
          </div>
        )}
        {currentStep === 2 && !isAnalyzing && previewData && (
          <div className="space-y-6">
            {/* Job Analysis Panel */}
            <Card>
              <CardHeader>
                <CardTitle>Job Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Job Title</label>
                    <p className="font-semibold">{previewData.job_title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="font-semibold">{previewData.company}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                    <p className="font-semibold">{previewData.experience_level}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="font-semibold">{previewData.industry}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Technical Skills</label>
                  <p className="text-sm">{(previewData.technical_skills || []).join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Functional Skills</label>
                  <p className="text-sm">{(previewData.functional_skills || []).join(', ')}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Soft Skills</label>
                  <p className="text-sm">{(previewData.soft_skills || []).join(', ')}</p>
                </div>
              </CardContent>
            </Card>

            {/* Match Score & Profile Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${
                    matchScore >= 70 ? 'text-emerald-600' : 
                    matchScore >= 50 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {matchScore}%
                  </div>
                  <div className="flex-1">
                    <Progress value={matchScore} className="h-3" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {extractedKeywords.filter(k => k.status === 'match').length} / {extractedKeywords.length} keywords matched
                  </div>
                </div>
                {previewData.profile_analysis && (
                  <div className="mt-4 text-sm text-muted-foreground">
                    <div><strong>Confidence:</strong> {previewData.profile_analysis.match_confidence}</div>
                    <div><strong>Scoring Method:</strong> {previewData.profile_analysis.scoring_methodology}</div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Keyword Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Matched Keywords */}
              <Card className="border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-700 flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    High Priority Keywords
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Skills and experience that align most closely with the job requirements
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(previewData.keyword_priority?.high || []).map((keyword: string, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200 cursor-help hover:bg-emerald-100 transition-colors">
                              {keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">High priority: {keyword}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Medium Priority Keywords */}
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-amber-700 flex items-center gap-2">
                    <span className="text-lg">!</span>
                    Medium Priority Keywords
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Related skills that are important for the role
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(previewData.keyword_priority?.medium || []).map((keyword: string, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200 cursor-help hover:bg-amber-100 transition-colors">
                              {keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Medium priority: {keyword}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Low Priority Keywords */}
              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-rose-700 flex items-center gap-2">
                    <span className="text-lg">✗</span>
                    Low Priority Keywords
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Skills that are less critical but still relevant
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(previewData.keyword_priority?.low || []).map((keyword: string, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200 cursor-help hover:bg-rose-100 transition-colors">
                              {keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">Low priority: {keyword}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customisation Options */}
            <Card>
              <CardHeader>
                <CardTitle>Customisation Options</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Adjust how we tailor your documents to this specific role
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">CV Length</label>
                    <RadioGroup
                      value={generationOptions.length}
                      onValueChange={(val) => setGenerationOptions((prev) => ({ ...prev, length: val as 'short' | 'medium' | 'long' }))}
                      className="flex flex-row gap-4"
                    >
                      <RadioGroupItem value="short" id="short" />
                      <Label htmlFor="short">Short</Label>
                      <RadioGroupItem value="medium" id="medium" />
                      <Label htmlFor="medium">Medium</Label>
                      <RadioGroupItem value="long" id="long" />
                      <Label htmlFor="long">Long</Label>
                    </RadioGroup>
                    <label className="text-sm font-medium mt-4">Focus Areas</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="achievements"
                          checked={generationOptions.sections.achievements}
                          onCheckedChange={(checked) => setGenerationOptions((prev) => ({
                            ...prev,
                            sections: { ...prev.sections, achievements: !!checked },
                          }))}
                        />
                        <label htmlFor="achievements" className="text-sm">Focus on quantifiable achievements</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="competencies"
                          checked={generationOptions.sections.competencies}
                          onCheckedChange={(checked) => setGenerationOptions((prev) => ({
                            ...prev,
                            sections: { ...prev.sections, competencies: !!checked },
                          }))}
                        />
                        <label htmlFor="competencies" className="text-sm">Emphasise technical skills</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="certifications"
                          checked={generationOptions.sections.certifications}
                          onCheckedChange={(checked) => setGenerationOptions((prev) => ({
                            ...prev,
                            sections: { ...prev.sections, certifications: !!checked },
                          }))}
                        />
                        <label htmlFor="certifications" className="text-sm">Highlight certifications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="education"
                          checked={generationOptions.sections.education}
                          onCheckedChange={(checked) => setGenerationOptions((prev) => ({
                            ...prev,
                            sections: { ...prev.sections, education: !!checked },
                          }))}
                        />
                        <label htmlFor="education" className="text-sm">Include education</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="custom-instructions" className="text-sm font-medium">Custom Instructions</label>
                    <Textarea
                      id="custom-instructions"
                      placeholder="Any specific requirements or preferences for your application..."
                      className="min-h-[100px]"
                      value={userPreferences.instructions || ''}
                      onChange={(e) => setUserPreferences((prev: any) => ({ ...prev, instructions: e.target.value }))}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? "Generating Documents..." : "Generate Documents"}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading state for generating */}
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

        {/* Loading state for updating */}
        {isUpdating && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">Updating Your Documents</h3>
                <p className="text-muted-foreground">
                  Please wait while we apply your requested updates...
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* In the preview rendering (Step 3), use Tabs to toggle between CV and Cover Letter */}
        {currentStep === 3 && !isGenerating && !isUpdating && generatedDocuments[selectedVariant] && (
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={previewTab} onValueChange={(val) => setPreviewTab(val as 'cv' | 'coverLetter')} className="w-full mt-8">
                <TabsList className="mb-4">
                  <TabsTrigger value="cv">CV</TabsTrigger>
                  <TabsTrigger value="coverLetter">Cover Letter</TabsTrigger>
                </TabsList>
                <TabsContent value="cv" className="mt-4">
                  {renderStructuredCV(generatedDocuments[selectedVariant].cv)}
                </TabsContent>
                <TabsContent value="coverLetter" className="mt-4">
                  {renderStructuredCV(undefined, generatedDocuments[selectedVariant].coverLetter)}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Edit Request Modal */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Request an Update</DialogTitle>
            <p className="text-sm text-muted-foreground">
              Describe what you want changed in your CV or cover letter
            </p>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">CV Updates:</label>
              <Textarea
                placeholder="Describe what you want changed in your CV..."
                value={cvUpdateRequest}
                onChange={(e) => setCvUpdateRequest(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Cover Letter Updates:</label>
              <Textarea
                placeholder="Describe what you want changed in your cover letter..."
                value={coverLetterUpdateRequest}
                onChange={(e) => setCoverLetterUpdateRequest(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              onClick={handleApplyUpdates}
              disabled={!cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim()}
            >
              Apply Update
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApplicationWizard;