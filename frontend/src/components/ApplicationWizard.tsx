import React, { useState } from "react";
import { Navigation } from "./Navigation";

const ApplicationWizard = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [extractedKeywords, setExtractedKeywords] = useState<string[]>([]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-16">
        <h1>Apply Flow Debug - Step Navigation & Keywords</h1>
        <div className="mb-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setCurrentStep(1)} className={currentStep === 1 ? "font-bold" : ""}>Step 1</button>
            <button onClick={() => setCurrentStep(2)} className={currentStep === 2 ? "font-bold" : ""}>Step 2</button>
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
                // Simulate keyword extraction (no API)
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
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;