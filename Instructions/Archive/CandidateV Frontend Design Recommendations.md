# CandidateV Frontend Design Recommendations

## Overall Design Philosophy

- **Minimalist & Focused**: Prioritize clarity and speed, especially for the core optimization journey. Reduce visual clutter.
- **Professional & Modern**: Reflect the expertise behind the product. Use clean typography, ample whitespace, and a professional color palette (consider blues, grays, with an accent color for CTAs).
- **Guided & Intuitive**: Use clear instructions, visual cues, and progressive disclosure to guide users.
- **Responsive**: Ensure seamless experience across desktop and mobile devices.

## Journey 1: Optimize for Application (Existing User)

### Step 1: Dashboard / Home Screen

- **Layout**: Clean dashboard layout. Consider a two-column approach on wider screens: main action area and sidebar for navigation/profile summary.
- **Primary CTA**: Large, visually distinct button (e.g., filled, contrasting color) labeled "Optimize for New Application" or similar. Place prominently (e.g., top-center or top-left of the main content area).
- **Secondary Options**: Less prominent links or buttons for "Manage Profile/CVs" and "View Application History" (e.g., in a sidebar or secondary navigation).
- **Visual Feedback**: Subtle confirmation upon login.

### Step 2: Input Job Details

- **Layout**: Simple, single-purpose screen.
- **Input Area**: Large, resizable text area for pasting the job description. Clearly label it. Provide an alternative input field for a job URL, perhaps with an icon link.
- **Guidance**: Use placeholder text within the text area (e.g., "Paste the full job description here..."). Add a brief instruction sentence above the input area.
- **Base CV Selection (Optional)**: If needed, use a simple dropdown menu below the input area, pre-selected to the "Mega CV" or most recent profile. Label clearly: "Optimize based on:".
- **CTA**: Clear, prominent button below the input area: "Analyze Job & Match". Disable until input is detected.

### Step 3: Initial Match & Keyword Analysis

- **Layout**: Two-column layout might work well: Match score/summary on one side, keyword details on the other.
- **Match Score**: Display prominently, perhaps using a gauge/dial visual or a large percentage number. Use color (e.g., green for high match, yellow/orange for medium, red for low) but ensure accessibility (e.g., combine color with icons or text labels).
- **Keyword Feedback**: Use a list format. Clearly distinguish between matched keywords (e.g., checkmark icon, green text) and missing keywords (e.g., warning icon, orange/red text). Consider grouping keywords by skill type.
- **CTAs**: Place primary CTA ("Optimize Now") prominently below the summary/score. Make the secondary CTA ("Enhance Details") less prominent (e.g., secondary button style or link).
- **Visual Feedback**: Animate the score calculation briefly to show processing.

### Step 4: (Optional) Enhance Details

- **Layout**: Focus on the identified gaps. Could be a modal window or a dedicated section on the page.
- **Interface**: List the missing keywords. For each, show the relevant sentence/context from the job description.
- **Input**: Provide simple text input fields next to each keyword gap, prompting the user (e.g., "Add experience related to [Keyword]"). Consider using rich text editing minimally if needed for formatting bullet points.
- **Guidance**: Provide clear instructions at the top: "Add specific examples or skills for the highlighted keywords below to improve your match score."
- **CTA**: Clear button: "Save & Optimize" or "Update & Optimize". Include a "Skip & Optimize" option.

### Step 5: Optimization & Generation Options

- **Visual Feedback**: Use a clear progress indicator (e.g., progress bar, spinner with text like "Analyzing job...", "Selecting relevant experience...", "Optimizing keywords...", "Generating cover letter..."). Make it feel like intelligent work is happening.
- **Cover Letter Option**: Simple, clearly labeled checkbox: "Include AI-Generated Cover Letter". Default to checked based on user preference or tier level.

### Step 6: Review & Download

- **Layout**: Side-by-side preview (on wider screens) or tabbed view for CV and Cover Letter.
- **Preview**: Use an embedded PDF viewer or render the documents accurately within the page. Ensure readability.
- **Highlighting (Optional)**: Use subtle background highlights or annotations in the preview to show AI-added/modified sections. Provide a toggle to turn highlights on/off.
- **Download Buttons**: Clear buttons for each format (PDF, DOCX). Use icons for quick recognition.
- **CTAs**: "Finish" or "Back to Dashboard". If integrated, "Apply Now" could link externally.
- **Save Confirmation**: Subtle notification that the application documents have been saved to their history.

## Journey 2: Build Profile / First Time Use

### Step 1: Welcome / Dashboard

- **Layout**: Simple, welcoming screen. Minimal options.
- **Greeting**: Personalized welcome message (e.g., "Welcome, [User Name]!").
- **Primary CTA**: Large, inviting button: "Build Your Profile" or "Get Started".
- **Alternative**: Clear secondary option: "Upload Existing CV".

### Step 2: Profile Building Method Selection

- **Layout**: Clear choice presentation. Use cards or large buttons for each option.
- **Options**: "Guide Me Step-by-Step" vs. "Upload My CV to Start". Include brief descriptions under each option explaining the process.

### Step 3: (If Upload CV) CV Upload & Parsing

- **Upload Interface**: Standard drag-and-drop area and file browser button. Specify accepted formats (PDF, DOCX).
- **Processing**: Show clear progress/parsing status.
- **Confirmation/Review**: Display parsed sections clearly (e.g., using cards or distinct sections). Allow inline editing for corrections. Highlight potentially uncertain parses.
- **CTA**: "Confirm & Build Profile" or "Looks Good, Continue".

### Step 4: (If Step-by-Step or Post-Upload) Guided Profile Builder

- **Layout**: Use a wizard/stepper component at the top or side to show progress through sections (Contact, Summary, Experience, etc.).
- **Interface**: Break down forms into manageable chunks per section. Use accordions or distinct pages for each major section.
- **Guidance**: Use clear labels, helper text, placeholder examples. Provide tips for writing effective summaries or experience descriptions.
- **Input**: Use appropriate controls (text fields, date pickers, tag inputs for skills). For Work Experience/Education, allow adding multiple entries dynamically.
- **Visual Feedback**: Show checkmarks on the stepper for completed sections. Provide real-time validation feedback on fields.
- **Save**: Implement auto-save or frequent explicit save points to prevent data loss.

### Step 5: Profile Complete / Initial CV View

- **Confirmation**: Clear success message.
- **CV Preview**: Display the generated CV prominently. Allow zooming/scrolling.
- **Template Selection**: Show template thumbnails visually. Allow users to click to preview their CV in different templates instantly.
- **CTAs**: Clear primary CTA leading towards the main goal: "Optimize for Your First Application" or "Find Jobs". Secondary CTA: "View Dashboard" or "Edit Profile".

## General UI Elements & Considerations

- **Navigation**: Simple top navigation (Dashboard, Profile/CVs, History, Settings, Logout). Keep it consistent.
- **Buttons**: Consistent button styling (Primary, Secondary, Tertiary/Link).
- **Forms**: Clear labels, appropriate input types, validation messages.
- **Feedback**: Use loading indicators, success messages, error messages clearly.
- **Empty States**: Design informative empty states for sections like "Application History" or when no CVs are uploaded yet.
- **Accessibility**: Ensure proper color contrast, keyboard navigation, screen reader compatibility (semantic HTML, ARIA attributes).
- **Tooltips/Help**: Provide contextual help for complex features or AI suggestions using tooltips or info icons.
