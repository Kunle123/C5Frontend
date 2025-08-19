import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { oauthService } from "@/services/oauthService";
import { useToast } from "@/hooks/use-toast";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");
    const token = params.get("token"); // NEW: get token from URL
    const pathname = location.pathname;

    if (token) {
      localStorage.setItem("token", token);
      toast({ title: "Authentication successful!", description: "You are now logged in." });
      navigate("/dashboard");
      return;
    }

    const handleOAuth = async () => {
      try {
        let result;
        if (pathname.includes("google")) {
          if (!code) throw new Error("Missing code from Google OAuth");
          result = await oauthService.handleGoogleCallback(code);
        } else if (pathname.includes("linkedin")) {
          if (!code || !state) throw new Error("Missing code or state from LinkedIn OAuth");
          result = await oauthService.handleLinkedInCallback(code, state);
        } else {
          throw new Error("Unknown OAuth provider");
        }
        // Store token/session as needed
        if (result && result.token) {
          localStorage.setItem("token", result.token);
          toast({ title: "Authentication successful!", description: "You are now logged in." });
          navigate("/dashboard");
        } else {
          throw new Error("No token received from backend");
        }
      } catch (err: any) {
        setError(err.message || "OAuth callback failed");
        toast({ title: "Authentication failed", description: err.message || "OAuth callback failed", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    handleOAuth();
    // eslint-disable-next-line
  }, [location]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Processing authentication...</div>;
  }
  if (error) {
    return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
  }
  return null;
};

export default AuthCallback; 