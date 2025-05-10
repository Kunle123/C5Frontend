import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  iat: number;
  id: string;
  email: string;
}

export const checkTokenExpiration = () => {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Date.now() / 1000; // Convert to seconds

    if (decoded.exp < currentTime) {
      // Token has expired
      localStorage.removeItem('token');
      window.dispatchEvent(new CustomEvent('session-expired'));
      window.location.href = '/login';
    }
  } catch (error) {
    // If token is invalid, clear it and redirect to login
    localStorage.removeItem('token');
    window.dispatchEvent(new CustomEvent('session-expired'));
    window.location.href = '/login';
  }
}; 