// CV Workflow API TypeScript Interfaces
// (Generated from user-provided schema)

// ============================================================================
// SESSION MANAGEMENT INTERFACES
// ============================================================================

export interface StartSessionRequest {
  profile: UserProfile;
  user_id?: string;
}

export interface StartSessionResponse {
  session_id: string;
  status: 'active';
  expires_at: string; // ISO timestamp
  message: string;
}

export interface EndSessionRequest {
  session_id: string;
}

export interface EndSessionResponse {
  session_id: string;
  status: 'ended';
  file_cleaned: boolean;
  message: string;
}

// ============================================================================
// USER PROFILE INTERFACE
// ============================================================================

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  experience: WorkExperience[];
  skills: SkillsSection;
  education: Education[];
  certifications?: Certification[];
}

export interface WorkExperience {
  company: string;
  title: string;
  dates: string;
  location?: string;
  responsibilities: string[];
  achievements?: string[];
}

export interface SkillsSection {
  technical?: string[];
  soft?: string[];
  languages?: string[];
  certifications?: string[];
}

export interface Education {
  degree: string;
  institution: string;
  year: string;
  classification?: string;
  relevant_coursework?: string;
}

export interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry?: string;
}

// ============================================================================
// CV PREVIEW INTERFACES
// ============================================================================

export interface CVPreviewRequest {
  session_id: string;
  job_description: string;
}

export interface CVPreviewResponse {
  job_title: string;
  company: string;
  experience_level: string;
  industry: string;
  technical_skills: [string, string, string, string, string];
  functional_skills: [string, string, string, string];
  soft_skills: [string, string, string];
  industry_terms: [string, string, string];
  experience_qualifiers: [string, string];
  total_keywords: 17;
  keyword_priority: KeywordPriority;
  profile_analysis: ProfileAnalysis;
  keyword_match_analysis: KeywordMatchAnalysis;
  strengths_identified: Strength[];
  gaps_identified: Gap[];
  cv_optimization_recommendations: OptimizationRecommendation[];
  extraction_validation: ExtractionValidation;
  consistency_metadata: ConsistencyMetadata;
}

export interface KeywordPriority {
  high: [string, string, string, string, string];
  medium: [string, string, string, string, string, string, string];
  low: [string, string, string, string, string];
}

export interface ProfileAnalysis {
  overall_match_score: number;
  technical_skills_score: number;
  functional_skills_score: number;
  experience_level_score: number;
  industry_alignment_score: number;
  soft_skills_score: number;
  match_confidence: 'HIGH' | 'MEDIUM' | 'LOW';
  scoring_methodology: string;
}

export interface KeywordMatchAnalysis {
  keywords_present_in_profile: number;
  keywords_missing_from_profile: number;
  natural_integration_opportunities: number;
  forced_integration_risks: number;
  keyword_coverage_percentage: number;
}

export interface Strength {
  strength: string;
  evidence: string;
  job_relevance_score: number;
  competitive_advantage: string;
}

export interface Gap {
  gap: string;
  importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
  mitigation_potential: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
  transferable_alternative: string | null;
}

