import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Textarea } from './ui/textarea';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from './ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Checkbox } from './ui/checkbox';
import { useToast } from '../hooks/use-toast';
import { CheckCircle, AlertCircle, XCircle, FileText, Edit3, ArrowRight } from 'lucide-react';
import { useCVSession } from '../hooks/useCVSession';
import { useCVPreview } from '../hooks/useCVPreview';
import { useCVGenerate } from '../hooks/useCVGenerate';
import { useCVUpdate } from '../hooks/useCVUpdate';

const steps = [
  { number: 1, title: 'Paste Job Description' },
  { number: 2, title: 'Review Keywords' },
  { number: 3, title: 'Preview' },
];

const ApplicationWizard = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState('');
  const [generationOptions, setGenerationOptions] = useState({
    sections: {
      achievements: true,
      competencies: true,
      certifications: true,
      education: true,
    },
  });
  const [userPreferences, setUserPreferences] = useState<any>({});
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [cvUpdateRequest, setCvUpdateRequest] = useState('');
  const [coverLetterUpdateRequest, setCoverLetterUpdateRequest] = useState('');
  const [previewTab, setPreviewTab] = useState<'cv' | 'coverLetter'>('cv');
  const [selectedVariant, setSelectedVariant] = useState('default');

  // Auth/session
  const userToken = localStorage.getItem('token') || '';
  const userId = (() => {
    try {
      return JSON.parse(atob(userToken.split('.')[1])).id;
    } catch {
      return '';
    }
  })();
  const { sessionId, startSession, endSession, loading: sessionLoading, error: sessionError } = useCVSession();
  const { preview, getPreview, loading: previewLoading, error: previewError } = useCVPreview();
  const { cv, coverLetter, generateCV, loading: generateLoading, error: generateError } = useCVGenerate();
  const { updatedCV, updateCV, loading: updateLoading, error: updateError } = useCVUpdate();

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

  // Step 1: Next
  const handleJobDescriptionNext = async () => {
    if (!jobDescription.trim() || !sessionId) return;
    const data = await getPreview(sessionId, jobDescription, userToken);
    if (data) setCurrentStep(2);
  };

  // Step 2: Generate
  const handleGenerate = async () => {
    if (!sessionId) return;
    await generateCV(sessionId, jobDescription, userToken);
    setCurrentStep(3);
  };

  // Step 3: Update
  const handleApplyUpdates = async () => {
    if (!sessionId || !cv) return;
    await updateCV(sessionId, cv, cvUpdateRequest, jobDescription, userToken);
    setShowUpdateModal(false);
    setCvUpdateRequest('');
    setCoverLetterUpdateRequest('');
  };

  // UI rendering helpers (keywords, match score, etc.)
  const extractedKeywords = preview
    ? [
        ...(preview.keyword_coverage.present_in_profile || []).map((k) => ({ text: k, status: 'match' })),
        ...(preview.keyword_coverage.missing_from_profile || []).map((k) => ({ text: k, status: 'missing' })),
      ]
    : [];
  const matchScore = preview?.profile_match?.match_score || 0;

  function renderCV(cv: any) {
    if (!cv) return <div>No CV data available.</div>;
    return (
      <div className="space-y-6">
        {/* Personal Information */}
        {cv.personal_information && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Personal Information</h3>
            <ul className="text-sm">
              {Object.entries(cv.personal_information).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Professional Summary */}
        {cv.professional_summary && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Professional Summary</h3>
            <p className="text-sm">{cv.professional_summary.content}</p>
          </div>
        )}
        {/* Work Experience */}
        {Array.isArray(cv.work_experience) && cv.work_experience.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Work Experience</h3>
            {cv.work_experience.map((exp: any, i: number) => (
              <div key={i} className="mb-3">
                <div className="font-medium">{exp.title} at {exp.company} <span className="text-xs text-muted-foreground">({exp.start_date} - {exp.end_date})</span></div>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul className="list-disc ml-6 text-sm">
                    {exp.responsibilities.map((r: string, j: number) => <li key={j}>{r}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Skills */}
        {cv.skills && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Skills</h3>
            <ul className="flex flex-wrap gap-2 text-xs">
              {Object.entries(cv.skills).map(([category, skills]: [string, any]) =>
                Array.isArray(skills)
                  ? skills.map((s: unknown, i: number) => <li key={category + i} className="px-2 py-1 bg-primary/10 text-primary rounded">{String(s)}</li>)
                  : null
              )}
            </ul>
          </div>
        )}
        {/* Education */}
        {Array.isArray(cv.education) && cv.education.length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Education</h3>
            <ul className="text-sm">
              {cv.education.map((e: any, i: number) => (
                <li key={i}><strong>{e.degree}</strong> - {e.institution} {e.year && `(${e.year})`}</li>
              ))}
            </ul>
          </div>
        )}
        {/* Additional Sections */}
        {cv.additional_sections && Object.keys(cv.additional_sections).length > 0 && (
          <div>
            <h3 className="font-semibold text-lg mb-1">Additional Sections</h3>
            <ul className="text-sm">
              {Object.entries(cv.additional_sections).map(([key, value]) => (
                <li key={key}><strong>{key.replace(/_/g, ' ')}:</strong> {String(value)}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  function renderCoverLetter(coverLetter: any) {
    if (!coverLetter) return <div>No cover letter data available.</div>;
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-lg mb-1">Cover Letter</h3>
        <div className="whitespace-pre-line text-sm">{coverLetter.content}</div>
        <div className="text-xs text-muted-foreground">Word count: {coverLetter.word_count}</div>
        {coverLetter.evidence_source && <div className="text-xs text-muted-foreground">Evidence: {coverLetter.evidence_source}</div>}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Indicator */}
        <div className="mb-8 sticky top-16 z-20 bg-background pt-4 pb-2">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= step.number ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                }`}>{step.number}</div>
                <span className={`ml-2 text-sm ${currentStep >= step.number ? 'text-foreground' : 'text-muted-foreground'}`}>{step.title}</span>
                {index < steps.length - 1 && (
                  <div className={`w-12 h-0.5 mx-4 ${currentStep > step.number ? 'bg-primary' : 'bg-muted'}`} />
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
              <p className="text-muted-foreground">Paste the job description below to get started. We'll analyze it to optimize your CV and cover letter.</p>
              <Textarea
                placeholder="Paste the job description here..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="min-h-[300px]"
              />
              <Button onClick={handleJobDescriptionNext} disabled={!jobDescription.trim() || sessionLoading} className="w-full">
                {previewLoading ? 'Analyzing...' : 'Next: Review Arc Data'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              {sessionError && <div className="text-destructive text-sm">{sessionError}</div>}
              {previewError && <div className="text-destructive text-sm">{previewError}</div>}
            </CardContent>
          </Card>
        )}

        {/* Step 2: Review Keywords */}
        {currentStep === 2 && preview && (
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
                    <p className="font-semibold">{preview.job_analysis.summary}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Keywords</label>
                    <p className="font-semibold">{(preview.job_analysis.keywords || []).join(', ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Strengths</label>
                    <p className="font-semibold">{(preview.profile_match.strengths || []).join(', ')}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Gaps</label>
                    <p className="font-semibold">{(preview.profile_match.gaps || []).join(', ')}</p>
                  </div>
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
                  <div className={`text-3xl font-bold ${matchScore >= 70 ? 'text-emerald-600' : matchScore >= 50 ? 'text-amber-600' : 'text-rose-600'}`}>{matchScore}%</div>
                  <div className="flex-1">
                    <Progress value={matchScore} className="h-3" />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {extractedKeywords.filter(k => k.status === 'match').length} / {extractedKeywords.length} keywords matched
                  </div>
                </div>
                <div className="mt-4 text-sm text-muted-foreground">
                  <div><strong>Evidence:</strong> {preview.profile_match.evidence_source}</div>
                </div>
              </CardContent>
            </Card>

            {/* Keyword Analysis */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Matched Keywords */}
              <Card className="border-emerald-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-emerald-700 flex items-center gap-2">
                    <span className="text-lg">✓</span>
                    Present in Profile
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Skills and experience found in your profile</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preview.keyword_coverage.present_in_profile.map((keyword: string, idx: number) => (
                      <Badge key={idx} variant="success">{keyword}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              {/* Missing Keywords */}
              <Card className="border-rose-200">
                <CardHeader className="pb-3">
                  <CardTitle className="text-rose-700 flex items-center gap-2">
                    <span className="text-lg">✗</span>
                    Missing from Profile
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Skills not found in your profile</p>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {preview.keyword_coverage.missing_from_profile.map((keyword: string, idx: number) => (
                      <Badge key={idx} variant="destructive">{keyword}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Customisation Options */}
            <Card>
              <CardHeader>
                <CardTitle>Customisation Options</CardTitle>
                <p className="text-sm text-muted-foreground">Add any specific requirements or preferences for your application</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium mt-4">Focus Areas</label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox id="achievements" checked={generationOptions.sections.achievements} onCheckedChange={(checked) => setGenerationOptions((prev) => ({ ...prev, sections: { ...prev.sections, achievements: !!checked } }))} />
                        <label htmlFor="achievements" className="text-sm">Focus on quantifiable achievements</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="competencies" checked={generationOptions.sections.competencies} onCheckedChange={(checked) => setGenerationOptions((prev) => ({ ...prev, sections: { ...prev.sections, competencies: !!checked } }))} />
                        <label htmlFor="competencies" className="text-sm">Emphasise technical skills</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="certifications" checked={generationOptions.sections.certifications} onCheckedChange={(checked) => setGenerationOptions((prev) => ({ ...prev, sections: { ...prev.sections, certifications: !!checked } }))} />
                        <label htmlFor="certifications" className="text-sm">Highlight certifications</label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox id="education" checked={generationOptions.sections.education} onCheckedChange={(checked) => setGenerationOptions((prev) => ({ ...prev, sections: { ...prev.sections, education: !!checked } }))} />
                        <label htmlFor="education" className="text-sm">Include education</label>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <label htmlFor="custom-instructions" className="text-sm font-medium">Custom Instructions</label>
                    <Textarea id="custom-instructions" placeholder="Any specific requirements or preferences for your application..." className="min-h-[100px]" value={userPreferences.instructions || ''} onChange={(e) => setUserPreferences((prev: any) => ({ ...prev, instructions: e.target.value }))} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Generate Button */}
            <Card>
              <CardContent className="pt-6">
                <Button onClick={handleGenerate} className="w-full" size="lg" disabled={generateLoading}>
                  {generateLoading ? 'Generating Documents...' : 'Generate Documents'}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                {generateError && <div className="text-destructive text-sm mt-2">{generateError}</div>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 3: Preview CV & Cover Letter */}
        {currentStep === 3 && (cv || coverLetter) && (
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
                  {renderCV(cv)}
                </TabsContent>
                <TabsContent value="coverLetter" className="mt-4">
                  {renderCoverLetter(coverLetter)}
                </TabsContent>
              </Tabs>
              <div className="flex gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowUpdateModal(true)}><Edit3 className="w-4 h-4 mr-2" />Edit/Request Update</Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading state for updating */}
        {updateLoading && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <h3 className="text-lg font-semibold">Updating Your Documents</h3>
                <p className="text-muted-foreground">Please wait while we apply your requested updates...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Edit Request Modal */}
        <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Request an Update</DialogTitle>
              <p className="text-sm text-muted-foreground">Describe what you want changed in your CV or cover letter</p>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">CV Updates:</label>
                <Textarea placeholder="Describe what you want changed in your CV..." value={cvUpdateRequest} onChange={(e) => setCvUpdateRequest(e.target.value)} className="min-h-[100px]" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Cover Letter Updates:</label>
                <Textarea placeholder="Describe what you want changed in your cover letter..." value={coverLetterUpdateRequest} onChange={(e) => setCoverLetterUpdateRequest(e.target.value)} className="min-h-[100px]" />
              </div>
            </div>
            <DialogFooter className="gap-2">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button onClick={handleApplyUpdates} disabled={!cvUpdateRequest.trim() && !coverLetterUpdateRequest.trim()}>
                Apply Update
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ApplicationWizard;