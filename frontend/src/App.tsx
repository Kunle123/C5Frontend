import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, Alert, useToast } from '@chakra-ui/react';
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

// Notification context
export const NotificationContext = createContext<{ notify: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void }>({ notify: () => {} });

function App() {
  const [notification, setNotification] = useState<{ msg: string; open: boolean; severity: 'success' | 'info' | 'warning' | 'error' }>({ msg: '', open: false, severity: 'info' });
  const toast = useToast();

  const notify = (msg: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setNotification({ msg, open: true, severity });
    toast({
      title: msg,
      status: severity,
      duration: 4000,
      isClosable: true,
      position: 'top',
    });
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
        <Layout>
          <Box maxW="container.lg" mx="auto">
            <Routes>
              <Route path="/" element={<HighConvertingLanding />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/cvs" element={<ProtectedRoute><CVsAndCoverLetters /></ProtectedRoute>} />
              <Route path="/career-ark" element={<ProtectedRoute><CareerArk /></ProtectedRoute>} />
              <Route path="/career-history" element={<ProtectedRoute><CareerArk /></ProtectedRoute>} />
              <Route path="/career-history/:idx" element={<ProtectedRoute><CareerArk /></ProtectedRoute>} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/account" element={<Account />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/subscription-success" element={<SubscriptionSuccess />} />
              <Route path="/subscription-cancel" element={<SubscriptionCancel />} />
              <Route path="/test" element={<TestAppJourneys />} />
              <Route path="/download-cvs" element={<ProtectedRoute><DownloadCVs /></ProtectedRoute>} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/career-ark-demo" element={<CareerArkDemo />} />
              <Route path="/debug-cv-ai" element={<DebugCVAIResponse />} />
              <Route path="/career-ark-v2" element={<ProtectedRoute><CareerArkV2 /></ProtectedRoute>} />
              <Route path="/search-jobs" element={<SearchJobs />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Box>
        </Layout>
      </Router>
    </NotificationContext.Provider>
  );
}

export default App;
