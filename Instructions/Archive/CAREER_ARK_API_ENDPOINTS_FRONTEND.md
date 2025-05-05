# Career Ark (Arc) API Endpoints for Frontend Implementation

All endpoints are accessed via the API Gateway:

**Base URL:** `https://api-gw-production.up.railway.app/api/arc`

All endpoints (except health) require a Bearer token in the `Authorization` header.

---

## 1. Health Check
- **GET** `/api/arc/health`
- **Description:** Check if the Arc service is up.
- **Auth:** No

---

## 2. Upload CV
- **POST** `/api/arc/cv`
- **Description:** Upload a CV file for processing and extraction.
- **Auth:** Yes
- **Request:** `multipart/form-data` with a `file` field (PDF, DOC, DOCX)
- **Response:**
  ```json
  { "taskId": "string" }
  ```

---

## 3. Poll CV Processing Status
- **GET** `/api/arc/cv/status/{taskId}`
- **Description:** Get the status of a CV processing task.
- **Auth:** Yes
- **Response:**
  ```json
  {
    "status": "pending" | "completed" | "failed",
    "extractedDataSummary"?: {
      "workExperienceCount": number,
      "skillsFound": number
    },
    "error"?: "string"
  }
  ```

---

## 4. Get Arc Data
- **GET** `/api/arc/data`
- **Description:** Retrieve the user's Arc profile data (skills, experience, etc.).
- **Auth:** Yes
- **Response:**
  ```json
  {
    "work_experience": [
      {
        "company": "Acme Corp",
        "title": "Software Engineer",
        "start_date": "2020-01",
        "end_date": "2022-06",
        "description": "Worked on backend systems and APIs.",
        "successes": [
          "Led migration to cloud infrastructure",
          "Reduced API latency by 30%"
        ],
        "skills": ["Python", "AWS", "APIs"],
        "training": ["AWS Certified Developer"]
      },
      // ... more roles ...
    ],
    "education": [
      {"institution": "University X", "degree": "BSc Computer Science", "year": "2019"}
    ],
    "skills": ["Python", "APIs", "AWS"],
    "projects": [
      {"name": "Project Y", "description": "Built a web app", "tech": ["React", "FastAPI"]}
    ],
    "certifications": [
      {"name": "AWS Certified Developer", "issuer": "Amazon", "year": "2021"}
    ]
  }
  ```

---

## 5. Update Arc Data
- **PUT** `/api/arc/data`

---

## CV and Cover Letter Generation Endpoint

### Endpoint
- **POST** `/api/arc/generate`

### Request Body
```json
{
  "jobAdvert": "Full job description text here...",
  "arcData": { /* ArcData object as returned by /api/arc/data */ }
}
```

### Response
```json
{
  "cv": "Tailored CV as a string (can be displayed, downloaded, or copied)",
  "coverLetter": "Targeted cover letter as a string"
}
```

### TypeScript Interface
```typescript
export interface GenerateResponse {
  cv: string;
  coverLetter: string;
}
```

### Integration Tips
- Display the returned `cv` and `coverLetter` in a rich text editor, preview, or allow download as PDF/Word.
- You can offer a "Download CV" or "Download Cover Letter" button by converting the string to a file.
- Optionally, allow users to edit the generated text before finalizing.
- If the backend returns an error, display a helpful message (e.g., "Could not generate CV. Please try again.").

### Example Usage
```typescript
const response = await fetch('/api/arc/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
  body: JSON.stringify({ jobAdvert, arcData }),
});
const data: GenerateResponse = await response.json();
displayCV(data.cv);
displayCoverLetter(data.coverLetter);
```

---

## TypeScript Interface for ArcData

```