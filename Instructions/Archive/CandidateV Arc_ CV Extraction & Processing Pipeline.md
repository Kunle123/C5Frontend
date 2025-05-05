# CandidateV Arc: CV Extraction & Processing Pipeline

## 1. Overview

This document defines the pipeline for processing user-uploaded CVs (e.g., PDF, DOCX) to extract structured career intelligence and populate the user's Arc database. The process emphasizes security (no long-term storage of original files), asynchronous processing, and leveraging the AI Integration Layer (using OpenAI GPT) for data extraction.

## 2. Pipeline Stages

1.  **Upload Handling & Initiation**:
    *   **Trigger**: User uploads a CV file via the CandidateV frontend.
    *   **API Endpoint**: A dedicated backend endpoint (e.g., `/api/arc/upload-cv`) receives the file.
    *   **Validation**: The endpoint validates the file type (PDF, DOCX allowed) and size limits.
    *   **Temporary Storage**: The validated file is saved securely to temporary storage (e.g., a dedicated S3 bucket with strict lifecycle policies or a secure local volume).
    *   **Task Queuing**: A task is added to an asynchronous task queue (e.g., Celery, Redis Queue) with the user ID and the temporary file path/identifier. This immediately returns a response to the user (e.g., "CV received, processing started...").

2.  **Asynchronous Processing (Worker Task)**:
    *   A worker process picks up the task from the queue.

3.  **File Parsing**: 
    *   **Library**: Use appropriate libraries based on file type (e.g., `pypdf` for PDF, `python-docx` for DOCX).
    *   **Action**: Extract raw text content from the document. Attempt to preserve basic structure if possible (e.g., section breaks), although the primary reliance is on AI for semantic understanding.
    *   **Error Handling**: Handle parsing errors gracefully (e.g., corrupted files, password-protected PDFs).

4.  **Data Preparation for AI**: 
    *   **Chunking**: If the extracted text exceeds the token limit of the target GPT model, implement a strategy to split the text into meaningful chunks (e.g., by potential sections, or overlapping chunks) while maintaining context.
    *   **Formatting**: Prepare the text chunk(s) to be sent to the AI Integration Layer.

5.  **AI-Powered Extraction**: 
    *   **Service Interaction**: The worker task sends the prepared text chunk(s) to the AI Integration Layer, requesting extraction based on the defined Arc database schema (PersonalInfo, WorkExperience, Education, Skills, etc.).
    *   **Prompt Engineering**: The AI Integration Layer uses carefully crafted prompts instructing the GPT model to identify and structure the relevant information as JSON objects matching the schema. Multiple prompts/calls might be needed per chunk or per data type (e.g., one prompt focused on work experience, another on skills).
    *   **Model Selection**: Choose appropriate GPT model(s) balancing cost, speed, and accuracy (e.g., GPT-4 for complex extraction, potentially GPT-3.5 for simpler tasks).

6.  **Response Parsing & Validation**: 
    *   **Receive Data**: The AI Integration Layer receives the structured JSON response(s) from the GPT model.
    *   **Consolidation**: If chunking was used, consolidate the extracted data from multiple responses.
    *   **Validation**: Validate the received JSON against the expected Arc database schema. Check data types, required fields, and basic consistency (e.g., end dates after start dates).
    *   **Error Handling**: Handle incomplete or malformed responses from the AI. Implement retry logic or flag data for user review if extraction is ambiguous or fails.
    *   **Return Data**: The AI Integration Layer returns the validated, structured data (or error information) to the worker task.

7.  **Data Storage**: 
    *   **Service Interaction**: The worker task sends the validated structured data to the Arc Database Service.
    *   **Action**: The Arc Database Service merges this new data with any existing data for the user in the Arc database. Implement logic to handle potential duplicates or updates (e.g., based on company name and date range for work experience). Mark data source as "extracted".

8.  **Cleanup**: 
    *   **Action**: Once data is successfully stored (or processing fails definitively), the worker task **must** securely delete the original CV file from temporary storage.

9.  **User Notification**: 
    *   **Mechanism**: Update the task status. The frontend can poll for status updates or receive a notification via WebSockets.
    *   **Success**: Notify the user (e.g., "Your CV has been processed! Review your updated Arc profile.") and potentially highlight newly added sections.
    *   **Failure**: Notify the user of the failure and provide guidance (e.g., "Could not process CV. Please try uploading a different file or format."). Log detailed errors internally.

## 3. Key Technologies & Considerations

*   **Parsing Libraries**: `pypdf`, `python-docx` (or alternatives).
*   **Task Queue**: Celery, RQ, RabbitMQ, AWS SQS.
*   **AI Interaction**: Direct OpenAI API calls managed via a dedicated internal layer.
*   **Security**: Strict controls on temporary file storage access and ensure prompt deletion. All data in transit should use TLS/SSL.
*   **Scalability**: Design workers and the AI Integration Layer to handle concurrent processing tasks.
*   **Cost**: Monitor OpenAI API usage closely. Optimize prompts and consider model choices.
*   **Idempotency**: Design tasks to be idempotent where possible (running the same task twice doesn't cause incorrect data duplication).
*   **User Feedback**: Allow users to easily correct or augment the extracted data within their Arc profile.
