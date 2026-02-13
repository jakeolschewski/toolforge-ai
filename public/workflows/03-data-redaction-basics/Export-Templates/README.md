# Export Templates - Data Redaction Basics

## Overview

This directory contains export templates and integration guides to help you transfer your data redaction policies, audit logs, and redaction rules into your preferred documentation, project management, or compliance platforms.

## Available Export Formats

### 1. Google Doc - Redaction Guide
**Best for:** Team-wide reference document, onboarding materials, compliance evidence

**Template:** `redaction-guide-template.md`

**Includes:**
- Complete redaction policy with data categories
- Token mapping reference table
- Step-by-step redaction procedures
- Before/after examples for every PII type
- Verification checklists
- Regulatory compliance notes

**Usage:**
1. Copy the Redaction-Guide.txt content into a new Google Doc
2. Format headings, tables, and checklists using Google Docs styles
3. Add your organization's logo and branding
4. Set sharing permissions (Viewer for team, Editor for policy owners)
5. Enable "Suggesting" mode so team members can propose updates

**Compatible platforms:**
- Google Docs (primary target)
- Microsoft Word (export as .docx)
- Notion (paste as markdown)
- Confluence (import as formatted text)
- SharePoint (upload as Word document)

**Formatting tips:**
- Use Heading 1 for main sections (Categories, Process, Scenarios)
- Use Heading 2 for subsections (Category A, Category B, etc.)
- Use tables for token mappings (easier scanning than bullet lists)
- Use checkboxes for verification checklists
- Add a "Last Updated" date in the header

---

### 2. Google Sheet - Data Audit Log
**Best for:** Tracking redaction activities, compliance audits, team accountability

**Template:** `data-audit-log-template.csv`

**Columns:**
| Column | Description | Example |
|--------|-------------|---------|
| Date | Redaction date | 2026-02-12 |
| Document Name | File or dataset identifier | Q1 Customer Report |
| Document Type | Category of document | Report / Dataset / Email / AI Output |
| Redactor | Person who performed redaction | Role or initials |
| Verifier | Person who verified redaction | Role or initials |
| PII Types Found | Categories of sensitive data | Names, Emails, Phone Numbers |
| Instance Count | Number of items redacted | 14 |
| Method | Redaction method used | Manual / Automated / Both |
| Tool Used | Specific tool (if automated) | Presidio / Regex Script / Adobe Acrobat |
| Verification Status | Pass or needs review | PASSED / NEEDS REVIEW |
| Notes | Exceptions or issues | One indirect identifier flagged for review |

**Usage:**
1. Create a new Google Sheet
2. Import the CSV template or copy column headers
3. Add data validation dropdowns for: Document Type, Method, Verification Status
4. Use conditional formatting: Green for PASSED, Red for NEEDS REVIEW
5. Create a pivot table for monthly summary (documents processed, pass rate)
6. Share with compliance team (Viewer access) and redaction team (Editor access)

**Sample formulas:**
```
// Total documents processed this month
=COUNTIFS(A:A, ">="&DATE(2026,2,1), A:A, "<"&DATE(2026,3,1))

// Pass rate
=COUNTIF(J:J, "PASSED") / COUNTA(J2:J) * 100

// Average instances redacted per document
=AVERAGE(G2:G)

// Documents needing review
=COUNTIF(J:J, "NEEDS REVIEW")
```

**Automation ideas:**
- Google Apps Script to send weekly summary email
- Form submission trigger to auto-populate new log entries
- Conditional formatting alerts for overdue verifications
- Dashboard charts for redaction metrics over time

**Compatible platforms:**
- Google Sheets (primary target)
- Microsoft Excel (download as .xlsx)
- Airtable (import CSV, configure field types)
- Notion databases (create inline database with same columns)
- Any CSV-compatible tool

---

### 3. PDF - Rules Summary
**Best for:** Quick-reference handout, training material, compliance documentation

**Template:** `redaction-rules-summary.md`

**Includes:**
- One-page token mapping reference card
- Quick-reference redaction rules by data type
- Decision tree: "Should I redact this?"
- Common mistakes to avoid (top 5)
- Emergency procedure for accidental PII exposure
- Regulatory reference table (GDPR, HIPAA, PCI DSS, CCPA)

**Usage:**
1. Copy the rules summary content into a formatted document
2. Apply professional formatting (headers, borders, color coding)
3. Export/print as PDF
4. Distribute as:
   - Desk reference card (laminated for physical workspaces)
   - Digital quick-reference (pinned in team chat)
   - Training handout (for onboarding sessions)
   - Compliance evidence (for auditors)

**Design recommendations:**
- Use a two-column layout for the token mapping table
- Color-code risk levels: Red (critical), Orange (high), Yellow (medium), Green (low)
- Include a decision flowchart for "Redact or Keep?"
- Keep to 2 pages maximum for printability
- Add version number and date in footer

