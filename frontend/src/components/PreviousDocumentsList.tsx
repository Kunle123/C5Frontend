import React, { useEffect, useState } from "react";

interface CV {
  cv_id?: string;
  id?: string;
  filename: string;
  created_at?: string;
  createdAt?: string;
}

interface CoverLetter {
  cover_letter_id: string;
  filename: string;
  created_at?: string;
}

interface PreviousDocumentsListProps {
  token: string;
}

function downloadBase64Docx(endpoint: string, token: string) {
  return fetch(endpoint, {
    headers: { Authorization: `Bearer ${token}` },
  })
    .then(res => {
      if (!res.ok) throw new Error("Failed to fetch document");
      return res.json();
    })
    .then(data => {
      if (!data.filedata) throw new Error("No filedata in response");
      const byteCharacters = atob(data.filedata);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = data.filename || "document.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    });
}

const PreviousDocumentsList: React.FC<PreviousDocumentsListProps> = ({ token }) => {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [coverLetterError, setCoverLetterError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setCoverLetterError(null);
    // Try /cvs for listing CVs, fallback to /api/cv if needed
    fetch("/cvs", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch CVs"))
      .then(cvsData => setCvs(cvsData))
      .catch(() => {
        // fallback to /api/cv
        fetch("/api/cv", { headers: { Authorization: `Bearer ${token}` } })
          .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch CVs"))
          .then(cvsData => setCvs(cvsData))
          .catch(() => setError("Failed to fetch CVs"));
      });
    // Try to fetch cover letters, but handle if endpoint is missing
    fetch("/api/cover-letter", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (!res.ok) throw new Error("Failed to fetch cover letters");
        return res.json();
      })
      .then(coverLettersData => setCoverLetters(coverLettersData))
      .catch(() => setCoverLetterError("Cover letter download not available."));
    setLoading(false);
  }, [token]);

  const handleDownloadCV = (cv: CV) => {
    const id = cv.cv_id || cv.id;
    if (!id) return alert("No CV ID found");
    downloadBase64Docx(`/api/cv/${id}/download`, token).catch(err => alert(err.message || err));
  };

  const handleDownloadCoverLetter = (cover_letter_id: string) => {
    downloadBase64Docx(`/api/cover-letter/${cover_letter_id}/download`, token).catch(err => alert(err.message || err));
  };

  if (loading) return <div>Loading documents...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div>
      <h3>Previously Generated CVs</h3>
      {cvs.length === 0 ? <p>No CVs found.</p> : (
        <ul>
          {cvs.map(cv => (
            <li key={cv.cv_id || cv.id}>
              {cv.filename} {(cv.created_at || cv.createdAt) && <span>({cv.created_at || cv.createdAt})</span>}
              <button onClick={() => handleDownloadCV(cv)}>Download</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Previously Generated Cover Letters</h3>
      {coverLetterError ? (
        <p style={{ color: 'gray' }}>{coverLetterError}</p>
      ) : coverLetters.length === 0 ? <p>No cover letters found.</p> : (
        <ul>
          {coverLetters.map(cl => (
            <li key={cl.cover_letter_id}>
              {cl.filename} {cl.created_at && <span>({cl.created_at})</span>}
              <button onClick={() => handleDownloadCoverLetter(cl.cover_letter_id)}>Download</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousDocumentsList; 