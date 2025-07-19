import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
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

const heroImg = "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5";

export function CandidateLanding() {
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
                Land your dream job faster with Candidate 5 - CV. Our AI uses your unique Career Arc™ to craft perfectly tailored CVs and cover letters in minutes.
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

      {/* Problem Statement Section */}
      <div className="py-12 px-2">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-2">
          Job Applications Are Broken. Candidate 5 Fixes Them.
        </h2>
        <p className="text-md sm:text-lg text-gray-600 text-center max-w-2xl mx-auto">
          Tired of spending hours rewriting your CV for every job? Candidate 5 automates the tedious parts, so you can focus on what matters: acing the interview.
        </p>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 px-4 sm:px-16 mb-16">
        <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
          <img src="/brain.svg" alt="AI-Personalized CVs" className="w-16 h-16" />
          <h4 className="text-md font-bold text-primary">AI-Personalized CVs</h4>
          <p className="text-gray-600">Go beyond templates. Candidate 5 uses your Career Arc™ to create bespoke applications that reflect your true value.</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
          <img src="/clock.svg" alt="Radical Time Savings" className="w-16 h-16" />
          <h4 className="text-md font-bold text-primary">Radical Time Savings</h4>
          <p className="text-gray-600">Cut application time from hours to minutes. Apply to more opportunities with less effort.</p>
        </div>
        <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
          <img src="/sparkles.svg" alt="Career Arc™ System" className="w-16 h-16" />
          <h4 className="text-md font-bold text-primary">Career Arc™ System</h4>
          <p className="text-gray-600">Your Career Arc™ evolves with you, making each future application stronger and smarter.</p>
        </div>
      </div>

      {/* Process Steps */}
      <div className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              Get Your Perfect Application in 3 Simple Steps
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                1
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Feed Your Arc™</h3>
              <p className="text-muted-foreground">
                Securely upload your existing CVs or manually add your career details. Our AI intelligently populates your personal Career Arc™.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                2
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Target Your Role</h3>
              <p className="text-muted-foreground">
                Find a job you love? Simply paste the job description into Candidate 5.
              </p>
            </div>
            <div className="text-center space-y-4">
              <div className="bg-primary w-16 h-16 rounded-full flex items-center justify-center mx-auto text-primary-foreground font-bold text-xl">
                3
              </div>
              <h3 className="text-xl font-semibold text-card-foreground">Apply with Confidence</h3>
              <p className="text-muted-foreground">
                Instantly generate a tailored CV and cover letter, optimized for the role. Download and apply!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              Find the Perfect Plan to Launch Your Next Career Move
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
              <h4 className="text-2xl font-bold text-gray-800">Starter</h4>
              <p className="text-3xl font-bold text-primary">Free</p>
              <p className="text-gray-600">Build your Career Arc™ and try basic AI CV generation.</p>
              <Button variant="outline" size="lg" className="w-full hover:bg-gray-100">Get Started</Button>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md border border-blue-500">
              <h4 className="text-2xl font-bold text-gray-800">Accelerator</h4>
              <p className="text-3xl font-bold text-primary">£14.99/mo</p>
              <p className="text-gray-600">Unlimited tailored applications, advanced AI, and priority support.</p>
              <Button variant="default" size="lg" className="w-full hover:bg-blue-700">Start Free Trial</Button>
            </div>
            <div className="flex flex-col items-center bg-white p-6 rounded-md shadow-md">
              <h4 className="text-2xl font-bold text-gray-800">Dominator</h4>
              <p className="text-3xl font-bold text-primary">£29.99/mo</p>
              <p className="text-gray-600">Everything in Accelerator plus 1:1 expert review and early access.</p>
              <Button variant="outline" size="lg" className="w-full hover:bg-gray-100">Contact Sales</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-background py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">© 2024 Candidate 5. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
} 