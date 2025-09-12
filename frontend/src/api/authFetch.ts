export async function authFetch(url: string, options: any = {}) {
  const token = localStorage.getItem('token');
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    'Content-Type': 'application/json',
  };
  const res = await fetch(url, { ...options, headers });
  if (res.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_email');
    // Dispatch a custom event for session expiry notification
    window.dispatchEvent(new CustomEvent('session-expired'));
    window.location.href = '/'; // Redirect to home page
    return;
  }
  return res;
} 