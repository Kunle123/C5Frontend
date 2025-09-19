import React, { useState } from "react";
import { Navigation } from "./Navigation";

// Utility to render the structured CV as JSX
function renderStructuredCV(cvData: any) {
  if (!cvData || typeof cvData !== 'object') return <div>No CV data available.</div>;
  return (
    <div className="space-y-4">
      {cvData.name && <h2 className="text-2xl font-bold">{cvData.name}</h2>}
      {cvData.contact_info && Array.isArray(cvData.contact_info) && (
        <div className="text-sm text-muted-foreground">{cvData.contact_info.filter(Boolean).join(' | ')}</div>
      )}
      {cvData.summary && cvData.summary.content && <p className="mt-2 text-base">{cvData.summary.content}</p>}

      {/* Achievements */}
      {Array.isArray(cvData.relevant_achievements) && cvData.relevant_achievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Relevant Achievements</h3>
          <ul className="list-disc list-inside ml-4">
            {cvData.relevant_achievements.map((a: any, idx: number) => (
              <li key={idx}>{a.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Experience */}
      {Array.isArray(cvData.experience) && cvData.experience.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Professional Experience</h3>
          <ul className="space-y-2">
            {cvData.experience.map((exp: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{exp.job_title}{exp.company_name ? `, ${exp.company_name}` : ''}{exp.dates ? `, ${exp.dates}` : ''}</div>
                {Array.isArray(exp.responsibilities) && exp.responsibilities.length > 0 && (
                  <ul className="list-disc list-inside ml-4">
                    {exp.responsibilities.map((resp: any, i: number) => (
                      <li key={i}>{resp.content}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Education */}
      {Array.isArray(cvData.education) && cvData.education.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Education</h3>
          <ul className="space-y-2">
            {cvData.education.map((edu: any, idx: number) => (
              <li key={idx}>
                <div className="font-medium">{edu.degree || edu.content}{edu.institution ? `, ${edu.institution}` : ''}{edu.year ? `, ${edu.year}` : ''}</div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Certifications */}
      {Array.isArray(cvData.certifications) && cvData.certifications.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Certifications</h3>
          <ul className="list-disc list-inside ml-4">
            {cvData.certifications.map((cert: any, idx: number) => (
              <li key={idx}>{cert.content}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Core Competencies */}
      {Array.isArray(cvData.core_competencies) && cvData.core_competencies.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mt-4 mb-2">Core Competencies</h3>
          <div className="flex flex-wrap gap-2">
            {cvData.core_competencies.map((comp: any, idx: number) => (
              <span key={idx} className="bg-muted px-2 py-1 rounded text-xs">{comp.content}</span>
            ))}
          </div>
        </div>
      )}

      {/* Cover Letter */}
      {cvData.cover_letter && cvData.cover_letter.content && <div className="mt-4"><h3 className="text-lg font-semibold mb-2">Cover Letter</h3><p>{cvData.cover_letter.content}</p></div>}
    </div>
  );
}

const ApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [structuredCV, setStructuredCV] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simulate keyword extraction for now
  const handleNextKeywords = () => {
    setExtractedKeywords(jobDescription ? ["example", "keywords"] : []);
    setCurrentStep(2);
  };

  // Real API call for CV generation
  const handleGenerateCV = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      // Replace with your real API endpoint and payload as needed
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Not authenticated");
      const res = await fetch("https://api-gw-production.up.railway.app/api/career-ark/generate-assistant", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          action: "generate_cv",
          job_description: jobDescription,
          // Add other required fields here
        }),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to generate CV");
      const data = await res.json();
      // Defensive normalization for relevant_achievements
      const normalizedData = {
        ...data,
        relevant_achievements: Array.isArray(data.relevant_achievements) ? data.relevant_achievements : [],
      };
      setStructuredCV(normalizedData);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || "CV generation failed");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-16">
        <h1>Apply Flow Debug - Step Navigation, Keywords, Preview</h1>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentStep(1)} className={currentStep === 1 ? "font-bold" : ""}>Step 1</button>
            <button onClick={() => setCurrentStep(2)} className={currentStep === 2 ? "font-bold" : ""}>Step 2</button>
            <button onClick={() => setCurrentStep(3)} className={currentStep === 3 ? "font-bold" : ""}>Step 3</button>
          </div>
        </div>
        {error && <div className="mb-4 text-red-600">Error: {error}</div>}
        {currentStep === 1 && (
          <div>
            <h2>Step 1: Paste Job Description</h2>
            <textarea
              value={jobDescription}
              onChange={e => setJobDescription(e.target.value)}
              placeholder="Paste the job description here..."
              className="w-full min-h-[120px] border rounded p-2"
            />
            <button
              onClick={handleNextKeywords}
              disabled={!jobDescription.trim()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              Next: Review Keywords
            </button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2>Step 2: Keyword Review (Simulated)</h2>
            <p>Extracted Keywords:</p>
            <ul>
              {extractedKeywords.map((kw, idx) => (
                <li key={idx}>{kw}</li>
              ))}
            </ul>
            <button
              onClick={() => setCurrentStep(1)}
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Back
            </button>
            <button
              onClick={handleGenerateCV}
              className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded"
              disabled={isGenerating}
            >
              {isGenerating ? "Generating..." : "Next: Preview"}
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2>Step 3: Preview</h2>
            {/* Defensive check for structuredCV */}
            {structuredCV ? renderStructuredCV(structuredCV) : <div>No CV data available.</div>}
            <button
              onClick={() => setCurrentStep(2)}
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;