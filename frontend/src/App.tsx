import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import Layout from './components/Layout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CVs from './pages/CVs';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import NotFound from './pages/NotFound';
import Applications from './pages/Applications';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import CVsAndCoverLetters from './pages/CVsAndCoverLetters';
import CareerArk from './pages/CareerArk';
import ProtectedRoute from './components/ProtectedRoute';
import TestAppJourneys from './pages/TestAppJourneys';
import DownloadCVs from './pages/DownloadCVs';
import { checkTokenExpiration } from './utils/auth';
import CareerArkDemo from './pages/CareerArkDemo';
import HighConvertingLanding from './pages/HighConvertingLanding';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Terms from './pages/Terms';
import FAQ from './pages/FAQ';
import DebugCVAIResponse from './pages/DebugCVAIResponse';
import CareerArkV2 from './pages/CareerArkV2';
import SearchJobs from './pages/SearchJobs';
import Landing from './pages/Landing';
import ColorTest from './pages/ColorTest';
import TailwindUiTest from './pages/TailwindUiTest';
import AuthCallback from './pages/AuthCallback';

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

  return (
    <NotificationContext.Provider value={{ notify }}>
      <Router>
        <Routes>
          {/* Tailwind/shadcn/ui landing and auth pages - NO ChakraProvider */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/google/callback" element={<AuthCallback />} />
          <Route path="/auth/linkedin/callback" element={<AuthCallback />} />

          {/* Chakra-based pages - wrap with ChakraProvider and Layout */}
          <Route path="/dashboard" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><Dashboard /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/cvs" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><CVsAndCoverLetters /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/career-ark" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><CareerArk /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/career-history" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><CareerArk /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/career-history/:idx" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><CareerArk /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/pricing" element={<ChakraProvider theme={theme}><Layout><Pricing /></Layout></ChakraProvider>} />
          <Route path="/account" element={<ChakraProvider theme={theme}><Layout><Account /></Layout></ChakraProvider>} />
          <Route path="/applications" element={<ChakraProvider theme={theme}><Layout><Applications /></Layout></ChakraProvider>} />
          <Route path="/subscription-success" element={<ChakraProvider theme={theme}><Layout><SubscriptionSuccess /></Layout></ChakraProvider>} />
          <Route path="/subscription-cancel" element={<ChakraProvider theme={theme}><Layout><SubscriptionCancel /></Layout></ChakraProvider>} />
          <Route path="/test" element={<ChakraProvider theme={theme}><Layout><TestAppJourneys /></Layout></ChakraProvider>} />
          <Route path="/download-cvs" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><DownloadCVs /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/privacy-policy" element={<ChakraProvider theme={theme}><Layout><PrivacyPolicy /></Layout></ChakraProvider>} />
          <Route path="/terms" element={<ChakraProvider theme={theme}><Layout><Terms /></Layout></ChakraProvider>} />
          <Route path="/faq" element={<ChakraProvider theme={theme}><Layout><FAQ /></Layout></ChakraProvider>} />
          <Route path="/career-ark-demo" element={<ChakraProvider theme={theme}><Layout><CareerArkDemo /></Layout></ChakraProvider>} />
          <Route path="/debug-cv-ai" element={<ChakraProvider theme={theme}><Layout><DebugCVAIResponse /></Layout></ChakraProvider>} />
          <Route path="/career-ark-v2" element={<ChakraProvider theme={theme}><Layout><ProtectedRoute><CareerArkV2 /></ProtectedRoute></Layout></ChakraProvider>} />
          <Route path="/search-jobs" element={<ChakraProvider theme={theme}><Layout><SearchJobs /></Layout></ChakraProvider>} />
          <Route path="/colortest" element={<ColorTest />} />
          <Route path="/tailwinduitest" element={<TailwindUiTest />} />
          <Route path="*" element={<ChakraProvider theme={theme}><Layout><NotFound /></Layout></ChakraProvider>} />
        </Routes>
      </Router>
    </NotificationContext.Provider>
  );
}

export default App;
