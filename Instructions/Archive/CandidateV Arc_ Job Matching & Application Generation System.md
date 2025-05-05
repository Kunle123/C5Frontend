# CandidateV Arc: Job Matching & Application Generation System

## 1. Overview

This document outlines the system responsible for matching a user's career intelligence data (stored in Arc) against the requirements of a specific job description and subsequently generating a bespoke CV and cover letter. This system is orchestrated by the Application Generation Service and heavily relies on the AI Integration Layer (using OpenAI GPT) for complex analysis, content selection, and drafting.

## 2. System Goal

To produce highly relevant, tailored CVs and cover letters that maximize a user's chances of success for a specific job application by intelligently leveraging their comprehensive career history stored in Arc and aligning it precisely with the target job's requirements.

## 3. Inputs

1.  **User Arc Data**: The complete, structured career intelligence data retrieved from the Arc Database for the specific user (includes work experience, skills, education, projects, achievements, etc.).
2.  **Analyzed Job Description**: The structured output from the Job Analysis Service, containing key skills, required experience, responsibilities, keywords, company context, etc., extracted from the job posting.
3.  **User Preferences (Optional)**: Template choice, desired tone (for cover letter), specific areas to emphasize.

## 4. Matching Process

This stage identifies the most relevant parts of the user's Arc data for the target job.

1.  **Skill Matching**: 
    *   Compare the `keySkills` from the Analyzed Job Description against the `skills` array in the User Arc Data.
    *   Identify direct matches (e.g., "Python" in job matches "Python" in Arc).
    *   Identify semantic matches (e.g., "Team Leadership" in job might relate to "Project Management" skill in Arc). This may involve using embedding comparisons or prompting the AI Integration Layer ("Which skills from this list [Arc skills] are relevant to these required skills [Job skills]?").
    *   Score or rank matched skills based on relevance and proficiency/experience level from Arc.
2.  **Experience Matching**: 
    *   Compare `requiredExperienceYears` and `jobTitle` from the job analysis with the user's `workExperience` entries.
    *   Identify roles in the Arc with similar titles or responsibilities.
    *   Filter experiences based on date relevance (e.g., prioritizing more recent roles).
3.  **Keyword Matching**: 
    *   Cross-reference `extractedKeywords` from the job analysis against the text content within Arc data (e.g., descriptions in `workExperience.responsibilities`, `workExperience.achievements`, `projects.description`).
4.  **Contextual Relevance Analysis (AI-Assisted)**:
    *   Use the AI Integration Layer (GPT) with prompts that combine job requirements and snippets of Arc data.
    *   Example Prompt Fragment: "Given the job requires [skill X] and [responsibility Y], which of these user achievements [list of achievements from Arc] are most relevant to highlight? Explain why."
    *   This helps identify not just *what* matches, but *how well* it matches in context.

## 5. Content Selection & Prioritization

Based on the matching results, the system selects and prioritizes the specific data points from the Arc to include in the generated application.

1.  **Prioritize High-Match Items**: Select skills, experiences, achievements, and projects that scored highly during the matching process.
2.  **Select Supporting Details**: For prioritized work experiences, select specific responsibilities and achievements that directly address the job requirements identified in the analysis.
3.  **Tailor Summary/Objective**: Choose or generate (via AI) a summary statement that aligns with the target job title and key requirements.
4.  **Filter Irrelevant Information**: Exclude experiences, skills, or projects deemed irrelevant to the target job to keep the application focused.
5.  **Ensure Completeness**: Check if key requirements from the job description are addressed by the selected Arc data. Flag gaps if necessary (potentially for AI to address in the cover letter or for user notification).

## 6. Generation Process (AI-Driven Drafting)

This stage uses the selected Arc data and job context to generate the actual CV and cover letter content via the AI Integration Layer.

1.  **CV Section Generation**: 
    *   **Prompting Strategy**: For each CV section (Summary, Work Experience, Skills, Education, Projects), create specific prompts for GPT.
    *   **Example Prompt (Work Experience Entry)**: "Generate a concise description for a CV work experience entry. Job Applied For: [Job Title]. User Role: [Position Title] at [Company Name] ([Start Date] - [End Date]). Key requirements for the target job are [list key requirements]. Select and rewrite the most relevant points from the user's responsibilities and achievements provided below, optimizing for ATS keywords related to the target job. User Responsibilities: [List selected responsibilities from Arc]. User Achievements: [List selected achievements from Arc]. Focus on quantifiable results where possible. Output format: Bullet points."
    *   Iterate through selected work experiences, skills list, education, etc., generating optimized content for each.
2.  **Cover Letter Generation**: 
    *   **Prompting Strategy**: Create a comprehensive prompt including:
        *   User's selected key qualifications/experiences from Arc.
        *   Key requirements and company context from the analyzed job description.
        *   Instructions on tone, length, and structure (e.g., introduction, body paragraphs addressing specific requirements, conclusion).
        *   Explicit instruction to connect the user's background (Arc data) directly to the job's needs.
    *   **Example Prompt Fragment**: "Write a professional cover letter for [User Name] applying for the [Job Title] role at [Company Name]. The job requires [Requirement 1], [Requirement 2], [Requirement 3]. Highlight how the user's experience in [Relevant Arc Experience/Skill 1] and achievement of [Relevant Arc Achievement] demonstrates their suitability. Mention their proficiency in [Relevant Arc Skill 2]. Use the following user details: [Selected Arc Info]. Maintain a [Tone] tone and keep it under [Word Count] words."
3.  **AI Integration Layer Role**: Manages these complex prompts, interacts with GPT, handles potential token limits (by structuring generation section-by-section), and returns the generated text content.

## 7. Formatting & Output

1.  **Content Assembly**: The Application Generation Service receives the generated text content for each CV section and the cover letter from the AI Integration Layer.
2.  **Template Application**: Apply the user's chosen template (or a default one). This involves placing the generated content into the correct structure defined by the template (e.g., HTML/CSS for PDF generation).
3.  **PDF/DOCX Conversion**: 
    *   Use a library like WeasyPrint (for HTML/CSS to PDF) or potentially `python-docx` (to create DOCX) to render the final document.
    *   Ensure proper formatting, fonts, and layout according to the template.
4.  **Output Storage**: Save the generated file(s) to secure storage (e.g., S3) with a temporary, secure download link.
5.  **Update Task Status**: Mark the generation task as complete and provide the download link(s) via the status API endpoint.

## 8. Considerations

*   **Iteration & Refinement**: The quality heavily depends on prompt engineering. Continuous refinement of prompts based on output quality is essential.
*   **Consistency**: Ensure consistency in language and formatting across different generated sections.
*   **Factuality**: While GPT drafts the content, it should primarily rephrase and structure information *selected* from the Arc. Mechanisms might be needed to prevent hallucination or introduction of non-factual information.
*   **User Review**: Although automated, consider offering a preview/edit step before final download, allowing users to make minor tweaks to the AI-generated content.
