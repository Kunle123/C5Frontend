# CandidateV Arc: Database Schema Design

## 1. Overview

This document proposes a database schema for the CandidateV "Arc" feature. The schema is designed to store structured career intelligence extracted from user CVs and refined by users. It prioritizes flexibility to accommodate diverse career paths and efficiency for querying during job matching and application generation. A document-based model (suitable for NoSQL like MongoDB or relational DBs with JSONB like PostgreSQL) is outlined.

## 2. Core Data Model (User-Centric)

Each user will have a main document or record containing their complete Arc data, potentially broken down into sub-documents or related collections/tables for organization.

**UserArc Document/Record:**

*   `userId`: ObjectId / UUID (Primary Key, links to User Service)
*   `personalInfo`: Object (Details below)
*   `summaryObjective`: Object (Contains various summary versions, potentially tagged by target role type)
*   `workExperience`: Array of Objects (Details below)
*   `education`: Array of Objects (Details below)
*   `skills`: Array of Objects (Details below)
*   `projects`: Array of Objects (Details below)
*   `certifications`: Array of Objects (Details below)
*   `metadata`: Object (e.g., `createdAt`, `lastUpdatedAt`, `lastCvProcessedAt`)

## 3. Sub-Document Structures

### 3.1 `personalInfo`

```json
{
  "fullName": "String",
  "email": "String",
  "phone": "String",
  "location": {
    "city": "String",
    "country": "String"
  },
  "links": [
    { "type": "LinkedIn", "url": "String" },
    { "type": "Portfolio", "url": "String" },
    { "type": "GitHub", "url": "String" },
    { "type": "Other", "url": "String", "label": "String" }
  ]
}
```

### 3.2 `summaryObjective`

```json
{
  "defaultSummary": "String",
  "customSummaries": [
    {
      "id": "ObjectId/UUID",
      "tag": "String", // e.g., "Software Engineer", "Project Manager"
      "content": "String",
      "metadata": { "createdAt": "Timestamp", "source": "user_generated/ai_generated" }
    }
  ]
}
```

### 3.3 `workExperience` (Array Item)

```json
{
  "id": "ObjectId/UUID",
  "companyName": "String",
  "positionTitle": "String",
  "location": {
    "city": "String",
    "country": "String"
  },
  "startDate": "Date", // ISO 8601 format
  "endDate": "Date", // ISO 8601 format, null if current
  "isCurrent": "Boolean",
  "responsibilities": [
    { "id": "ObjectId/UUID", "description": "String", "metadata": { "source": "extracted/user_added" } }
  ],
  "achievements": [
    {
      "id": "ObjectId/UUID",
      "description": "String", // e.g., "Increased sales by 15% in Q3 by implementing X strategy."
      "metrics": [ { "metricName": "Sales Increase", "value": 15, "unit": "%" } ], // Optional structured metrics
      "linkedSkillIds": ["ObjectId/UUID", ...], // Link to skills used
      "metadata": { "source": "extracted/user_added" }
    }
  ],
  "technologiesUsed": ["String", ...], // Can also link to skill IDs
  "metadata": { "createdAt": "Timestamp", "lastUpdatedAt": "Timestamp", "source": "extracted/user_added" }
}
```

### 3.4 `education` (Array Item)

```json
{
  "id": "ObjectId/UUID",
  "institutionName": "String",
  "degree": "String", // e.g., "Bachelor of Science"
  "fieldOfStudy": "String", // e.g., "Computer Science"
  "startDate": "Date",
  "endDate": "Date",
  "gpa": "Float", // Optional
  "relevantCoursework": ["String", ...],
  "activities": ["String", ...],
  "metadata": { "createdAt": "Timestamp", "lastUpdatedAt": "Timestamp", "source": "extracted/user_added" }
}
```

### 3.5 `skills` (Array Item)

```json
{
  "id": "ObjectId/UUID",
  "skillName": "String", // e.g., "Python", "Project Management", "Spanish"
  "category": "String", // e.g., "Programming Language", "Methodology", "Soft Skill", "Language"
  "proficiency": "String", // e.g., "Advanced", "Intermediate", "Fluent", "Native"
  "yearsExperience": "Integer", // Optional
  "context": [
    { "type": "work", "refId": "ObjectId/UUID" }, // Link to workExperience item ID
    { "type": "project", "refId": "ObjectId/UUID" } // Link to project item ID
  ],
  "metadata": { "createdAt": "Timestamp", "lastUpdatedAt": "Timestamp", "source": "extracted/user_added" }
}
```

### 3.6 `projects` (Array Item)

```json
{
  "id": "ObjectId/UUID",
  "projectName": "String",
  "description": "String",
  "role": "String", // Optional, e.g., "Lead Developer"
  "startDate": "Date", // Optional
  "endDate": "Date", // Optional
  "technologiesUsed": ["String", ...], // Can also link to skill IDs
  "link": "String", // Optional URL to project/repo
  "achievements": [
    { "id": "ObjectId/UUID", "description": "String", "linkedSkillIds": ["ObjectId/UUID", ...] }
  ],
  "metadata": { "createdAt": "Timestamp", "lastUpdatedAt": "Timestamp", "source": "extracted/user_added" }
}
```

### 3.7 `certifications` (Array Item)

```json
{
  "id": "ObjectId/UUID",
  "certificationName": "String",
  "issuingOrganization": "String",
  "issueDate": "Date",
  "expirationDate": "Date", // Optional
  "credentialId": "String", // Optional
  "credentialUrl": "String", // Optional
  "metadata": { "createdAt": "Timestamp", "lastUpdatedAt": "Timestamp", "source": "extracted/user_added" }
}
```

## 4. Indexing Considerations

To ensure efficient querying, especially during job matching:

*   Index `userId` heavily.
*   Index fields frequently used for filtering or searching within arrays, such as:
    *   `workExperience.companyName`, `workExperience.positionTitle`
    *   `education.institutionName`, `education.degree`, `education.fieldOfStudy`
    *   `skills.skillName`, `skills.category`
    *   `projects.projectName`
*   Consider text indexing on description fields (`responsibilities.description`, `achievements.description`, `projects.description`) if keyword searching within the Arc is required.

## 5. Rationale

*   **Flexibility**: The use of arrays and objects allows for varying levels of detail and easy addition of new fields or sections.
*   **Queryability**: Structured fields enable targeted queries (e.g., "find all work experiences related to 'Python' skills").
*   **Context**: Linking achievements and skills to specific work experiences or projects provides valuable context for the AI during generation.
*   **Metadata**: Tracking the source and timestamps helps manage data provenance and allows for features like showing users what was recently added or extracted.
