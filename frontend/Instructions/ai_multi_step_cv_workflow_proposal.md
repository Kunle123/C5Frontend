# Multi-Step AI CV Workflow Proposal (Unified Endpoint)

## Overview
This document outlines a multi-step workflow for CV and cover letter generation using a single AI endpoint. All actions are performed via `POST /api/career-ark/generate-assistant` with an `action` field in the payload. This is intended for the backend team to implement and for the frontend to consume.

---

## General Usage
- **Endpoint:** `POST /api/career-ark/generate-assistant`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer <user_token>`
- **Payload:** JSON object with an `action` field and relevant data fields (see below)

---

## 1. Extract Keywords (`extract_keywords`)
**Purpose:** Get relevant keywords and match percentage from a user profile and job description.

- **Payload Example:**
  ```json
  {
    "action": "extract_keywords",
    "profile": { "summary": "Senior developer with Python and cloud experience" },
    "job_description": "We are seeking a Python developer with experience in AWS, CI/CD, and agile teams."
  }
  ```
- **Response Example:**
  ```json
  {
    "keywords": ["Python", "AWS", "CI/CD", ...],
    "match_percentage": 70
  }
  ```
- **Frontend Use:**
  - Display extracted keywords to the user.
  - Show match percentage as a progress bar or score.

---

## 2. Generate CV (`generate_cv`)
**Purpose:** Generate a tailored CV and cover letter based on user profile and job description.

- **Payload Example:**
  ```json
  {
    "action": "generate_cv",
    "profile": {
      "summary": "Senior developer with Python and cloud experience",
      "experience": [{ "title": "Backend Developer", "company": "TechCorp", "years": 3 }],
      "education": [{ "degree": "BSc Computer Science", "institution": "UniX" }]
    },
    "job_description": "We are seeking a Python developer with experience in AWS, CI/CD, and agile teams."
  }
  ```
- **Response Example:**
  ```json
  {
    "cv": "Name: ...\nSummary: ...\nExperience: ...",
    "cover_letter": "Dear Hiring Manager, ..."
  }
  ```
- **Frontend Use:**
  - Display or allow download of the generated CV and cover letter.
  - Allow user to edit or copy the generated documents.

---

## 3. Update CV (`update_cv`)
**Purpose:** Update an existing CV to better match a new job description.

- **Payload Example:**
  ```json
  {
    "action": "update_cv",
    "profile": {
      "summary": "Senior developer with Python and cloud experience",
      "experience": [{ "title": "Backend Developer", "company": "TechCorp", "years": 3 }],
      "education": [{ "degree": "BSc Computer Science", "institution": "UniX" }]
    },
    "job_description": "We are seeking a Python developer with experience in AWS, CI/CD, and agile teams.",
    "existing_cv": "John Doe\nBackend Developer at TechCorp\nBSc Computer Science, UniX\nSkills: Python, AWS, CI/CD, Agile"
  }
  ```
- **Response Example:**
  ```json
  {
    "cv": "Name: ...\nSummary: ...\nExperience: ...",
    "cover_letter": "Dear Hiring Manager, ..."
  }
  ```
- **Frontend Use:**
  - Show the updated CV and cover letter to the user.
  - Allow user to compare, edit, or download the updated documents.

---

## UI/UX Flow (Frontend Guidance)

1. **Paste Job Description** →
2. **Extract Keywords** (show keywords + match %) →
3. **Review/Edit Keywords** (optional) →
4. **Generate CV & Cover Letter** →
5. **Review/Edit/Add Key Points** (optional) →
6. **Update CV** (optional) →
7. **Download/Save**

---

## General Rules for Backend
- All actions are handled by `/api/career-ark/generate-assistant` using the `action` field in the payload.
- Always return JSON in the exact formats above.
- Return errors in a consistent JSON format.
- Enforce strict separation of user profile data and job advert content in CV generation.
- See the full prompt for detailed extraction and generation logic.

---

## Reference: Extraction & Generation Prompt

(Include the full prompt text you provided above here for backend reference.) 