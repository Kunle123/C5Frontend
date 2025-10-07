import React, { useState, useEffect, useContext } from 'react';
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
import { Slider } from './ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCVSession } from '../hooks/useCVSession';
import { useCVPreview } from '../hooks/useCVPreview';
import { useCVGenerate } from '../hooks/useCVGenerate';
import { useCVUpdate } from '../hooks/useCVUpdate';
import { CreditsContext } from '../context/CreditsContext';

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

const ApplicationWizard = () => {
  const { toast } = useToast();
  const { credits, refreshCredits } = useContext(CreditsContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
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
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [maxRoles, setMaxRoles] = useState<number>(0); // 0 means show all roles

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Keywords' },
    { number: 3, title: 'Preview' },
  ];

  const { sessionId, startSession, endSession, loading: sessionLoading, error: sessionError } = useCVSession();
  const { preview, getPreview, loading: previewLoading, error: previewError } = useCVPreview();
  const { cv, coverLetter, generateCV, loading: generateLoading, error: generateError } = useCVGenerate();
  const { updatedCV, updateCV, loading: updateLoading, error: updateError } = useCVUpdate();

  // Auth/session - get user_id from JWT
  const userToken = localStorage.getItem('token') || '';
  const userId = (() => {
    try {
      return JSON.parse(atob(userToken.split('.')[1])).id;
    } catch {
      return '';
    }
  })();

  // Start session on mount
  useEffect(() => {
    if (!sessionId && userId && userToken) {
      startSession(userId, userToken);
    }
    // End session on unmount
    return () => {
      if (sessionId && userToken) endSession(userToken);
    };
    // eslint-disable-next-line
  }, [userId, userToken]);

  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    setCurrentStep(2);
    
    try {
      if (sessionId) {
        await getPreview(sessionId, jobDescription, userToken);
      }
      setIsAnalyzing(false);
    } catch (err) {
      toast({
        title: "Error Analysing Job Description",
        description: err instanceof Error ? err.message : "Failed to analyse job description.",
        variant: "destructive",
      });
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

  const handleGenerate = async () => {
    setIsGenerating(true);
    setCurrentStep(3);
    
    try {
      if (sessionId) {
        await generateCV(sessionId, jobDescription, userToken);
        
        // Set max roles based on the generated CV
        const totalRoles = (cv as any)?.professional_experience?.roles?.length || 0;
        setMaxRoles(totalRoles); // Initialize to show all roles
        
        // Refresh credits after successful generation (backend should have deducted automatically)
        setTimeout(async () => {
          await refreshCredits();
        }, 1000); // Small delay to ensure backend has processed
        
        toast({
          title: "Documents Generated",
          description: "All CV variations have been successfully generated! 1 credit used.",
        });
      }
      setIsGenerating(false);
    } catch (err) {
      toast({
        title: "Error Generating Documents",
        description: err instanceof Error ? err.message : "Failed to generate documents.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  const handleSaveAndDownload = async () => {
    if (!cv || !coverLetter) {
      toast({
        title: "No Documents to Save",
        description: "Please generate documents first.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Save CV to database - use the structure that matches the API expectation
      const saveRes = await fetch('https://api-gw-production.up.railway.app/api/cvs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          name: `CV for ${(preview?.job_analysis as any)?.job_title || preview?.job_analysis?.summary || 'Job Application'}`,
          description: `Generated for ${(preview?.job_analysis as any)?.job_title || 'job application'}`,
          template_id: 'default',
          is_default: false,
          type: 'cv',
          summary: (cv as any).professional_summary?.content || '',
          experience: ((cv as any).professional_experience?.roles || [])
            .slice(0, maxRoles || ((cv as any).professional_experience?.roles || []).length)
            .map((role: any) => ({
              job_title: role.title || '',
              company_name: role.company || '',
              start_date: role.start_date || '',
              end_date: role.end_date || '',
              location: role.location || '',
              bullets: (role.bullets || []).map((b: any) => b.content || b).filter((c: string) => c)
            })),
          education: ((cv as any).education || []).map((edu: any) => ({
            degree: edu.degree || '',
            institution: edu.institution || '',
            year: String(edu.graduation_date || edu.year || ''),
            classification: edu.classification || ''
          })),
          skills: [
            ...((cv as any).technical_skills?.priority_1 || []),
            ...((cv as any).technical_skills?.priority_2 || []),
            ...((cv as any).technical_skills?.priority_3 || []),
            ...((cv as any).soft_skills?.priority_1 || []),
            ...((cv as any).soft_skills?.priority_2 || [])
          ].filter(s => s),
          contact: (cv as any).personal_information?.name || 'Candidate',
          cover_letter: (coverLetter as any)?.content || '',
        }),
      });

      if (!saveRes.ok) {
        const errorData = await saveRes.json();
        console.error('CV Save Error:', errorData);
        throw new Error(errorData.detail || errorData.message || 'Failed to save CV');
      }
      const saveResult = await saveRes.json();

      toast({
        title: "CV Saved Successfully",
        description: "Your CV has been saved and is ready for download.",
      });

      // Redirect to My CVs page
      window.location.href = '/my-cvs-new';
      
    } catch (err) {
      toast({
        title: "Error Saving CV",
        description: err instanceof Error ? err.message : "Failed to save CV.",
        variant: "destructive",
      });
    }
  };

  const handleRequestUpdates = () => {
    setShowUpdateModal(true);
  };

  const handleApplyUpdates = async () => {
    setIsUpdating(true);
    setShowUpdateModal(false);
    
    try {
      if (sessionId && cv) {
        await updateCV(sessionId, cv, cvUpdateRequest, jobDescription, userToken);
      }
      // setGeneratedDocuments(preview?.generatedDocuments || {}); // This line is removed as per the edit hint
      // setSelectedVariant(preview?.selectedVariant || generateVariantKey(generationOptions.length, generationOptions.sections)); // This line is removed as per the edit hint
      setIsUpdating(false);
      setCvUpdateRequest('');
      setCoverLetterUpdateRequest('');
      
      toast({
        title: "Documents Updated",
        description: "Your CV and cover letter have been updated with your requests!",
      });
    } catch (err) {
      toast({
        title: "Error Updating Documents",
        description: err instanceof Error ? err.message : "Failed to update documents.",
        variant: "destructive",
      });
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

  const renderCV = (cvData: any) => {
    if (!cvData || !cvData.cv) return <div>No CV data available.</div>;
    
    const cv = cvData.cv;
    const selectedLength = generationOptions.length;
    
    // Filter content based on priority and selected length
    const getPriorityThreshold = () => {
      if (selectedLength === 'short') return 1; // Only priority 1
      if (selectedLength === 'medium') return 2; // Priority 1-2
      if (selectedLength === 'long') return 3; // Priority 1-3
      return 3;
    };
    
    const shouldShowByPriority = (item: any) => {
      return item.priority <= getPriorityThreshold();
    };
    
    return (
      <div className="space-y-6 text-sm">
        {/* Personal Information - Always included */}
        {cv.personal_information && (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold">{cv.personal_information.name}</h2>
              <p className="text-lg text-muted-foreground">{cv.personal_information.professional_title}</p>
              <p className="text-sm">{cv.personal_information.contact} | {cv.personal_information.location}</p>
            </div>
          </div>
        )}

        {/* Professional Summary - Always included */}
        {cv.professional_summary && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Professional Summary</h3>
            <p className="leading-relaxed">{cv.professional_summary.content}</p>
          </div>
        )}

        {/* Professional Experience - Always included */}
        {cv.professional_experience && Array.isArray(cv.professional_experience.roles) && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Professional Experience</h3>
            {cv.professional_experience.roles
              .slice(0, maxRoles || cv.professional_experience.roles.length) // Trim to maxRoles
              .map((role: any, i: number) => (
              <div key={i} className="mb-4 border-l-2 border-primary/20 pl-4">
                <div className="font-medium text-base">
                  {role.title} | {role.company}
                </div>
                <div className="text-muted-foreground text-sm mb-2">
                  {role.start_date} - {role.end_date}
                  {role.location && <span className="ml-2">| {role.location}</span>}
                </div>
                {Array.isArray(role.bullets) && (
                  <ul className="list-disc ml-4 space-y-1">
                    {role.bullets
                      .filter((bullet: any) => shouldShowByPriority(bullet))
                      .map((bullet: any, j: number) => (
                        <li key={j} className="text-sm">{bullet.content}</li>
                      ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Achievements Section - Toggleable */}
        {cv.achievements && generationOptions.sections.achievements && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Key Achievements</h3>
            <ul className="list-disc ml-4 space-y-1">
              {cv.achievements
                .filter((achievement: any) => shouldShowByPriority(achievement))
                .map((achievement: any, i: number) => (
                  <li key={i} className="text-sm">{achievement.content}</li>
                ))}
            </ul>
          </div>
        )}

        {/* Technical Skills - Toggleable */}
        {cv.technical_skills && generationOptions.sections.competencies && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Technical Skills</h3>
            <div className="space-y-2">
              {cv.technical_skills.priority_1 && cv.technical_skills.priority_1.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cv.technical_skills.priority_1.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/10 text-primary rounded text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {selectedLength !== 'short' && cv.technical_skills.priority_2 && cv.technical_skills.priority_2.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cv.technical_skills.priority_2.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/20 text-primary rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {selectedLength === 'long' && cv.technical_skills.priority_3 && cv.technical_skills.priority_3.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cv.technical_skills.priority_3.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-primary/30 text-primary rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Soft Skills - Toggleable */}
        {cv.soft_skills && generationOptions.sections.competencies && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Soft Skills</h3>
            <div className="space-y-2">
              {cv.soft_skills.priority_1 && cv.soft_skills.priority_1.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cv.soft_skills.priority_1.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-secondary/10 text-secondary-foreground rounded text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
              {selectedLength !== 'short' && cv.soft_skills.priority_2 && cv.soft_skills.priority_2.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {cv.soft_skills.priority_2.map((skill: string, i: number) => (
                    <span key={i} className="px-3 py-1 bg-secondary/20 text-secondary-foreground rounded text-sm">
                      {skill}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Education Section - Toggleable */}
        {cv.education && generationOptions.sections.education && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Education</h3>
            {cv.education
              .filter((edu: any) => shouldShowByPriority(edu))
              .map((edu: any, i: number) => (
                <div key={i} className="mb-2">
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-muted-foreground">{edu.institution} ({edu.graduation_date})</div>
                  {edu.classification && <div className="text-sm text-muted-foreground">{edu.classification}</div>}
                </div>
              ))}
          </div>
        )}

        {/* Certifications Section - Toggleable */}
        {cv.certifications && generationOptions.sections.certifications && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Certifications</h3>
            <div className="space-y-2">
              {cv.certifications
                .filter((cert: any) => shouldShowByPriority(cert))
                .map((cert: any, i: number) => (
                  <div key={i}>
                    <div className="font-medium">{cert.name}</div>
                    <div className="text-muted-foreground text-sm">{cert.issuer} ({cert.date})</div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Projects Section - Toggleable (if enabled in options) */}
        {cv.projects && selectedLength === 'long' && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Key Projects</h3>
            {cv.projects
              .filter((project: any) => shouldShowByPriority(project))
              .map((project: any, i: number) => (
                <div key={i} className="mb-3">
                  <div className="font-medium">{project.name}</div>
                  <p className="text-sm text-muted-foreground mt-1">{project.description}</p>
                </div>
              ))}
          </div>
        )}

        {/* Languages - Only in long CV */}
        {cv.languages && selectedLength === 'long' && cv.languages.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Languages</h3>
            <div className="flex flex-wrap gap-2">
              {cv.languages.map((lang: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                  {lang}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Interests - Only in long CV */}
        {cv.interests && selectedLength === 'long' && cv.interests.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-2">Interests</h3>
            <div className="flex flex-wrap gap-2">
              {cv.interests.map((interest: string, i: number) => (
                <span key={i} className="px-2 py-1 bg-muted text-muted-foreground rounded text-sm">
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderCoverLetter = (data: any) => {
    if (!data || !data.cover_letter) return <div>No cover letter data available.</div>;
    
    const coverLetter = data.cover_letter;
    
    return (
      <div className="space-y-4">
        <div className="whitespace-pre-line text-sm leading-relaxed">
          {coverLetter.content}
        </div>
        <div className="flex justify-between items-center text-xs text-muted-foreground border-t pt-2">
          <span>Word count: {coverLetter.word_count}</span>
          <span>Keywords included: {(coverLetter.keywords_included || []).join(', ')}</span>
        </div>
        {coverLetter.evidence_source && (
          <div className="text-xs text-muted-foreground">
            Evidence: {coverLetter.evidence_source}
          </div>
        )}
      </div>
    );
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
                disabled={!jobDescription.trim() || sessionLoading}
                className="w-full"
              >
                Next: Review Arc Data
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Keywords */}
        {currentStep === 2 && !isAnalyzing && preview && (
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
                    <p className="font-semibold">{(preview.job_analysis as any)?.job_title || preview.job_analysis?.summary || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Company</label>
                    <p className="font-semibold">{(preview.job_analysis as any)?.company || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Experience Level</label>
                    <p className="font-semibold">{(preview.job_analysis as any)?.experience_level || 'Not specified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Industry</label>
                    <p className="font-semibold">{(preview.job_analysis as any)?.industry || 'Not specified'}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Key Requirements</label>
                  <p className="text-sm">{(preview.job_analysis?.keywords || []).join(', ') || 'No requirements identified'}</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Strengths</label>
                    <p className="text-sm">{(preview.profile_match?.strengths || []).join(', ') || 'No strengths identified'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gaps</label>
                    <p className="text-sm">{(preview.profile_match?.gaps || []).join(', ') || 'No gaps identified'}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium text-muted-foreground">Evidence Source</label>
                  <p className="text-sm">{preview.profile_match?.evidence_source || 'No evidence source available'}</p>
                </div>
              </CardContent>
            </Card>

            {/* Match Score */}
            <Card>
              <CardHeader>
                <CardTitle>Match Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4">
                  <div className={`text-3xl font-bold ${
                    (preview.profile_match?.match_score || 0) >= 70 ? 'text-emerald-600' : 
                    (preview.profile_match?.match_score || 0) >= 50 ? 'text-amber-600' : 'text-rose-600'
                  }`}>
                    {preview.profile_match?.match_score || 0}%
                    </div>
                  <div className="flex-1">
                    <Progress value={preview.profile_match?.match_score || 0} className="h-3" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {(preview.keyword_coverage?.present_in_profile || []).length} / {((preview.keyword_coverage?.present_in_profile || []).length + (preview.keyword_coverage?.missing_from_profile || []).length)} keywords matched
                        </div>
                      </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <div><strong>Evidence:</strong> {preview.profile_match?.evidence_source || 'No evidence available'}</div>
                    </div>
              </CardContent>
            </Card>

            {/* Keyword Analysis - RAG Status */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Green Keywords - Strong Match */}
              <Card className="border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-700 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Strong Match
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Direct evidence in your profile
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {((preview.keyword_coverage as any)?.keywords || preview.keyword_coverage?.present_in_profile || [])
                      .filter((kw: any) => typeof kw === 'object' ? kw.status === 'green' : true)
                      .map((keyword: any, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-sm border border-emerald-200 cursor-help hover:bg-emerald-100 transition-colors">
                              {typeof keyword === 'object' ? keyword.keyword : keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {typeof keyword === 'object' && keyword.evidence 
                                ? keyword.evidence 
                                : `Found in your ${typeof keyword === 'object' ? keyword.profile_section : 'profile'}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Amber Keywords - Partial Match */}
              <Card className="border-amber-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-amber-700 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4" />
                    Partial Match
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Related experience found
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {((preview.keyword_coverage as any)?.keywords || [])
                      .filter((kw: any) => kw.status === 'amber')
                      .map((keyword: any, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-sm border border-amber-200 cursor-help hover:bg-amber-100 transition-colors">
                              {keyword.keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">{keyword.evidence}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Red Keywords - No Match */}
              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-rose-700 flex items-center gap-2">
                    <XCircle className="w-4 h-4" />
                    No Match
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Not found in your profile
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {((preview.keyword_coverage as any)?.keywords || preview.keyword_coverage?.missing_from_profile || [])
                      .filter((kw: any) => typeof kw === 'object' ? kw.status === 'red' : true)
                      .map((keyword: any, idx: number) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="px-3 py-1 bg-rose-50 text-rose-700 rounded-full text-sm border border-rose-200 cursor-help hover:bg-rose-100 transition-colors">
                              {typeof keyword === 'object' ? keyword.keyword : keyword}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="max-w-xs">
                              {typeof keyword === 'object' && keyword.evidence 
                                ? keyword.evidence 
                                : `Consider highlighting related experience or learning agility for ${typeof keyword === 'object' ? keyword.keyword : keyword}`}
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customization Options */}
            <Card>
              <CardHeader>
                <CardTitle>Customization Options</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Adjust how we tailor your documents to this specific role
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium">Focus Areas</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="technical" className="rounded" defaultChecked />
                        <label htmlFor="technical" className="text-sm">Emphasize technical skills</label>
              </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="leadership" className="rounded" />
                        <label htmlFor="leadership" className="text-sm">Highlight leadership experience</label>
            </div>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="achievements" className="rounded" defaultChecked />
                        <label htmlFor="achievements" className="text-sm">Focus on quantifiable achievements</label>
          </div>
                    </div>
                </div>
                  <div className="space-y-3">
                    <label htmlFor="custom-instructions" className="text-sm font-medium">Custom Instructions</label>
                    <Textarea 
                      id="custom-instructions"
                      placeholder="Any specific requirements or preferences for your application..."
                      className="min-h-[100px]"
                    />
                  </div>
                    </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={isGenerating || sessionLoading}>
                  {isGenerating ? "Generating Documents..." : "Generate Documents"}
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Loading state for analyzing */}
        {currentStep === 2 && isAnalyzing && (
            <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">Analysing Job Description</h3>
                <p className="text-muted-foreground">
                  Please wait while we extract keywords and analyse the requirements...
                </p>
                    </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Preview CV & Cover Letter */}
        {currentStep === 3 && !isGenerating && !isUpdating && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview Your CV & Cover Letter</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Review your generated documents below. You can switch between length and section options to see different variations.
                </p>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Document Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Page Length:</Label>
                    <RadioGroup
                      value={generationOptions.length}
                      onValueChange={(value: 'short' | 'medium' | 'long') => {
                        setGenerationOptions(prev => ({ ...prev, length: value }));
                        // setSelectedVariant(generateVariantKey(value, generationOptions.sections)); // This line is removed as per the edit hint
                      }}
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="short" id="short" />
                        <Label htmlFor="short">Short</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="medium" id="medium" />
                        <Label htmlFor="medium">Medium</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="long" id="long" />
                        <Label htmlFor="long">Long</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Include sections:</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="achievements"
                          checked={generationOptions.sections.achievements}
                          onCheckedChange={(checked) => {
                            const newSections = { ...generationOptions.sections, achievements: checked as boolean };
                            setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                            // setSelectedVariant(generateVariantKey(generationOptions.length, newSections)); // This line is removed as per the edit hint
                          }}
                        />
                        <Label htmlFor="achievements" className="text-sm">Achievements</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="competencies"
                          checked={generationOptions.sections.competencies}
                          onCheckedChange={(checked) => {
                            const newSections = { ...generationOptions.sections, competencies: checked as boolean };
                            setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                            // setSelectedVariant(generateVariantKey(generationOptions.length, newSections)); // This line is removed as per the edit hint
                          }}
                        />
                        <Label htmlFor="competencies" className="text-sm">Competencies</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="certifications"
                          checked={generationOptions.sections.certifications}
                          onCheckedChange={(checked) => {
                            const newSections = { ...generationOptions.sections, certifications: checked as boolean };
                            setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                            // setSelectedVariant(generateVariantKey(generationOptions.length, newSections)); // This line is removed as per the edit hint
                          }}
                        />
                        <Label htmlFor="certifications" className="text-sm">Certifications</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="education"
                          checked={generationOptions.sections.education}
                          onCheckedChange={(checked) => {
                            const newSections = { ...generationOptions.sections, education: checked as boolean };
                            setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                            // setSelectedVariant(generateVariantKey(generationOptions.length, newSections)); // This line is removed as per the edit hint
                          }}
                        />
                        <Label htmlFor="education" className="text-sm">Education</Label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Work Experience Trimmer */}
                {(cv as any)?.professional_experience?.roles && (cv as any).professional_experience.roles.length > 0 && (
                  <div className="space-y-3 p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-medium">Number of Work Experiences to Include:</Label>
                      <span className="text-sm font-semibold text-primary">
                        {maxRoles || (cv as any).professional_experience.roles.length} of {(cv as any).professional_experience.roles.length} roles
                      </span>
                    </div>
                    <Slider
                      min={1}
                      max={(cv as any).professional_experience.roles.length}
                      step={1}
                      value={[maxRoles || (cv as any).professional_experience.roles.length]}
                      onValueChange={(value) => setMaxRoles(value[0])}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Adjust the slider to include fewer work experiences. The most recent roles will be shown first.
                    </p>
                  </div>
                )}

                {/* Document Preview with Tabs */}
                {(cv || coverLetter) ? (
                  <div className="space-y-4">
                <Tabs defaultValue="cv" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cv">CV</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>
                      
                  <TabsContent value="cv" className="space-y-4">
                        {/* CV Validation Badges */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Factual Accuracy
                          </Badge>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Job Alignment
                          </Badge>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Anti-Fabrication
                          </Badge>
                        </div>

                        {/* Included Keywords */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Included Keywords:</h4>
                          <div className="flex flex-wrap gap-1">
                            {(preview?.keyword_coverage?.present_in_profile || []).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Alignment Score */}
                        <div className="mb-4">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium">Alignment Score:</span>
                            <span className="text-sm font-bold text-emerald-600">{preview?.profile_match?.match_score || 0}%</span>
                            <Progress value={preview?.profile_match?.match_score || 0} className="flex-1 h-2" />
                          </div>
                        </div>

                        {/* CV Content */}
                        <div className="border rounded-lg p-6 bg-muted/50 min-h-[400px]">
                          {cv ? renderCV({ cv }) : <div>No CV data available</div>}
                    </div>
                  </TabsContent>
                      
                  <TabsContent value="cover-letter" className="space-y-4">
                        {/* Cover Letter Validation Badges */}
                        <div className="flex items-center gap-2 mb-4">
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Tone & Style
                          </Badge>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Job Alignment
                          </Badge>
                          <Badge variant="success" className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Professional Format
                          </Badge>
                    </div>

                        {/* Included Keywords */}
                        <div className="mb-4">
                          <h4 className="text-sm font-medium mb-2">Included Keywords:</h4>
                          <div className="flex flex-wrap gap-1">
                            {(preview?.keyword_coverage?.present_in_profile || []).slice(0, 6).map((keyword, idx) => (
                              <span key={idx} className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                                {keyword}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Cover Letter Content */}
                        <div className="border rounded-lg p-6 bg-muted/50 min-h-[400px]">
                          {coverLetter ? renderCoverLetter({ cover_letter: coverLetter }) : <div>No cover letter data available</div>}
                        </div>
                  </TabsContent>
                </Tabs>
                  </div>
                ) : (
                  <div className="border rounded-lg p-8 bg-muted/50 text-center">
                    <p className="text-muted-foreground">Your documents will appear here after generation</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-4">
                  {(cv || coverLetter) ? (
                    <>
                  <Button
                    variant="outline"
                        onClick={handleRequestUpdates}
                  >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit/Request Update
                  </Button>
                      <Button
                        onClick={handleSaveAndDownload}
                        className="flex-1"
                      >
                        Save & Go to Downloads
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={handleGenerate}
                      className="w-full"
                    >
                      Generate CV & Cover Letter
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
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
              disabled={!cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim() || updateLoading}
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