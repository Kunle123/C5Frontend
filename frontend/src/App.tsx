import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Pricing from './pages/Pricing';
import NotFound from './pages/NotFound';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import CVsAndCoverLetters from './pages/CVsAndCoverLetters';
import CareerArk from './pages/CareerArk';
import ProtectedRoute from './components/ProtectedRoute';
import TestAppJourneys from './pages/TestAppJourneys';
import { checkTokenExpiration } from './utils/auth';
import HighConvertingLanding from './pages/HighConvertingLanding';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import DebugCVAIResponse from './pages/DebugCVAIResponse';
import SearchJobs from './pages/SearchJobs';
import Landing from './pages/Landing';
import LandingOriginal from './pages/LandingOriginal';
import LandingAlternate from './pages/LandingAlternate';
import ColorTest from './pages/ColorTest';
import TailwindUiTest from './pages/TailwindUiTest';
import AuthCallback from './pages/AuthCallback';
import CareerArcV2 from './pages/CareerArcV2';
import DashboardNew from './pages/DashboardNew';
import MyCVsNew from './pages/MyCVsNew';
import Account from './pages/Account';
import CareerArkV2 from './pages/CareerArkV2';
import Apply from './pages/Apply';
import PaymentSuccess from './pages/PaymentSuccess';
import { CreditsProvider } from './context/CreditsContext';
import ApplicationHistory from './components/ApplicationHistory';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import Blog from './pages/Blog';
import ATSProof from './pages/ATSProof';
import CareerArcInfo from './pages/CareerArcInfo';
import ApplicationTracker from './pages/ApplicationTracker';
import { AdminRoute } from './components/AdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminUserDetail from './pages/admin/AdminUserDetail';

// Notification context
export const NotificationContext = createContext<{ notify: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void }>({ notify: () => {} });

function App() {
  const [notification, setNotification] = useState<{ msg: string; open: boolean; severity: 'success' | 'info' | 'warning' | 'error' }>({ msg: '', open: false, severity: 'info' });

  const notify = (msg: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setNotification({ msg, open: true, severity });
    // toast logic omitted for brevity
  };

  const handleClose = () => setNotification((n) => ({ ...n, open: false }));

  useEffect(() => {
    const handler = () => notify('Session expired. Please log in again.', 'error');
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);

  // Check token expiration every minute
  useEffect(() => {
    const checkInterval = setInterval(checkTokenExpiration, 60000);
    return () => clearInterval(checkInterval);
  }, []);

  // Load Custoq chatbot
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://custoq.com/js/chat.js";
    script.dataset.companyName = "candidate5.co.uk";
    script.dataset.companyId = "fc1aa323-3320-4a2b-85e8-6ac313a68e28";
    script.async = true;
    document.body.appendChild(script);

    // Cleanup: remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{ notify }}>
      <CreditsProvider>
        <Router>
          <Routes>
            {/* Tailwind/shadcn/ui landing and auth pages - NO ChakraProvider */}
            <Route path="/" element={<Landing />} />
            <Route path="/landing-original" element={<LandingOriginal />} />
            <Route path="/landing-alternate" element={<LandingAlternate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/auth/google/callback" element={<AuthCallback />} />
            <Route path="/auth/linkedin/callback" element={<AuthCallback />} />
            <Route path="/auth/callback" element={<AuthCallback />} />

            {/* Chakra-based pages - wrap with ChakraProvider and Layout */}
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard-new" element={<DashboardNew />} />
            <Route path="/cvs" element={<ChakraProvider theme={theme}><ProtectedRoute><CVsAndCoverLetters /></ProtectedRoute></ChakraProvider>} />
            <Route path="/pricing" element={<ChakraProvider theme={theme}><Pricing /></ChakraProvider>} />
            <Route path="/apply" element={<ProtectedRoute><Apply /></ProtectedRoute>} />
            <Route path="/subscription-success" element={<ChakraProvider theme={theme}><SubscriptionSuccess /></ChakraProvider>} />
            <Route path="/subscription-cancel" element={<ChakraProvider theme={theme}><SubscriptionCancel /></ChakraProvider>} />
            <Route path="/test" element={<ChakraProvider theme={theme}><TestAppJourneys /></ChakraProvider>} />
            <Route path="/privacy-policy" element={<ChakraProvider theme={theme}><PrivacyPolicy /></ChakraProvider>} />
            <Route path="/terms" element={<ChakraProvider theme={theme}><Terms /></ChakraProvider>} />
            <Route path="/faq" element={<ChakraProvider theme={theme}><FAQ /></ChakraProvider>} />
            <Route path="/features" element={<Features />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/debug-cv-ai" element={<ChakraProvider theme={theme}><DebugCVAIResponse /></ChakraProvider>} />
            <Route path="/search-jobs" element={<ChakraProvider theme={theme}><SearchJobs /></ChakraProvider>} />
            <Route path="/colortest" element={<ColorTest />} />
            <Route path="/tailwinduitest" element={<TailwindUiTest />} />
            <Route path="/my-cvs-new" element={<MyCVsNew />} />
            <Route path="/careerarcv2" element={<CareerArkV2 />} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/payment-success" element={<ChakraProvider theme={theme}><PaymentSuccess /></ChakraProvider>} />
            <Route path="/application-history" element={<ApplicationHistory />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/ats-proof" element={<ATSProof />} />
            <Route path="/career-arc" element={<CareerArcInfo />} />
            <Route path="/application-tracker" element={<ApplicationTracker />} />
            
            {/* Admin Routes */}
            <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />
            <Route path="/admin/users/:userId" element={<AdminRoute><AdminUserDetail /></AdminRoute>} />
            
            <Route path="*" element={<ChakraProvider theme={theme}><NotFound /></ChakraProvider>} />
          </Routes>
        </Router>
      </CreditsProvider>
    </NotificationContext.Provider>
  );
}

export default App;