**Compatible platforms:**
- Any PDF viewer
- Print-ready for physical distribution
- Google Drive (for cloud storage and sharing)
- Learning management systems (for training modules)

---

### 4. Markdown (Universal)
**Best for:** Documentation, GitHub, Notion, Obsidian, any markdown-compatible system

**Template:** `redaction-policy-template.md`

**Includes:**
- Complete redaction policy document
- Token reference tables
- Process checklists
- Audit log template
- Training outline

**Usage:**
1. Copy template contents
2. Customize for your organization's specific data types
3. Import to your markdown-compatible tool

**Compatible platforms:**
- Notion (paste as markdown)
- Obsidian (save as .md file)
- GitHub/GitLab (documentation repository)
- VS Code (with markdown preview)
- Confluence (import with markdown macro)
- Any text editor

---

### 5. CSV (Spreadsheet-Compatible)
**Best for:** Data classification matrices, token mappings, audit logs, compliance tracking

**Templates Available:**
- `data-classification-matrix.csv` - Classify all data types by sensitivity
- `token-mapping-reference.csv` - Complete token standard reference
- `redaction-audit-log.csv` - Ongoing redaction tracking
- `compliance-checklist.csv` - Regulatory requirement tracking

**Usage:**
1. Download CSV template
2. Open in spreadsheet application
3. Customize columns for your organization
4. Use for sorting, filtering, and reporting

**Compatible platforms:**
- Microsoft Excel
- Google Sheets
- Apple Numbers
- Airtable
- Any CSV-compatible database or tool

---

## Platform-Specific Integration Guides

### Google Docs Integration (Redaction Guide)

**Setup Steps:**
1. Open Google Docs and create a new document
2. Title: "Data Redaction Policy and Guide - [Organization Name]"
3. Copy content from Redaction-Guide.txt
4. Format using these styles:
   - Title: Document title
   - Heading 1: Major sections (Categories, Process, Scenarios)
   - Heading 2: Subsections (Category A, Category B, Steps)
   - Normal: Body text
   - Bullet lists: Safe alternatives and checklist items
5. Insert tables for token mappings
6. Add checkboxes for verification checklists (Insert > Checkbox)

**Sharing configuration:**
- Policy owners: Editor access
- Team members: Commenter access (suggest updates via comments)
- Compliance/legal: Viewer access
- External auditors: Viewer access (via link, time-limited)

**Maintenance:**
- Review and update quarterly
- Use version history to track changes
- Pin current version link in team communication channel
- Include "Last Reviewed" date on first page

---

### Google Sheets Integration (Data Audit Log)

**Setup Steps:**
1. Open Google Sheets
2. File > Import > Upload > Select `data-audit-log-template.csv`
3. Import location: "Create new spreadsheet"
4. Configure data validation:
   - Document Type: Dropdown (Report, Dataset, Email, AI Output, Spreadsheet, PDF, Other)
   - Method: Dropdown (Manual, Automated, Both)
   - Verification Status: Dropdown (PASSED, NEEDS REVIEW, FAILED, PENDING)
5. Apply conditional formatting:
   - Verification Status "PASSED": Green background
   - Verification Status "NEEDS REVIEW": Yellow background
   - Verification Status "FAILED": Red background

**Dashboard tab setup:**
- Create a second sheet tab named "Dashboard"
- Add summary metrics:
  - Total documents processed (all time, this month, this quarter)
  - Pass rate percentage
  - Average redaction instances per document
  - Most common PII types found
  - Documents pending review
- Add charts:
  - Bar chart: Documents processed per month
  - Pie chart: PII types distribution
  - Line chart: Pass rate trend over time

**Automation with Google Apps Script:**
```javascript
// Send weekly redaction summary email
function sendWeeklySummary() {
  var sheet = SpreadsheetApp.getActiveSheet();
  var data = sheet.getDataRange().getValues();
  // Count this week's entries, calculate pass rate
  // Send email to compliance team
  // (Customize with your email and logic)
}
```

---

### PDF Export (Rules Summary)

**Creating the PDF:**

**Option A: From Google Docs**
1. Create formatted document in Google Docs (see guide above)
2. File > Download > PDF Document (.pdf)
3. Verify formatting is preserved

**Option B: From Markdown**
1. Open rules summary in a markdown editor with PDF export (Typora, VS Code + extension)
2. Configure page size (Letter or A4)
3. Export as PDF
4. Verify tables and formatting render correctly

**Option C: From Word**
1. Open in Microsoft Word
2. Apply professional template/styling
3. File > Save As > PDF
4. Review PDF for formatting issues

**Distribution recommendations:**
- Upload to shared drive (Google Drive, SharePoint, Dropbox)
- Pin in team Slack/Teams channel
- Include in onboarding packet
- Print and laminate for physical reference (1-2 pages)
- Submit to compliance team as evidence of data protection procedures

---

### Notion Integration

**Setup Steps:**
1. Create new Notion page: "Data Redaction Program"
2. Add sub-pages:
   - Redaction Policy (paste from Redaction-Guide.txt)
   - Token Reference (create inline table)
   - Audit Log (create inline database)
   - Training Materials (link to resources)
