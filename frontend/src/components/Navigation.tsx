import { Button } from "./ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { Menu } from "lucide-react";
import { Badge } from "./ui/badge";
import { CreditsContext } from "../context/CreditsContext";

export function Navigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { credits, refreshCredits } = useContext(CreditsContext);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    // Listen for storage changes (e.g., logout in another tab)
    const handler = () => setIsLoggedIn(!!localStorage.getItem("token"));
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        const res = await fetch("https://api-gw-production.up.railway.app/api/user/credits", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const data = await res.json();
        refreshCredits(); // Use refreshCredits from context, no arguments
      } catch {}
    };
    fetchCredits();
  }, [isLoggedIn, refreshCredits]);

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
          <div className="flex items-center gap-2">
            <img src="/C5Logo.png" alt="CV Logo" className="h-8 w-auto mr-2" />
            <span className="text-2xl font-bold text-primary">Candidate 5</span>
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
                  <button onClick={() => { navigate("/careerarcv2"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/careerarcv2") ? "text-primary font-medium" : "text-foreground"}`}>Career Ark</button>
                  <button onClick={() => { localStorage.setItem('resetApplyStep', 'true'); navigate("/apply"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/apply") ? "text-primary font-medium" : "text-foreground"}`}>Apply</button>
                  <button onClick={() => { navigate("/my-cvs-new"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/my-cvs-new") ? "text-primary font-medium" : "text-foreground"}`}>My CVs</button>
                  <button onClick={() => { navigate("/application-history"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/application-history") ? "text-primary font-medium" : "text-foreground"}`}>Application History</button>
                  <button onClick={() => { navigate("/account"); setShowMenu(false); }} className={`block w-full text-left px-4 py-2 hover:bg-accent ${isActive("/account") ? "text-primary font-medium" : "text-foreground"}`}>Account</button>
                  <Button variant="outline" size="sm" className="w-full mt-2" onClick={() => { handleLogout(); setShowMenu(false); }}>Log Out</Button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center space-x-8">
              {/* Public menu items */}
              <button onClick={() => navigate("/")} className={`transition-colors ${isActive("/") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Home</button>
              <button onClick={() => navigate("/pricing")} className={`transition-colors ${isActive("/pricing") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Pricing</button>
              <button onClick={() => navigate("/privacy-policy")} className={`transition-colors ${isActive("/privacy-policy") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Privacy</button>
              <button onClick={() => navigate("/terms")} className={`transition-colors ${isActive("/terms") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Terms</button>
              <button onClick={() => navigate("/login")} className={`transition-colors ${isActive("/login") ? "text-primary font-medium" : "text-foreground hover:text-primary"}`}>Login</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}