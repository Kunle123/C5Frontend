import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Sparkles, Shield, Zap, Target, Layers, Settings, BarChart, Award, Clock, FileText, ArrowRight } from 'lucide-react';
import { StatsTiles } from '../components/landing/StatsTiles';

const LandingAlternate = () => {
  // Custom color palette to match hero image - sage/teal tones
  const brandColor = '#6B9080'; // Sage green from plants in hero image
  const brandColorLight = '#A4C3B2'; // Lighter sage
  const brandColorDark = '#4A6B5C'; // Darker sage
  
  return (
    <>
      <style>{`
        .landing-alternate .text-primary:not(button *):not(a *) {
          color: ${brandColor} !important;
        }
        .landing-alternate .bg-primary {
          background-color: ${brandColor} !important;
        }
        .landing-alternate .bg-primary\\/10 {
          background-color: ${brandColor}20 !important;
        }
        .landing-alternate .border-primary {
          border-color: ${brandColor} !important;
        }
        .landing-alternate button.bg-primary:hover,
        .landing-alternate a.bg-primary:hover {
          background-color: ${brandColorDark} !important;
        }
        /* Ensure button text stays white */
        .landing-alternate button.bg-primary,
        .landing-alternate a.bg-primary {
          color: white !important;
        }
        /* Icons in buttons should be white too */
        .landing-alternate button.bg-primary svg,
        .landing-alternate a.bg-primary svg {
          color: white !important;
        }
      `}</style>
      <div className="min-h-screen bg-background landing-alternate">
      {/* Navigation */}
      <nav className="border-b sticky top-0 bg-background/95 backdrop-blur z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="text-2xl font-bold hover:opacity-80 transition-opacity" style={{ color: brandColor }}>Candidate5</a>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm text-muted-foreground hover:text-foreground">Log In</a>
            <Button asChild>
              <a href="/signup">Get Started Free</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 md:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <Badge className="mb-4" variant="secondary">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Career Intelligence
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            Land Interviews <span style={{ color: brandColor }}>Twice as Fast</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop rewriting your CV for every job. Our AI analyses job descriptions, matches your experience with evidence-based precision, and generates perfectly tailored applications in minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button size="lg" className="text-lg" asChild>
              <a href="/signup">
                Create Your Free Account
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
            <Button size="lg" variant="outline" className="text-lg" asChild>
              <a href="#how-it-works">See How It Works</a>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground pt-2">No credit card required • 3 free applications</p>
        </div>
        
        {/* Hero Image */}
        <div className="max-w-4xl mx-auto mt-12">
          <img
            src="/hero-woman-desk.png"
            alt="Professional woman working at desk"
            className="rounded-lg object-cover shadow-lg w-full"
          />
        </div>
      </section>

      {/* Stats Section - Using StatsTiles from deployed page */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4">
          <StatsTiles />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-muted/30 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to get your perfect, tailored application materials
            </p>
          </div>
          
          {/* Step 1: Paste Job Posting */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img
                  src="/paste-job-posting.jpeg"
                  alt="Paste a job posting"
                  className="rounded-lg object-cover shadow-lg w-full"
                />
              </div>
              <div className="order-1 md:order-2">
                <Badge className="mb-4">Step 1</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Paste a job posting</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Simply paste the job posting. Our AI instantly analyses requirements, extracts keywords, and identifies what matters most.
                </p>
                <div className="flex gap-1 mb-4">
                  <Badge className="bg-emerald-100 text-emerald-800">Green</Badge>
                  <Badge className="bg-amber-100 text-amber-800">Amber</Badge>
                  <Badge className="bg-rose-100 text-rose-800">Red</Badge>
                </div>
                <div className="text-sm text-primary font-medium">⚡ Takes 2 seconds</div>
              </div>
            </div>
          </div>

          {/* Step 2: Showcase Skills */}
          <div className="max-w-5xl mx-auto mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <Badge className="mb-4">Step 2</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Review keyword match</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  See your match score and RAG analysis (Green/Amber/Red keywords) with evidence from your profile for complete transparency.
                </p>
                <p className="text-muted-foreground mb-4">
                  Candidate 5 will provide keyword and match analysis so you know which roles suit you best and how to improve your chances.
                </p>
              </div>
              <div>
                <img
                  src="/KeywordMatch.png"
                  alt="Keyword match analysis"
                  className="rounded-lg object-cover shadow-lg w-full"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Stay Informed */}
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="order-2 md:order-1">
                <img
                  src="/GenerateCustomise1.png"
                  alt="Generate and customise"
                  className="rounded-lg object-cover shadow-lg w-full"
                />
              </div>
              <div className="order-1 md:order-2">
                <Badge className="mb-4">Step 3</Badge>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Generate & Customise</h3>
                <p className="text-muted-foreground text-lg mb-4">
                  Get your tailored CV and cover letter. Toggle sections, adjust length, trim work history, and download when it's perfect.
                </p>
                <p className="text-muted-foreground mb-4">
                  Review your covering letter and CV, we'll help make any last minute tweaks to ensure it's pitch perfect.
                </p>
                <div className="text-sm text-primary font-medium">🎯 100% Factual - Zero Fabrication</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Showcase */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features You'll Love</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional, job-specific applications with confidence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {/* RAG Keyword Analysis */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <BarChart className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">RAG Keyword Analysis</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  See exactly which keywords you match (Green), partially match (Amber), or need to address (Red) - all with evidence from your profile.
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs">
                    <CheckCircle className="w-3 h-3 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Strong evidence found</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <AlertCircle className="w-3 h-3 text-amber-600" />
                    <span className="text-amber-600 font-medium">Transferable skills identified</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <XCircle className="w-3 h-3 text-rose-600" />
                    <span className="text-rose-600 font-medium">Gaps with mitigation strategies</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Smart CV Variants */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Layers className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Smart CV Variants</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate Short, Medium, or Long CV versions with intelligent priority-based filtering. Most relevant content appears in shorter versions.
                </p>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline">Short (2 pages)</Badge>
                  <Badge variant="outline">Medium (3 pages)</Badge>
                  <Badge variant="outline">Long (4 pages)</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Toggleable Sections */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Settings className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Toggleable Sections</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Customise your CV on the fly. Toggle achievements, competencies, education, and certifications on or off instantly.
                </p>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    <span>Achievements</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    <span>Technical Skills</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-sm bg-primary"></div>
                    <span>Certifications</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Work Experience Trimmer */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Work Experience Trimmer</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Use the slider to control how many work experiences to include. Perfect for focusing on your most recent and relevant roles.
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <div className="flex-1 h-1 bg-primary/30 rounded"></div>
                  <span>5 of 14 roles</span>
                </div>
              </CardContent>
            </Card>

            {/* Anti-Fabrication Guarantee */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Zero Fabrication</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Every statement is backed by evidence from your profile. No made-up experience, no exaggerated claims - just your real achievements, optimally presented.
                </p>
                <Badge variant="success" className="text-xs">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  100% Factual Accuracy
                </Badge>
              </CardContent>
            </Card>

            {/* Career Arc™ */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Award className="w-5 h-5 text-primary" />
                  <CardTitle className="text-lg">Career Arc™</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Build your career profile once. Upload CVs, add experiences manually, or import from LinkedIn. Then generate unlimited tailored applications.
                </p>
                <div className="text-xs text-primary font-medium">One profile, unlimited applications</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* RAG System Showcase */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Evidence-Based Keyword Matching</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our unique RAG (Red/Amber/Green) system shows you exactly how your profile matches each requirement - with proof
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="border-emerald-200 bg-emerald-50/50">
              <CardHeader>
                <CardTitle className="text-emerald-700 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  Green - Strong Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Direct evidence of the skill or experience in your profile
                </p>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white rounded-lg text-sm">
                    <div className="font-medium text-emerald-700">Project Management</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      "Led end-to-end delivery at Allpay Ltd..."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-amber-200 bg-amber-50/50">
              <CardHeader>
                <CardTitle className="text-amber-700 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Amber - Partial Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Related or transferable skills identified in your background
                </p>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white rounded-lg text-sm">
                    <div className="font-medium text-amber-700">Team Leadership</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      "Managed cross-functional teams..."
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-rose-200 bg-rose-50/50">
              <CardHeader>
                <CardTitle className="text-rose-700 flex items-center gap-2">
                  <XCircle className="w-5 h-5" />
                  Red - No Match
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Skills not found - we'll strategically address these gaps
                </p>
                <div className="space-y-2">
                  <div className="px-3 py-2 bg-white rounded-lg text-sm">
                    <div className="font-medium text-rose-700">GraphQL</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      "Focus on learning agility and API experience"
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Customisation Features */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Total Control Over Your CV</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Fine-tune every aspect of your CV to match the job perfectly
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Visual Demo */}
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Preview Your CV & Cover Letter</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium mb-2">Page Length:</div>
                      <div className="flex gap-2">
                        <div className="px-3 py-1 bg-primary text-primary-foreground rounded text-sm">Medium</div>
                        <div className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">Short</div>
                        <div className="px-3 py-1 bg-muted text-muted-foreground rounded text-sm">Long</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Include sections:</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Achievements</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Competencies</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-muted-foreground"></div>
                          <span>Certifications</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 rounded border-2 border-primary bg-primary flex items-center justify-center">
                            <CheckCircle className="w-3 h-3 text-white" />
                          </div>
                          <span>Education</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium mb-2">Work Experiences:</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-primary/20 rounded relative overflow-hidden">
                          <div className="absolute left-0 top-0 h-full bg-primary" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-xs font-semibold">8 of 14</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Trim older roles with a simple slider</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Right: Feature List */}
              <div className="space-y-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Zap className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Instant Priority Filtering</h4>
                          <p className="text-sm text-muted-foreground">
                            Content is automatically prioritized. Short CVs show only the most relevant experiences.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Job-Specific Optimisation</h4>
                          <p className="text-sm text-muted-foreground">
                            Every CV is tailored to the specific role. Keywords are naturally integrated where evidence exists.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Evidence Transparency</h4>
                          <p className="text-sm text-muted-foreground">
                            Hover over any keyword to see exactly where it was found in your profile. Complete traceability.
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-primary mt-0.5" />
                        <div>
                          <h4 className="font-semibold mb-1">Session-Based Security</h4>
                          <p className="text-sm text-muted-foreground">
                            Your profile is loaded securely for each session and cleaned up automatically. Your data never persists in AI systems.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Candidate5?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built by job seekers, for job seekers. We understand the challenges because we've lived them.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <CheckCircle className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">No More Copy-Paste Fatigue</h3>
                  <p className="text-muted-foreground">
                    Build your Career Arc once, then generate unlimited tailored CVs. No more maintaining 10 different CV versions.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Know Your Match Score</h3>
                  <p className="text-muted-foreground">
                    See your match percentage before you apply. Understand your strengths and gaps with evidence-based insights.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Honest & Accurate</h3>
                  <p className="text-muted-foreground">
                    Our AI never fabricates. Every bullet point, every achievement is traceable to your actual experience. Build trust with recruiters.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Apply in Under 8 Minutes</h3>
                  <p className="text-muted-foreground">
                    From pasting the job description to downloading your tailored CV and cover letter - the entire process takes less than 8 minutes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Settings className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Full Customisation Control</h3>
                  <p className="text-muted-foreground">
                    Toggle sections, adjust length, trim roles, add custom instructions. The AI adapts to your preferences in real-time.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Layers className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2">Multiple CV Variants</h3>
                  <p className="text-muted-foreground">
                    Generate short, medium, or long versions instantly. Each optimised for different application contexts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">How We Compare</h2>
              <p className="text-lg text-muted-foreground">
                See why Candidate5 is different from traditional CV builders and generic AI tools
              </p>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Traditional CV Builders</th>
                        <th className="text-center p-4 font-semibold">Generic AI Tools</th>
                        <th className="text-center p-4 font-semibold text-primary">Candidate5</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="p-4 font-medium">RAG Keyword Analysis</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Evidence-Based Content</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Zero Fabrication Guarantee</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Priority-Based Filtering</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Work Experience Trimmer</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Match Score & Gap Analysis</td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Toggleable Sections</td>
                        <td className="p-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                      <tr>
                        <td className="p-4 font-medium">Career Profile Management</td>
                        <td className="p-4 text-center"><AlertCircle className="w-5 h-5 text-amber-600 mx-auto" /></td>
                        <td className="p-4 text-center"><XCircle className="w-5 h-5 text-muted-foreground mx-auto" /></td>
                        <td className="p-4 text-center"><CheckCircle className="w-5 h-5 text-primary mx-auto" /></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-lg text-muted-foreground mb-12">
            Start free, upgrade when you're ready. No hidden fees, cancel anytime.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <div className="text-3xl font-bold mt-2">£0</div>
                <p className="text-sm text-muted-foreground">Forever</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>3 credits per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Up to 3 CVs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Tailored cover letter with every CV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Career Arc profile</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>DOCX downloads</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <a href="/signup">Get Started Free</a>
                </Button>
              </CardContent>
            </Card>

            <Card className="border-primary shadow-lg">
              <CardHeader>
                <Badge className="w-fit mb-2">Most Popular</Badge>
                <CardTitle>Monthly</CardTitle>
                <div className="text-3xl font-bold mt-2">£24.99</div>
                <p className="text-sm text-muted-foreground">per month</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span><strong>100 credits</strong> monthly recurring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span><strong>+ 3 credits per day</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Create up to 140 CVs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Tailored cover letter with every CV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Priority support</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" asChild>
                  <a href="/pricing">Start Monthly Plan</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Annual</CardTitle>
                <div className="text-3xl font-bold mt-2">£199</div>
                <p className="text-sm text-muted-foreground">per year</p>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-left">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span><strong>100 credits</strong> monthly recurring</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span><strong>+ 5 credits per day</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Create up to 200 CVs per month</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Tailored cover letter with every CV</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span><strong>33% discount</strong></span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" style={{ color: brandColor }} />
                    <span>Cancel anytime</span>
                  </li>
                </ul>
                <Button className="w-full mt-6" variant="outline" asChild>
                  <a href="/pricing">Choose Annual - Save 33%!</a>
                </Button>
              </CardContent>
            </Card>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-8">
            All plans include Career Arc, Application Wizard, and all customisation features
          </p>
        </div>
      </section>

      {/* Social Proof / Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Job Seekers Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-amber-400">★</div>
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "The RAG keyword system is brilliant! I could see exactly which skills I matched and which ones to emphasize. Got 3 interviews in my first week."
                </p>
                <div className="text-xs text-muted-foreground">
                  <div className="font-semibold">Sarah M.</div>
                  <div>Project Manager</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-amber-400">★</div>
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "The work experience trimmer is genius. I could create a focused 2-page CV for startups and a comprehensive 4-pager for corporate roles from the same profile."
                </p>
                <div className="text-xs text-muted-foreground">
                  <div className="font-semibold">James K.</div>
                  <div>Software Engineer</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 text-amber-400">★</div>
                  ))}
                </div>
                <p className="text-sm mb-4">
                  "Finally, an AI that doesn't make things up! Every statement was backed by my actual experience. Recruiters noticed the authenticity."
                </p>
                <div className="text-xs text-muted-foreground">
                  <div className="font-semibold">Rachel P.</div>
                  <div>Marketing Director</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto bg-primary text-primary-foreground">
          <CardContent className="pt-12 pb-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Land More Interviews?</h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of job seekers who are applying smarter, not harder.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg" asChild>
                <a href="/signup">Create Free Account</a>
              </Button>
            </div>
            <p className="text-sm mt-6 opacity-75">No credit card required • Start with 3 free applications</p>
          </CardContent>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h4 className="font-semibold mb-3">Product</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/features">Features</a></li>
                  <li><a href="/pricing">Pricing</a></li>
                  <li><a href="/faq">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Company</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                  <li><a href="/blog">Blog</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Legal</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li><a href="/privacy-policy">Privacy</a></li>
                  <li><a href="/terms">Terms</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-3">Candidate5</h4>
                <p className="text-sm text-muted-foreground">
                  Evidence-based CV generation for the modern job seeker.
                </p>
              </div>
            </div>
            <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
              © 2025 Candidate5. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default LandingAlternate;