3. For Audit Log database:
   - Create properties matching audit log columns
   - Add views: "All Entries", "Needs Review", "This Month", "By PII Type"
   - Set up templates for quick log entry creation

**Recommended properties for Audit Log database:**
- Document Name: Title
- Date: Date
- Document Type: Select
- PII Types Found: Multi-select
- Instance Count: Number
- Method: Select
- Verification Status: Select (with color coding)
- Redactor: Person
- Verifier: Person
- Notes: Text

---

### Airtable Integration

**Setup Steps:**
1. Create new base: "Data Redaction Tracker"
2. Create tables:
   - Audit Log (main tracking table)
   - Data Classification (reference table)
   - Token Mapping (reference table)
   - Team Members (people table, linked to Audit Log)
3. Import CSVs for initial setup
4. Configure field types and relations

**Automation ideas:**
- When Verification Status is "NEEDS REVIEW" for 48+ hours, send Slack alert
- Weekly summary of redaction activity sent to compliance team
- Auto-create audit log entry when form is submitted
- Monthly compliance report generation

---

## Export Workflow Examples

### Example 1: Setting Up Compliance Documentation

**Scenario:** You need to demonstrate data redaction practices to an auditor

**Steps:**
1. Export Redaction Policy as Google Doc (formatted, branded)
2. Export Audit Log as Google Sheet (with dashboard metrics)
3. Export Rules Summary as PDF (for auditor handout)
4. Compile into a "Data Protection Evidence Package":
   - Redaction Policy (shows what you do)
   - Audit Log (shows you do it consistently)
   - Rules Summary (shows your team has reference materials)
   - Training records (shows your team is trained)

---

### Example 2: Onboarding a New Team Member

**Scenario:** New hire needs to learn your redaction procedures

**Steps:**
1. Share Redaction Guide Google Doc (read-only access)
2. Print Rules Summary PDF as desk reference
3. Grant Editor access to Audit Log spreadsheet
4. Walk through one redaction exercise using Example documents
5. Have new hire complete their first redaction with peer review
6. Log the training completion in your records

---

### Example 3: Integrating Redaction into Daily AI Workflow

**Scenario:** Team uses AI tools daily and needs systematic redaction

**Steps:**
1. Post Rules Summary PDF in team chat (pinned message)
2. Create a Google Form linked to Audit Log sheet for quick logging
3. Set up Slack reminder: "Did you redact before sending to AI today?"
4. Create a shared bookmark folder with:
   - Redaction Guide (Google Doc)
   - Audit Log (Google Sheet)
   - Token Reference (quick-access table)
5. Schedule monthly review of audit log entries

---

## File Naming Conventions

When exporting your redaction documents, use consistent naming:

```
redaction-guide-[ORG]-[DATE]-[VERSION].docx
redaction-audit-log-[ORG]-[DATE].xlsx
redaction-rules-summary-[ORG]-[DATE]-[VERSION].pdf
data-classification-[ORG]-[DATE].csv
```

Examples:
- `redaction-guide-ACME-2026-02-12-v1.docx`
- `redaction-audit-log-ACME-2026-Q1.xlsx`
- `redaction-rules-summary-ACME-2026-02-12-v1.pdf`
- `data-classification-ACME-2026-02-12.csv`

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction to your own documents first** (see Redaction-Guide.txt)
2. **Verify no real PII in examples:**
   - All sample data must be synthetic/fictional
   - Example names: Jane Doe, Alex Sample (clearly generic)
   - Example emails: user@example.com (safe domain)
   - Example phones: (555) 000-0000 (reserved range)
3. **Check platform privacy:**
   - Is data encrypted at rest and in transit?
   - Who has access (team only vs. public)?
   - Where is data stored geographically?
   - Can you delete data permanently?
4. **Verify access controls:**
   - Set appropriate permissions (view-only, comment, edit)
   - Use least-privilege principle
   - Audit access regularly
   - Set expiration on shared links (for external sharing)
5. **Audit log files specifically:**
   - Audit logs may reference real documents with PII
   - Use document IDs, not document names containing PII
   - Redactor/verifier names may need anonymization for external sharing

**HIGH-SENSITIVITY DATA:** Keep offline in encrypted storage; do not export to cloud platforms

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Google Doc Redaction Guide template
  - Google Sheet Data Audit Log template
  - PDF Rules Summary template
  - Integration guides for 5 major platforms
  - Export workflow examples

---

## Contributing

Have a template for a platform not listed here? Contributions welcome.
Share your custom redaction templates to help others protect sensitive data.

---

**Next Steps:**
1. Choose export format based on your primary workflow tools
2. Complete your data classification using the SOP
3. Apply redaction to all documents (see Redaction-Guide.txt)
4. Export using appropriate template
5. Set up audit logging in your chosen platform
6. Train your team using exported materials
