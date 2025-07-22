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
import { Link } from "react-router-dom";

export default function Landing() {
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
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
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
                Stop Rewriting, Start 
                <span className="text-primary"> Applying</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Land your dream job faster with Candidate 5 - CV. Our AI uses your unique Career Arc™ 
                to craft perfectly tailored CVs and cover letters in minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/signup">
                  <Button size="lg" className="gap-2 text-lg px-8 py-6">
                    <CheckCircle className="h-5 w-5" />
                    Create Your Free Account
                  </Button>
                </Link>
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
                  Your Master Career Profile, Always Ready
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  The Mega CV draws from your Arc™ to create a comprehensive master version of your resume, 
                  perfect for networking and speculative applications.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Complete, always-current master document
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Ideal for diverse application needs
                  </li>
                  <li className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Showcase the full breadth of experience
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
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
                Securely upload your existing CVs or manually add your career details. 
                Our AI intelligently populates your personal Career Arc™.
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
                Instantly generate a tailored CV and cover letter, optimized for the role. 
                Download and apply!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Advantages */}
      <section className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              The Candidate 5 - CV Advantage: More Than Just a CV Builder
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center p-6 shadow-card">
              <CardContent className="space-y-4">
                <Brain className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-semibold text-card-foreground">Intelligent Personalization</h3>
                <p className="text-sm text-muted-foreground">
                  Go beyond templates. Create genuinely bespoke applications that reflect your true value.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-card">
              <CardContent className="space-y-4">
                <Clock className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-semibold text-card-foreground">Radical Time Savings</h3>
                <p className="text-sm text-muted-foreground">
                  Cut down application time from hours to mere minutes. Apply to more opportunities.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-card">
              <CardContent className="space-y-4">
                <Users className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-semibold text-card-foreground">Career Long Companion</h3>
                <p className="text-sm text-muted-foreground">
                  Your Career Arc™ evolves with you, making each future application stronger and smarter.
                </p>
              </CardContent>
            </Card>
            <Card className="text-center p-6 shadow-card">
              <CardContent className="space-y-4">
                <Shield className="h-12 w-12 text-primary mx-auto" />
                <h3 className="font-semibold text-card-foreground">Your Data, Your Control</h3>
                <p className="text-sm text-muted-foreground">
                  We prioritize your privacy. Your Career Arc™ is your secure, personal career database.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              Don't Just Take Our Word For It...
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "Candidate 5 is a game-changer! I landed three interviews in my first week using it. 
                  The tailored CVs make a huge difference."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    SK
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Sarah K.</p>
                    <p className="text-xs text-muted-foreground">Marketing Manager</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "I used to spend hours on every application. Now it takes minutes and I get more callbacks."
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    JT
                  </div>
                  <div>
                    <p className="font-semibold text-sm">James T.</p>
                    <p className="text-xs text-muted-foreground">Software Engineer</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="shadow-card">
              <CardContent className="p-6 space-y-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-warning text-warning" />
                  ))}
                </div>
                <p className="text-muted-foreground">
                  "The Career Arc keeps all my experience organized. I feel so much more confident applying!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    PS
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Priya S.</p>
                    <p className="text-xs text-muted-foreground">Recent Grad</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 bg-muted/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-card-foreground mb-4">
              Find the Perfect Plan to Launch Your Next Career Move
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Starter Plan */}
            <Card className="shadow-card">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Career Starter</h3>
                  <div className="text-3xl font-bold text-primary mt-2">Free</div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Build your Career Arc™
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Basic CV parsing
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    1 tailored application per month
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Email support
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full" variant="outline">
                    Get Started with Career Starter
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Accelerator Plan */}
            <Card className="shadow-card border-2 border-primary relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Most Popular</Badge>
              </div>
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Career Accelerator</h3>
                  <div className="text-3xl font-bold text-primary mt-2">£14.99<span className="text-lg text-muted-foreground">/mo</span></div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Unlimited tailored applications
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Advanced AI optimization
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Priority support
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Access to Application Wizard
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full">
                    Get Started with Career Accelerator
                  </Button>
                </Link>
              </CardContent>
            </Card>
            {/* Dominator Plan */}
            <Card className="shadow-card">
              <CardContent className="p-8 space-y-6">
                <div>
                  <h3 className="text-2xl font-bold text-card-foreground">Career Dominator</h3>
                  <div className="text-3xl font-bold text-primary mt-2">£29.99<span className="text-lg text-muted-foreground">/mo</span></div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Everything in Accelerator
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    1:1 expert review
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Early access to new features
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    Personalized job search insights
                  </li>
                </ul>
                <Link to="/signup">
                  <Button className="w-full" variant="outline">
                    Get Started with Career Dominator
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
          <p className="text-center text-muted-foreground mt-8">
            All plans start with a 7-day free trial. Cancel anytime.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-4xl font-bold text-card-foreground">
            Ready to Transform Your Job Search?
          </h2>
          <p className="text-xl text-muted-foreground">
            Stop letting tedious applications hold you back. Join Candidate 5 today and start applying 
            smarter, faster, and with more confidence.
          </p>
          <Link to="/signup">
            <Button size="lg" className="gap-2 text-lg px-8 py-6">
              Sign Up for Your Free Trial Now
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
          <p className="text-sm text-muted-foreground">
            No credit card required for trial. Takes less than 2 minutes to get started.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 bg-muted/30 py-8 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-muted-foreground">
            © 2024 Candidate 5. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}