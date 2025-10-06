// Admin Authentication - Uses existing auth system

export const getAdminToken = () => localStorage.getItem('token'); // Use existing token

export const isAdmin = (): boolean => {
  const token = getAdminToken();
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    // Check if user has admin role or is_admin flag
    return payload.is_admin === true || payload.role === 'admin' || payload.role === 'super_admin';
  } catch {
    return false;
  }
};

export const getAdminUser = () => {
  const token = getAdminToken();
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      role: payload.role || 'admin',
      is_admin: payload.is_admin
    };
  } catch {
    return null;
  }
};

export const isAdminAuthenticated = () => {
  return !!getAdminToken() && isAdmin();
};

