{allSections && Array.isArray(allSections.work_experience) && allSections.work_experience.length > 0 ? (
  sortByEndDateDesc(allSections.work_experience).map((item, idx) => (
    // ... existing code ...
  ))
) : (
  <Text color="gray.400">No work experience yet. You can add entries here.</Text>
)}

<Accordion allowMultiple>
  {/* Skills Section */}
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" textAlign="left">Skills</Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
      {/* Add Skill Form and Skills List code here (existing code) */}
      {/* ...existing Skills section code... */}
    </AccordionPanel>
  </AccordionItem>
  {/* Projects Section */}
  <AccordionItem>
    <AccordionButton>
      <Box flex="1" textAlign="left">Projects</Box>
      <AccordionIcon />
    </AccordionButton>
    <AccordionPanel pb={4}>
      {/* Add Project Form and Projects List code here (existing code) */}
      {/* ...existing Projects section code... */}
    </AccordionPanel>
  </AccordionItem>
  {/* Add other AccordionItems here (Certifications, etc.) as needed */}
</Accordion>

const API_GATEWAY_BASE = 'https://api-gw-production.up.railway.app';

const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  setUploading(true);
  setUploadError('');
  setTaskId(null);
  setStatus('');
  setSummary(null);
  setUploadProgress(10);
  try {
    const token = localStorage.getItem('token') || '';
    const formData = new FormData();
    formData.append('file', file);
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${API_GATEWAY_BASE}/api/career-ark/cv`, true);
    xhr.setRequestHeader('Authorization', `Bearer ${token}`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 60));
      }
    };
    xhr.onreadystatechange = async () => {
      if (xhr.readyState === 4) {
        if (xhr.status >= 200 && xhr.status < 300) {
          setUploadProgress(70);
          const data = JSON.parse(xhr.responseText);
          setTaskId(data.taskId);
          setStatus('pending');
          setPolling(true);
          // Poll for extraction completion
          let pollCount = 0;
          const poll = async () => {
            try {
              const statusData = await getCVStatus(data.taskId);
              setStatus(statusData.status);
              if (statusData.status === 'completed') {
                setUploadProgress(100);
                setPolling(false);
                setSummary(statusData.extractedDataSummary || null);
                // Refresh Ark data, bypassing cache
                const arcRes = await fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me/all_sections`, {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    'Cache-Control': 'no-cache',
                  },
                });
                if (arcRes.ok) {
                  const arcData = await arcRes.json();
                  setAllSections(arcData);
                }
                toast({ status: 'success', title: 'CV imported and Ark updated!' });
              } else if (statusData.status === 'failed') {
                setPolling(false);
                setUploadError('CV extraction failed.');
              } else if (pollCount < 30) {
                setTimeout(poll, 2000);
                pollCount++;
                setUploadProgress(70 + Math.min(30, pollCount));
              } else {
                setPolling(false);
                setUploadError('CV extraction timed out.');
              }
            } catch {
              setPolling(false);
              setUploadError('Failed to check CV extraction status.');
            } finally {
              setUploading(false);
            }
          };
          poll();
        } else {
          setUploadError('Upload failed');
          setUploading(false);
        }
      }
    };
    xhr.send(formData);
  } catch (err: any) {
    setUploadError(err?.error || err?.message || 'Upload failed');
    setUploading(false);
  }
};

// In useEffect for initial profile and all_sections fetch, add 'Cache-Control: no-cache' to both fetches
useEffect(() => {
  setLoading(true);
  const token = (typeof window !== 'undefined' ? localStorage.getItem('token') : '') || '';
  if (!token) {
    setError('Not authenticated');
    setLoading(false);
    return;
  }
  // Fetch the user's profile using the correct endpoint, always bypassing cache
  fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/me`, {
    headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
  })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch profile');
      return res.json();
    })
    .then(profile => {
      setUser(profile); // Store the profile object
      setProfileId(profile.id);
      // Now fetch all sections using the profileId, always bypassing cache
      return fetch(`${API_GATEWAY_BASE}/api/career-ark/profiles/${profile.id}/all_sections`, {
        headers: { Authorization: `Bearer ${token}`, 'Cache-Control': 'no-cache' },
      });
    })
    .then(res => {
      if (!res.ok) throw new Error('Failed to fetch sections');
      return res.json();
    })
    .then(data => {
      setAllSections(data);
      setError('');
    })
    .catch(() => setError('Failed to load data'))
    .finally(() => setLoading(false));
}, []); 