import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    // Listen for storage changes (e.g., logout in another tab)
    const handler = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    navigate("/");
  };

  return (
    <nav className="border-b border-border/50 bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="text-2xl font-bold text-primary cursor-pointer" 
            onClick={() => navigate("/")}
          >
            CandidateV
          </div>
          <div className="hidden md:flex items-center space-x-8">
            {/* Public menu items */}
            {!isLoggedIn && (
              <>
                <button onClick={() => navigate("/")} className={`transition-colors ${isActive("/") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Home</button>
                <button onClick={() => navigate("/pricing")} className={`transition-colors ${isActive("/pricing") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Pricing</button>
                <button onClick={() => navigate("/privacy-policy")} className={`transition-colors ${isActive("/privacy-policy") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Privacy</button>
                <button onClick={() => navigate("/terms")} className={`transition-colors ${isActive("/terms") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Terms</button>
                <button onClick={() => navigate("/login")} className={`transition-colors ${isActive("/login") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Login</button>
                <button onClick={() => navigate("/signup")} className={`transition-colors ${isActive("/signup") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Sign Up</button>
              </>
            )}
            {/* Internal menu items */}
            {isLoggedIn && (
              <>
                <button onClick={() => navigate("/dashboard")} className={`transition-colors ${isActive("/dashboard") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Dashboard</button>
                <button onClick={() => navigate("/careerarcv2")} className={`transition-colors ${isActive("/careerarcv2") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Career Arc</button>
                <button onClick={() => navigate("/my-cvs-new")} className={`transition-colors ${isActive("/my-cvs-new") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>My CVs</button>
                <button onClick={() => navigate("/account-new")} className={`transition-colors ${isActive("/account-new") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Account</button>
                <button onClick={() => navigate("/apply")} className={`transition-colors ${isActive("/apply") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Apply</button>
                <Button variant="outline" size="sm" onClick={handleLogout}>Log Out</Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 