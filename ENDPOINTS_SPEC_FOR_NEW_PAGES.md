# API Endpoint Specification for New Pages

This document outlines the required API endpoints for the newly scaffolded pages: **Profile**, **Settings**, **Application History**, **Job Management**, and **Feedback**. Each endpoint includes method, path, authentication, request/response format, and notes.

---

## 1. Profile

### Get User Profile
- **Method:** GET
- **Path:** `/api/user/profile`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "createdAt": "ISO8601 string",
  "updatedAt": "ISO8601 string"
}
```
- **Notes:** Returns the current user's profile information.

### Update User Profile
- **Method:** PUT
- **Path:** `/api/user/profile`
- **Auth:** Bearer token required
- **Request:**
```json
{
  "name": "string",
  "email": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "profile": { /* updated profile object */ }
}
```
- **Notes:** Only updatable fields should be included. Email change may require re-verification.

### Change Password
- **Method:** PUT
- **Path:** `/api/user/password`
- **Auth:** Bearer token required
- **Request:**
```json
{
  "currentPassword": "string",
  "newPassword": "string"
}
```
- **Response:**
```json
{
  "success": true
}
```
- **Notes:** Should validate current password and enforce password policy.

---

## 2. Settings

### Get User Settings
- **Method:** GET
- **Path:** `/api/user/settings`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
{
  "notifications": {
    "email": true,
    "sms": false
  },
  "theme": "light" // or "dark"
}
```
- **Notes:** Extendable for more preferences.

### Update User Settings
- **Method:** PUT
- **Path:** `/api/user/settings`
- **Auth:** Bearer token required
- **Request:**
```json
{
  "notifications": {
    "email": true,
    "sms": false
  },
  "theme": "dark"
}
```
- **Response:**
```json
{
  "success": true,
  "settings": { /* updated settings object */ }
}
```

---

## 3. Application History

### List Application History
- **Method:** GET
- **Path:** `/api/applications/history`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
[
  {
    "id": "string",
    "jobTitle": "string",
    "company": "string",
    "appliedAt": "ISO8601 string",
    "cvId": "string",
    "coverLetterId": "string"
  }
]
```
- **Notes:** Returns a list of applications the user has generated or submitted.

### Get Application Details
- **Method:** GET
- **Path:** `/api/applications/:id`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
{
  "id": "string",
  "jobTitle": "string",
  "company": "string",
  "appliedAt": "ISO8601 string",
  "cv": { /* CV object */ },
  "coverLetter": { /* Cover letter object */ }
}
```
- **Notes:** Returns details and downloadable links for a specific application.

---

## 4. Job Management

### List Saved Jobs
- **Method:** GET
- **Path:** `/api/jobs`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
[
  {
    "id": "string",
    "title": "string",
    "company": "string",
    "description": "string",
    "status": "saved" | "applied" | "archived",
    "createdAt": "ISO8601 string",
    "updatedAt": "ISO8601 string"
  }
]
```

### Save a New Job
- **Method:** POST
- **Path:** `/api/jobs`
- **Auth:** Bearer token required
- **Request:**
```json
{
  "title": "string",
  "company": "string",
  "description": "string"
}
```
- **Response:**
```json
{
  "success": true,
  "job": { /* job object */ }
}
```

### Update a Job
- **Method:** PUT
- **Path:** `/api/jobs/:id`
- **Auth:** Bearer token required
- **Request:**
```json
{
  "title": "string",
  "company": "string",
  "description": "string",
  "status": "saved" | "applied" | "archived"
}
```
- **Response:**
```json
{
  "success": true,
  "job": { /* updated job object */ }
}
```

### Delete a Job
- **Method:** DELETE
- **Path:** `/api/jobs/:id`
- **Auth:** Bearer token required
- **Request:** None
- **Response:**
```json
{
  "success": true
}
```

---

## 5. Feedback

### Submit Feedback
- **Method:** POST
- **Path:** `/api/feedback`
- **Auth:** Bearer token optional (allow anonymous feedback)
- **Request:**
```json
{
  "message": "string",
  "type": "bug" | "feature" | "general",
  "email": "string (optional)"
}
```
- **Response:**
```json
{
  "success": true
}
```
- **Notes:** Store feedback for admin review. Optionally send email notification to support.

---

## General Notes
- All endpoints should return appropriate error codes and messages for validation/auth failures.
- All timestamps should be ISO8601 strings.
- All endpoints should be versioned if your API uses versioning (e.g., `/api/v1/...`). 