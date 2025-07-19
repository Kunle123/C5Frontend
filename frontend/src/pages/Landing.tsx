import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import {
  ArrowRight,
  Play,
  CheckCircle,
  Zap,
  Shield,
  Target,
  Users,
  Clock,
  Star,
  FileText,
  Brain,
  Sparkles
} from "lucide-react";
import React from "react";

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-primary">Candidate 5</div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#home" className="text-foreground hover:text-primary transition-colors">Home</a>
              <a href="#pricing" className="text-foreground hover:text-primary transition-colors">Pricing</a>
              <Button variant="outline">Login</Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <Badge variant="success" className="gap-2">
                <Sparkles className="h-3 w-3" />
                AI-Powered Career Growth
              </Badge>
              <h1 className="text-5xl lg:text-6xl font-bold text-card-foreground leading-tight">
                Stop Rewriting, Start <span className="text-primary"> Applying</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Land your dream job faster with Candidate 5 - CV. Our AI uses your unique Career Arc™ 
                to craft perfectly tailored CVs and cover letters in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="gap-2 text-lg px-8 py-6">
                  <CheckCircle className="h-5 w-5" />
                  Create Your Free Account
                </Button>
                <Button variant="outline" size="lg" className="gap-2 text-lg px-8 py-6">
                  <Play className="h-5 w-5" />
                  See How It Works (60s)
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Join 10,000+ job seekers already optimizing their applications!
              </p>
            </div>
            <div className="relative">
              <div className="relative bg-gradient-to-br from-primary/10 to-accent/10 rounded-3xl p-8 border shadow-elevated">
                <div className="bg-background rounded-2xl p-6 shadow-card">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-success rounded-full"></div>
                      <div className="w-3 h-3 bg-warning rounded-full"></div>
                      <div className="w-3 h-3 bg-destructive rounded-full"></div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-4 bg-muted rounded w-full"></div>
                      <div className="h-4 bg-muted rounded w-1/2"></div>
                      <div className="h-6 bg-primary/20 rounded w-2/3"></div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-primary rounded-full p-3 shadow-glow">
                  <Brain className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 border-y border-border/50 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-center text-muted-foreground mb-8">As seen on</p>
          <div className="flex justify-center items-center gap-12 opacity-60">
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
            <div className="h-8 w-24 bg-muted rounded"></div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h2 className="text-4xl font-bold text-card-foreground">
            The Job Application Grind is Real. Candidate 5 - CV is Your Way Out.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Spending hours tailoring your CV for each role? Worried your application will get lost in the ATS black hole? 
            Juggling multiple CV versions? It's exhausting and inefficient. Candidate 5 automates the tedious parts, 
            so you can focus on what matters: acing the interview.
          </p>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              Meet Your AI-Powered Application Toolkit
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-card hover:shadow-elevated">
              <CardContent className="p-8 space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Build Once, Apply Perfectly, Forever
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Your Career Arc™ is your private, intelligent career repository. Upload your existing CVs 
                  or add your experiences. Arc™ extracts, structures, and stores every skill and achievement.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Consolidate your entire career history
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Ensure consistency across applications
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Gets more powerful with every update
                  </li>
                </ul>
              </CardContent>
            </Card>
            {/* Feature 2 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-card hover:shadow-elevated">
              <CardContent className="p-8 space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  Tailored CVs & Cover Letters, Instantly
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Paste any job description, and let the Application Wizard work its magic. Our AI instantly 
                  analyzes the role and generates perfectly optimized applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Beat Applicant Tracking Systems (ATS)
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Highlight relevant experiences
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Save hours per application
                  </li>
                </ul>
              </CardContent>
            </Card>
            {/* Feature 3 */}
            <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-card hover:shadow-elevated">
              <CardContent className="p-8 space-y-6">
                <div className="bg-primary/10 w-16 h-16 rounded-2xl flex items-center justify-center">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-card-foreground">
                  All Your Docs, One Place
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  Store, manage, and access all your CVs, cover letters, and supporting docs in one secure place.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Secure cloud storage
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Easy version control
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Access from any device
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* More sections from lovable design can be added here as needed */}
    </div>
  );
};

export default Landing; 