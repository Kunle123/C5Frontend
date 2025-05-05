import authFetch from './authFetch';

export async function submitFeedback(data: { message: string; type: 'bug' | 'feature' | 'general'; email?: string }) {
  const res = await authFetch('/api/feedback', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to submit feedback');
  return res.json();
} 