import React, { useState } from 'react';
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
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Download, Edit3, ArrowRight, ArrowLeft } from 'lucide-react';

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

  const steps = [
    { number: 1, title: 'Paste Job Description' },
    { number: 2, title: 'Review Keywords' },
    { number: 3, title: 'Preview' },
  ];

  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    setCurrentStep(2);
    
    // Simulate keyword extraction and analysis
    setTimeout(() => {
      // Mock data - in real app this would come from API
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
    
    // Generate all possible combinations
    const lengths = ['short', 'medium', 'long'];
    const sectionCombinations = [
      { achievements: true, competencies: true, certifications: true, education: true },
      { achievements: true, competencies: true, certifications: false, education: true },
      { achievements: false, competencies: true, certifications: true, education: true },
      // Add more combinations as needed
    ];
    
    // Simulate document generation for all variants
    setTimeout(() => {
      const newDocuments: GeneratedDocuments = {};
      
      lengths.forEach(length => {
        sectionCombinations.forEach(sections => {
          const variantKey = generateVariantKey(length, sections);
          
          const baseCV = `JOHN DOE
Senior Full Stack Developer

EXPERIENCE
Software Engineer | Current Company | 2022-Present
• Built scalable React applications with TypeScript
• Implemented microservices using Node.js and Docker
• Collaborated in Agile development environment
• Increased application performance by 40%

SKILLS
React, TypeScript, Node.js, Docker, Agile Development`;

          let cv = baseCV;
          
          if (sections.achievements) {
            cv += `\n\nACHIEVEMENTS\n• Improved system performance by 40%\n• Led team of 5 developers`;
          }
          
          if (sections.competencies) {
            cv += `\n\nCOMPETENCIES\n• Technical Leadership\n• Agile Methodology\n• Problem Solving`;
          }
          
          if (sections.certifications) {
            cv += `\n\nCERTIFICATIONS\n• AWS Certified Developer\n• React Professional Certificate`;
          }
          
          if (sections.education) {
            cv += `\n\nEDUCATION\nComputer Science Degree | University | 2018-2022`;
          }
          
          // Adjust length
          if (length === 'short') {
            cv = cv.substring(0, cv.length * 0.7);
          } else if (length === 'long') {
            cv += `\n\nADDITIONAL EXPERIENCE\nIntern | Previous Company | 2021\n• Developed web applications\n• Learned modern frameworks`;
          }
          
          newDocuments[variantKey] = {
            cv,
            coverLetter: `Dear Hiring Manager,

I am writing to express my strong interest in the Senior Full Stack Developer position at TechCorp Inc. With my extensive experience in React, TypeScript, and modern development practices, I am confident I would be a valuable addition to your team.

In my current role, I have successfully built scalable applications and worked with technologies directly relevant to your job requirements. My experience with React and TypeScript aligns perfectly with your tech stack, and I am eager to contribute to your innovative projects.

I would welcome the opportunity to discuss how my skills and experience can benefit TechCorp Inc.

Best regards,
John Doe`
          };
        });
      });
      
      setGeneratedDocuments(newDocuments);
      setSelectedVariant(generateVariantKey('medium', generationOptions.sections));
      setIsGenerating(false);
      
      toast({
        title: "Documents Generated",
        description: "All CV variations have been successfully generated!",
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
        setGeneratedDocuments(prev => ({
          ...prev,
          [selectedVariant]: {
            ...prev[selectedVariant],
            cv: prev[selectedVariant]?.cv + `\n\nADDITIONAL EXPERIENCE\nSpace X Project Contributor | NASA | 2021\n• ${cvUpdateRequest}`
          }
        }));
      }
      
      if (coverLetterUpdateRequest.trim()) {
        setGeneratedDocuments(prev => ({
          ...prev,
          [selectedVariant]: {
            ...prev[selectedVariant],
            coverLetter: prev[selectedVariant]?.coverLetter.replace(
              'Best regards,',
              `Additionally, I want to highlight my experience: ${coverLetterUpdateRequest}\n\nBest regards,`
            )
          }
        }));
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
                        onClick={handleGenerate}
                        className="w-full"
                      >
                        Generate Documents
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Preview */}
        {currentStep === 3 && !isGenerating && !isUpdating && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Step 3: Preview</span>
                  {jobTitle && (
                    <div className="text-right">
                      <div className="text-sm font-medium">{jobTitle}</div>
                      <div className="text-sm text-muted-foreground">{companyName}</div>
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
                          onValueChange={(value: 'short' | 'medium' | 'long') => {
                            setGenerationOptions(prev => ({ ...prev, length: value }));
                            setSelectedVariant(generateVariantKey(value, generationOptions.sections));
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
                                const newSections = { ...generationOptions.sections, achievements: checked as boolean };
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
                                const newSections = { ...generationOptions.sections, competencies: checked as boolean };
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
                                const newSections = { ...generationOptions.sections, certifications: checked as boolean };
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
                                const newSections = { ...generationOptions.sections, education: checked as boolean };
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
                {generatedDocuments[selectedVariant] ? (
                  <div className="space-y-4">
                    <Tabs defaultValue="cv" className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="cv">Generated CV</TabsTrigger>
                        <TabsTrigger value="cover-letter">Generated Cover Letter</TabsTrigger>
                      </TabsList>
                      
                       <TabsContent value="cv" className="space-y-4">
                         <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                           <pre className="whitespace-pre-wrap text-sm">{generatedDocuments[selectedVariant]?.cv}</pre>
                         </div>
                       </TabsContent>
                       
                       <TabsContent value="cover-letter" className="space-y-4">
                         <div className="border rounded-lg p-4 bg-muted/50 min-h-[400px]">
                           <pre className="whitespace-pre-wrap text-sm">{generatedDocuments[selectedVariant]?.coverLetter}</pre>
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
                  {generatedDocuments[selectedVariant] ? (
                    <>
                      <Button
                        variant="outline"
                        onClick={handleRequestUpdates}
                      >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        onClick={() => window.location.href = '/cv-download'}
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
  );
};

export default ApplicationWizard;