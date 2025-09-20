import React, { useState, useContext, useEffect } from 'react';
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
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft, Loader2 } from 'lucide-react';
import { extractKeywords, generateApplicationMaterials, updateCV, getArcData } from '../api/careerArkApi';
import { CreditsContext } from '../context/CreditsContext';
import { createApplicationHistory } from '../api';

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
  const [arcData, setArcData] = useState<any>(null);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  // Add state for DOCX download
  const [docxData, setDocxData] = useState<{ cv?: string; cover_letter?: string } | null>(null);
  const [isDocxGenerating, setIsDocxGenerating] = useState(false);

  useEffect(() => {
    // Fetch Arc Data and user profile on mount
    (async () => {
      try {
        const arc = await getArcData();
        setArcData(arc);
        // Optionally fetch user profile if needed
      } catch (err) {
        setArcData(null);
      }
    })();
  }, []);

  useEffect(() => {
    console.log('STATE CHANGE: currentStep', currentStep);
  }, [currentStep]);
  useEffect(() => {
    console.log('STATE CHANGE: selectedVariant', selectedVariant);
  }, [selectedVariant]);
  useEffect(() => {
    console.log('STATE CHANGE: generatedDocuments', generatedDocuments);
    console.log('All keys in generatedDocuments:', Object.keys(generatedDocuments));
  }, [generatedDocuments]);

  console.log('ApplicationWizard render, currentStep:', currentStep);

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Keywords' },
    { number: 3, title: 'Preview' },
  ];

  // Utility to trigger DOCX download
  const downloadBase64Docx = (base64: string, filename: string = 'cv.docx') => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Step 1: Extract Keywords (correct endpoint/payload)
  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    try {
      const profile = { ...(userProfile || {}), ...(arcData || {}) };
      const payload = {
        action: 'extract_keywords',
        profile,
        job_description: jobDescription,
      };
      const res = await fetch('/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setExtractedKeywords(
        (result.keywords || []).map((kw: any) =>
          typeof kw === 'string'
            ? { text: kw, status: 'match' }
            : { text: kw.keyword, status: kw.status || 'match' }
        )
      );
      setMatchScore(result.overall_match_percentage ?? result.match_percentage ?? 0);
      setJobTitle(result.job_title || '');
      setCompanyName(result.company_name || '');
      setThreadId(result.thread_id || null);
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

  // Step 2: Generate CV (correct endpoint/payload)
  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const profile = { ...(userProfile || {}), ...(arcData || {}) };
      const payload: any = {
          action: 'generate_cv',
        profile,
        job_description: jobDescription,
        numPages: generationOptions.length === 'short' ? 1 : generationOptions.length === 'medium' ? 2 : 3,
        includeKeywords: true,
        includeRelevantExperience: true,
        thread_id: threadId,
      };
      const res = await fetch('/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      const variantKey = generateVariantKey(generationOptions.length, generationOptions.sections);
      setGeneratedDocuments({
        [variantKey]: {
          cv: result.cv ? result.cv : result, // Store structured CV if .cv is missing
          coverLetter: result.cover_letter || result.coverLetter || '',
        },
      });
      setSelectedVariant(variantKey);
      setJobTitle(result.job_title || '');
      setCompanyName(result.company_name || '');
      setCurrentStep(3);
      toast({ title: 'Documents Generated', description: 'Your CV and cover letter have been generated.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'CV generation failed', variant: 'destructive' });
    } finally {
      setIsGenerating(false);
    }
  };

  // Step 3: Generate DOCX from CV JSON
  const handleGenerateDocx = async () => {
    setIsDocxGenerating(true);
    try {
      const cvJson = generatedDocuments[selectedVariant]?.cv;
      if (!cvJson) throw new Error('No CV data to generate DOCX');
      const res = await fetch('/api/cv/generate-docx', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ cv: cvJson }),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      setDocxData(result);
      if (result.cv) downloadBase64Docx(result.cv, 'cv.docx');
      if (result.cover_letter) downloadBase64Docx(result.cover_letter, 'cover_letter.docx');
      toast({ title: 'DOCX Generated', description: 'Your CV and cover letter DOCX files are ready.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'DOCX generation failed', variant: 'destructive' });
    } finally {
      setIsDocxGenerating(false);
    }
  };

  // Step 4: Persist Application History
  const handleSaveApplicationHistory = async () => {
    try {
      const token = localStorage.getItem('token') || '';
      const payload = {
        job_title: jobTitle,
        company_name: companyName,
        job_description: jobDescription,
        applied_at: new Date().toISOString(),
      };
      await createApplicationHistory(payload, token);
      toast({ title: 'Application Saved', description: 'Application history has been saved.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save application history', variant: 'destructive' });
    }
  };

  const handleRequestUpdates = () => {
    setShowUpdateModal(true);
  };

  const handleApplyUpdates = async () => {
    setIsUpdating(true);
    setShowUpdateModal(false);
    try {
      // Merge arcData and userProfile for richer profile
      const profile = {
        ...(userProfile || {}),
        ...(arcData || {}),
      };
      const existing_cv = generatedDocuments[selectedVariant]?.cv || '';
      const result = await updateCV(profile, jobDescription, existing_cv, [cvUpdateRequest, coverLetterUpdateRequest].filter(Boolean));
      if (result.error) throw new Error(result.error);
      setGeneratedDocuments(prev => ({
        ...prev,
        [selectedVariant]: {
          ...prev[selectedVariant],
          cv: result.cv || prev[selectedVariant]?.cv,
          coverLetter: result.cover_letter || result.coverLetter || prev[selectedVariant]?.coverLetter,
        },
      }));
      toast({ title: 'Documents Updated', description: 'Your CV and cover letter have been updated.' });
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Update failed', variant: 'destructive' });
    } finally {
      setIsUpdating(false);
      setCvUpdateRequest('');
      setCoverLetterUpdateRequest('');
    }
  };

  const getKeywordColor = (status: Keyword['status']) => {
    switch (status) {
      case 'match': return 'bg-emerald-500 text-white'; // green
      case 'partial': return 'bg-amber-400 text-white'; // amber
      case 'missing': return 'bg-rose-500 text-white'; // red
      default: return 'bg-gray-300 text-black';
    }
  };

  const getKeywordIcon = (status: Keyword['status']) => {
    switch (status) {
      case 'match': return <CheckCircle className="w-3 h-3" />;
      case 'partial': return <AlertCircle className="w-3 h-3" />;
      case 'missing': return <XCircle className="w-3 h-3" />;
    }
  };

  // Utility: Render structured CV JSON
  type CVType = any; // Replace with a proper interface if available
  type PriorityItem = { priority?: number; content?: string; [key: string]: any };
  // Map page length to max priority
  const getMaxPriority = (length: string) => {
    switch (length) {
      case 'short': return 1;
      case 'medium': return 2;
      case 'long': return 3;
      default: return 3;
    }
  };

  // Utility: Render structured CV JSON with toggles and priority filtering
  function renderStructuredCV(
    cv: CVType,
    options: GenerationOptions
  ) {
    console.log('renderStructuredCV called', cv, options);
    const maxPriority = getMaxPriority(options.length);
    const filterByPriority = (arr: PriorityItem[] | undefined): PriorityItem[] => Array.isArray(arr) ? arr.filter((item: PriorityItem) => (item.priority ?? 1) <= maxPriority) : [];
    console.log('Achievements:', filterByPriority(cv.relevant_achievements));
    console.log('Experience:', cv.experience);
    console.log('Competencies:', filterByPriority(cv.core_competencies));
    console.log('Education:', filterByPriority(cv.education));
    if (!cv) return <div>No CV data available.</div>;
    if (
      !cv.summary?.content &&
      filterByPriority(cv.relevant_achievements).length === 0 &&
      (!Array.isArray(cv.experience) || cv.experience.length === 0) &&
      filterByPriority(cv.core_competencies).length === 0 &&
      filterByPriority(cv.education).length === 0
    ) {
      return <div style={{ color: 'red' }}>No CV sections to display (all filtered out or empty).</div>;
    }
  return (
      <div className="space-y-4">
        {cv.name && <h2 className="text-xl font-bold">{cv.name}</h2>}
        {cv.summary?.content && <div><strong>Summary:</strong> {cv.summary.content}</div>}
        {options.sections.competencies && filterByPriority(cv.core_competencies).length > 0 && (
          <div>
            <h3 className="font-semibold">Core Competencies</h3>
            <div className="ml-6">
              {filterByPriority(cv.core_competencies).map((c: PriorityItem) => c.content).filter(Boolean).join(' • ')}
            </div>
          </div>
        )}
        {options.sections.achievements && filterByPriority(cv.relevant_achievements).length > 0 && (
          <div>
            <h3 className="font-semibold">Achievements</h3>
            <ul className="list-disc ml-6">
              {filterByPriority(cv.relevant_achievements).map((a: PriorityItem, i: number) => <li key={i}>{a.content}</li>)}
            </ul>
          </div>
        )}
        {Array.isArray(cv.experience) && cv.experience.length > 0 && (
          <div>
            <h3 className="font-semibold">Experience</h3>
            {cv.experience.map((exp: any, i: number) => (
              <div key={i} className="mb-2">
                <div><strong>{exp.job_title}</strong> at {exp.company_name} {exp.dates && <span>({exp.dates})</span>}</div>
                {filterByPriority(exp.responsibilities).length > 0 && (
                  <ul className="list-disc ml-6">
                    {filterByPriority(exp.responsibilities).map((r: PriorityItem, j: number) => <li key={j}>{r.content}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {options.sections.education && filterByPriority(cv.education).length > 0 && (
          <div>
            <h3 className="font-semibold">Education</h3>
            <ul className="list-disc ml-6">
              {filterByPriority(cv.education).map((e: any, i: number) => <li key={i}>{e.degree} - {e.institution} {e.year && `(${e.year})`}</li>)}
            </ul>
          </div>
        )}
        {options.sections.certifications && Array.isArray(cv.certifications) && cv.certifications.length > 0 && (
          <div>
            <h3 className="font-semibold">Certifications</h3>
            <ul className="list-disc ml-6">
              {cv.certifications.map((cert: any, i: number) => <li key={i}>{cert.content || cert.name}</li>)}
            </ul>
          </div>
        )}
      </div>
    );
  }

  if (currentStep === 3) {
    console.log('Rendering Step 3 preview, currentStep:', currentStep);
    console.log('generatedDocuments:', generatedDocuments);
    console.log('selectedVariant:', selectedVariant);
    console.log('CV for preview:', generatedDocuments[selectedVariant]?.cv);
  }

  // Add this function inside ApplicationWizard
  const handleSaveCV = async () => {
    const doc = Object.values(generatedDocuments)[0];
    const cvJson = doc?.cv;
    if (!cvJson) {
      toast({ title: 'Error', description: 'No CV to save', variant: 'destructive' });
      return;
    }
    try {
      const res = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify(cvJson),
      });
      const result = await res.json();
      if (result.error) throw new Error(result.error);
      toast({ title: 'CV Saved', description: 'Your CV has been saved to your account.' });
      window.location.href = '/my-cvs-new';
    } catch (err: any) {
      toast({ title: 'Error', description: err.message || 'Failed to save CV', variant: 'destructive' });
    }
  };

  return (
    <div>
      <div style={{ color: 'blue', fontWeight: 'bold' }}>TOP-LEVEL TEST: ApplicationWizard is rendering</div>
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
                  disabled={isAnalyzing}
              />
              <Button 
                onClick={handleJobDescriptionNext}
                disabled={!jobDescription.trim() || isAnalyzing}
                className="w-full"
              >
                {isAnalyzing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                {isAnalyzing ? 'Analyzing...' : 'Next: Review Arc Data'}
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
                      <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
                      <p className="text-muted-foreground ml-4">Analyzing job description...</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Match Score</h3>
                      <div className="flex items-center gap-2">
                        <div className={`text-2xl font-bold ${
                            matchScore >= 70 ? 'text-emerald-500' : 
                            matchScore >= 50 ? 'text-amber-500' : 'text-rose-500'
                        }`}>
                          {matchScore}%
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Extracted Keywords</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-emerald-500 text-white px-2 py-1 rounded">Test Green Badge</span>
                        {extractedKeywords.map((keyword, index) => (
                          <span
                            key={index}
                            className={`flex items-center gap-1 rounded px-2 py-1 text-xs font-medium ${getKeywordColor(keyword.status)}`}
                          >
                            {getKeywordIcon(keyword.status)}
                            {keyword.text}
                          </span>
                        ))}
                      </div>
                    </div>
                      <div className="flex justify-end">
                    <Button
                      onClick={handleGenerate}
                      className="w-full"
                      disabled={isGenerating}
                    >
                          {isGenerating ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
                          {isGenerating ? 'Generating...' : 'Generate Documents'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                      </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Preview (ZEN DESIGN) */}
        {currentStep === 3 && !isGenerating && !isDocxGenerating && !isUpdating && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Step 3: Preview</span>
                  {(jobTitle || companyName) && (
                    <div className="text-right">
                      {jobTitle && <div className="text-sm font-medium">{jobTitle}</div>}
                      {companyName && <div className="text-sm text-muted-foreground">{companyName}</div>}
                    </div>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* CV Options Accordion */}
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="options">
                    <AccordionTrigger>CV Options</AccordionTrigger>
                    <AccordionContent className="space-y-6 pt-4">
                      {/* Page Length */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Page Length:</Label>
                        <RadioGroup
                          value={generationOptions.length}
                          onValueChange={(value) => {
                            const typedValue = value as 'short' | 'medium' | 'long';
                            setGenerationOptions(prev => ({ ...prev, length: typedValue }));
                            setSelectedVariant(generateVariantKey(typedValue, generationOptions.sections));
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
                      {/* CV Sections */}
                      <div className="space-y-3">
                        <Label className="text-sm font-medium">Include sections in CV:</Label>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="achievements"
                              checked={generationOptions.sections.achievements}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                const newSections = { ...generationOptions.sections, achievements: isChecked };
                                setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                                setSelectedVariant(generateVariantKey(generationOptions.length, newSections));
                              }}
                            />
                            <Label htmlFor="achievements">Achievements</Label>
          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="competencies"
                              checked={generationOptions.sections.competencies}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                const newSections = { ...generationOptions.sections, competencies: isChecked };
                                setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                                setSelectedVariant(generateVariantKey(generationOptions.length, newSections));
                              }}
                            />
                            <Label htmlFor="competencies">Competencies</Label>
                    </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="certifications"
                              checked={generationOptions.sections.certifications}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                const newSections = { ...generationOptions.sections, certifications: isChecked };
                                setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                                setSelectedVariant(generateVariantKey(generationOptions.length, newSections));
                              }}
                            />
                            <Label htmlFor="certifications">Certifications</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="education"
                              checked={generationOptions.sections.education}
                              onCheckedChange={(checked) => {
                                const isChecked = checked === true;
                                const newSections = { ...generationOptions.sections, education: isChecked };
                                setGenerationOptions(prev => ({ ...prev, sections: newSections }));
                                setSelectedVariant(generateVariantKey(generationOptions.length, newSections));
                              }}
                            />
                            <Label htmlFor="education">Education</Label>
                          </div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
                {/* Document Preview */}
                {Object.values(generatedDocuments)[0]?.cv ? (
                  <div className="space-y-4">
                <Tabs defaultValue="cv" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cv">Generated CV</TabsTrigger>
                        <TabsTrigger value="cover-letter">Generated Cover Letter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cv" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                          {renderStructuredCV(Object.values(generatedDocuments)[0]?.cv, generationOptions)}
                    </div>
                  </TabsContent>
                  <TabsContent value="cover-letter" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                          {(() => {
                            const doc = Object.values(generatedDocuments)[0] as any;
                            const cv = doc?.cv as any;
                            const coverLetter = doc?.coverLetter as any;
                            let content = '';
                            if (coverLetter && typeof coverLetter === 'object' && 'content' in coverLetter) {
                              content = coverLetter.content;
                            } else if (typeof coverLetter === 'string') {
                              content = coverLetter;
                            }
                            let candidateName = '';
                            if (cv && typeof cv === 'object' && 'name' in cv) {
                              candidateName = cv.name;
                            }
                            return (
                              <pre className="whitespace-pre-wrap text-sm">
                                {content}
                                {candidateName ? `\n\nBest regards,\n${candidateName}` : ''}
                              </pre>
                            );
                          })()}
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
                  {Object.values(generatedDocuments)[0]?.cv ? (
                    <>
                  <Button
                    variant="outline"
                        onClick={handleRequestUpdates}
                  >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                  </Button>
                  <Button
                        onClick={handleSaveCV}
                    className="flex-1"
                  >
                        Go to downloads
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
          <DialogContent className="sm:max-w-md">
          <DialogHeader>
              <DialogTitle>Edit Documents</DialogTitle>
          </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CV Updates:</label>
                <Textarea
                  placeholder="Describe any changes you'd like to make to your CV..."
                  value={cvUpdateRequest}
                  onChange={(e) => setCvUpdateRequest(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter Updates:</label>
                <Textarea
                  placeholder="Describe any changes you'd like to make to your cover letter..."
                  value={coverLetterUpdateRequest}
                  onChange={(e) => setCoverLetterUpdateRequest(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button 
                onClick={handleApplyUpdates}
                disabled={!cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim()}
              >
                Apply Updates
              </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
};

export default ApplicationWizard; 