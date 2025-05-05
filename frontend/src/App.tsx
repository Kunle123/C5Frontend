import React, { useState, createContext, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CssBaseline, Container, Snackbar, Alert } from '@mui/material';
import Layout from './components/Layout';
import Landing from './pages/Landing';
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
import DownloadApplication from './pages/DownloadApplication';
import { ThemeProvider } from '@mui/material/styles';
import theme from './theme';

// Notification context
export const NotificationContext = createContext<{ notify: (msg: string, severity?: 'success' | 'info' | 'warning' | 'error') => void }>({ notify: () => {} });

function App() {
  const [notification, setNotification] = useState<{ msg: string; open: boolean; severity: 'success' | 'info' | 'warning' | 'error' }>({ msg: '', open: false, severity: 'info' });

  const notify = (msg: string, severity: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setNotification({ msg, open: true, severity });
  };

  const handleClose = () => setNotification(n => ({ ...n, open: false }));

  useEffect(() => {
    const handler = () => notify('Session expired. Please log in again.', 'error');
    window.addEventListener('session-expired', handler);
    return () => window.removeEventListener('session-expired', handler);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationContext.Provider value={{ notify }}>
        <Router>
          <Layout>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/cvs" element={<ProtectedRoute><CVsAndCoverLetters /></ProtectedRoute>} />
                <Route path="/career-ark" element={<ProtectedRoute><CareerArk /></ProtectedRoute>} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/account" element={<Account />} />
                <Route path="/applications" element={<Applications />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                <Route path="/subscription-cancel" element={<SubscriptionCancel />} />
                <Route path="/test" element={<TestAppJourneys />} />
                <Route path="/download" element={<ProtectedRoute><DownloadApplication /></ProtectedRoute>} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Container>
          </Layout>
          <Snackbar open={notification.open} autoHideDuration={4000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
            <Alert onClose={handleClose} severity={notification.severity} sx={{ width: '100%' }}>
              {notification.msg}
            </Alert>
          </Snackbar>
        </Router>
      </NotificationContext.Provider>
    </ThemeProvider>
  );
}

export default App;
