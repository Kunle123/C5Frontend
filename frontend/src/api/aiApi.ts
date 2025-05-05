import { authFetch } from './authFetch';

const AI_API_BASE = import.meta.env.VITE_AI_API_BASE || 'https://api-gw-production.up.railway.app/api/ai';
const ARC_API_BASE = import.meta.env.VITE_ARC_API_BASE || 'https://api-gw-production.up.railway.app/api/arc';

export async function optimizeCV({ cv_id, targets }: { cv_id: string, targets: any[] }) {
  const res = await authFetch(`${AI_API_BASE}/optimize-cv`, {
    method: 'POST',
    body: JSON.stringify({ cv_id, targets }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function generateCoverLetter({ cv_id, job_description, user_comments, tone, company_name, recipient_name, position_title }: {
  cv_id: string,
  job_description: string,
  user_comments?: string,
  tone?: string,
  company_name?: string,
  recipient_name?: string,
  position_title?: string,
}) {
  const res = await authFetch(`${AI_API_BASE}/generate-cover-letter`, {
    method: 'POST',
    body: JSON.stringify({ cv_id, job_description, user_comments, tone, company_name, recipient_name, position_title }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function extractKeywords(jobDescription: string, token?: string) {
  if (!token) throw new Error('Authentication token is required for keyword extraction');
  const res = await fetch(`${ARC_API_BASE}/ai/keywords`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ jobDescription }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to fetch keywords'));
  return res.json();
}

export async function analyzeCV({ cv_id, sections }: { cv_id: string, sections?: string[] }) {
  const res = await authFetch(`${AI_API_BASE}/analyze`, {
    method: 'POST',
    body: JSON.stringify({ cv_id, sections }),
  });
  if (!res) throw new Error('Unauthorized or network error');
  if (!res.ok) throw await res.json();
  return res.json();
} 