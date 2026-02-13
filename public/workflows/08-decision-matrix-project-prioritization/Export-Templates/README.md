# Export Templates - Decision Matrix for Project Prioritization

## Overview

This directory contains export templates and integration guides to help you transfer your decision matrix, priority rankings, and rationale documentation into your preferred spreadsheet, project management, or collaboration platforms.

## Available Export Formats

### 1. Google Sheets Matrix Calculator
**Best for:** Interactive scoring, team collaboration, automatic calculations

**Template:** `decision-matrix-calculator.gsheet`

**Includes:**
- Scored matrix with weighted calculations
- Automatic ranking and tier assignment
- Conditional formatting for visual scoring
- Multi-rater aggregation sheet
- Sensitivity analysis scenario tabs
- Summary dashboard with charts

**Usage:**
1. Open Google Sheets and create a new spreadsheet
2. Set up the following sheet structure (detailed below)
3. Enter your projects, criteria, weights, and scores
4. Formulas auto-calculate weighted scores and rankings

**Sheet Structure:**

**Tab 1: Scoring Matrix**
```
Row 1: Headers - "Project" | [Criterion 1] Raw | [Criterion 1] Weighted | [Criterion 2] Raw | ... | Total | Rank
Row 2: Weights - "" | [Weight 1] | "" | [Weight 2] | "" | ... | "" | ""
Row 3+: Projects - [Name] | [Score] | =B3*B$2 | [Score] | =D3*D$2 | ... | =SUM(weighted) | =RANK(total)
```

**Tab 2: Scoring Anchors**
```
Table defining what each score level (1-5 or 1-10) means for each criterion.
```

**Tab 3: Multi-Rater (if team exercise)**
```
Individual rater sheets with automatic averaging to the main Scoring Matrix.
```

**Tab 4: Sensitivity Analysis**
```
Alternative weight scenarios with side-by-side ranking comparisons.
```

**Tab 5: Dashboard**
```
Summary charts, tier assignments, and key metrics.
```

**Sample Formulas:**
```
// Weighted Score (cell C3, where B3 is raw score and B2 is weight)
=B3*B$2

// Total Weighted Score (sum of all weighted score columns for a project)
=C3+E3+G3+I3+K3

// Rank (descending by total score)
=RANK(L3, L$3:L$20, 0)

// Tier Assignment
=IF(L3>=PERCENTILE(L$3:L$20, 0.66), "Tier 1 - High",
 IF(L3>=PERCENTILE(L$3:L$20, 0.33), "Tier 2 - Medium",
 "Tier 3 - Low"))

// Average across raters (on aggregation sheet)
=AVERAGE(Rater1!B3, Rater2!B3, Rater3!B3)

// Variance across raters (flag disagreements)
=STDEV(Rater1!B3, Rater2!B3, Rater3!B3)

// Conditional formatting threshold
// Green: Score >= 4 (on 1-5 scale)
// Yellow: Score = 3
// Red: Score <= 2
```

**Enhancements:**
- Add data validation dropdowns restricting scores to valid range (1-5 or 1-10)
- Use conditional formatting: green for high scores, red for low scores
- Create a pivot table summarizing scores by criterion
- Add a chart sheet with bar chart (total scores) and radar chart (top 3 projects)
- Enable version history to track scoring changes over time

**Compatible Platforms:**
- Google Sheets (native)
- Microsoft Excel (export as .xlsx)
- Apple Numbers (export as .xlsx)
- LibreOffice Calc

---

### 2. Google Doc Rationale Template
**Best for:** Formal decision documentation, stakeholder communication, audit trails

**Template:** `decision-rationale-template.gdoc`

**Includes:**
- Executive summary section
- Criteria and weighting rationale
- Per-project evaluation summaries
- Sensitivity analysis findings
- Assumptions and constraints log
- Approval and sign-off section

**Template Structure:**

