import React, { useState, useEffect, useContext } from 'react';
import { Navigation } from './Navigation';
import { useToast } from '../hooks/use-toast';
import { CreditsContext } from '../context/CreditsContext';

// --- Types ---
interface PriorityContent {
  content: string;
  priority: number;
}
interface ExperienceEntry {
  job_title: string;
  company_name?: string;
  dates?: string;
  responsibilities: PriorityContent[];
}
interface EducationEntry extends PriorityContent {
  degree?: string;
  institution?: string;
  year?: string;
}
interface CVData {
  name: string;
  contact_info: string[];
  summary: PriorityContent;
  relevant_achievements?: PriorityContent[];
  experience: ExperienceEntry[];
  core_competencies?: PriorityContent[];
  education?: EducationEntry[];
  certifications?: PriorityContent[];
  cover_letter: PriorityContent;
  trimming_guide?: { [key: string]: string };
}

// --- Filtering utility ---
function filterByPriority(data: CVData, maxPriority: number): CVData {
  return {
    ...data,
    relevant_achievements: (data.relevant_achievements || []).filter(item => item.priority <= maxPriority),
    experience: (data.experience || []).map(role => ({
      ...role,
      responsibilities: (role.responsibilities || []).filter(item => item.priority <= maxPriority)
    })),
    core_competencies: (data.core_competencies || []).filter(item => item.priority <= maxPriority),
    certifications: (data.certifications || []).filter(item => item.priority <= maxPriority),
    education: (data.education || []).filter(item => item.priority <= maxPriority)
  };
}

// --- Render utility ---
function renderStructuredCV(cvData: any) {
  if (!cvData || typeof cvData !== 'object') return <div>No CV data available.</div>;
  return (
    <div className="space-y-4">
      {cvData.name && <h2 className="text-2xl font-bold">{cvData.name}</h2>}
      {cvData.contact_info && Array.isArray(cvData.contact_info) && (
        <div className="text-sm text-muted-foreground">{cvData.contact_info.filter(Boolean).join(' | ')}</div>
      )}
      {cvData.summary && cvData.summary.content && <p className="mt-2 text-base">{cvData.summary.content}</p>}
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
      {cvData.cover_letter && cvData.cover_letter.content && <div className="mt-4"><h3 className="text-lg font-semibold mb-2">Cover Letter</h3><p>{cvData.cover_letter.content}</p></div>}
    </div>
  );
}

