# Frontend Presentation Guide for Normalized CV Data (Career Ark)

## 1. API Endpoints

- **Base URL:**  `/api/career-ark/profiles/{profile_id}/`
- **Sections:**
  - Work Experience: `work_experience`
  - Education: `education`
  - Skills: `skills`
  - Projects: `projects`
  - Certifications: `certifications`

**Example:**
`GET /api/career-ark/profiles/{profile_id}/work_experience`

---

## 2. Data Structure

### Work Experience
```json
[
  {
    "id": "uuid",
    "company": "Company Name",
    "title": "Job Title",
    "start_date": "MMM YYYY",
    "end_date": "MMM YYYY" or "Present",
    "description": "Full job description",
    "order_index": 0
  },
  ...
]
```
- **Sort by `end_date` descending** (treat `"Present"` as most recent).
- **Display:**
  - **Company** (bold or heading)
  - **Title** (subheading)
  - **Dates** (e.g., "Jan 2021 – Present")
  - **Description** (multi-line, preserve newlines/bullets if present)

### Education
```json
[
  {
    "id": "uuid",
    "institution": "University Name",
    "degree": "Degree Title",
    "field": "Field of Study",
    "start_date": "YYYY",
    "end_date": "YYYY",
    "description": "Details",
    "order_index": 0
  }
]
```
- **Display:**
  - **Institution** (bold)
  - **Degree** (subheading)
  - **Field** (optional)
  - **Dates**
  - **Description** (optional)

### Skills
```json
[
  {
    "id": "uuid",
    "skill": "Skill Name"
  }
]
```
- **Display as a tag cloud, comma-separated list, or grid of badges.**

### Projects
```json
[
  {
    "id": "uuid",
    "name": "Project Name",
    "description": "Project Description",
    "order_index": 0
  }
]
```
- **Display:**
  - **Name** (bold)
  - **Description** (paragraph or bullet list)

### Certifications
```json
[
  {
    "id": "uuid",
    "name": "Certification Name",
    "issuer": "Issuer Name",
    "year": "YYYY",
    "order_index": 0
  }
]
```
- **Display:**
  - **Name** (bold)
  - **Issuer** (optional, if present)
  - **Year** (optional, if present)

---

## 3. UI/UX Best Practices

- **Section Headings:** Use clear section headings (e.g., "Work Experience", "Education").
- **Empty States:** If a section is empty, show a friendly message (e.g., "No skills found. Add your skills!").
- **Sorting:**
  - Work experience: sort by `end_date` descending, treat `"Present"` as most recent.
  - Education: sort by `end_date` descending.
- **Descriptions:**
  - Preserve line breaks and bullet points in descriptions.
  - If descriptions are long, consider truncating with a "Show more" option.

---

## 4. Example (React/JS) Sorting for Work Experience

```js
const workExp = await fetch(`/api/career-ark/profiles/${profileId}/work_experience`).then(r => r.json());
const sorted = workExp.sort((a, b) => {
  if (a.end_date === "Present") return -1;
  if (b.end_date === "Present") return 1;
  // Parse dates, fallback to 0 if invalid
  const parse = d => Date.parse(d + '-01') || 0;
  return parse(b.end_date) - parse(a.end_date);
});
```

---

## 5. Error Handling

- If an API call fails, show a user-friendly error message and suggest retrying.
- If a section is empty, encourage the user to add data.

---

## 6. Example Section Layout

```jsx
// Work Experience Section Example (React)
<section>
  <h2>Work Experience</h2>
  {workExp.length === 0 ? (
    <p>No work experience found.</p>
  ) : (
    workExp.map(exp => (
      <div key={exp.id} className="work-exp-entry">
        <h3>{exp.company}</h3>
        <h4>{exp.title}</h4>
        <span>{exp.start_date} – {exp.end_date}</span>
        <p style={{whiteSpace: 'pre-line'}}>{exp.description}</p>
      </div>
    ))
  )}
</section>
```

---

## 7. Summary for Frontend
- Use the normalized endpoints for all CRUD and display operations.
- Always sort and present data as described above.
- Handle empty states and errors gracefully.
- Use section headings and preserve formatting for descriptions. 