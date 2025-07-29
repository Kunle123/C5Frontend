import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu } from "lucide-react";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
          {isLoggedIn ? (
            <div className="flex items-center space-x-2 relative">
              <button
                className="text-base font-medium px-2 py-1 rounded hover:bg-accent focus:outline-none"
                onClick={() => { navigate("/dashboard"); setShowMenu(false); }}
                aria-label="Go to Dashboard"
              >
                Dashboard
              </button>
              <button
                className="flex items-center px-2 py-2 rounded hover:bg-accent focus:outline-none"
                onClick={() => setShowMenu((prev) => !prev)}
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </button>
              {showMenu && (
                <div className="absolute right-0 top-12 bg-background border rounded shadow-lg z-50 min-w-[180px]">
                  <button onClick={() => { navigate("/dashboard"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/dashboard") ? "text-primary font-medium" : "text-foreground"}`}>Dashboard</button>
                  <button onClick={() => { navigate("/careerarcv2"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/careerarcv2") ? "text-primary font-medium" : "text-foreground"}`}>Career Arc</button>
                  <button onClick={() => { navigate("/my-cvs-new"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/my-cvs-new") ? "text-primary font-medium" : "text-foreground"}`}>My CVs</button>
                  <button onClick={() => { navigate("/account-new"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/account-new") ? "text-primary font-medium" : "text-foreground"}`}>Account</button>
                  <button onClick={() => { navigate("/apply"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/apply") ? "text-primary font-medium" : "text-foreground"}`}>Apply</button>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => { handleLogout(); setShowMenu(false); }}>Log Out</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-8">
              {/* Public menu items */}
              <button onClick={() => navigate("/")} className={`transition-colors ${isActive("/") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Home</button>
              <button onClick={() => navigate("/pricing")} className={`transition-colors ${isActive("/pricing") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Pricing</button>
              <button onClick={() => navigate("/privacy-policy")} className={`transition-colors ${isActive("/privacy-policy") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Privacy</button>
              <button onClick={() => navigate("/terms")} className={`transition-colors ${isActive("/terms") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Terms</button>
              <button onClick={() => navigate("/login")} className={`transition-colors ${isActive("/login") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Login</button>
              <button onClick={() => navigate("/signup")} className={`transition-colors ${isActive("/signup") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Sign Up</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 