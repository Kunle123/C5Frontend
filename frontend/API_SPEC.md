# CandidateV API Interface Specification

This document describes all API endpoints expected by the CandidateV frontend. Each endpoint includes the HTTP method, path, request/response structure, and a description of its purpose.

---

## Authentication & User Management

### Register
- **POST** `/api/auth/register`
- **Body:** `{ name: string, email: string, password: string }`
- **Response:** `{ user: { id, name, email }, token }`
- **Purpose:** Register a new user and return a JWT for authentication.

### Login
- **POST** `/api/auth/login`
- **Body:** `{ email: string, password: string }`
- **Response:** `{ user: { id, name, email }, token }`
- **Purpose:** Authenticate user and return a JWT.

### Get Current User
- **GET** `/api/auth/me`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ user: { id, name, email, plan, ... } }`
- **Purpose:** Fetch the currently authenticated user's profile.

### Update Profile
- **PUT** `/api/user/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ name?: string, email?: string, ... }`
- **Response:** `{ user: { ...updated fields... } }`
- **Purpose:** Update user profile information.

---

## CV Management

### Create New CV
- **POST** `/api/cvs`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ jobDescription, contact, summary, experience, education, skills, ... }`
- **Response:** `{ cv: { id, ...fields... } }`
- **Purpose:** Create a new CV for the user.

### Get All CVs
- **GET** `/api/cvs`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ cvs: [ { id, name, created, job, status, ... }, ... ] }`
- **Purpose:** List all CVs for the user.

### Get Single CV
- **GET** `/api/cvs/:cvId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ cv: { ...fields... } }`
- **Purpose:** Fetch a specific CV for viewing or editing.

### Update CV
- **PUT** `/api/cvs/:cvId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ ...fields to update... }`
- **Response:** `{ cv: { ...updated fields... } }`
- **Purpose:** Update an existing CV.

### Delete CV
- **DELETE** `/api/cvs/:cvId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true }`
- **Purpose:** Delete a CV.

### Duplicate CV
- **POST** `/api/cvs/:cvId/duplicate`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ cv: { ...duplicated CV... } }`
- **Purpose:** Duplicate an existing CV.

### Download CV
- **GET** `/api/cvs/:cvId/download?format=pdf|docx`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Purpose:** Download a CV in the requested format.

---

## Cover Letter Management

### Create Cover Letter
- **POST** `/api/cover-letters`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ jobDescription, style, intro, experience, interest, closing, ... }`
- **Response:** `{ coverLetter: { id, ...fields... } }`
- **Purpose:** Create a new cover letter.

### Get All Cover Letters
- **GET** `/api/cover-letters`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ coverLetters: [ { id, name, created, job, status, ... }, ... ] }`
- **Purpose:** List all cover letters for the user.

### Get Single Cover Letter
- **GET** `/api/cover-letters/:clId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ coverLetter: { ...fields... } }`
- **Purpose:** Fetch a specific cover letter.

### Update Cover Letter
- **PUT** `/api/cover-letters/:clId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ ...fields to update... }`
- **Response:** `{ coverLetter: { ...updated fields... } }`
- **Purpose:** Update an existing cover letter.

### Delete Cover Letter
- **DELETE** `/api/cover-letters/:clId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true }`
- **Purpose:** Delete a cover letter.

### Download Cover Letter
- **GET** `/api/cover-letters/:clId/download?format=pdf|docx`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Purpose:** Download a cover letter.

---

## Mega CV

### Create Mega CV
- **POST** `/api/mega-cv`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ jobDescription, selectedSections: [sectionIds], ... }`
- **Response:** `{ megaCV: { id, ...fields... } }`
- **Purpose:** Generate a Mega CV by consolidating content from previous CVs.

### Get Mega CVs
- **GET** `/api/mega-cv`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ megaCVs: [ { id, created, job, status, ... }, ... ] }`
- **Purpose:** List all Mega CVs for the user.

### Get Optimization Score
- **POST** `/api/mega-cv/score`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ jobDescription, selectedSections: [sectionIds] }`
- **Response:** `{ score: number, suggestions: [string], keywords: [string] }`
- **Purpose:** Get optimization score and suggestions for a Mega CV.

---

## Job Applications

### Create Application
- **POST** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ jobTitle, company, cvId, coverLetterId, dateApplied, status }`
- **Response:** `{ application: { id, ...fields... } }`
- **Purpose:** Track a new job application.

### Get All Applications
- **GET** `/api/applications`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ applications: [ { id, job, company, date, status, ... }, ... ] }`
- **Purpose:** List all job applications for the user.

### Update Application
- **PUT** `/api/applications/:appId`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ ...fields to update... }`
- **Response:** `{ application: { ...updated fields... } }`
- **Purpose:** Update an application (e.g., status, notes).

### Delete Application
- **DELETE** `/api/applications/:appId`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ success: true }`
- **Purpose:** Delete an application.

---

## Subscription & Billing

### Get Subscription Info
- **GET** `/api/subscription`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ plan, renewal, status, paymentMethod, billingHistory: [ ... ] }`
- **Purpose:** Get current subscription and billing info.

### Update Subscription
- **POST** `/api/subscription/update`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ plan: string }`
- **Response:** `{ plan, status }`
- **Purpose:** Upgrade or downgrade subscription.

### Cancel Subscription
- **POST** `/api/subscription/cancel`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** `{ status: 'cancelled' }`
- **Purpose:** Cancel the user's subscription.

### Update Payment Method
- **POST** `/api/subscription/payment-method`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ paymentMethod: { ... } }`
- **Response:** `{ paymentMethod }`
- **Purpose:** Update the user's payment method.

---

## Other/Optional

### LinkedIn Import
- **POST** `/api/integrations/linkedin/import`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ linkedInProfileUrl }`
- **Response:** `{ importedData: { ... } }`
- **Purpose:** Import data from LinkedIn profile.

### Export Document
- **POST** `/api/export`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** `{ type: 'cv'|'coverLetter'|'megaCV', id, format: 'pdf'|'docx' }`
- **Response:** `application/pdf` or `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
- **Purpose:** Export any document in the desired format.

---

## Summary Table

| Endpoint | Method | Purpose |
|----------|--------|---------|
| /api/auth/register | POST | Register new user |
| /api/auth/login | POST | Login user |
| /api/auth/me | GET | Get current user |
| /api/user/profile | PUT | Update user profile |
| /api/cvs | GET/POST | List/Create CVs |
| /api/cvs/:cvId | GET/PUT/DELETE | Get/Update/Delete CV |
| /api/cvs/:cvId/duplicate | POST | Duplicate CV |
| /api/cvs/:cvId/download | GET | Download CV |
| /api/cover-letters | GET/POST | List/Create Cover Letters |
| /api/cover-letters/:clId | GET/PUT/DELETE | Get/Update/Delete Cover Letter |
| /api/cover-letters/:clId/download | GET | Download Cover Letter |
| /api/mega-cv | GET/POST | List/Create Mega CVs |
| /api/mega-cv/score | POST | Get optimization score |
| /api/applications | GET/POST | List/Create Applications |
| /api/applications/:appId | PUT/DELETE | Update/Delete Application |
| /api/subscription | GET | Get subscription info |
| /api/subscription/update | POST | Update subscription plan |
| /api/subscription/cancel | POST | Cancel subscription |
| /api/subscription/payment-method | POST | Update payment method |
| /api/integrations/linkedin/import | POST | Import LinkedIn data |
| /api/export | POST | Export document | 