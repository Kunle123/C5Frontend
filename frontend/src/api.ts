import { jwtDecode } from 'jwt-decode';
import { authFetch } from './api/authFetch';
import { analyzeCV as aiAnalyzeCV } from './api/aiApi';

const API_BASE = 'https://api-gw-production.up.railway.app/api/auth';

export async function register({ name, email, password }: { name?: string; email: string; password: string }) {
  const res = await authFetch(`${API_BASE}/register`, {
    method: 'POST',
    body: JSON.stringify({ name, email, password }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function login({ email, password }: { email: string; password: string }) {
  const res = await authFetch(`${API_BASE}/login`, {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await authFetch('https://api-gw-production.up.railway.app/users/me');
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function logout(token: string) {
  const res = await authFetch(`${API_BASE}/logout`, {
    method: 'POST',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function forgotPassword(email: string) {
  const res = await authFetch(`${API_BASE}/forgot-password`, {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function resetPassword(token: string, password: string) {
  const res = await authFetch(`${API_BASE}/reset-password`, {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export function getSocialAuthUrl(provider: 'google' | 'facebook' | 'linkedin') {
  return `${API_BASE}/${provider}`;
}

// CV Service API
const CV_API_BASE = 'https://api-gw-production.up.railway.app/cvs';

export async function listCVs(token: string) {
  const res = await authFetch(CV_API_BASE);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function uploadCV(file: File, token: string) {
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(CV_API_BASE, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}` }, // keep for multipart
    body: formData,
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getCV(cvId: string, token: string) {
  const res = await authFetch(`${CV_API_BASE}/${cvId}`);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function updateCV(cvId: string, data: any, token: string) {
  const res = await authFetch(`${CV_API_BASE}/${cvId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deleteCV(cvId: string, token: string) {
  const res = await authFetch(`${CV_API_BASE}/${cvId}`, {
    method: 'DELETE',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export { aiAnalyzeCV as analyzeCV };

export async function downloadCV(cvId: string, token: string) {
  const res = await authFetch(`${CV_API_BASE}/${cvId}/download`);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  // For now, returns JSON; in future, may return blob (PDF/DOCX)
  return res.json();
}

// User Service
export async function getUser(token: string) {
  const res = await authFetch('/api/users/me');
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

// Subscription Service
export async function getSubscription(userId: string, token: string) {
  const res = await authFetch(`/api/subscriptions/user/${userId}`);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function cancelSubscription(subscriptionId: string, token: string) {
  const res = await authFetch(`/api/subscriptions/cancel/${subscriptionId}`, {
    method: 'POST',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

// Payments Service
export async function getPaymentMethods(userId: string, token: string) {
  const res = await authFetch(`/api/payments/methods/${userId}`);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function getPaymentHistory(userId: string, token: string) {
  const res = await authFetch(`/api/payments/history/${userId}`);
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function addPaymentMethod(token: string) {
  const res = await authFetch('/api/payments/methods/add', {
    method: 'POST',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function deletePaymentMethod(paymentMethodId: string, token: string) {
  const res = await authFetch(`/api/payments/methods/${paymentMethodId}`, {
    method: 'DELETE',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function setDefaultPaymentMethod(paymentMethodId: string, token: string) {
  const res = await authFetch(`/api/payments/methods/${paymentMethodId}/default`, {
    method: 'POST',
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export function getUserIdFromToken(token: string): string | null {
  try {
    const payload: any = jwtDecode(token);
    return payload.id || payload.user_id || null;
  } catch {
    return null;
  }
}

// Cover Letters Service API
const COVER_LETTERS_API_BASE = 'https://api-gw-production.up.railway.app/cover-letters';

// Mega CV Service API
const MEGA_CV_API_BASE = 'https://api-gw-production.up.railway.app/mega-cv';

// Applications Service API
const APPLICATIONS_API_BASE = 'https://api-gw-production.up.railway.app/applications';

export async function listPreviousCVs(token: string) {
  const res = await fetch('https://api-gw-production.up.railway.app/mega-cv/previous-cvs', {
    headers: { 'Authorization': `Bearer ${token}` },
  });
  if (!res.ok) throw await res.json();
  return res.json();
} 