import authFetch from './authFetch';

export async function getProfile() {
  const res = await authFetch('/api/user/profile');
  if (!res.ok) throw new Error('Failed to fetch profile');
  return res.json();
}

export async function updateProfile(data: { name: string; email: string }) {
  const res = await authFetch('/api/user/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update profile');
  return res.json();
}

export async function changePassword(data: { currentPassword: string; newPassword: string }) {
  const res = await authFetch('/api/user/password', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to change password');
  return res.json();
} 