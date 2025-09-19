import React, { useState } from 'react';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ToggleGroup, ToggleGroupItem } from './ui/toggle-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';

interface Keyword {
  text: string;
  status: 'match' | 'partial' | 'missing';
}

interface GenerationOptions {
  pages: 2 | 3 | 4;
  includeKeywords: boolean;
  includeRelevantExperience: boolean;
  language: string;
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
    language: 'UK English',
  });
  const [generatedCV, setGeneratedCV] = useState('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Keywords' },
    { number: 3, title: 'Review and Download' },
  ];

  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim()) return;
    setIsAnalyzing(true);
    setCurrentStep(2);
    // Simulate keyword extraction and analysis
    setTimeout(() => {
      setExtractedKeywords([
        { text: 'React', status: 'match' },
        { text: 'TypeScript', status: 'match' },
        { text: 'Node.js', status: 'partial' },
        { text: 'GraphQL', status: 'missing' },
        { text: 'AWS', status: 'partial' },
        { text: 'Docker', status: 'match' },
        { text: 'Kubernetes', status: 'missing' },
        { text: 'Agile', status: 'match' },
      ]);
      setMatchScore(72);
      setJobTitle('Senior Full Stack Developer');
      setCompanyName('TechCorp Inc.');
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setShowOptionsModal(false);
    setCurrentStep(3);
    // Simulate document generation
    setTimeout(() => {
      setGeneratedCV(`JOHN DOE\nSenior Full Stack Developer\n\nEXPERIENCE\nSoftware Engineer | Current Company | 2022-Present\n• Built scalable React applications with TypeScript\n• Implemented microservices using Node.js and Docker\n• Collaborated in Agile development environment\n• Increased application performance by 40%\n\nSKILLS\nReact, TypeScript, Node.js, Docker, Agile Development\n\nEDUCATION\nComputer Science Degree | University | 2018-2022`);
      setGeneratedCoverLetter(`Dear Hiring Manager,\n\nI am writing to express my strong interest in the Senior Full Stack Developer position at TechCorp Inc. With my extensive experience in React, TypeScript, and modern development practices, I am confident I would be a valuable addition to your team.\n\nIn my current role, I have successfully built scalable applications and worked with technologies directly relevant to your job requirements. My experience with React and TypeScript aligns perfectly with your tech stack, and I am eager to contribute to your innovative projects.\n\nI would welcome the opportunity to discuss how my skills and experience can benefit TechCorp Inc.\n\nBest regards,\nJohn Doe`);
      setIsGenerating(false);
      toast({
        title: "Documents Generated",
        description: "Your CV and cover letter have been successfully generated!",
      });
    }, 3000);
  };

  const handleRequestUpdates = () => {
    setShowUpdateModal(true);
  };

  const handleApplyUpdates = async () => {
    setIsUpdating(true);
    setShowUpdateModal(false);
    // Simulate AI processing updates
    setTimeout(() => {
      if (cvUpdateRequest.trim()) {
        setGeneratedCV(prev => prev + `\n\nADDITIONAL EXPERIENCE\nSpace X Project Contributor | NASA | 2021\n• ${cvUpdateRequest}`);
      }
      if (coverLetterUpdateRequest.trim()) {
        setGeneratedCoverLetter(prev => prev.replace(
          'Best regards,',
          `Additionally, I want to highlight my experience: ${coverLetterUpdateRequest}\n\nBest regards,`
        ));
      }
      setCurrentStep(3);
      setIsUpdating(false);
      setCvUpdateRequest('');
      setCoverLetterUpdateRequest('');
      toast({
        title: "Documents Updated",
        description: "Your CV and cover letter have been updated with your requests!",
      });
    }, 2000);
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
                    <div className="flex justify-end">
                      <Button
                        onClick={() => setShowOptionsModal(true)}
                        className="w-full"
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

        {/* Step 3: Generate Documents */}
        {currentStep === 3 && !isGenerating && !isUpdating && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Documents Generated</span>
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
                  <TabsTrigger value="cv">Generated CV</TabsTrigger>
                  <TabsTrigger value="cover-letter">Generated Cover Letter</TabsTrigger>
                </TabsList>
                <TabsContent value="cv" className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50 min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm">{generatedCV}</pre>
                  </div>
                </TabsContent>
                <TabsContent value="cover-letter" className="space-y-4">
                  <div className="border rounded-lg p-4 bg-muted/50 min-h-[300px]">
                    <pre className="whitespace-pre-wrap text-sm">{generatedCoverLetter}</pre>
                  </div>
                </TabsContent>
              </Tabs>
              <div className="flex gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={handleRequestUpdates}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Request Updates
                </Button>
                <Button
                  onClick={() => window.location.href = '/cv-download'}
                  className="flex-1"
                >
                  Go to downloads
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state for step 3 */}
        {(currentStep === 3 && isGenerating) || isUpdating && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">
                  {isUpdating ? 'Updating Your Documents' : 'Generating Your Documents'}
                </h3>
                <p className="text-muted-foreground">
                  {isUpdating 
                    ? 'Please wait while we apply your requested updates...'
                    : 'Please wait while we create your optimized CV and cover letter...'
                  }
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* CV Options Modal */}
      <Dialog open={showOptionsModal} onOpenChange={setShowOptionsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>CV Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Pages Option */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Pages:</label>
              <ToggleGroup
                type="single"
                value={generationOptions.pages.toString()}
                onValueChange={(value) => {
                  if (value) {
                    setGenerationOptions(prev => ({ ...prev, pages: parseInt(value) as 2 | 3 | 4 }));
                  }
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="2" aria-label="2 pages">
                  2
                </ToggleGroupItem>
                <ToggleGroupItem value="3" aria-label="3 pages">
                  3
                </ToggleGroupItem>
                <ToggleGroupItem value="4" aria-label="4 pages">
                  4
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {/* Include Keywords Option */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Include Keywords:</label>
              <ToggleGroup
                type="single"
                value={generationOptions.includeKeywords ? "yes" : "no"}
                onValueChange={(value) => {
                  if (value) {
                    setGenerationOptions(prev => ({ ...prev, includeKeywords: value === "yes" }));
                  }
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="yes" aria-label="Include keywords">
                  Yes
                </ToggleGroupItem>
                <ToggleGroupItem value="no" aria-label="Don't include keywords">
                  No
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {/* Include Relevant Experience Option */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Include Relevant Experience:</label>
              <ToggleGroup
                type="single"
                value={generationOptions.includeRelevantExperience ? "yes" : "no"}
                onValueChange={(value) => {
                  if (value) {
                    setGenerationOptions(prev => ({ ...prev, includeRelevantExperience: value === "yes" }));
                  }
                }}
                className="justify-start"
              >
                <ToggleGroupItem value="yes" aria-label="Include relevant experience">
                  Yes
                </ToggleGroupItem>
                <ToggleGroupItem value="no" aria-label="Don't include relevant experience">
                  No
                </ToggleGroupItem>
              </ToggleGroup>
            </div>
            {/* Language Option */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Language:</label>
              <Select
                value={generationOptions.language}
                onValueChange={(value) => setGenerationOptions(prev => ({ ...prev, language: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UK English">UK English</SelectItem>
                  <SelectItem value="US English">US English</SelectItem>
                  <SelectItem value="Canadian English">Canadian English</SelectItem>
                  <SelectItem value="Australian English">Australian English</SelectItem>
                  <SelectItem value="French">French</SelectItem>
                  <SelectItem value="German">German</SelectItem>
                  <SelectItem value="Spanish">Spanish</SelectItem>
                  <SelectItem value="Italian">Italian</SelectItem>
                  <SelectItem value="Portuguese">Portuguese</SelectItem>
                  <SelectItem value="Dutch">Dutch</SelectItem>
                  <SelectItem value="Swedish">Swedish</SelectItem>
                  <SelectItem value="Norwegian">Norwegian</SelectItem>
                  <SelectItem value="Danish">Danish</SelectItem>
                  <SelectItem value="Finnish">Finnish</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleGenerate} className="w-full">
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Update Request Modal */}
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
                />
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowUpdateModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={handleApplyUpdates}
                disabled={!cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim()}
                className="flex-1"
              >
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