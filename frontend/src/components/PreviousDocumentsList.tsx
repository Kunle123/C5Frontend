import React, { useEffect, useState } from "react";

interface CV {
  cv_id: string;
  filename: string;
  created_at?: string;
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

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all([
      fetch("/api/cv", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch CVs")),
      fetch("/api/cover-letter", { headers: { Authorization: `Bearer ${token}` } })
        .then(res => res.ok ? res.json() : Promise.reject("Failed to fetch cover letters")),
    ])
      .then(([cvsData, coverLettersData]) => {
        setCvs(cvsData);
        setCoverLetters(coverLettersData);
        setLoading(false);
      })
      .catch(err => {
        setError(typeof err === "string" ? err : "Failed to fetch documents");
        setLoading(false);
      });
  }, [token]);

  const handleDownloadCV = (cv_id: string) => {
    downloadBase64Docx(`/api/cv/${cv_id}/download`, token).catch(err => alert(err.message || err));
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
            <li key={cv.cv_id}>
              {cv.filename} {cv.created_at && <span>({cv.created_at})</span>}
              <button onClick={() => handleDownloadCV(cv.cv_id)}>Download</button>
            </li>
          ))}
        </ul>
      )}
      <h3>Previously Generated Cover Letters</h3>
      {coverLetters.length === 0 ? <p>No cover letters found.</p> : (
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