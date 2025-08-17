# Apply Flow (Updated for Thread-Aware CV & Keyword Extraction, Structured JSON, and DOCX Generation)

This document summarizes the Application Wizard (Apply Flow) for the frontend, including endpoints, inputs, and expected JSON responses at each step. **As of the latest backend update, CVs are generated using a professional layout and enhanced styling via the ProfessionalCVFormatter. The flow now uses structured JSON for preview/editing, and a dedicated endpoint to convert JSON to DOCX.**

---

## Apply Flow Summary Table

| Step | Action / UI | Endpoint | Method | Input (JSON) | Response (JSON) | Notes |
|------|-------------|----------|--------|--------------|-----------------|-------|
| 1 | **Fetch User Profile** | `/api/user/profile` | GET | (Bearer token) | `{ "id": "...", "name": "...", ... }` | Used to pre-fill user info |
| 2 | **Fetch Career Ark Data** | `/api/career-ark/profiles/{profileId}/all_sections` | GET | (Bearer token) | `{ "work_experience": [...], "education": [...], ... }` | Used to pre-fill experience |
| 3 | **Extract Keywords** | `/api/career-ark/generate-assistant` | POST | `{ "action": "extract_keywords", "profile": {...}, "job_description": "..." }` or `{ "action": "extract_keywords", "thread_id": "..." }` | `{ "keywords": ["..."], "thread_id": "..." }` | Thread-aware: only send new instruction if thread_id is present |
| 4 | **Generate Structured CV & Cover Letter JSON** | `/api/career-ark/generate-assistant` | POST | `{ "action": "generate_cv", "profile": {...}, "job_description": "..." }` or `{ "action": "generate_cv", "thread_id": "..." }` | `{ "name": "...", "contact_info": [...], "summary": "...", "experience": [...], ... }` | Thread-aware: only send new instruction if thread_id is present. **No longer returns DOCX directly.** |
| 5 | **Preview/Edit Structured JSON** | (Frontend only) | - | (Structured JSON) | (HTML preview) | User can preview and edit the CV/cover letter before generating DOCX. |
| 6 | **Generate DOCX| **Download Cover Letter** | `/api/cv/{cover_letter_id}/download` | GET | (Bearer token) | (DOCX file) | Download cover letter file (must use correct ID) |

---

## Key Updates

- **CV DOCX files are now generated from structured JSON using the `/api/cv/generate-docx` endpoint.**
- **Cover letters are stored as separate records in the database, each with their own unique ID.**
- **To download the correct file, always use the specific ID for the CV or cover letter.**
- **Keyword extraction and CV/cover letter generation are thread-aware: if a `thread_id` is provided, only the relevant instruction is sent to the assistant, leveraging prior context.**
- **The `/api/cv/thread-keywords` endpoint has been removed; use `/api/career-ark/generate-assistant` for all keyword extraction and CV/cover letter generation.**
- **The frontend should use the structured JSON for preview and editing, and only generate DOCX when the user is ready to save/download.**
- **The DOCX generation step always uses the last generated CV and cover letter as shown in the preview (step 3), including after any updates via the Request Updates modal. The frontend does not reconstruct the CV from thread or keypoints, but uses the current preview content as the source of truth for DOCX generation.**

---

## Example JSON Formats

### Extract Keywords (Step 3)
**Request (initial, no thread):**
```json
{
  "action": "extract_keywords",
  "profile": { "name": "John Doe", ... },
  "job_description": "Looking for a project manager..."
}
```
**Request (thread-aware, follow-up):**
```json
{
  "action": "extract_keywords",
  "thread_id": "thread_abc123"
}
```
**Response:**
```json
{
  "keywords": ["project management", "agile", "stakeholder"],
  "thread_id": "thread_abc123"
}
```

---

### Generate Structured CV & Cover Letter JSON (Step 4)
**Request (initial, no thread):**
```json
{
  "action": "generate_cv",
  "profile": { "name": "John Doe", ... },
  "job_description": "Looking for a project manager..."
}
```
**Request (thread-aware, follow-up):**
```json
{
  "action": "generate_cv",
  "thread_id": "thread_abc123"
}
```
**Response:**
```json
{
  "name": "John Doe",
  "contact_info": ["..."],
  "summary": "...",
  "experience": [ { "job_title": "...", "company": "...", "dates": "...", "bullets": ["...", ...] }, ... ],
  "education": [ { "degree": "...", "institution": "...", "dates": "..." } ],
  "certifications": ["..."],
  "core_competencies": ["..."],
  "cover_letter": "...",
  "job_title": "...",
  "company_name": "..."
}
```

---

### Generate DOCX from JSON (Step 6)
**Request:**
```json
{
  "name": "John Doe",
  "contact_info": ["..."],
  "summary": "...",
  "experience": [ ... ],
  "education": [ ... ],
  "certifications": [ ... ],
  "core_competencies": [ ... ],
  "cover_letter": "...",
  "job_title": "...",
  "company_name": "..."
}
```
**Response:**
```json
{
  "cv": "<base64-encoded-docx>",
  "cover_letter": "<base64-encoded-docx>"
}
```

---

### Persist Generated Docs (Step 7)
**Request:**
```json
{
  "cv": "<base64-encoded-docx>",
  "cover_letter": "<base64-encoded-docx>",
  "job_title": "Project Manager",
  "company_name": "Acme Corp"
}
```
**Response:**
```json
{
  "id": "cv-uuid",
  "cover_letter_id": "cover-letter-uuid",
  ...
}
```
**Note:** The `id` is for the CV, and `cover_letter_id` is for the cover letter. Use the correct ID for downloads.

---

### List All Docs (Step 8)
**Response:**
```json
[
  {
    "id": "cv-uuid",
    "job_title": "Project Manager",
    "company_name": "Acme Corp",
    "cover_letter_available": true,
    "cover_letter_download_url": "/api/cv/cover-letter-uuid/download",
    ...
  },
  {
    "id": "cover-letter-uuid",
    "job_title": "Project Manager",
    "company_name": "Acme Corp",
    "cover_letter_available": false,
    "cover_letter_download_url": null,
    ...
  }
]
```

---

### Download CV or Cover Letter (Step 9/10)
- **Request:**  
  `GET /api/cv/{id}/download` (with Bearer token)
- **Response:**  
  Returns a `.docx` file as binary. The CV will have a professional layout; the cover letter will be as generated.
