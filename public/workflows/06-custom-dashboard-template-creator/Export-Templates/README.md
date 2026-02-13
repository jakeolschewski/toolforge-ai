# Export Templates - Custom Dashboard Template Creator

## Overview

This directory contains export templates and integration guides to help you transfer your custom dashboard templates into your preferred platforms. Each export format preserves the dashboard structure, sample data, and interactive elements to the greatest extent supported by the target platform.

## Available Export Formats

### 1. Notion Page Duplicate
**Best for:** Teams already using Notion for project management, wikis, or knowledge bases

**Template:** `notion-dashboard-template.md`

**Includes:**
- Database views (table, board, calendar, gallery)
- KPI summary with inline database rollups
- Linked databases with relation properties
- Toggle sections for progressive disclosure
- Callout blocks for status indicators
- Template buttons for recurring data entry

**Usage:**
1. Open the Notion template page
2. Click "Duplicate" in the top-right menu
3. Select your target workspace
4. Update database properties to match your metrics
5. Replace sample data with your actual values
6. Configure sharing permissions

**Compatible Features:**
- Database views (table, kanban, calendar, timeline, gallery)
- Rollup calculations for aggregated metrics
- Relation properties linking dashboards to project databases
- Synced blocks for metrics that appear in multiple locations
- Button automations for data refresh workflows
- Formula properties for calculated metrics

**Limitations:**
- No native charting (use third-party embeds: Google Sheets charts, Mermaid diagrams)
- Limited conditional formatting (use formula-based emoji indicators)
- No real-time data connections without third-party integrations
- Database views can be slow with 10,000+ records

---

### 2. Google Sheets Dashboard
**Best for:** Data-heavy dashboards, financial tracking, automated reporting with formulas and charts

**Template:** `dashboard-template.xlsx`

**Includes:**
- Summary sheet with KPI scorecards
- Charts sheet with pre-configured visualizations
- Data input sheet with validation rules
- Calculations sheet with formula library
- Configuration sheet for thresholds and settings
- Instructions sheet with setup guide

**Usage:**
1. Download the .xlsx template file
2. Open in Google Sheets (File > Import > Upload)
3. Or open directly in Excel/Numbers
4. Navigate to the "Configuration" sheet first
5. Set your metric names, targets, and thresholds
6. Enter data in the "Data Input" sheet
7. Dashboard auto-populates on the "Summary" sheet

**Compatible Features:**
- Native charts (line, bar, pie, combo, sparklines)
- Conditional formatting with color scales and icon sets
- Data validation dropdowns for filters
- QUERY and IMPORTRANGE functions for data connections
- Pivot tables for dynamic analysis
- Google Apps Script for automation
- Sparklines for inline trend indicators

**Formulas Included:**
```
// KPI Scorecard with Status
=IF(B2>=C2, "On Track", IF(B2>=C2*0.8, "At Risk", "Off Track"))

// Trend Indicator (vs. previous period)
=IF(B2>B1, "Up " & TEXT((B2-B1)/B1, "0.0%"), "Down " & TEXT((B1-B2)/B1, "0.0%"))

// Sparkline for inline trend
=SPARKLINE(D2:D13, {"charttype","line"; "color","#4285f4"; "linewidth",2})

// Conditional Formatting Formula
// Green: =B2>=C2 (actual >= target)
// Yellow: =AND(B2>=C2*0.8, B2<C2) (within 80-100% of target)
// Red: =B2<C2*0.8 (below 80% of target)
```

---

### 3. PDF Wireframe
**Best for:** Design mockups, stakeholder presentations, platform-agnostic planning, print-ready documentation

**Template:** `dashboard-wireframe.pdf`

**Includes:**
- Annotated layout diagram with section labels
- Metric placement guide with visualization type annotations
- Color palette and typography specifications
- Mobile layout variation
- Interactive element annotations (where filters and toggles go)
- Implementation notes for developers or builders

**Usage:**
1. Open the PDF wireframe
2. Review the annotated layout for section placement
3. Use as a blueprint when building in your target platform
4. Share with stakeholders for approval before building
5. Reference mobile layout section for responsive design
6. Hand off to developers with implementation notes

**Contents:**
- Page 1: Desktop full-width layout (annotated)
- Page 2: Desktop layout with metric specifications
- Page 3: Tablet layout (medium breakpoint)
- Page 4: Mobile layout (narrow breakpoint)
- Page 5: Color palette, typography, and icon reference
- Page 6: Interactive element map and data flow diagram

**File Formats Available:**
- PDF (universal, print-ready)
- PNG (for embedding in presentations)
- SVG (for editing in design tools)

---

### 4. Airtable Base Template
**Best for:** Visual databases, project tracking, CRM-style dashboards with multiple view types

**Template:** `airtable-dashboard-base.csv` (for import) + `airtable-setup-guide.md`

**Includes:**
- Grid view with metric tracking fields
- Kanban view for status-based tracking
- Calendar view for time-based metrics
- Gallery view for visual metric cards
- Form view for data entry
- Extensions setup guide (charts, pivot tables)

**Usage:**
1. Create a new Airtable base
2. Import CSV: Add Table > Import > CSV file
3. Configure field types after import (see setup guide)
4. Create additional views (kanban, calendar, gallery)
5. Set up chart extensions for visualizations
6. Configure automations for data updates

**Recommended Field Types:**
- Metric Name: Single line text (primary field)
- Category: Single select
- Current Value: Number
- Target Value: Number
- Status: Single select (On Track, At Risk, Off Track)
- Trend: Single select (Up, Down, Flat)
- Last Updated: Date
- Owner: Collaborator
- Notes: Long text
- Data Source: URL

---

## Platform-Specific Integration Guides

### Google Sheets Integration

**Setup Steps:**
1. Open Google Sheets
2. File > Import > Upload > Select template file
3. Import location: "Create new spreadsheet"
4. Separator type: "Comma"
5. Navigate to "Configuration" tab to set your parameters

**Enhancements:**
- Add data validation for dropdown fields (metric status, categories)
- Create pivot tables for cross-dimensional analysis
- Use conditional formatting for green/yellow/red status indicators
- Set up Google Apps Script for scheduled data refresh

**Dashboard-Specific Formulas:**
```
// Dynamic Date Range Filter
=FILTER(Data!A:F, Data!A:A>=Dashboard!B1, Data!A:A<=Dashboard!B2)

// Rolling 7-Day Average
=AVERAGE(OFFSET(B2, -6, 0, 7, 1))

// Year-over-Year Comparison
=IFERROR((B2-INDEX(Data!B:B, MATCH(A2-365, Data!A:A, 1)))/INDEX(Data!B:B, MATCH(A2-365, Data!A:A, 1)), "N/A")

// Status Emoji Indicator
=IF(B2>=C2, "  On Track", IF(B2>=C2*0.8, "  At Risk", "  Off Track"))
```

---

### Notion Integration

**Setup Steps:**
1. Duplicate the Notion template page to your workspace
2. Customize database properties to match your metrics
3. Configure views (table, board, calendar) per dashboard section
4. Set up relations to existing Notion databases (projects, clients, etc.)
5. Configure formula properties for calculated metrics

**Recommended Database Properties:**
- Metric Name: Title
- Category: Select (KPI, Health, Financial, Operational)
- Current Value: Number
- Target: Number
- Status: Formula (auto-calculate from Current vs. Target)
- Trend: Select (Up, Down, Flat)
- Responsible: Person
- Update Frequency: Select (Daily, Weekly, Monthly)
- Data Source: URL
- Notes: Text

**Dashboard Layout Tips:**
- Use linked database views to show same data in multiple sections
- Callout blocks for KPI summary row with emoji indicators
- Toggle headings for progressive disclosure of details
- Synced blocks for metrics that appear across multiple pages
- Button properties for quick data entry or status updates

**Formula Examples:**
```
// Status calculation
if(prop("Current Value") >= prop("Target"), "On Track",
  if(prop("Current Value") >= prop("Target") * 0.8, "At Risk", "Off Track"))

// Progress percentage
round(prop("Current Value") / prop("Target") * 100)

// Days until target date
dateBetween(prop("Target Date"), now(), "days")
```

---

### Airtable Integration

**Setup Steps:**
1. Create new base: "Dashboard Template"
2. Import CSV: Table > Import > CSV file
3. Configure field types (see recommended types above)
4. Create views: Grid (default), Kanban (by Status), Calendar (by Date)
5. Install extensions: Chart, Pivot Table, Page Designer

**Automation Setup:**
- When Status changes to "Off Track", send Slack/email notification
- Weekly digest: Summarize all metrics and send to dashboard owner
- When new data is entered via form, recalculate status automatically
- Monthly: Generate PDF report using Page Designer extension

**Chart Extension Configuration:**
- Bar chart: Metrics by Category with Current Value
- Line chart: Metric values over time (requires date field)
- Pie chart: Distribution of Status values across all metrics
- Number: Total metrics On Track vs. At Risk vs. Off Track

---

## Export Workflow Examples

### Example 1: Export to Google Sheets for Financial Dashboard

**Scenario:** Building a monthly financial dashboard for the executive team

**Steps:**
1. Complete dashboard design using SOP Steps 1-6
2. Open `dashboard-template.xlsx` in Google Sheets
3. Configure the "Settings" tab:
   - Set metric names (Revenue, Expenses, Profit Margin, etc.)
   - Define targets and thresholds
   - Set date range to current month
4. Populate "Data Input" tab with sample financial data
5. Review auto-generated charts on "Dashboard" tab
6. Apply conditional formatting for financial thresholds
7. Share with executive team (View Only permissions)
8. Schedule monthly update reminder

**Benefits:**
- Native charting for financial visualizations
- Formula-based calculations update automatically
- Version history tracks changes over time
- Easy to duplicate for next month

---

### Example 2: Export to Notion for Team Project Dashboard

**Scenario:** Creating a project status dashboard for a cross-functional team

**Steps:**
1. Duplicate Notion template to team workspace
2. Create linked databases:
   - Projects database (name, status, owner, deadline)
   - Tasks database (task, project relation, assignee, status)
   - Metrics database (KPI name, value, target, trend)
3. Configure dashboard views:
   - KPI summary using callout blocks with rollup values
   - Project board (kanban) by status
   - Task calendar by due date
   - Team workload by assignee (gallery view)
4. Set up template buttons for:
   - "Add New Project" with standard fields
   - "Weekly Status Update" with report template
5. Share with team and configure permissions:
   - Editors: Project managers
   - Viewers: Stakeholders and executives

**Benefits:**
- Centralized in existing team workspace
- Rich formatting and nested content
- Relations connect dashboard to project details
- Template buttons standardize data entry

---

### Example 3: Export as PDF Wireframe for Stakeholder Approval

**Scenario:** Getting approval for a new operational dashboard before building

**Steps:**
1. Complete dashboard design using SOP Steps 1-4
2. Open `dashboard-wireframe.pdf` template
3. Annotate with your specific:
   - Section names and metric placements
   - Visualization type selections
   - Color palette (match brand guidelines)
   - Mobile layout adaptations
4. Add implementation notes:
   - Data source connections needed
   - Refresh schedule requirements
   - Access control specifications
5. Present to stakeholders for feedback
6. Incorporate feedback and iterate
7. Use approved wireframe as blueprint for platform build

**Benefits:**
- Platform-agnostic review (no tool dependency)
- Print-friendly for meeting discussions
- Clear annotations for builder handoff
- Easy to iterate before investing in build

---

## File Naming Conventions

When exporting your dashboards, use consistent naming:

```
[role]-dashboard-[version]-[date].[format]
[role]-dashboard-template-[version]-[date].[format]
[role]-dashboard-wireframe-[version]-[date].[format]
```

Examples:
- `executive-dashboard-v1.2-2026-02-12.xlsx`
- `pm-dashboard-template-v1.0-2026-02-12.md`
- `marketing-dashboard-wireframe-v2.0-2026-02-12.pdf`
- `sales-dashboard-data-v1.0-2026-02-12.csv`

**Benefits:**
- Easy sorting by role, date, or version
- Clear identification of template vs. live dashboard
- Multi-user environments (role identifies audience)
- Consistent with professional documentation standards

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction** (see Redaction-Guide.txt)
2. **Check platform privacy:**
   - Is data encrypted at rest?
   - Who has access (team only vs. public)?
   - Where is data stored geographically?
   - Can you delete data permanently?

3. **Verify access controls:**
   - Set appropriate permissions (view-only, comment, edit)
   - Use least-privilege principle
   - Audit access regularly
   - Revoke access for departed team members

4. **Consider data sensitivity:**
   - Financial dashboards: Restrict to authorized personnel only
   - Performance dashboards: Anonymize individual data before sharing broadly
   - Client-facing dashboards: Remove internal metrics and cost data
   - Public templates: Use only fictional sample data

**HIGH-SENSITIVITY DATA:** Keep in controlled environments with audit logging. Never export to personal accounts or unapproved cloud platforms.

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Notion, Google Sheets, PDF, Airtable templates
  - Integration guides for 4 major platforms
  - Export workflow examples
  - Privacy and redaction guidelines

---

## Next Steps

1. Choose export format based on your primary platform
2. Complete your dashboard design using the main SOP
3. Apply redaction (see Redaction-Guide.txt)
4. Export using the appropriate template
5. Configure sharing and permissions in target platform
6. Schedule ongoing maintenance and review cycles
