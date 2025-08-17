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
      const result = await extractKeywords(mergedProfile, jobDescription, token);
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
    setIsGenerating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      // Use the latest generatedCV, generatedCoverLetter, jobTitle, companyName
      // Sanitize and transform as before
      const data = {
        cv: generatedCV,
        cover_letter: generatedCoverLetter,
        job_title: jobTitle,
        company_name: companyName
      };
      // Sanitize experience descriptions if needed (if you have structured data)
      // 1. Transform the generated CV data to structured JSON (sections array)
      const structuredCV = transformCVResponseToSections(data);
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
      // 3. POST the DOCX to /api/cv as before (using FormData)
      const formData = new FormData();
      formData.append('file', docxBlob, 'cv.docx');
      formData.append('job_title', uniqueJobTitle);
      formData.append('company_name', uniqueCompanyName);
      const persistRes = await fetch('/api/cv', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });
      if (!persistRes.ok) {
        let errorMsg = 'Failed to save CV';
        try {
          const error = await persistRes.json();
          errorMsg = error.detail || error.message || errorMsg;
        } catch {}
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
                    <div className="flex gap-4">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentStep(1)}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open('/career-arc', '_blank')}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit Arc Data
                      </Button>
                      <Button
                        onClick={() => setShowOptionsModal(true)}
                        className="flex-1"
                      >
                        Generate CV & Cover Letter
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
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
                <Tabs defaultValue="cv" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="cv">Optimized CV</TabsTrigger>
                    <TabsTrigger value="cover-letter">Cover Letter</TabsTrigger>
                  </TabsList>
                  <TabsContent value="cv" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm">{generatedCV}</pre>
                    </div>
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
                    onClick={() => setCurrentStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Analysis
                  </Button>
                  <Button
                    onClick={handleSaveAndDownload}
                    className="flex-1"
                    disabled={isGenerating}
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
                      <pre className="whitespace-pre-wrap text-sm">{generatedCV}</pre>
                    </div>
                    {/* Download CV button removed */}
                  </TabsContent>
                  <TabsContent value="cover-letter" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                      <pre className="whitespace-pre-wrap text-sm">{generatedCoverLetter}</pre>
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
    </div>
  );
};

export default ApplicationWizard; 