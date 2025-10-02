import { useState } from 'react';
import { CVUpdateRequest, CVUpdateResponse, CVObject } from '../types/cvWorkflow';

export function useCVUpdate() {
  const [updatedCV, setUpdatedCV] = useState<CVObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCV = async (
    sessionId: string,
    currentCV: CVObject,
    updateRequest: string,
    jobDescription: string,
    token: string
  ) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api-gw-production.up.railway.app/api/v1/cv/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, currentCV, updateRequest, jobDescription } as CVUpdateRequest),
      });
      if (!res.ok) throw new Error('Failed to update CV');
      const data: CVUpdateResponse = await res.json();
      setUpdatedCV(data);
      return data;
    } catch (err: any) {
      setError(err.message || 'CV update failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { updatedCV, updateCV, loading, error };
}
