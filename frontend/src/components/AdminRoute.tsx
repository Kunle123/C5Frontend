import { Navigate } from 'react-router-dom';
import { isAdminAuthenticated } from '../services/adminAuth';

export const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAdminAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

