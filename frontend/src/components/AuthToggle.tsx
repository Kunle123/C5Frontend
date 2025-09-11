import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Separator } from "./ui/separator";
import { toast } from "../hooks/use-toast";

export function AuthToggle() {
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState<string | null>(null);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [tab, setTab] = useState<'login' | 'register'>('login');
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  // Replace with your actual reCAPTCHA site key
  const RECAPTCHA_SITE_KEY = "6LcjwIsrAAAAAB0gcJBueXnRM-5QJM_GOdckHwAy";

  const handleLogin = async () => {
    if (!loginEmail || !loginPassword) {
      toast({ title: "Missing fields", description: "Please enter your email and password.", variant: "destructive" });
      return;
    }
    if (!recaptchaValue) {
      toast({ title: "CAPTCHA required", description: "Please complete the CAPTCHA.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword, captchaToken: recaptchaValue }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Login failed", description: err.message || "Invalid credentials", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      const data = await res.json();
      localStorage.setItem("token", data.token);
      toast({ title: "Login successful!", description: "Welcome back!" });
      window.location.href = "/dashboard";
    } catch (err) {
      toast({ title: "Login error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!registerEmail || !registerPassword || !registerConfirm) {
      toast({ title: "Missing fields", description: "Please fill in all fields.", variant: "destructive" });
      return;
    }
    if (registerPassword !== registerConfirm) {
      toast({ title: "Password mismatch", description: "Passwords do not match.", variant: "destructive" });
      return;
    }
    if (!agreeToTerms) {
      toast({ title: "Terms required", description: "Please agree to the terms and conditions.", variant: "destructive" });
      return;
    }
    if (!recaptchaValue) {
      toast({ title: "CAPTCHA required", description: "Please complete the CAPTCHA.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: registerEmail, password: registerPassword, confirmPassword: registerConfirm, captchaToken: recaptchaValue }),
      });
      if (!res.ok) {
        const err = await res.json();
        toast({ title: "Registration failed", description: err.message || "Failed to create account", variant: "destructive" });
        setIsLoading(false);
        return;
      }
      toast({ title: "Account created!", description: "Please check your email to verify your account." });
      setTab('login');
    } catch (err) {
      toast({ title: "Registration error", description: "Something went wrong. Please try again.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Welcome</CardTitle>
          <CardDescription>
            Sign in to your account or create a new one
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" value={tab} onValueChange={v => setTab(v as 'login' | 'register')} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            <TabsContent value="login" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <Input
                  id="login-email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <Input
                  id="login-password"
                  type="password"
                  placeholder="Enter your password"
                  disabled={isLoading}
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                />
              </div>
              <div className="space-y-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div>
              <Button 
                className="w-full" 
                disabled={isLoading || !recaptchaValue}
                onClick={handleLogin}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
              <div className="text-center">
                <Button variant="link" className="text-sm">
                  Forgot password?
                </Button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </TabsContent>
            <TabsContent value="register" className="space-y-4 mt-6">
              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  value={registerEmail}
                  onChange={e => setRegisterEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  placeholder="Create a password"
                  disabled={isLoading}
                  value={registerPassword}
                  onChange={e => setRegisterPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                  value={registerConfirm}
                  onChange={e => setRegisterConfirm(e.target.value)}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="terms" 
                  checked={agreeToTerms}
                  onCheckedChange={(checked) => setAgreeToTerms(checked === true)}
                />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Terms of Service
                  </Button>{" "}
                  and{" "}
                  <Button variant="link" className="p-0 h-auto text-sm">
                    Privacy Policy
                  </Button>
                </Label>
              </div>
              <div className="space-y-4">
                <ReCAPTCHA
                  sitekey={RECAPTCHA_SITE_KEY}
                  onChange={(value) => setRecaptchaValue(value)}
                />
              </div>
              <Button 
                className="w-full" 
                disabled={isLoading || !agreeToTerms || !recaptchaValue}
                onClick={handleRegister}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    Or continue with
                  </span>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Continue with Google
              </Button>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
