const API_BASE = 'https://api-gw-production.up.railway.app/api/arc';
export const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';

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
export async function generateApplicationMaterials(jobAdvert: string, arcData: any) {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ jobAdvert, arcData }),
  });
  if (!res.ok) throw await res.json().catch(() => new Error('Failed to generate application materials'));
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

// Update Work Experience
export async function updateWorkExperience(id: string, data: any) {
  const res = await fetch(`${API_BASE}/work_experience/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
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

// Update Education
export async function updateEducation(id: string, data: any) {
  const res = await fetch(`${API_BASE}/education/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
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

// Update Training
export async function updateTraining(id: string, data: any) {
  const res = await fetch(`${API_BASE}/training/${id}`, {
    method: 'PATCH',
    headers: {
      ...getAuthHeaders(),
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