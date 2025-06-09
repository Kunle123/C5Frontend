# CV Creation API Integration Guide

This document describes how the frontend should interact with the updated CV creation API, including new customizable options and the flow from CV creation to downloadable DOCX.

---

## 1. CV Creation Endpoint

**Endpoint:**
```
POST /api/cv
```

**Headers:**
- `Authorization: Bearer <user_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "My Optimized CV",
  "description": "CV for Project Manager role",
  "is_default": true,
  "template_id": "default",
  "num_pages": 2,                      // Options: 2, 3, or 4
  "include_keywords": true,             // true or false
  "include_relevant_experience": true   // true or false
}
```

- All options are required. The frontend should provide radio buttons or toggles for these fields.

**Response Example:**
```json
{
  "id": "cv_12345",
  "name": "My Optimized CV",
  "description": "CV for Project Manager role",
  "created_at": "2024-06-10T12:34:56Z",
  ...
}
```

---

## 2. How User Options Influence CV Generation

- The selected options (`num_pages`, `include_keywords`, `include_relevant_experience`) are **fed directly into the OpenAI prompt** used by the backend to generate the CV content.
- This ensures the generated CV matches the user's preferences for length and included sections.
- Example OpenAI prompt snippet:
  > Generate a professional CV with the following requirements:
  > - Number of pages: 2
  > - Include keyword section: Yes
  > - Include relevant experience section: Yes
  > ...

---

## 3. Update CV Content

**Endpoint:**
```
PUT /api/cv/{cv_id}/content
```

**Request Body Example:**
```json
{
  "summary": "...",
  "experiences": [...],
  "education": [...],
  "skills": [...],
  ...
}
```

---

## 4. Download CV as DOCX

**Endpoint:**
```
GET /api/cv/{cv_id}/download?format=docx
```
- Triggers download of the generated CV as a DOCX file.
- The backend will use the options selected at creation time (pages, keywords, relevant experience) to generate the document according to user preferences.

---

## 5. User Flow

1. **User completes the Application Wizard.**
2. **Frontend presents options:**
   - Number of pages (2, 3, 4)
   - Include keyword section (yes/no)
   - Include relevant experience section (yes/no)
3. **Frontend sends POST /api/cv** with selected options.
4. **Backend uses these options in the OpenAI prompt to generate the CV content.**
5. **Frontend updates CV content** via PUT /api/cv/{cv_id}/content (if needed).
6. **User can download the CV** via GET /api/cv/{cv_id}/download?format=docx.

---

## 6. Notes for Frontend Developers

- Always send the user's Bearer token in the Authorization header.
- Validate user input for the new options before sending the request.
- The options you send will directly affect the generated CV via the OpenAI prompt.
- Handle 422 errors (validation) gracefully and display user-friendly messages.
- The download endpoint returns a binary DOCX file; use `window.location` or an anchor tag with `download` attribute to trigger download in the browser.

---

## 7. Example UI Elements

- **Radio buttons** for number of pages:
  - 2 pages
  - 3 pages
  - 4 pages
- **Toggles or checkboxes** for:
  - Include keyword section
  - Include relevant experience section

---

## 8. API Contract Summary

| Endpoint                                 | Method | Purpose                  | Request/Response         |
|-------------------------------------------|--------|--------------------------|-------------------------|
| `/api/cv`                                | POST   | Create new CV            | JSON (with options)     |
| `/api/cv/{cv_id}/content`                | PUT    | Update CV content        | JSON                    |
| `/api/cv/{cv_id}/download?format=docx`   | GET    | Download CV as DOCX      | Binary (DOCX)           |

---

For any questions or backend changes, contact the backend team. 