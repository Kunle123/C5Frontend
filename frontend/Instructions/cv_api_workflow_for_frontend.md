# CV API Workflow for Frontend Developers

This document explains the end-to-end workflow for generating and downloading CVs using the CandidateV API, as implemented in the backend and tested in `test_cv_flow.py`. It is designed to help frontend developers understand the API flow, payloads, authentication, and how to handle DOCX downloads.

---

## 1. **User Login**
- **Endpoint:** `POST /api/auth/login`
- **Purpose:** Authenticate the user and obtain a JWT token.
- **Payload:**
  ```json
  {
    "email": "user@example.com",
    "password": "your_password"
  }
  ```
- **Response:**
  ```json
  {
    "success": true,
    "message": "Login successful.",
    "token": "<JWT_TOKEN>",
    "user": { ... }
  }
  ```
- **Frontend Action:** Store the `token` for use in the `Authorization` header for all subsequent requests.

---

## 2. **Fetch Ark Profile**
- **Endpoint:** `GET /api/career-ark/profiles/me`
- **Purpose:** Retrieve the user's Ark profile data (used for CV generation).
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "id": "...",
    "user_id": "...",
    "name": "...",
    "email": "..."
  }
  ```

---

## 3. **Generate CV and Cover Letter**
- **Endpoint:** `POST /api/career-ark/generate`
- **Purpose:** Generate CV and cover letter text based on Ark profile and job description.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Payload:**
  ```json
  {
    "jobAdvert": "Job description here...",
    "arcData": { ... } // Ark profile object
  }
  ```
- **Response:**
  ```json
  {
    "cv": "CV text...",
    "cover_letter": "Cover letter text..."
  }
  ```

---

## 4. **Create and Persist a DOCX CV**
- **Endpoint:** `POST /api/cv`
- **Purpose:** Generate a DOCX file from the provided CV and cover letter text, and persist it in the backend.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Payload:**
  ```json
  {
    "cv": "CV text...",
    "cover_letter": "Cover letter text..."
  }
  ```
- **Response:**
  ```json
  {
    "filename": "cv_<id>.docx",
    "filedata": "<base64 string>",
    "cv_id": "<id>"
  }
  ```
- **Frontend Action:**
  1. Decode the `filedata` base64 string to binary.
  2. Save as a `.docx` file using the provided `filename`.
  3. See the code sample below for how to do this in JavaScript.

---

## 5. **List User's CVs**
- **Endpoint:** `GET /api/cv`
- **Purpose:** Retrieve a list of the user's CVs (metadata only).
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:** Array of CV objects (see API for details).

---

## 6. **Download a Persisted DOCX CV**
- **Endpoint:** `GET /api/cv/{cv_id}/download`
- **Purpose:** Download a previously generated and persisted DOCX CV as a base64-encoded string in JSON.
- **Headers:**
  - `Authorization: Bearer <JWT_TOKEN>`
- **Response:**
  ```json
  {
    "filename": "cv_<id>.docx",
    "filedata": "<base64 string>",
    "cv_id": "<id>"
  }
  ```
- **Frontend Action:**
  1. Decode the `filedata` base64 string to binary.
  2. Save as a `.docx` file using the provided `filename`.

---

## **How to Download a Base64-Encoded DOCX in the Frontend (JavaScript Example)**

```javascript
fetch('/api/cv/<cv_id>/download', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  }
})
  .then(res => res.json())
  .then(data => {
    const byteCharacters = atob(data.filedata);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = data.filename || 'cv.docx';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  });
```

---

## **Best Practices**
- Always include the `Authorization` header with the JWT token for protected endpoints.
- Handle errors gracefully (e.g., with `.catch()` in JS).
- Revoke object URLs after download to free memory.
- You can wrap the download logic in a reusable function or React hook.

---

**For questions or further integration help, contact the backend team.**

# Proposal: Passing CV Options (Relevant Experience & Keywords) to CV Generation AI

## Overview
To enhance the customization and relevance of generated CVs, we propose updating the CV generation workflow to include user-selected options from the frontend modal. These options will be sent as part of the payload to the backend CV generation endpoint, ensuring the AI incorporates the user's preferences, relevant experience, and targeted keywords.

---

## Frontend Changes

### CV Options Modal
The modal will collect user input for:
- **Relevant Experience:** A text area or multi-select where users specify roles, projects, or achievements they want highlighted.
- **Keywords:** A field for users to enter job-specific or industry-specific keywords to emphasize in the CV.
- **Any other existing options** (e.g., CV style, tone, etc.).

### Payload Structure
When the user submits the modal, the frontend will POST to the CV generation endpoint with a payload such as:

```json
{
  "userId": "string",
  "cvOptions": {
    "relevantExperience": ["Experience 1", "Experience 2"],
    "keywords": ["React", "Node.js", "Agile"],
    "style": "Modern",
    "tone": "Professional"
  }
}
```

---

## Backend Changes

### API Contract Update
- **Endpoint:** `POST /api/generate-cv` (or `/api/arc/generate`)
- **Request Body:** Accepts the new `cvOptions` object in the request body.

### AI Prompt Construction
The backend should update the prompt sent to the AI to:
- Explicitly include the "Relevant Experience" section, ensuring these experiences are prioritized or highlighted in the generated CV.
- Incorporate the "Keywords" section, ensuring these terms are naturally integrated throughout the CV (especially in skills, summary, and experience sections).
- Optionally, use the selected `style` and `tone` if provided.

**Example prompt update:**
```
Generate a CV for the user. Highlight the following relevant experiences: [list from cvOptions.relevantExperience].
Ensure the following keywords are included: [list from cvOptions.keywords].
Use the selected style: [cvOptions.style] and tone: [cvOptions.tone].
```

---

## Benefits
- **Personalization:** Users get CVs tailored to their unique background and target roles.
- **ATS Optimization:** Including keywords improves chances of passing automated screening.
- **User Satisfaction:** More control and transparency for users over the CV content.

---

## Next Steps
1. **Confirm** the payload structure and endpoint contract.
2. **Backend** to update the AI prompt logic to handle the new fields.
3. **Frontend** to update the modal and API call accordingly.

---

## Questions / Feedback
- Are there any additional fields or options you'd like to include?
- Should the endpoint be `/api/generate-cv` or `/api/arc/generate`?
- Any other requirements for style, tone, or formatting?

Let us know before implementation begins! 