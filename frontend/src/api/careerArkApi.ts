const API_BASE = 'https://api-gw-production.up.railway.app/api/arc';
export const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';
const API_CAREER_ARK = 'https://api-gw-production.up.railway.app/api/career-ark';

function getAuthHeaders() {
  return {
    Authorization: `Bearer ${localStorage.getItem('token') || ''}`,
  };
}

// 1. Health Check
export async function healthCheck() {
  const res = await fetch(`${API_BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

// 2. Upload CV
export async function uploadCV(file: File) {
  const token = localStorage.getItem('token') || '';
  const formData = new FormData();
  formData.append('file', file);
  const res = await fetch('/api/career-ark/cv', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Upload failed'));
  return res.json();
}

// 3. Poll CV Processing Status
export async function getCVStatus(taskId: string) {
  const res = await fetch(`${API_BASE}/cv/status/${taskId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Status check failed'));
  return res.json();
}

// 4. Get Arc Data
export async function getArcData() {
  const token = localStorage.getItem('token') || '';
  // Fetch the user's profile
  const profileRes = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!profileRes.ok) throw new Error('Failed to fetch profile');
  const profile = await profileRes.json();
  // Fetch all sections using the profileId
  const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profile.id}/all_sections`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch Ark data');
  return res.json();
}

// 5. Update Arc Data
// export async function updateArcData(data: any) {
//   const res = await fetch(`${API_BASE}/data`, {
//     method: 'PUT',
//     headers: {
//       ...getAuthHeaders(),
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(data),
//   });
//   if (!res.ok) throw await res.json().catch(() => new Error('Failed to update Arc data'));
//   return res.json();
// }

// 6. Generate Application Materials
export async function generateApplicationMaterials(profile: any, job_description: string, keywords?: string[]) {
  const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/generate-assistant`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'generate_cv',
      profile,
      job_description,
      ...(keywords ? { keywords } : {})
    }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to generate application materials'));
  return res.json();
}

export async function updateCV(profile: any, job_description: string, existing_cv: string, additional_keypoints?: string[]) {
  const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/generate-assistant`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action: 'update_cv',
      profile,
      job_description,
      existing_cv,
      ...(additional_keypoints ? { additional_keypoints } : {})
    }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to update CV'));
  return res.json();
}

// 7. Delete a CV Task
export async function deleteCVTask(taskId: string) {
  const res = await fetch(`${API_BASE}/cv/${taskId}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete CV task'));
  return res.json();
}

// 8. (Optional) List All CV Tasks
export async function listCVTasks() {
  const res = await fetch(`${API_BASE}/cv/tasks`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to list CV tasks'));
  return res.json();
}

// 9. (Optional) Download Processed CV
export async function downloadProcessedCV(taskId: string) {
  const res = await fetch(`${API_BASE}/cv/download/${taskId}`, {
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw new Error('Failed to download processed CV');
  return res.blob();
}

// Add Work Experience
export async function addWorkExperience(data: any) {
  const res = await fetch(`${API_BASE}/work_experience`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to add work experience'));
  return res.json();
}

// Update Work Experience (Career Ark)
export async function updateWorkExperience(id: string, data: any) {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API_CAREER_ARK}/work_experience/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to update work experience'));
  return res.json();
}

// Work Experience
export async function deleteWorkExperience(id: string) {
  const res = await fetch(`${API_BASE}/work_experience/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete work experience'));
  return res.json();
}

// Add Education
export async function addEducation(data: any) {
  const res = await fetch(`${API_BASE}/education`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to add education'));
  return res.json();
}

// Update Education (Career Ark)
export async function updateEducation(id: string, data: any) {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API_CAREER_ARK}/education/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to update education'));
  return res.json();
}

// Education
export async function deleteEducation(id: string) {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete education'));
  return res.json();
}

// Add Training
export async function addTraining(data: any) {
  const res = await fetch(`${API_BASE}/training`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to add training'));
  return res.json();
}

// Update Training (Career Ark)
export async function updateTraining(id: string, data: any) {
  const token = localStorage.getItem('token') || '';
  const res = await fetch(`${API_CAREER_ARK}/training/${id}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to update training'));
  return res.json();
}

// Training
export async function deleteTraining(id: string) {
  const res = await fetch(`${API_BASE}/training/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete training'));
  return res.json();
}

// Skills
export async function deleteSkill(id: string) {
  const res = await fetch(`${API_BASE}/skills/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete skill'));
  return res.json();
}

// Projects
export async function deleteProject(id: string) {
  const res = await fetch(`${API_BASE}/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete project'));
  return res.json();
}

// Certifications
export async function deleteCertification(id: string) {
  const res = await fetch(`${API_BASE}/certifications/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to delete certification'));
  return res.json();
}

// Save generated CV and cover letter as a new application (per new API contract)
export async function saveGeneratedCV({ role_title, job_description, cv_text, cover_letter_text }: {
  role_title: string,
  job_description: string,
  cv_text: string,
  cover_letter_text: string
}) {
  const res = await fetch(`/api/applications`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role_title, job_description, cv_text, cover_letter_text }),
  });
  if (!res.ok) {
    let errorMsg = 'Failed to save application';
    try {
      const error = await res.json();
      errorMsg = error.detail || error.message || errorMsg;
    } catch {}
    throw new Error(errorMsg);
  }
  return res.json();
}

/**
 * Generate CV and Cover Letter with user options (relevant experience, keywords, style, tone, etc.)
 * @param {Object} params
 * @param {string} params.jobAdvert - The job description or advert
 * @param {any} params.arcData - The user's Ark profile data
 * @param {Object} params.options - User-selected options (relevantExperience, keywords, style, tone, etc.)
 * @returns {Promise<{cv: string, cover_letter: string}>}
 */
export async function generateCVWithOptions({ jobAdvert, arcData, options }: {
  jobAdvert: string,
  arcData: any,
  options: {
    relevantExperience?: string[];
    keywords?: string[];
    style?: string;
    tone?: string;
    [key: string]: any;
  }
}) {
  const res = await fetch(`${API_GATEWAY_BASE}/api/career-ark/generate-assistant`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobAdvert, arcData, ...options }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to generate CV with options'));
  return res.json();
}

/**
 * List all user's CVs (metadata only)
 * @returns {Promise<any[]>}
 */
export async function listCVs() {
  const res = await fetch(`/api/cv`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to list CVs'));
  return res.json();
}

/**
 * Download a persisted DOCX CV by ID (returns { filename, filedata, cv_id })
 * @param {string} cv_id
 * @returns {Promise<{filename: string, filedata: string, cv_id: string}>}
 */
export async function downloadCV(cv_id: string) {
  const res = await fetch(`/api/cv/${cv_id}/download`, {
    method: 'GET',
    headers: getAuthHeaders(),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to download CV'));
  return res.json();
}

/**
 * Utility: Download a base64-encoded DOCX file in the browser
 * @param {string} base64 - The base64-encoded file data
 * @param {string} filename - The filename for download
 */
export function downloadBase64Docx(base64: string, filename: string = 'cv.docx') {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
} 