```markdown
# Project Prioritization Decision Record

**Decision Date:** [DATE]
**Decision-Makers:** [NAMES/ROLES]
**Version:** [v1.0]

## 1. Executive Summary
[1-2 paragraph summary: what was decided, which projects were selected, key factors]

## 2. Decision Context
- Decision Statement: [What are we deciding?]
- Constraint: [Budget/time/headcount limitation]
- Time Horizon: [Quarter/year/multi-year]

## 3. Evaluation Methodology
### Criteria and Weights
| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| [Criterion 1] | [X%] | [Why this weight] |
| ... | ... | ... |

### Scoring Scale
[Description of 1-5 or 1-10 scale with anchors]

## 4. Results Summary
### Priority Rankings
| Rank | Project | Total Score | Tier |
|------|---------|-------------|------|
| 1 | [Name] | [Score] | Tier 1 |
| ... | ... | ... | ... |

## 5. Per-Project Rationale
### Tier 1 (Selected)
**[Project Name]** - Score: [X]
- Key Strengths: [Why it ranked high]
- Key Risks: [What to watch]
- Resource Requirements: [What it needs]

### Tier 2 (Deferred)
**[Project Name]** - Score: [X]
- Elevation Conditions: [What would move it to Tier 1]

### Tier 3 (Deprioritized)
**[Project Name]** - Score: [X]
- Deprioritization Rationale: [Why it ranked low]

## 6. Sensitivity Analysis
[Summary of alternative scenarios and ranking stability]

## 7. Assumptions and Constraints
[List of key assumptions made during scoring]

## 8. Re-evaluation Triggers
[Conditions that would trigger a re-scoring]

## 9. Approval
| Approver | Role | Date | Signature |
|----------|------|------|-----------|
| [Name] | [Role] | [Date] | _________ |
```

**Usage:**
1. Copy the template into Google Docs
2. Fill in each section after completing the matrix exercise
3. Share with stakeholders for review and comment
4. Obtain sign-off in the approval section
5. Export as PDF for permanent record

**Compatible Platforms:**
- Google Docs (native)
- Microsoft Word (export as .docx)
- Notion (paste as markdown)
- Confluence (paste as wiki markup)

---

### 3. PDF Priority Summary
**Best for:** Executive briefings, board presentations, archival records

**Template:** `priority-summary-template.pdf`

**Includes:**
- One-page executive summary
- Visual priority matrix (2x2 quadrant chart)
- Tier assignment table
- Key recommendations
- Decision record metadata

**Usage:**
1. Complete the scoring matrix and rationale documentation
2. Use the Google Doc template to create content
3. Export as PDF (File > Download > PDF Document)
4. Alternatively, create a presentation slide version for meetings

**Recommended Layout (single page):**
```
+---------------------------------------------------+
| PRIORITY SUMMARY - [Date]                          |
+---------------------------------------------------+
| Decision: [1-sentence decision statement]          |
|                                                    |
| +-------------------+  +------------------------+ |
| | PRIORITY MATRIX   |  | RANKINGS               | |
| |  (2x2 chart:      |  | 1. Project A [Tier 1]  | |
| |   Impact vs Effort)|  | 2. Project B [Tier 1]  | |
| |                    |  | 3. Project C [Tier 2]  | |
| |                    |  | 4. Project D [Tier 2]  | |
| |                    |  | 5. Project E [Tier 3]  | |
| +-------------------+  +------------------------+ |
|                                                    |
| KEY FINDINGS:                                      |
| - [Finding 1]                                      |
| - [Finding 2]                                      |
| - [Finding 3]                                      |
|                                                    |
| NEXT STEPS:                                        |
| - [Action 1] by [Date]                             |
| - [Action 2] by [Date]                             |
+---------------------------------------------------+
```

**Compatible Platforms:**
- Any PDF reader
- Email attachment
- Print-ready format
- Presentation insert (as image or embedded PDF)

---

### 4. Notion Database Template
**Best for:** Notion users managing project portfolios with relational databases

**Template:** Notion database structure (see setup guide below)

**Includes:**
- Projects database with scoring properties
- Criteria definitions database
- Scoring sessions database (version history)
- Linked views for different audiences

**Setup Steps:**
1. Create new Notion page titled "Project Prioritization"
2. Create a database: `/database` > "Table - Inline"
3. Configure properties:
   - Project Name: Title
   - Description: Text
   - [Criterion 1] Score: Number (1-10)
   - [Criterion 2] Score: Number (1-10)
   - [Criterion 3] Score: Number (1-10)
   - [Criterion 4] Score: Number (1-10)
   - Weighted Total: Formula (compute from scores and weights)
   - Tier: Select (Tier 1, Tier 2, Tier 3)
   - Status: Select (Proposed, Approved, In Progress, Completed, Deferred)
   - Sponsor: Person
   - Rationale: Text
   - Session Date: Date

