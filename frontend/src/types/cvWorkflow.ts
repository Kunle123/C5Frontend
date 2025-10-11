// Types for /cv/session/start
export interface StartSessionRequest {
  user_id: string;
}
export interface StartSessionResponse {
  session_id: string;
  status: string;
  message: string;
}

// Types for /cv/preview
export interface CVPreviewRequest {
  session_id: string;
  jobDescription: string;
}
export interface CVPreviewResponse {
  job_analysis: {
    summary: string;
    keywords: string[];
  };
  profile_match: {
    strengths: string[];
    gaps: string[];
    match_score: number;
    evidence_source: string;
  };
  keyword_coverage: {
    present_in_profile: string[];
    missing_from_profile: string[];
    profile_references: Record<string, any>;
  };
  session_id: string;
  preview_ready: boolean;
  generation_method: string;
}

// Types for /cv/generate
export interface CVGenerateRequest {
  session_id: string;
  jobDescription: string;
}
export interface CVGenerateResponse {
  cv: CVObject;
  cover_letter: CoverLetterObject;
  generation_metadata: Record<string, any>;
  session_id: string;
  generation_method: string;
  job_description: string;
}

export interface CVObject {
  personal_information: Record<string, any>;
  professional_summary: Record<string, any>;
  work_experience: Array<Record<string, any>>;
  skills: Record<string, any>;
  education: Array<Record<string, any>>;
  additional_sections: Record<string, any>;
}
export interface CoverLetterObject {
  content: string;
  word_count: number;
  evidence_source: string;
  priority: number;
}

// Types for /cv/update
export interface CVUpdateRequest {
  session_id: string;
  currentCV: CVObject;
  updateRequest: string;
  jobDescription?: string;
}
export interface CVUpdateResponse extends CVObject {
  session_id: string;
  generation_method: string;
  update_request: string;
  updated_at: number;
}

