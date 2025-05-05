# CandidateV Arc: API Endpoint Specifications

## 1. Overview

This document defines the backend API endpoints required to support the CandidateV "Arc" feature. These endpoints facilitate user interactions for managing their career intelligence (Arc), processing job descriptions, and generating bespoke application materials. Endpoints interacting with complex analysis or generation tasks leverage the AI Integration Layer, which communicates with OpenAI GPT models.

**Authentication**: All endpoints listed require user authentication (e.g., via JWT token in the Authorization header) unless otherwise specified.

## 2. CV Processing Endpoints

### 2.1 Upload CV

*   **Method**: `POST`
*   **Path**: `/api/arc/cv`
*   **Description**: Accepts a user-uploaded CV file (PDF, DOCX), validates it, saves it temporarily, and triggers the asynchronous CV extraction pipeline.
*   **Request**: `multipart/form-data` containing the CV file.
*   **Response**:
    *   `202 Accepted`: If validation passes and processing is initiated.
        ```json
        {
          "message": "CV received. Processing started.",
          "taskId": "unique_task_identifier"
        }
        ```
    *   `400 Bad Request`: Invalid file type, size exceeded, etc.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: Indirect. Triggers the CV Processing Service, which uses the AI Integration Layer (GPT) for data extraction (as defined in the pipeline document).

### 2.2 Get CV Processing Status

*   **Method**: `GET`
*   **Path**: `/api/arc/cv/status/{taskId}`
*   **Description**: Allows the frontend to poll for the status of a specific CV processing task.
*   **Request Params**: `taskId` (from the upload response).
*   **Response**:
    *   `200 OK`:
        ```json
        {
          "taskId": "unique_task_identifier",
          "status": "pending | processing | completed | failed",
          "message": "Optional status message, e.g., error details on failure.",
          "extractedDataSummary": { // Optional summary on completion
            "workExperienceCount": 3,
            "skillsFound": 15
          }
        }
        ```
    *   `404 Not Found`: Task ID does not exist.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None directly. Reports status of the background task involving AI.

## 3. Arc Data Management Endpoints

### 3.1 Get User Arc Data

*   **Method**: `GET`
*   **Path**: `/api/arc/data`
*   **Description**: Retrieves the user's complete structured career intelligence data stored in the Arc.
*   **Request**: None.
*   **Response**:
    *   `200 OK`: JSON object containing the user's Arc data, matching the defined database schema.
    *   `404 Not Found`: User has no Arc data yet.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None.

### 3.2 Update User Arc Data Section

*   **Method**: `PUT`
*   **Path**: `/api/arc/data/{section}` (e.g., `/api/arc/data/workExperience`, `/api/arc/data/skills`)
*   **Description**: Allows the user to update a specific section (e.g., a single work experience entry, a skill) within their Arc data after reviewing or refining it.
*   **Request Params**: `section` (e.g., `workExperience`, `skills`, `education`).
*   **Request Body**: JSON object containing the specific item ID and the updated fields for that item within the section.
    ```json
    // Example for updating a work experience item
    {
      "itemId": "work_experience_item_id",
      "updates": {
        "positionTitle": "Senior Software Engineer",
        "achievements": [ /* updated achievements array */ ]
      }
    }
    ```
*   **Response**:
    *   `200 OK`: JSON object confirming the update.
        ```json
        { "message": "Arc data updated successfully.", "updatedItemId": "work_experience_item_id" }
        ```
    *   `400 Bad Request`: Invalid input data or schema mismatch.
    *   `404 Not Found`: Item ID not found within the specified section.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None directly. Stores user refinements.

### 3.3 Add Item to Arc Data Section

*   **Method**: `POST`
*   **Path**: `/api/arc/data/{section}` (e.g., `/api/arc/data/projects`)
*   **Description**: Allows the user to manually add a new item (e.g., a project, a skill, a certification) to a specific section in their Arc.
*   **Request Params**: `section` (e.g., `projects`, `skills`).
*   **Request Body**: JSON object representing the new item, matching the schema for that section.
*   **Response**:
    *   `201 Created`: JSON object confirming creation and returning the new item's ID.
        ```json
        { "message": "Item added to Arc successfully.", "newItemId": "new_project_item_id" }
        ```
    *   `400 Bad Request`: Invalid input data or schema mismatch.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None directly. Stores user-added data.

## 4. Job Analysis Endpoints

### 4.1 Submit Job Description

