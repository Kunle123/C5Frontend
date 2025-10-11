import { StartSessionRequest, StartSessionResponse, EndSessionRequest, EndSessionResponse, CVPreviewRequest, CVPreviewResponse, CVGenerateRequest, CVGenerateResponse, CVUpdateRequest, CVUpdateResponse, APIError } from './cvWorkflowTypes';

const BASE_URL = 'https://api-gw-production.up.railway.app';

async function handleApiResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let error: APIError;
    try {
      error = await res.json();
    } catch {
      throw new Error('Unknown error');
    }
    throw error;
  }
  return res.json();
}

export async function startSession(request: StartSessionRequest): Promise<StartSessionResponse> {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${BASE_URL}/api/v1/cv/session/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleApiResponse<StartSessionResponse>(res);
}

export async function endSession(request: EndSessionRequest): Promise<EndSessionResponse> {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${BASE_URL}/api/v1/cv/session/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleApiResponse<EndSessionResponse>(res);
}

export async function getPreview(request: CVPreviewRequest): Promise<CVPreviewResponse> {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${BASE_URL}/api/v1/cv/preview`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleApiResponse<CVPreviewResponse>(res);
}

export async function generateCV(request: CVGenerateRequest): Promise<CVGenerateResponse> {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${BASE_URL}/api/v1/cv/generate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleApiResponse<CVGenerateResponse>(res);
}

export async function updateCV(request: CVUpdateRequest): Promise<CVUpdateResponse> {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${BASE_URL}/api/v1/cv/update`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(request),
  });
  return handleApiResponse<CVUpdateResponse>(res);
}


