import { useState } from 'react';
import { CVGenerateRequest, CVGenerateResponse, CVObject, CoverLetterObject } from '../types/cvWorkflow';

export function useCVGenerate() {
  const [cv, setCV] = useState<CVObject | null>(null);
  const [coverLetter, setCoverLetter] = useState<CoverLetterObject | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCV = async (sessionId: string, jobDescription: string, token: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/cv/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId, jobDescription } as CVGenerateRequest),
      });
      if (!res.ok) throw new Error('Failed to generate CV');
      const data: CVGenerateResponse = await res.json();
      setCV(data.cv);
      setCoverLetter(data.cover_letter);
      return data;
    } catch (err: any) {
      setError(err.message || 'CV generation failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { cv, coverLetter, generateCV, loading, error };
}
