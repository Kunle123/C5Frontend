import React, { useState } from 'react';
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

interface Keyword {
  text: string;
  status: 'match' | 'partial' | 'missing';
}

interface GenerationOptions {
  pages: 2 | 3 | 4;
  includeKeywords: boolean;
  includeRelevantExperience: boolean;
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
    setCurrentStep(2);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const mergedProfile = getMergedProfile();
      if (!mergedProfile) throw new Error('Profile data not loaded');
      const result = await extractKeywords(mergedProfile, jobDescription, token);
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

  // Replace handleGenerate with real API call for both CV and cover letter
  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowOptionsModal(false);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const mergedProfile = getMergedProfile();
      if (!mergedProfile) throw new Error('Profile data not loaded');
      // Generate both CV and Cover Letter in one call
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'generate_cv',
          profile: mergedProfile,
          job_description: jobDescription,
          // Optionally add keywords/cv_length if needed
        }),
      });
      if (!res.ok) throw new Error('Failed to generate documents');
      const data = await res.json();
      setGeneratedCV(data.cv || '');
      setGeneratedCoverLetter(data.cover_letter || '');
      setJobTitle(data.job_title || '');
      setCompanyName(data.company_name || '');
      // Persist the generated CV and cover letter
      if (data.cv && data.cv.trim()) {
        const persistRes = await fetch('/api/cv', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            cv: data.cv,
            cover_letter: data.cover_letter || '',
            job_title: data.job_title || '',
            company_name: data.company_name || ''
          })
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
      } else {
        throw new Error('Generated CV is empty. Please try again.');
      }
    } catch (err: any) {
      setError(err.message || 'Document generation or save failed');
      toast({ title: 'Error', description: err.message || 'Document generation or save failed' });
    } finally {
      setIsGenerating(false);
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
  useEffect(() => {
    if (currentStep === 4 && !isGenerating && !error) {
      const timeout = setTimeout(() => {
        window.location.href = '/my-cvs-new';
      }, 2000); // Give user a moment to see the result before redirect
      return () => clearTimeout(timeout);
    }
  }, [currentStep, isGenerating, error]);

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
                    <Button className="w-full">
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generation Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
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
    </div>
  );
};

export default ApplicationWizard; 