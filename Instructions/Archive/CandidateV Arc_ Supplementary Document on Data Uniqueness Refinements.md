# CandidateV Arc: Supplementary Document on Data Uniqueness Refinements

## 1. Purpose

This document addresses the specific requirement that the CandidateV "Arc" feature must maintain a unique, consolidated representation of a user's career intelligence. It details the refinements needed in the previously outlined design to prevent data duplication when processing multiple CVs or user inputs containing overlapping information, ensuring the Arc serves as a single source of truth.

## 2. Core Principle: Deduplication and Merging

The fundamental change is shifting from simply adding extracted data to a process of **identifying potential duplicates** and **intelligently merging** new information with existing entries in the user's Arc.

*   **No CV File Storage**: Reiterating the original design, raw CV files are *not* stored long-term. They are processed, data is extracted, and the files are deleted.
*   **Unique Structured Data**: The Arc database stores only the structured information (Work Experience, Skills, Education, etc.) derived from CVs or added manually.
*   **Enhancement Focus**: The system allows users to enhance existing entries (e.g., add metrics to an achievement) rather than creating parallel, slightly different versions.

## 3. Key Refinements

### 3.1 Defining Uniqueness

Before deduplication can occur, uniqueness must be defined for each data type:

*   **Work Experience**: Same company + similar role title + overlapping dates.
*   **Education**: Same institution + same degree + same field + overlapping dates.
*   **Skills**: Same skill name (potentially considering category).
*   **Projects**: Similar project name (potentially considering description/tech).
*   **Certifications**: Same credential ID or same name + issuing organization.
*   **Responsibilities/Achievements**: Semantic similarity *within the context* of a specific parent Work Experience or Project.

### 3.2 Updated CV Processing Pipeline (Stage 7)

The critical change occurs in the **Data Storage** stage (previously Stage 7). Instead of just saving extracted data, this stage now involves:

1.  **Receiving Extracted Data**: The Arc Database Service receives validated, structured data from the AI extraction process.
2.  **Iterating Through Items**: For each major item (e.g., a Work Experience entry) in the extracted data:
    *   **Query for Duplicates**: Search the user's existing Arc for entries that are potentially the same based on the uniqueness definitions (using fuzzy matching, date overlap, etc.).
    *   **Compare & Score**: Analyze potential duplicates against the extracted item to determine the confidence of a match (using similarity scores, potentially AI assistance for ambiguity).
    *   **Merge or Add**: 
        *   **If Match Found**: Update the *existing* Arc entry by merging in new details (e.g., adding a newly extracted achievement to an existing role, but only if that achievement isn't already listed semantically).
        *   **If No Match Found**: Add the extracted item as a *new* entry in the Arc.
3.  **Transaction Management**: All database operations for processing a single CV (identification, comparison, merging/adding) are wrapped in a transaction to ensure atomicity.

### 3.3 Deduplication & Merging Logic

Detailed logic is applied per entity type, using a combination of:

*   **Key Field Matching**: Comparing fields like company name, institution, skill name.
*   **Fuzzy Matching**: Handling minor variations in spelling or phrasing (e.g., "Ltd" vs "Limited").
*   **Date Overlap Analysis**: Checking if time periods align.
*   **Semantic Similarity**: Using AI (e.g., embeddings or direct GPT prompts) to compare descriptions (like achievements or responsibilities) for meaning, not just exact wording.
*   **Conflict Resolution Rules**: Defining how to handle discrepancies if merging (e.g., keep the latest date, longest description).

### 3.4 Refined Database Operations

Supporting this logic requires specific database capabilities and practices:

*   **Efficient Querying**: Indexes on key fields (`userId`, company names, skill names, dates) are crucial for finding potential duplicates quickly.
*   **Atomic Updates**: Using database features to update specific fields or add unique items to arrays within existing records.
*   **Transaction Support**: Leveraging database transactions to ensure consistency during the multi-step merge/add process.
*   **Data Validation**: Enforcing schema rules at the database or application level.

## 4. Outcome

By implementing these refinements, the CandidateV Arc will:

*   **Avoid Redundancy**: Prevent the same role, skill, or educational experience from appearing multiple times in a user's profile.
*   **Consolidate Knowledge**: Merge details from different sources (multiple CVs, user edits) into single, comprehensive entries.
*   **Maintain Accuracy**: Provide a cleaner, more reliable dataset for the AI to use when generating tailored applications.
*   **Improve User Experience**: Present users with a clear, non-repetitive view of their career history.

This approach directly addresses the requirement to ensure the Arc contains only unique, structured information, evolving intelligently as the user provides more data over time.