4. Create filtered views:
   - "Tier 1 - Approved" (filter: Tier = Tier 1)
   - "All Projects - Ranked" (sort: Weighted Total descending)
   - "Needs Scoring" (filter: any score field is empty)
   - "By Criterion" (group by highest-scoring criterion)

**Formula Example (Weighted Total):**
```
prop("Impact Score") * 0.30 +
prop("Effort Score") * 0.20 +
prop("Alignment Score") * 0.20 +
prop("Risk Score") * 0.15 +
prop("Urgency Score") * 0.15
```

**Advanced Setup:**
- Create a "Scoring Sessions" database with a relation to Projects
- Build a "Criteria Library" database for reusable criteria definitions
- Create rollup properties to track scoring trends over time
- Use Notion API to automate data entry from Google Sheets

---

### 5. Project Management Formats
**Best for:** Tracking implementation of selected projects in PM tools

**Templates Available:**
- `asana-import.csv` - Asana project import with priority tiers
- `trello-board.md` - Trello board structure for priority tracking
- `monday-board.csv` - Monday.com board import
- `jira-import.csv` - Jira issue import for selected projects
- `clickup-tasks.csv` - ClickUp task import

**CSV Column Structure (universal):**
```
Project Name, Description, Priority Tier, Total Score, Status, Owner, Target Start, Target End, Budget Estimate, Key Risks, Notes
```

**Usage:**
1. Export priority rankings from your scoring matrix
2. Populate the CSV with project details for selected (Tier 1) projects
3. Import into your PM tool
4. Create task breakdowns for each approved project
5. Track implementation progress against the original priority ranking

---

## Platform-Specific Integration Guides

### Google Sheets Integration

**Setup Steps:**
1. Open Google Sheets
2. Create the tab structure described above (Scoring Matrix, Anchors, Multi-Rater, Sensitivity, Dashboard)
3. Set up data validation: Data > Data Validation > Number between 1 and 5
4. Apply conditional formatting: Format > Conditional Formatting
5. Create charts: Insert > Chart > Bar chart (total scores)

**Advanced Features:**
- Use Google Apps Script to auto-sort by total score
- Create a custom menu for "Run Sensitivity Analysis"
- Set up email notifications when scores are updated (via Apps Script)
- Use ImportRange to pull data from other department matrices

**Sharing and Collaboration:**
- Share with "Can edit" for raters during scoring
- Change to "Can comment" after scoring is complete
- Export as PDF for executive distribution
- Use "Version history" to track all scoring changes

---

### Notion Integration

**Setup Steps:**
1. Create a new Notion workspace page
2. Follow the database setup guide above
3. Import baseline data from CSV if available
4. Configure views for different stakeholders

**Recommended Views:**
- Board View: Kanban by Tier (Tier 1 | Tier 2 | Tier 3)
- Table View: All projects sorted by weighted score
- Gallery View: Project cards with key metrics
- Calendar View: Implementation timeline for approved projects

**Automation with Notion API:**
```python
# Example: Update project scores via Notion API
import requests

NOTION_API_KEY = "your_integration_token"
DATABASE_ID = "your_database_id"

headers = {
    "Authorization": f"Bearer {NOTION_API_KEY}",
    "Notion-Version": "2022-06-28",
    "Content-Type": "application/json"
}

# Update a project's score
page_id = "project_page_id"
data = {
    "properties": {
        "Impact Score": {"number": 8},
        "Effort Score": {"number": 4},
        "Tier": {"select": {"name": "Tier 1"}}
    }
}

response = requests.patch(
    f"https://api.notion.com/v1/pages/{page_id}",
    headers=headers,
    json=data
)
```

---

### Airtable Integration

**Setup Steps:**
1. Create new base: "Project Prioritization"
2. Import CSV or build manually
3. Configure field types:
   - Project Name: Single line text (primary)
   - Each Criterion: Number (1-10)
   - Weighted Total: Formula
   - Tier: Single select
   - Sponsor: Collaborator
   - Status: Single select
   - Rationale: Long text

