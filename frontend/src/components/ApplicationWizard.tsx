import React, { useState } from "react";
import { Navigation } from "./Navigation";

// Utility to render the structured CV as JSX (already defined above)
// function renderStructuredCV(cvData: any) { ... }

const mockStructuredCV = {
  name: "Jane Doe",
  contact_info: ["jane@example.com", "555-1234"],
  summary: { content: "Experienced professional.", priority: 1 },
  relevant_achievements: [{ content: "Achievement 1", priority: 1 }],
  experience: [
    {
      job_title: "Developer",
      company_name: "Tech Co",
      dates: "2020-2022",
      responsibilities: [{ content: "Built things", priority: 1 }],
    },
  ],
  core_competencies: [{ content: "React", priority: 1 }],
  education: [{ content: "BSc Computer Science", priority: 1 }],
  certifications: [{ content: "Certified Dev", priority: 1 }],
  cover_letter: { content: "Dear Sir/Madam...", priority: 1 },
};

const ApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);
  const [structuredCV] = useState<any>(mockStructuredCV); // Hardcoded for now

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
              onClick={() => {
                setExtractedKeywords(jobDescription ? ["example", "keywords"] : []);
                setCurrentStep(2);
              }}
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
              onClick={() => setCurrentStep(3)}
              className="mt-4 ml-2 px-4 py-2 bg-green-600 text-white rounded"
            >
              Next: Preview
            </button>
          </div>
        )}
        {currentStep === 3 && (
          <div>
            <h2>Step 3: Preview (Mock Data)</h2>
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