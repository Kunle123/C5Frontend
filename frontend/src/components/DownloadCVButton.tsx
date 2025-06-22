import React, { useCallback } from "react";

// Custom hook for downloading base64-encoded DOCX
function useDownloadBase64Docx() {
  return useCallback(
    async ({ endpoint, payload, token }: { endpoint: string; payload: any; token?: string }) => {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to fetch the DOCX file");

      const data = await res.json();
      if (!data.filedata) throw new Error("No filedata in response");

      // Decode base64 to binary
      const byteCharacters = atob(data.filedata);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);

      // Create Blob and trigger download
      const blob = new Blob([byteArray], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = data.filename || "cv.docx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(link.href);
    },
    []
  );
}

// DownloadCVButton component
const DownloadCVButton: React.FC = () => {
  const downloadDocx = useDownloadBase64Docx();

  const handleDownload = async () => {
    try {
      await downloadDocx({
        endpoint: "https://api-gw-production.up.railway.app/api/cv", // Update as needed
        payload: {
          // Add your payload here, e.g. CV options
          name: "My Optimized CV",
          description: "CV for Project Manager role",
          is_default: true,
          template_id: "default",
          num_pages: 2,
          include_keywords: true,
          include_relevant_experience: true,
        },
        token: "YOUR_AUTH_TOKEN", // Replace with actual token logic
      });
    } catch (err) {
      alert((err as Error).message);
    }
  };

  return <button onClick={handleDownload}>Download CV</button>;
};

export default DownloadCVButton; 