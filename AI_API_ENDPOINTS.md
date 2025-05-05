# AI Service API Endpoints — Frontend Integration Reference

This document describes **all AI-related API endpoints** as called by the frontend. Backend developers should ensure their implementation matches these specifications **exactly**—including URL paths, HTTP methods, request/response structure, and authentication. All requests are routed through the API Gateway.

---

## Base URL (API Gateway)

```
https://api-gw-production.up.railway.app/api/ai
```

All endpoints below are relative to this base URL.

---

## 1. Extract Keywords

- **POST** `/keywords`
- **Headers:**
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  { "text": "string" }
  ```
- **Response:**
  ```json
  { "keywords": ["string", ...] }
  ```

---

## 2. Analyze CV

- **POST** `/analyze`
- **Headers:**
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  { "cv_id": "string", "sections": ["string"] (optional) }
  ```
- **Response:**
  - JSON object with analysis results (score, feedback, suggestions, etc.)

---

## 3. Optimize CV

- **POST** `/optimize-cv`
- **Headers:**
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "cv_id": "string",
    "targets": [
      {
        "section": "string",
        "content": "string",
        "target_job": "string",
        "tone": "string",
        "keywords": ["string"]
      }
    ]
  }
  ```
- **Response:**
  - JSON object with optimized CV sections and metadata

---

## 4. Generate Cover Letter

- **POST** `/generate-cover-letter`
- **Headers:**
  - `Authorization: Bearer <JWT>`
  - `Content-Type: application/json`
- **Request Body:**
  ```json
  {
    "cv_id": "string",
    "job_description": "string",
    "user_comments": "string",
    "tone": "string",
    "company_name": "string",
    "recipient_name": "string",
    "position_title": "string"
  }
  ```
- **Response:**
  - JSON object with generated cover letter and key points

---

## General Notes

- **Authentication:** All endpoints require a valid JWT Bearer token in the `Authorization` header.
- **Routing:** All requests must go through the API Gateway (`https://api-gw-production.up.railway.app/api/ai`).
- **CORS:** The gateway must allow requests from the frontend origin (e.g., `http://localhost:5173` for local dev).
- **No deviation:** Backend endpoints, request/response structure, and authentication must match this document exactly for seamless frontend integration.

---

**For questions or updates, coordinate with the frontend team to avoid breaking changes.** 