const ApplicationWizard = () => {
  const { toast } = useToast();
  const { refreshCredits } = useContext(CreditsContext);
  const [currentStep, setCurrentStep] = useState(1);
  const [jobDescription, setJobDescription] = useState("");
  const [profile, setProfile] = useState<any>(null);
  const [arcData, setArcData] = useState<any>(null);
  const [extractedKeywords, setExtractedKeywords] = useState<any[]>([]);
  const [matchScore, setMatchScore] = useState<number>(0);
  const [structuredCV, setStructuredCV] = useState<any>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Section toggles and page length
  const [maxPriority, setMaxPriority] = useState(2);
  const [showAchievements, setShowAchievements] = useState(true);
  const [showCompetencies, setShowCompetencies] = useState(true);
  const [showCertifications, setShowCertifications] = useState(true);
  const [showEducation, setShowEducation] = useState(true);

  // Fetch profile and arc data on mount
  useEffect(() => {
    const fetchProfileAndArc = async () => {
      try {
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');
        const profileRes = await fetch('https://api-gw-production.up.railway.app/api/user/profile', {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (!profileRes.ok) throw new Error('Failed to fetch user profile');
        const userProfile = await profileRes.json();
        setProfile(userProfile);
        const arcRes = await fetch(`https://api-gw-production.up.railway.app/api/career-ark/profiles/${userProfile.id}/all_sections`, {
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
        if (!arcRes.ok) throw new Error('Failed to fetch arc data');
        const arc = await arcRes.json();
        setArcData(arc);
      } catch (err: any) {
        setError(err.message || 'Failed to load profile/arc data');
      }
    };
    fetchProfileAndArc();
  }, []);

  // Real keyword extraction
  const handleExtractKeywords = async () => {
    setIsAnalyzing(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      if (!profile || !arcData) throw new Error('Profile or arc data not loaded');
      const payload = {
        action: 'extract_keywords',
        profile: arcData, // or buildPIIFreeProfile(profile, arcData)
        job_description: jobDescription,
      };
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Keyword extraction failed');
      const data = await res.json();
      setExtractedKeywords((data.keywords || []).map((kw: any) => ({ text: kw.keyword, status: kw.status })));
      setMatchScore(data.overall_match_percentage || 0);
      setCurrentStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to extract keywords');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Real CV generation
  const handleGenerateCV = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const payload = {
        action: 'generate_cv',
        profile: arcData, // or buildPIIFreeProfile(profile, arcData)
        job_description: jobDescription,
        numPages: maxPriority,
        includeKeywords: showCompetencies,
        includeRelevantExperience: showAchievements,
      };
      const res = await fetch('https://api-gw-production.up.railway.app/api/career-ark/generate-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      });
      if (!res.ok) throw new Error('Failed to generate CV');
      const data = await res.json();
      console.log('CV generation response:', data); // <-- Debug log
      const normalizedData = {
        ...data,
        relevant_achievements: Array.isArray(data.relevant_achievements) ? data.relevant_achievements : [],
      };
      setStructuredCV(normalizedData);
      setCurrentStep(3);
    } catch (err: any) {
      setError(err.message || 'CV generation failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // Download/save/credit deduction
  const handleSaveAndDownload = async () => {
    setIsGenerating(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      // 1. Generate DOCX blob
      const docxRes = await fetch('https://api-gw-production.up.railway.app/api/cv/generate-docx', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(structuredCV),
        credentials: 'include',
      });
      if (!docxRes.ok) throw new Error('Failed to generate DOCX');
      const docxBlob = await docxRes.blob();
      // 2. Download file
      const url = window.URL.createObjectURL(docxBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'CV.docx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      // 3. Deduct a credit
      await fetch('https://api-gw-production.up.railway.app/api/user/credits/use', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}`,'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'generate_cv' }),
        credentials: 'include',
      });
      await refreshCredits();
      toast({ title: 'Documents Generated & Saved', description: 'Your CV and cover letter have been generated and saved!' });
    } catch (err: any) {
      setError(err.message || 'Document save failed');
    } finally {
      setIsGenerating(false);
    }
  };

  // --- UI ---
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl pt-16">
        <h1>Apply Flow</h1>
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
              onClick={handleExtractKeywords}
              disabled={!jobDescription.trim() || isAnalyzing}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
              {isAnalyzing ? 'Analyzing...' : 'Next: Review Keywords'}
            </button>
          </div>
        )}
        {currentStep === 2 && (
          <div>
            <h2>Step 2: Keyword Review</h2>
            <p>Match Score: {matchScore}%</p>
            <ul>
              {extractedKeywords.map((kw, idx) => (
                <li key={idx}>{kw.text} ({kw.status})</li>
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
            {/* Section toggles and page length controls */}
            <div className="mb-4 flex gap-4 items-center">
              <span>Page Length:</span>
              {[2, 3, 4].map(n => (
                <label key={n} className="flex items-center gap-1">
                  <input type="radio" checked={maxPriority === n} onChange={() => setMaxPriority(n)} />
                  {n} pages
                </label>
              ))}
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={showAchievements} onChange={e => setShowAchievements(e.target.checked)} /> Achievements
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={showCompetencies} onChange={e => setShowCompetencies(e.target.checked)} /> Competencies
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={showCertifications} onChange={e => setShowCertifications(e.target.checked)} /> Certifications
              </label>
              <label className="flex items-center gap-1">
                <input type="checkbox" checked={showEducation} onChange={e => setShowEducation(e.target.checked)} /> Education
              </label>
            </div>
            {/* Filtered preview */}
            {(() => { console.log('structuredCV for preview:', structuredCV); return null; })()}
            {structuredCV ? renderStructuredCV({
              ...filterByPriority(structuredCV, maxPriority),
              relevant_achievements: showAchievements && Array.isArray(structuredCV?.relevant_achievements) ? filterByPriority(structuredCV, maxPriority).relevant_achievements : [],
              core_competencies: showCompetencies && Array.isArray(structuredCV?.core_competencies) ? filterByPriority(structuredCV, maxPriority).core_competencies : [],
              certifications: showCertifications && Array.isArray(structuredCV?.certifications) ? filterByPriority(structuredCV, maxPriority).certifications : [],
              education: showEducation && Array.isArray(structuredCV?.education) ? filterByPriority(structuredCV, maxPriority).education : [],
            }) : <div>No CV data available.</div>}
            <button
              onClick={() => setCurrentStep(2)}
              className="mt-4 px-4 py-2 bg-gray-400 text-white rounded"
            >
              Back
            </button>
            <button
              onClick={handleSaveAndDownload}
              className="mt-4 ml-2 px-4 py-2 bg-blue-600 text-white rounded"
              disabled={isGenerating}
            >
              {isGenerating ? "Saving..." : "Save & Download"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationWizard;