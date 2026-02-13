# Export Templates - Feedback Loop Analyzer

## Overview

This directory contains export templates and integration guides to help you transfer your feedback analysis results, action plans, and trend reports into your preferred project management, documentation, or collaboration platforms.

## Available Export Formats

### 1. Google Sheets - Feedback Analysis Report
**Best for:** Collaborative analysis, pattern tracking, sentiment scoring, data visualization

**Template:** `feedback-analysis-report.csv`

**Includes:**
- Raw feedback log with category, sentiment, and urgency tags
- Pattern summary dashboard with frequency counts
- Sentiment distribution charts (auto-generated from data)
- Priority scoring matrix with calculated rankings
- Before/after comparison tables for loop closure
- Historical trend tracking across multiple cycles

**Usage:**
1. Open Google Sheets and create a new spreadsheet
2. File > Import > Upload > Select `feedback-analysis-report.csv`
3. Set separator type to "Comma" and import
4. Review column headers: Date, Source, Feedback Text, Category, Subcategory, Sentiment Score, Urgency, Pattern Tag, Action Status
5. Apply conditional formatting to Sentiment Score column (red for negative, green for positive)
6. Create pivot tables for pattern frequency and source distribution
7. Add charts for sentiment trend over time

**Sample Formulas:**
```
// Average Sentiment Score
=AVERAGE(F2:F500)

// Count by Category
=COUNTIF(D2:D500, "Usability")

// Negative Feedback Percentage
=COUNTIF(F2:F500, "<0") / COUNTA(F2:F500) * 100

// Priority Score (Frequency + Impact - Effort)
=H2+I2-J2
```

**Enhancements:**
- Add data validation dropdowns for Category and Sentiment fields
- Create filtered views: "Negative Only", "Critical Urgency", "Unresolved"
- Use conditional formatting on Urgency column (red = Critical, orange = High)
- Build a dashboard tab with summary charts and KPIs
- Set up Google Apps Script for automated sentiment calculation

**Compatible Platforms:**
- Google Sheets (native)
- Microsoft Excel (import CSV)
- Apple Numbers
- Airtable (import CSV)
- LibreOffice Calc

---

### 2. Google Docs - Action Plan Document
**Best for:** Structured action plans, stakeholder communication, progress documentation

**Template:** `feedback-action-plan.md` (import as Google Doc)

**Includes:**
- Executive summary of feedback analysis findings
- Pattern-to-action mapping table
- Detailed action plan for each prioritized improvement
- Timeline with milestones and owners
- Success metrics and measurement plan
- Communication plan template
- Post-implementation review template

**Usage:**
1. Open Google Docs and create a new document
2. Copy the markdown template content and paste into the document
3. Format headings, tables, and checklists using Google Docs formatting
4. Fill in your specific analysis findings and action plans
5. Share with stakeholders using appropriate access levels (view, comment, edit)
6. Use Suggesting Mode for collaborative review of action plans
7. Track version history for audit trail

**Document Structure:**
```
1. Executive Summary
   - Analysis period and scope
   - Key findings (3-5 bullet points)
   - Top priorities and expected outcomes

2. Pattern Analysis Summary
   - Table: Pattern | Frequency | Impact | Confidence
   - Supporting evidence for each pattern

3. Action Plans
   - For each improvement:
     - Objective
     - Tasks and milestones
     - Owner and timeline
     - Success metric and target
     - Risk and mitigation

4. Implementation Timeline
   - Gantt-style table with weekly milestones

5. Measurement Plan
   - Baseline metrics
   - Target metrics
   - Re-collection schedule

6. Appendix
   - Raw data summary (redacted)
   - Methodology notes
```

**Compatible Platforms:**
- Google Docs (native)
- Microsoft Word (export as .docx)
- Notion (paste markdown)
- Confluence (paste or import)
- Dropbox Paper

---

### 3. PDF - Executive Summary Report
**Best for:** Stakeholder presentations, board updates, archived reports, formal documentation

**Template:** `feedback-executive-summary.md` (convert to PDF)

**Includes:**
- One-page executive summary with key metrics and findings
- Visual sentiment trend chart (include as image)
- Top 5 patterns with impact assessment
- Action plan summary table
- Loop closure results (before/after comparison)
- Next cycle preview and focus areas

**Usage:**
1. Copy the markdown template into Google Docs, Notion, or your preferred editor
2. Fill in your analysis results, metrics, and action summaries
3. Insert charts or visualizations exported from your spreadsheet
4. Apply professional formatting (company branding if applicable)
5. Export as PDF: File > Download > PDF Document
6. Review PDF for any missed redactions before distributing
7. Distribute via secure channels (email, shared drive, not public links)

**Design Guidelines:**
- Keep to 2-4 pages maximum for executive consumption
- Lead with outcomes and impact, not methodology
- Use charts and visuals over dense text
- Include clear "Next Steps" section
- Date and version the report prominently

**Compatible Platforms:**
- Any PDF reader
- Google Drive (preview and share)
- Email attachment
- Secure document management systems
- Print-ready for physical distribution

---

## Platform-Specific Integration Guides

### Google Sheets Integration

**Setup Steps:**
1. Create a new Google Sheet titled "Feedback Analysis - [Period]"
2. Import CSV template
3. Configure data validation for dropdown columns
4. Set up conditional formatting rules
5. Create pivot tables for pattern analysis
6. Build dashboard tab with charts

**Recommended Tabs:**
- **Raw Data**: All feedback entries with tags
- **Pattern Analysis**: Pivot tables and frequency counts
- **Priority Matrix**: Scoring and ranking
- **Action Tracker**: Implementation status
- **Trends**: Historical data across cycles
- **Dashboard**: Summary charts and KPIs

**Automation Ideas:**
- Google Forms > Sheets: Auto-collect feedback into the tracker
- Apps Script: Auto-calculate sentiment scores on new entries
- Scheduled emails: Weekly summary of new feedback to stakeholders
- Conditional alerts: Notify when critical urgency feedback arrives

---

### Notion Integration

**Setup Steps:**
1. Create a new Notion page: "Feedback Loop Analyzer"
2. Create inline database: "Feedback Entries"
3. Add properties: Date, Source (Select), Category (Select), Sentiment (Number), Urgency (Select), Pattern (Multi-select), Status (Select)
4. Create related database: "Action Plans" with relation to Feedback Entries
5. Build filtered views: "Unresolved", "Critical", "By Category", "By Source"

**Recommended Views:**
- **Table View**: Full feedback log with all properties
- **Board View**: Kanban by Status (New > Categorized > Action Planned > Resolved)
- **Gallery View**: Action plans with key details
- **Calendar View**: Timeline of feedback collection and action deadlines
- **Chart View**: Sentiment trends (using Notion charts or embedded sheets)

**Template Properties:**
- Feedback Text: Title
- Date Received: Date
- Source: Select (Support, Survey, Review, Social, Internal)
- Category: Select (customizable taxonomy)
- Sentiment Score: Number (-5 to +5)
- Urgency: Select (Critical, High, Medium, Low)
- Pattern Tags: Multi-select
- Status: Select (New, Categorized, Action Planned, In Progress, Resolved)
- Action Plan: Relation (to Action Plans database)
- Cycle: Select (Q1 2026, Q2 2026, etc.)

---

### Airtable Integration

**Setup Steps:**
1. Create new base: "Feedback Loop Analyzer"
2. Import CSV template as new table
3. Configure field types (Single select, Number, Long text, etc.)
4. Create linked "Action Plans" table
5. Set up automations for notifications

**Recommended Automations:**
- When Urgency = "Critical", send Slack notification
- When Status changes to "Resolved", update action plan progress
- Weekly digest: Summary of new feedback entries
- Monthly report: Auto-generate sentiment trend summary

---

## Export Workflow Examples

### Example 1: Monthly Feedback Analysis to Google Sheets

**Scenario:** Regular monthly analysis cycle with spreadsheet tracking

**Steps:**
1. Export feedback from all sources to CSV
2. Import to Google Sheets using the analysis template
3. Categorize and tag entries (manually or with AI assistance)
4. Generate pivot tables for pattern identification
5. Score and prioritize patterns in the Priority Matrix tab
6. Document action plans in the Action Tracker tab
7. Share with stakeholders (view-only for most, edit for action owners)
8. Archive completed cycle and create new sheet for next month

---

### Example 2: Action Plans to Google Docs for Stakeholder Review

**Scenario:** Presenting feedback findings and proposed actions to leadership

**Steps:**
1. Complete feedback analysis in spreadsheet
2. Open Google Docs action plan template
3. Populate executive summary with key findings
4. Detail each action plan with timeline and success metrics
5. Add charts exported from spreadsheet as images
6. Share with leadership using Suggesting Mode for input
7. Incorporate feedback and finalize the document
8. Export as PDF for formal distribution and archival

---

### Example 3: Executive Summary PDF for Board Presentation

**Scenario:** Quarterly feedback report for executive or board review

**Steps:**
1. Compile data from last 3 monthly analysis cycles
2. Calculate quarter-over-quarter trends
3. Populate executive summary template with top findings
4. Include before/after metrics for completed improvements
5. Create 2-3 key visualizations (sentiment trend, category distribution, resolution rate)
6. Format and export as PDF
7. Distribute 48 hours before the meeting for pre-reading
8. Prepare talking points for live presentation

---

## File Naming Conventions

When exporting your analyses, use consistent naming:

```
feedback-analysis-[SCOPE]-[DATE]-[VERSION].csv
feedback-action-plan-[SCOPE]-[DATE]-[VERSION].md
feedback-executive-summary-[SCOPE]-[DATE].pdf
feedback-trend-report-[PERIOD]-[DATE].csv
```

Examples:
- `feedback-analysis-product-2026-02-12-v1.csv`
- `feedback-action-plan-support-2026-02-12-v2.md`
- `feedback-executive-summary-q1-2026-02-15.pdf`
- `feedback-trend-report-2025-annual-2026-01-20.csv`

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction** (see Redaction-Guide.txt)
2. **Check platform privacy:**
   - Is data encrypted at rest and in transit?
   - Who has access (team only vs. broader organization)?
   - Where is data stored geographically?
   - Can data be permanently deleted when no longer needed?

3. **Verify access controls:**
   - Set appropriate permissions (view-only for most stakeholders)
   - Restrict download/export permissions for sensitive data
   - Audit access regularly and remove stale permissions

4. **Consider data sensitivity:**
   - Raw feedback text may contain PII even after categorization
   - Aggregate data is always safer to share than individual entries
   - Historical trend data is generally safe; raw data requires more caution
   - AI tool outputs may be retained by the provider; check their policies

**HIGH-SENSITIVITY FEEDBACK:** Keep in restricted-access systems; do not export to broadly shared platforms

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Google Sheets analysis report template
  - Google Docs action plan template
  - PDF executive summary template
  - Integration guides for Sheets, Notion, Airtable

---

**Next Steps:**
1. Choose export format based on your primary collaboration tool
2. Complete your feedback analysis using the main SOP
3. Apply redaction (see Redaction-Guide.txt)
4. Export using the appropriate template
5. Set up tracking in your chosen platform
6. Schedule recurring exports aligned with your analysis cadence