export interface OptimizationRecommendation {
  recommendation: string;
  rationale: string;
  implementation: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface ExtractionValidation {
  job_metadata_extracted: true;
  keywords_exactly_17: true;
  categories_properly_distributed: true;
  scoring_systematic: true;
  deterministic_process_followed: true;
}

export interface ConsistencyMetadata {
  extraction_method: string;
  scoring_method: string;
  variance_control: string;
  reproducibility_guarantee: string;
}

// ============================================================================
// CV GENERATION INTERFACES
// ============================================================================

export interface CVGenerateRequest {
  session_id: string;
  job_description: string;
  user_preferences?: Record<string, any>;
  preview_data?: CVPreviewResponse;
}

export interface CVGenerateResponse {
  session_id: string;
  cv: GeneratedCV;
  cover_letter: CoverLetter;
  generation_metadata: GenerationMetadata;
  job_alignment: JobAlignment;
}

export interface GeneratedCV {
  name: string;
  contact: ContactInfo;
  professional_summary: CVSection;
  key_achievements: CVAchievement[];
  professional_experience: CVExperience[];
  core_competencies: CoreCompetencies;
  education: CVEducation[];
  certifications: CVCertification[];
}

export interface ContactInfo {
  email: string;
  phone: string;
  location: string;
  linkedin: string;
}

export interface CVSection {
  original_profile_basis: string;
  job_aligned_content: string;
  keywords_included: string[];
  priority_level: 1 | 2 | 3 | 4 | 5;
  fabrication_check: string;
  evidence_source: string;
}

export interface CVAchievement {
  original_profile_content: string;
  job_aligned_content: string;
  priority: 1 | 2 | 3 | 4 | 5;
  keywords_used: string[];
  metrics_preserved: string;
  fabrication_check: string;
  evidence_source: string;
}

export interface CVExperience {
  company: string;
  title: string;
  dates: string;
  location: string;
  chronological_position: number;
  continuity_validated: true;
  bullets: CVBullet[];
}

export interface CVBullet {
  original_profile_content: string;
  job_aligned_content: string;
  priority: 1 | 2 | 3 | 4 | 5;
  keywords_used: string[];
  fabrication_check: string;
  evidence_source: string;
}

export interface CoreCompetencies {
  technical_skills: CVSkill[];
  soft_skills: CVSkill[];
}

export interface CVSkill {
  original_profile_evidence: string;
  job_aligned_skill: string;
  proficiency?: string;
  priority: 1 | 2 | 3 | 4 | 5;
  evidence_source: string;
}

export interface CVEducation {
  degree: string;
  institution: string;
  year: string;
  classification: string;
  relevant_coursework: string;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface CVCertification {
  name: string;
  issuer: string;
  date: string;
  priority: 1 | 2 | 3 | 4 | 5;
}

export interface CoverLetter {
  paragraph_1: CoverLetterParagraph;
  paragraph_2: CoverLetterParagraph;
  paragraph_3: CoverLetterParagraph;
  paragraph_4: CoverLetterParagraph;
  full_content: string;
  word_count: number;
  fabrication_check: string;
}

export interface CoverLetterParagraph {
  content: string;
  evidence_basis: string;
  fabrication_check?: string;
}

export interface GenerationMetadata {
  chronological_continuity_verified: true;
  timeline_gaps_eliminated: true;
  roles_included_continuous: true;
  evidence_traceability_complete: true;
  fabrication_risk: string;
  priority_distribution_factual: true;
  anti_fabrication_compliance: string;
  cv_length: 'SHORT' | 'MEDIUM' | 'LONG' | 'EXTENDED';
  total_roles_included: number;
  highest_priority_used: 1 | 2 | 3 | 4 | 5;
}

export interface JobAlignment {
  job_title: string;
  company_name: string;
  key_requirements_matched: string[];
  keywords_naturally_integrated: string[];
}

// ============================================================================
// CV UPDATE INTERFACES
// ============================================================================

export interface CVUpdateRequest {
  session_id: string;
  current_cv: GeneratedCV;
  update_request: string;
  job_description: string;
}

export interface CVUpdateResponse {
  session_id: string;
  updated_cv: GeneratedCV;
  update_summary: UpdateSummary;
  update_metadata: UpdateMetadata;
  job_alignment: JobAlignment;
}

export interface UpdateSummary {
  user_request: string;
  changes_implemented: ChangeImplemented[];
  requests_fulfilled: number;
  requests_not_possible: RequestNotPossible[];
  new_content_added: NewContentAdded[];
  priority_adjustments: PriorityAdjustment[];
}

export interface ChangeImplemented {
  section: string;
  change_type: 'EMPHASIS' | 'REORGANIZATION' | 'ADDITION' | 'LANGUAGE_IMPROVEMENT';
  specific_change: string;
  profile_content_used: string;
  rationale: string;
}

export interface RequestNotPossible {
  request: string;
  reason: string;
  alternative_suggested: string;
}

export interface NewContentAdded {
  content: string;
  source: string;
  rationale: string;
}

export interface PriorityAdjustment {
  content: string;
  old_priority: 1 | 2 | 3 | 4 | 5;
  new_priority: 1 | 2 | 3 | 4 | 5;
  rationale: string;
}

export interface UpdateMetadata {
  chronological_continuity_maintained: true;
  factual_accuracy_preserved: true;
  evidence_traceability_complete: true;
  fabrication_risk: string;
  update_compliance: string;
  profile_content_utilization: string;
  anti_fabrication_compliance: string;
  update_timestamp: string; // ISO timestamp
  original_cv_preserved: true;
}

// ============================================================================
// ERROR INTERFACES
// ============================================================================

export interface APIError {
  detail: string;
  type: 'validation_error' | 'profile_error' | 'session_error' | 'rate_limit_error' | 'server_error';
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PriorityLevel = 1 | 2 | 3 | 4 | 5;
export type MatchConfidence = 'HIGH' | 'MEDIUM' | 'LOW';
export type ImportanceLevel = 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
export type MitigationPotential = 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
export type CVLength = 'SHORT' | 'MEDIUM' | 'LONG' | 'EXTENDED';
export type ChangeType = 'EMPHASIS' | 'REORGANIZATION' | 'ADDITION' | 'LANGUAGE_IMPROVEMENT';