**Formula for Weighted Total:**
```
({Impact Score} * 0.30) +
({Effort Score} * 0.20) +
({Alignment Score} * 0.20) +
({Risk Score} * 0.15) +
({Urgency Score} * 0.15)
```

**Automation Ideas:**
- When Tier changes to "Tier 1", send Slack notification
- When all scores are filled, auto-calculate and assign tier
- Weekly digest of scoring changes to stakeholders
- Form view for collecting individual rater scores

---

### Asana Integration

**Setup Steps:**
1. Create project: "Project Prioritization - [Quarter/Year]"
2. Import CSV: ... > Import > CSV
3. Create sections: Tier 1 (Approved), Tier 2 (Deferred), Tier 3 (Deprioritized)

**Custom Fields:**
- Priority Score: Number
- Tier: Dropdown (Tier 1, Tier 2, Tier 3)
- Sponsor: People
- Budget Estimate: Number
- Implementation Status: Dropdown

**Task Structure for Approved Projects:**
- Task: [Project Name]
  - Subtask: Kickoff planning
  - Subtask: Resource allocation
  - Subtask: Milestone 1
  - Subtask: Milestone 2
  - Subtask: Review and close-out

---

## Export Workflow Examples

### Example 1: Solo Prioritization to Google Sheets

**Scenario:** Individual contributor prioritizing personal projects for the quarter

**Steps:**
1. List all candidate projects in a Google Sheet
2. Define 4-5 criteria with weights
3. Score each project in the matrix
4. Review automatic rankings
5. Export as PDF for personal reference
6. Create calendar events for selected projects

---

### Example 2: Team Prioritization to Notion

**Scenario:** Product team prioritizing feature backlog for next sprint cycle

**Steps:**
1. Set up Notion database with scoring properties
2. Each team member scores independently (separate views or linked databases)
3. Aggregate scores in main database using rollup properties
4. Discuss discrepancies in team meeting
5. Assign final tiers and implementation owners
6. Create linked tasks in sprint planning board

---

### Example 3: Executive Prioritization to PDF Summary

**Scenario:** Leadership team selecting annual strategic initiatives

**Steps:**
1. Complete matrix exercise in Google Sheets
2. Generate charts and visualizations
3. Write rationale document in Google Docs
4. Export one-page summary as PDF
5. Present to board or executive committee
6. Archive all materials in shared drive with version label

---

## File Naming Conventions

When exporting your decision matrices, use consistent naming:

```
decision-matrix-[CONTEXT]-[INITIALS]-[DATE]-[VERSION].xlsx
priority-rationale-[CONTEXT]-[INITIALS]-[DATE].docx
priority-summary-[CONTEXT]-[INITIALS]-[DATE].pdf
```

Examples:
- `decision-matrix-q3-projects-JD-2026-02-12-v1.xlsx`
- `priority-rationale-q3-projects-JD-2026-02-12.docx`
- `priority-summary-q3-projects-JD-2026-02-12.pdf`

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction** (see Redaction-Guide.txt)
2. **Check platform access controls:**
   - Who can view the matrix? (team only vs. broader organization)
   - Are scores and rationale visible to all viewers or just editors?
   - Can the document be downloaded and reshared?
3. **Consider the audience:**
   - Internal team: Full detail appropriate
   - Broader organization: Anonymize project names if sensitive
   - External: Full redaction required
4. **Verify formulas don't expose hidden data:**
   - Check that hidden rows/columns don't contain sensitive data
   - Verify pivot table sources don't reference unredacted sheets
   - Confirm chart data ranges don't include sensitive columns

**HIGH-SENSITIVITY DECISIONS:** Keep offline in encrypted storage. Do not export to cloud platforms without explicit approval from decision authority.

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Google Sheets matrix calculator with formulas
  - Google Doc rationale template
  - PDF summary layout
  - Notion, Airtable, Asana integration guides
  - Platform-specific setup instructions

---

## Next Steps

1. Choose your primary platform based on team workflow
2. Complete the scoring matrix using the main SOP
3. Apply redaction before sharing externally (see Redaction-Guide.txt)
4. Export using the appropriate template
5. Set up tracking for approved projects in your PM tool
6. Schedule quarterly re-evaluation using the review cadence from SOP Step 10
