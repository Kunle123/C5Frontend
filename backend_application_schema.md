# Backend Application Schema for Grouped CV & Cover Letter

This document describes the recommended schema and API endpoints for grouping a CV and cover letter for a single job role (application).

---

## 1. SQL Table Schema

```sql
CREATE TABLE applications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    role_title VARCHAR(255),
    job_description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    cv_docx_path VARCHAR(255),           -- or use a blob/file reference
    cover_letter_docx_path VARCHAR(255)  -- or use a blob/file reference
);
```

---

## 2. ORM Example (Python SQLAlchemy)

```python
class Application(Base):
    __tablename__ = 'applications'
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'))
    role_title = Column(String(255))
    job_description = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    cv_docx_path = Column(String(255))
    cover_letter_docx_path = Column(String(255))
```

---

## 3. API Endpoints

### a. Create Application

```
POST /api/applications
Content-Type: multipart/form-data

Fields:
- job_description: string
- role_title: string (optional, can be parsed from job_description)
- cv_docx: file
- cover_letter_docx: file
```

### b. List Applications

```
GET /api/applications

Response:
[
  {
    "id": 1,
    "role_title": "Project Manager: Microsoft",
    "job_description": "...",
    "created_at": "2024-06-25T12:39:00Z",
    "cv_docx_url": "/api/applications/1/cv",
    "cover_letter_docx_url": "/api/applications/1/cover-letter"
  },
  ...
]
```

### c. Download CV or Cover Letter

```
GET /api/applications/{id}/cv
GET /api/applications/{id}/cover-letter
```

---

## 4. Role Title Extraction (Python Example)

```python
def extract_role_title(job_description):
    # Simple: take first line or use regex to find a title/company
    lines = job_description.splitlines()
    if lines:
        return lines[0][:100]  # Truncate for safety
    return "Untitled Role"
```

---

## 5. Migration Notes
- If you have existing CVs and cover letters, group them by user and job description or creation time to populate the new `applications` table.

---

## 6. Summary Table

| Table/Model     | Fields                                                                 |
|-----------------|-----------------------------------------------------------------------|
| applications    | id, user_id, role_title, job_description, created_at, cv_docx_path, cover_letter_docx_path |