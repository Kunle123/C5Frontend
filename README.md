# C5 Frontend – Session-Based CV Workflow Integration

## Overview
This project integrates a session-based, function-aware CV workflow using modern React and TypeScript best practices. The workflow is powered by custom React hooks and strict TypeScript types generated from backend JSON schemas.

---

## Endpoints & Workflow

### 1. Start Session
- **Endpoint:** `/api/v1/cv/session/start`
- **Request:** `{ user_id }`
- **Response:** `{ session_id, status, message }`

### 2. CV Preview
- **Endpoint:** `/api/v1/cv/preview`
- **Request:** `{ session_id, jobDescription }`
- **Response:** `{ job_analysis, profile_match, keyword_coverage, ... }`

### 3. CV Generation
- **Endpoint:** `/api/v1/cv/generate`
- **Request:** `{ session_id, jobDescription }`
- **Response:** `{ cv, cover_letter, ... }`

### 4. CV Update
- **Endpoint:** `/api/v1/cv/update`
- **Request:** `{ session_id, currentCV, updateRequest, jobDescription? }`
- **Response:** `CV object (same as /cv/generate)`

### 5. End Session
- **Endpoint:** `/api/v1/cv/session/end`
- **Request:** `{ session_id }`

---

## TypeScript Types
All request and response types are defined in [`src/types/cvWorkflow.ts`](frontend/src/types/cvWorkflow.ts).

---

## Custom React Hooks

- [`useCVSession`](frontend/src/hooks/useCVSession.ts): Start/end session, manage session state.
- [`useCVPreview`](frontend/src/hooks/useCVPreview.ts): Fetch job analysis and profile match.
- [`useCVGenerate`](frontend/src/hooks/useCVGenerate.ts): Generate CV and cover letter.
- [`useCVUpdate`](frontend/src/hooks/useCVUpdate.ts): Update CV with user instructions.

Each hook manages loading and error state, and returns the relevant data and functions.

---

## Quickstart Example

```tsx
import { useCVSession } from './src/hooks/useCVSession';
import { useCVPreview } from './src/hooks/useCVPreview';
import { useCVGenerate } from './src/hooks/useCVGenerate';
import { useCVUpdate } from './src/hooks/useCVUpdate';

function ApplyFlow({ userId, userToken }: { userId: string; userToken: string }) {
  const { sessionId, startSession, endSession, loading: sessionLoading } = useCVSession();
  const { preview, getPreview, loading: previewLoading } = useCVPreview();
  const { cv, coverLetter, generateCV, loading: generateLoading } = useCVGenerate();
  const { updatedCV, updateCV, loading: updateLoading } = useCVUpdate();

  // Example usage:
  // 1. Start session on mount
  // 2. Call getPreview, generateCV, updateCV as needed
}
```

---

## Best Practices
- Always use the `session_id` for all CV-related requests after session start.
- Never send PII (name, email) to OpenAI; the backend uses placeholders.
- Handle errors: If you get a 404 or session expired, prompt the user to start a new session.
- Show loading indicators for long-running requests.
- Display evidence fields from the backend for transparency.

---

## UI/UX
- The apply flow UI is based on the latest Style Zen design, with all panels, steps, and modals matching the Figma/Zen spec.
- All state and API data is managed via the custom hooks above.

---

## Questions?
If you need to extend the workflow, add new endpoints, or want OpenAPI/Swagger docs, contact the dev team or see the hooks/types for extension points.
