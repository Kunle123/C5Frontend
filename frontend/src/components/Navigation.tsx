import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

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
            <button 
              onClick={() => navigate("/")}
              className={`transition-colors ${
                isActive("/") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Dashboard
            </button>
            <button 
              onClick={() => navigate("/career-arc")}
              className={`transition-colors ${
                isActive("/career-arc") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Career Arc
            </button>
            <button 
              onClick={() => navigate("/my-cvs-new")}
              className={`transition-colors ${
                isActive("/my-cvs-new") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              My CVs
            </button>
            <button 
              onClick={() => navigate("/account-new")}
              className={`transition-colors ${
                isActive("/account-new") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Account
            </button>
            <button 
              onClick={() => navigate("/login")}
              className={`transition-colors ${
                isActive("/login") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => navigate("/signup")}
              className={`transition-colors ${
                isActive("/signup") 
                  ? "text-primary font-medium" 
                  : "text-foreground hover:text-primary"
              }`}
            >
              Sign Up
            </button>
            <Button variant="outline" size="sm">
              Log Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
} 