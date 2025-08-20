import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Checkbox } from "../components/ui/checkbox";
import { Mail, Lock, User, Eye, EyeOff, Shield } from "lucide-react";
import SocialAuthButton from "../components/auth/SocialAuthButton";
import CaptchaComponent, { CaptchaRef } from "../components/auth/CaptchaComponent";
import { oauthService } from "../services/oauthService";
import { useToast } from "../hooks/use-toast";
import NavBanner from "../components/NavBanner";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    code: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const captchaRef = useRef<CaptchaRef>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (isLocal) {
      setCaptchaToken("dev-bypass");
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match");
      toast({ title: "Password mismatch", description: "Passwords do not match", variant: "destructive" });
      setIsLoading(false);
      return;
    }
    if (!agreeToTerms) {
      setErrorMessage("Please agree to the terms and conditions");
      toast({ title: "Terms required", description: "Please agree to the terms and conditions", variant: "destructive" });
      return;
    }
    if (!captchaToken) {
      setErrorMessage("Please complete the CAPTCHA verification.");
      toast({ title: "CAPTCHA required", description: "Please complete the CAPTCHA verification.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    setErrorMessage(null);
    try {
      // TODO: Connect to your backend API
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, captchaToken }),
      });
      if (response.ok) {
        const data = await response.json();
        toast({ title: "Account created successfully!", description: "Please check your email to verify your account." });
        setErrorMessage(null);
        navigate("/login"); // Redirect to login after successful registration
      } else {
        const error = await response.json();
        setErrorMessage(error.message || "Failed to create account");
        toast({ title: "Registration failed", description: error.message || "Failed to create account", variant: "destructive" });
        captchaRef.current?.reset();
        setCaptchaToken(null);
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please try again.");
      console.error("Registration error:", error);
      toast({ title: "Registration error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    try { oauthService.initiateGoogleAuth(); } catch (error) { toast({ title: "OAuth Error", description: "Failed to initiate Google authentication", variant: "destructive" }); }
  };
  const handleLinkedInAuth = () => {
    try { oauthService.initiateLinkedInAuth(); } catch (error) { toast({ title: "OAuth Error", description: "Failed to initiate LinkedIn authentication", variant: "destructive" }); }
  };
  const handleCaptchaChange = (token: string | null) => { setCaptchaToken(token); };
  const handleCaptchaError = () => { toast({ title: "CAPTCHA Error", description: "CAPTCHA verification failed. Please try again.", variant: "destructive" }); setCaptchaToken(null); };

  return (
    <>
      <NavBanner />
      <div className="min-h-screen bg-auth-gradient-subtle flex items-center justify-center p-4">
        <div className="w-full max-w-md animate-fade-in">
          <Card className="shadow-elegant border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-4xl font-bold text-primary">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">Join us today and get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {errorMessage && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded border border-red-300 text-center">
                  {errorMessage}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="name" name="name" type="text" placeholder="Enter your full name" value={formData.name} onChange={(e) => { handleChange(e); setErrorMessage(null); }} className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-foreground font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="email" name="email" type="email" placeholder="Enter your email" value={formData.email} onChange={(e) => { handleChange(e); setErrorMessage(null); }} className="pl-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"} placeholder="Create a password" value={formData.password} onChange={(e) => { handleChange(e); setErrorMessage(null); }} className="pl-10 pr-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300" required autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                      className="pl-10 pr-10 border-border/50 focus:border-primary focus:ring-primary/20 transition-all duration-300"
                      required
                      autoComplete="current-password"
                    />
                    <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors">{showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code" className="font-medium text-foreground">6-Digit Code</Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    maxLength={6}
                    placeholder="Enter your passcode"
                    value={formData.code || ""}
                    onChange={e => setFormData({ ...formData, code: e.target.value })}
                    required
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" checked={agreeToTerms} onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)} />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">I agree to the{" "}<Link to="/terms" className="text-primary hover:text-primary-glow underline">Terms of Service</Link>{" "}and{" "}<Link to="/privacy" className="text-primary hover:text-primary-glow underline">Privacy Policy</Link></Label>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground font-medium flex items-center gap-2"><Shield className="h-4 w-4" />Security Verification</Label>
                  {!(window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") && (
                    <CaptchaComponent ref={captchaRef} siteKey="6LcjwIsrAAAAAB0gcJBueXnRM-5QJM_GOdckHwAy" onChange={handleCaptchaChange} onError={handleCaptchaError} theme="light" />
                  )}
                </div>
                {/* Button should always be visible after CAPTCHA */}
                <Button
                  type="submit"
                  className="w-full bg-primary text-white hover:bg-primary-dark border-0 shadow-soft transition-all duration-300 mt-6 min-h-12 block"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>
              <div className="relative">
                <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border/50" /></div>
                <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or continue with</span></div>
              </div>
              <div className="space-y-3">
                <SocialAuthButton provider="google" onClick={handleGoogleAuth} disabled={isLoading} />
                {/* <SocialAuthButton provider="linkedin" onClick={handleLinkedInAuth} disabled={isLoading} /> */}
              </div>
              <p className="text-center text-sm text-muted-foreground">Already have an account?{" "}<Link to="/login" className="text-primary hover:text-primary-glow transition-colors underline-offset-4 hover:underline font-medium">Sign in</Link></p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default Signup; 