import authFetch from './authFetch';

export async function listApplications() {
  const res = await authFetch('/api/applications/history');
  if (!res.ok) throw new Error('Failed to fetch application history');
  return res.json();
}

export async function getApplication(id: string) {
  const res = await authFetch(`/api/applications/${id}`);
  if (!res.ok) throw new Error('Failed to fetch application details');
  return res.json();
} 