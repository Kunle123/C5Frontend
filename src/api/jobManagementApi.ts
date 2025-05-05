import authFetch from './authFetch';

export async function listJobs() {
  const res = await authFetch('/api/jobs');
  if (!res.ok) throw new Error('Failed to fetch jobs');
  return res.json();
}

export async function createJob(data: { title: string; company: string; description: string }) {
  const res = await authFetch('/api/jobs', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create job');
  return res.json();
}

export async function updateJob(id: string, data: { title: string; company: string; description: string; status: string }) {
  const res = await authFetch(`/api/jobs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to update job');
  return res.json();
}

export async function deleteJob(id: string) {
  const res = await authFetch(`/api/jobs/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete job');
  return res.json();
} 