*   **Method**: `POST`
*   **Path**: `/api/arc/analyze-job`
*   **Description**: Accepts job description text or a URL, validates it, and triggers an asynchronous task to analyze requirements using AI.
*   **Request Body**:
    ```json
    {
      "jobDescriptionText": "String", // Required if URL not provided
      "jobUrl": "String" // Optional, if provided, backend attempts to scrape
    }
    ```
*   **Response**:
    *   `202 Accepted`: If validation passes and analysis is initiated.
        ```json
        {
          "message": "Job description received. Analysis started.",
          "taskId": "unique_analysis_task_identifier"
        }
        ```
    *   `400 Bad Request`: Missing text and URL, invalid URL, etc.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: Indirect. Triggers the Job Analysis Service, which uses the AI Integration Layer (GPT) to extract key requirements, skills, responsibilities, etc.

### 4.2 Get Job Analysis Status/Results

*   **Method**: `GET`
*   **Path**: `/api/arc/analyze-job/status/{taskId}`
*   **Description**: Allows the frontend to poll for the status and results of a specific job analysis task.
*   **Request Params**: `taskId` (from the submit response).
*   **Response**:
    *   `200 OK`:
        ```json
        {
          "taskId": "unique_analysis_task_identifier",
          "status": "pending | processing | completed | failed",
          "message": "Optional status message.",
          "analysisResults": { // Present on completion
            "jobTitle": "String",
            "companyName": "String",
            "keySkills": ["String", ...],
            "requiredExperienceYears": "Integer",
            "responsibilitiesSummary": "String",
            "extractedKeywords": ["String", ...]
            // ... other relevant extracted fields
          }
        }
        ```
    *   `404 Not Found`: Task ID does not exist.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None directly. Returns results obtained via AI in the background task.

## 5. Application Generation Endpoints

### 5.1 Generate Application

*   **Method**: `POST`
*   **Path**: `/api/arc/generate`
*   **Description**: Triggers the asynchronous generation of a tailored CV and/or cover letter based on the user's Arc data and a previously analyzed job description.
*   **Request Body**:
    ```json
    {
      "jobAnalysisTaskId": "unique_analysis_task_identifier", // Links to the analyzed job
      "generateCv": "Boolean", // Default true
      "generateCoverLetter": "Boolean", // Default true
      "outputFormat": "PDF", // e.g., PDF, DOCX (initially PDF)
      "templatePreference": "String" // Optional: User preference for CV style/template
    }
    ```
*   **Response**:
    *   `202 Accepted`: If validation passes and generation is initiated.
        ```json
        {
          "message": "Application generation started.",
          "generationTaskId": "unique_generation_task_identifier"
        }
        ```
    *   `400 Bad Request`: Invalid jobAnalysisTaskId, etc.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: Indirect. Triggers the Application Generation Service. This service retrieves Arc data and job analysis results, prepares detailed prompts incorporating relevant user data and job requirements, and uses the AI Integration Layer (GPT) extensively to draft the CV content (selecting relevant achievements/responsibilities) and the cover letter.

### 5.2 Get Generation Status/Download Link

*   **Method**: `GET`
*   **Path**: `/api/arc/generate/status/{generationTaskId}`
*   **Description**: Allows the frontend to poll for the status of the application generation task and retrieve download links when complete.
*   **Request Params**: `generationTaskId` (from the generate response).
*   **Response**:
    *   `200 OK`:
        ```json
        {
          "generationTaskId": "unique_generation_task_identifier",
          "status": "pending | processing | completed | failed",
          "message": "Optional status message.",
          "downloadLinks": { // Present on completion
            "cv": "secure_download_url_for_cv.pdf", // If requested and successful
            "coverLetter": "secure_download_url_for_cl.pdf" // If requested and successful
          }
        }
        ```
    *   `404 Not Found`: Task ID does not exist.
    *   `401 Unauthorized`: Authentication failed.
*   **AI Interaction**: None directly. Returns results produced via AI in the background task.

## 6. AI Integration Layer (Internal - Not a User-Facing API)

*   **Function**: Centralizes all communication with the OpenAI API.
*   **Responsibilities**:
    *   Receives requests from other backend services (CV Processing, Job Analysis, Application Generation) with context and instructions.
    *   Constructs optimized prompts based on the task.
    *   Manages API key security.
    *   Makes calls to the appropriate GPT model endpoint.
    *   Handles rate limiting, retries, and error handling for API calls.
    *   Parses and validates responses from OpenAI.
    *   Returns structured data or generated text to the calling service.
    *   Potentially implements caching for common requests or prompt fragments to manage costs.
