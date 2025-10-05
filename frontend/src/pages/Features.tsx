import React from 'react';
import { Navigation } from '../components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { CheckCircle, AlertCircle, XCircle, Sparkles, Shield, Zap, Target, Layers, Settings, BarChart, Award, Clock } from 'lucide-react';

const Features = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Powerful Features</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create professional, job-specific applications with confidence
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
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
                See exactly which keywords you match (Green), partially match (Amber), or need to address (Red) — all with evidence from your profile.
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  <span className="text-emerald-600 font-medium">Strong evidence found</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span className="text-amber-600 font-medium">Transferable skills</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <XCircle className="w-3 h-3 text-rose-600" />
                  <span className="text-rose-600 font-medium">Gaps with strategies</span>
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
                Customize your CV on the fly. Toggle achievements, competencies, education, and certifications on or off instantly.
              </p>
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
            </CardContent>
          </Card>

          {/* Anti-Fabrication */}
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
                100% Factual
              </Badge>
            </CardContent>
          </Card>

          {/* Career Arc */}
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
            </CardContent>
          </Card>

          {/* Match Score */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Match Score & Gap Analysis</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Know your match percentage before you apply. Understand your strengths and gaps with evidence-based insights.
              </p>
            </CardContent>
          </Card>

          {/* Priority Filtering */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Priority-Based Filtering</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Content is automatically prioritized. Short CVs show only the most relevant experiences. Long CVs include comprehensive details.
              </p>
            </CardContent>
          </Card>

          {/* Session Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Session-Based Security</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Your profile is loaded securely for each session and cleaned up automatically. Your data never persists in AI systems.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA */}
        <Card className="bg-primary text-primary-foreground">
          <CardContent className="py-12 text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-lg mb-6 opacity-90">
              Create your free account and start applying smarter today.
            </p>
            <a
              href="/signup"
              className="inline-block px-8 py-3 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Create Free Account
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Features;
