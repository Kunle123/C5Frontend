import { useState } from 'react';
import { CVPreviewRequest, CVPreviewResponse } from '../types/cvWorkflow';

export function useCVPreview() {
  const [preview, setPreview] = useState<CVPreviewResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getPreview = async (sessionId: string, jobDescription: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/cv/preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, jobDescription } as CVPreviewRequest),
      });
      if (!res.ok) throw new Error('Failed to get preview');
      const data: CVPreviewResponse = await res.json();
      setPreview(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'Preview failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { preview, getPreview, loading, error };
}
