const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';

// 2. Upload CV
export async function uploadCV(file: File) {
  const token = localStorage.getItem('token') || '';
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/cv`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Upload failed'));
  return res.json();
} 