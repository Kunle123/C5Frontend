# Career Ark Frontend Data Display Guide

## 1. Current Status
- **Backend extraction and normalization are working.**
- **All CV data (work experience, education, skills, certifications, etc.) is present in the database for users who have uploaded a CV.**
- **However, none of this data is currently displayed on the Career Ark page in the frontend.**

## 2. Endpoints to Retrieve Each Section
For a given user, first fetch their profile ID:

- **Get Profile:**
  - `GET /api/user/profile`
  - Response: `{ id: <profile_id>, ... }`

Then, use the profile ID to fetch each section:

- **Work Experience:**
  - `GET /api/career-ark/profiles/{profile_id}/work_experience`
- **Education:**
  - `GET /api/career-ark/profiles/{profile_id}/education`
- **Skills:**
  - `GET /api/career-ark/profiles/{profile_id}/skills`
- **Projects:**
  - `GET /api/career-ark/profiles/{profile_id}/projects`
- **Certifications:**
  - `GET /api/career-ark/profiles/{profile_id}/certifications`

All endpoints require a valid Bearer token in the `Authorization` header.

## 3. Best Practices for Displaying Data
- **Section Headings:** Use clear, bold headings for each section (e.g., "Work Experience").
- **Sorting:**
  - Work experience and education: sort by `end_date` descending, treating "Present" as most recent.
- **Descriptions:**
  - Preserve line breaks and bullet points in descriptions (use `white-space: pre-line` in CSS).
  - For long descriptions, consider a "Show more"/"Show less" toggle.
- **Skills:**
  - Display as a tag cloud, badge grid, or comma-separated list.
- **Projects/Certifications:**
  - Show name/title, description, and any relevant details (issuer, year, etc.).

## 4. Handling Empty States Elegantly
- **Do NOT show a blank page or just a heading.**
- For each section, if the data array is empty, show a friendly, visually appealing message:
  - Example: `No work experience found. Upload your CV to get started!`
  - Use icons, soft colors, or illustrations to make empty states inviting.
  - Optionally, provide a call-to-action button (e.g., "Upload CV" or "Add Work Experience").
- **Example (React/JS):**

```jsx
<section>
  <h2>Work Experience</h2>
  {workExp.length === 0 ? (
    <div className="empty-state">
      <img src="/empty-work.svg" alt="No work experience" style={{width: 120}} />
      <p>No work experience found. <a href="/upload">Upload your CV</a> to get started!</p>
    </div>
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

## 5. Summary for Frontend Team
- **All normalized CV data is available via the endpoints above.**
- **No data is currently shown on the Career Ark page—implement these endpoints to display it.**
- **Handle empty states with friendly, elegant UI.**
- **If you need help with API integration or UI/UX, ask the backend team for support.** 