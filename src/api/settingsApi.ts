import authFetch from './authFetch';

export async function getSettings() {
  const res = await authFetch('/api/user/settings');
  if (!res.ok) throw new Error('Failed to fetch settings');
  return res.json();
}

export async function updateSettings(data: any) {
  const res = await authFetch('/api/user/settings', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update settings');
  return res.json();
} 