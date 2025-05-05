import Profile from './pages/Profile';
import Settings from './pages/Settings';
import ApplicationHistory from './pages/ApplicationHistory';
import JobManagement from './pages/JobManagement';
import HelpFAQ from './pages/HelpFAQ';
import Feedback from './pages/Feedback';
import Legal from './pages/Legal';
import Error404 from './pages/Error404';

import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import CVsAndCoverLetters from './pages/CVsAndCoverLetters';
import CareerArk from './pages/CareerArk';
import Pricing from './pages/Pricing';
import Account from './pages/Account';
import Applications from './pages/Applications';
import SubscriptionSuccess from './pages/SubscriptionSuccess';
import SubscriptionCancel from './pages/SubscriptionCancel';
import TestAppJourneys from './pages/TestAppJourneys';
import DownloadApplication from './pages/DownloadApplication';
import Dashboard from './pages/Dashboard';

const App = () => {
  return (
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
      <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      <Route path="/application-history" element={<ProtectedRoute><ApplicationHistory /></ProtectedRoute>} />
      <Route path="/job-management" element={<ProtectedRoute><JobManagement /></ProtectedRoute>} />
      <Route path="/help" element={<HelpFAQ />} />
      <Route path="/feedback" element={<Feedback />} />
      <Route path="/legal" element={<Legal />} />
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default App; 