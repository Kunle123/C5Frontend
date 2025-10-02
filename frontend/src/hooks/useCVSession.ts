import { useState } from 'react';
import { StartSessionRequest, StartSessionResponse } from '../types/cvWorkflow';

export function useCVSession() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startSession = async (user_id: string, token: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('https://api-gw-production.up.railway.app/api/v1/cv/session/start', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id } as StartSessionRequest),
      });
      if (!res.ok) throw new Error('Failed to start session');
      const data: StartSessionResponse = await res.json();
      setSessionId(data.session_id);
      return data.session_id;
    } catch (err: any) {
      setError(err.message || 'Session start failed');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const endSession = async (token: string) => {
    if (!sessionId) return;
    setLoading(true);
    setError(null);
    try {
      await fetch('https://api-gw-production.up.railway.app/api/v1/cv/session/end', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ session_id: sessionId }),
      });
      setSessionId(null);
    } catch (err: any) {
      setError(err.message || 'Session end failed');
    } finally {
      setLoading(false);
    }
  };

  return { sessionId, startSession, endSession, loading, error };
}
