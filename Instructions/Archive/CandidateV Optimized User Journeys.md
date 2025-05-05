# CandidateV Optimized User Journeys

## Design Principles

Based on user requirements and UX best practices, the following principles guide the design:

1.  **Streamlined Core Task**: Prioritize the speed and ease of generating an optimized CV and cover letter from a job description.
2.  **Clear Entry Points**: Provide distinct starting points for users with existing CVs versus new users.
3.  **Guided Interaction**: Offer clear instructions, feedback (like match scores), and optional steps for enhancement.
4.  **Flexibility**: Accommodate users who want to upload CVs, build profiles from scratch, or directly optimize existing data.
5.  **Efficiency**: Minimize clicks, simplify navigation, and automate where possible.
6.  **Intelligent Consolidation**: Ensure the backend logic for the Mega CV handles potential repetition effectively.

## User Journey 1: Optimize for Application (Existing User / Profile Built)

**Goal**: Quickly generate an optimized CV and cover letter for a specific job application using existing profile/CV data.

**Assumptions**: User has logged in and has at least one CV uploaded or a profile built.

**Steps:**

1.  **Dashboard / Home Screen**:
    *   **Primary CTA**: Prominent button: "Optimize for New Application" or "Get Matched CV".
    *   **Secondary Options**: "Manage Profile/CVs", "View Application History".
    *   *Design Note*: Keep the dashboard clean, focusing the user on the primary task.

2.  **Input Job Details**:
    *   **Interface**: Large text area for pasting job description OR field for job URL.
    *   **Guidance**: Clear instruction: "Paste the full job description or URL below."
    *   **CTA**: Button: "Analyze Job & Match".
    *   *(Optional)* **Base CV Selection**: If multiple distinct CV profiles exist, allow user to select which one to use as a base, or default to the consolidated "Mega CV" profile.

3.  **Initial Match & Keyword Analysis**:
    *   **Display**: Show an initial match score (e.g., "Your profile is a 75% match for this role").
    *   **Keyword Feedback**: List key skills/keywords from the job description. Indicate which are well-represented in the user's profile/CV and which have gaps.
    *   **CTA 1 (Primary)**: "Optimize Now".
    *   **CTA 2 (Optional)**: "Enhance Details" or "Add Missing Info".
    *   *Design Note*: Use visual cues (color-coding, icons) to quickly show keyword matches and gaps.

4.  **(Optional) Enhance Details**:
    *   **Interface**: Focus on the identified keyword gaps. For each gap, provide context from the job description and prompt the user to add relevant experience, skills, or examples.
    *   **Guidance**: "Add details for keywords like [Keyword 1], [Keyword 2] to improve your match."
    *   **Input**: Simple text fields or guided prompts.
    *   **CTA**: "Save Enhancements & Optimize".
    *   *Design Note*: This step should feel optional and targeted, not like rebuilding the CV.

5.  **Optimization & Generation Options**:
    *   **Trigger**: User clicks "Optimize Now" or "Save Enhancements & Optimize".
    *   **Progress Indicator**: Show processing status (e.g., "Optimizing your CV...", "Generating cover letter...").
    *   **Option**: Checkbox (default checked): "Generate matching Cover Letter".
    *   *Backend Note*: This is where the core AI logic runs, selecting relevant points, enhancing keywords, and structuring the documents.

6.  **Review & Download**:
    *   **Display**: Preview of the optimized CV and the generated Cover Letter (if selected).
    *   **Highlighting**: Optionally highlight sections that were specifically added or modified based on the job description.
    *   **Download Options**: Buttons to download in various formats (PDF, DOCX).
    *   **CTA**: "Apply Now" (if integrated with job boards) or "Finish".
    *   **Save**: Automatically save the generated documents linked to the job application in the user's history.

## User Journey 2: Build Profile / First Time Use

**Goal**: Guide a new user (or user without an uploaded CV) to create their professional profile, enabling future optimizations.

**Assumptions**: User has just signed up or logged in and has no existing profile data.

**Steps:**

1.  **Welcome / Dashboard**:
    *   **Greeting**: Welcome message.
    *   **Primary CTA**: Prominent button: "Build Your Professional Profile" or "Get Started".
    *   **Alternative**: Option "Upload Existing CV" (leads to Step 2b).

2.  **Profile Building Method Selection**:
    *   **Option A**: "Guide Me Step-by-Step" (leads to Step 3).
    *   **Option B**: "Upload My CV to Start" (leads to Step 2b).
    *   *Design Note*: Present these as clear choices.

3.  **(If Upload CV)** **CV Upload & Parsing**:
    *   **Interface**: Standard file upload interface.
    *   **Processing**: Parse the uploaded CV (PDF, DOCX).
    *   **Confirmation**: Show the parsed sections (Contact, Experience, Education, Skills) for user review and editing.
    *   **CTA**: "Confirm & Build Profile" (leads to Step 4).

4.  **(If Step-by-Step or Post-Upload)** **Guided Profile Builder**:
    *   **Interface**: Multi-step form or wizard interface, broken down by standard CV sections (Contact Info, Professional Summary, Work Experience, Education, Skills, Certifications, Projects, etc.).
    *   **Guidance**: Clear labels, placeholders, and tips for each field. Use examples.
    *   **Input**: Standard form fields, text areas, date pickers, potentially dynamic lists for skills.
    *   **Progress Indicator**: Show progress through the sections.
    *   **Save**: Auto-save progress or provide clear "Save & Continue" buttons.
    *   *Design Note*: Make this process feel manageable, not overwhelming. Allow users to skip sections and come back later.

5.  **Profile Complete / Initial CV View**:
    *   **Confirmation**: Message indicating the profile is built.
    *   **CV Preview**: Generate and display a first version of their CV based on the profile data.
    *   **Template Selection**: Offer a selection of professional CV templates.
    *   **CTA**: "View Dashboard" or "Optimize for First Application".
    *   *Outcome*: User now has a base profile and CV, ready to use Journey 1.

## Core Journey Emphasis

The design should always guide users towards **Journey 1 (Optimize for Application)** as the primary value proposition. Journey 2 serves as the necessary onboarding to enable Journey 1.
