# Export Templates - Goal Breakdown & Milestone Mapper

## Overview

This directory contains export templates and integration guides to help you transfer your goal breakdowns, milestone timelines, and progress tracking data into your preferred project management, documentation, or collaboration platforms.

## Available Export Formats

### 1. Notion Roadmap Page
**Best for:** Teams and individuals using Notion as their knowledge base and project hub

**Template:** `notion-roadmap-template.md`

**Includes:**
- Goal overview section with SMART criteria
- Sub-goal database with linked milestones
- Milestone timeline with status tracking
- Resource allocation table
- Risk register
- Visual roadmap using Notion timeline view
- Weekly review template (recurring)

**Setup Steps:**
1. Create a new Notion page titled "Goal Roadmap: [Your Goal Name]"
2. Add the following database structure:
   - **Sub-Goals Database** (Inline table)
     - Sub-Goal Name: Title
     - Description: Text
     - Status: Select (Not Started, In Progress, At Risk, Complete)
     - Priority: Select (Critical Path, High, Medium, Low)
     - Owner: Person
     - Start Date: Date
     - Target Date: Date
     - Dependencies: Relation (to other sub-goals)
   - **Milestones Database** (Inline table, related to Sub-Goals)
     - Milestone Name: Title
     - Sub-Goal: Relation (to Sub-Goals database)
     - Deliverable: Text
     - Target Date: Date
     - Status: Select (Not Started, In Progress, At Risk, Complete, Blocked)
     - Owner: Person
     - Early Warning: Text
     - Notes: Text
3. Create a **Timeline View** of the Milestones database for visual roadmap
4. Create a **Board View** grouped by Status for kanban-style tracking
5. Add a **Resources** section below databases with team allocation table
6. Add a **Risks** section with risk register table
7. Create a recurring **Weekly Review** template linked from the page

**Enhancements:**
- Use Notion formulas to calculate days remaining per milestone
- Add rollup properties to show sub-goal completion percentage
- Create filtered views: "This Week's Milestones," "At Risk Items," "My Assignments"
- Use Notion AI to generate weekly status summaries from milestone updates

**Compatible platforms:**
- Notion (native)
- Can export as Markdown for use in Obsidian, GitHub, etc.

---

### 2. Google Sheets Milestone Tracker
**Best for:** Spreadsheet users who want formulas, conditional formatting, and easy sharing

**Template:** `milestone-tracker.csv`

**Includes:**
- Goal Summary tab
- Sub-Goals tab with decomposition details
- Milestones tab with dates, owners, and status tracking
- Resource Allocation tab with capacity calculations
- Risk Register tab
- Dashboard tab with charts and RAG status overview

**Setup Steps:**
1. Open Google Sheets and create a new spreadsheet
2. File > Import > Upload > Select `milestone-tracker.csv`
3. Create separate tabs for each section (or use the multi-tab template)
4. Configure the following columns on the Milestones tab:
   - A: Milestone ID (M-001, M-002, etc.)
   - B: Sub-Goal (dropdown linked to Sub-Goals tab)
   - C: Milestone Name
   - D: Deliverable Description
   - E: Owner
   - F: Start Date
   - G: Target Date
   - H: Actual Completion Date
   - I: Status (dropdown: Not Started, In Progress, At Risk, Complete, Blocked)
   - J: % Complete
   - K: Dependencies
   - L: Notes / Blockers
5. Apply conditional formatting:
   - Status "At Risk" or "Blocked" = red background
   - Status "Complete" = green background
   - Target Date < Today AND Status != "Complete" = red text (overdue)
6. Create Dashboard tab with:
   - Pie chart of milestone status distribution
   - Gantt-style chart using stacked bar chart
   - Summary metrics (total milestones, % complete, days remaining)

**Sample Formulas:**
```
// Days remaining until milestone
=IF(H2="", MAX(0, G2-TODAY()), "Complete")

// Overall completion percentage
=COUNTIF(I:I, "Complete") / COUNTA(I2:I) * 100

// RAG Status auto-calculation
=IF(I2="Complete", "Green", IF(G2-TODAY()<7, "Red", IF(G2-TODAY()<14, "Amber", "Green")))

// Resource utilization (hours assigned / hours available)
=SUMIF(Milestones!E:E, A2, Milestones!J:J) / B2 * 100
```

**Compatible platforms:**
- Google Sheets (native)
- Microsoft Excel
- Apple Numbers
- Airtable (CSV import)
- Any spreadsheet application

---

### 3. PDF Breakdown Chart
**Best for:** Executive presentations, stakeholder updates, printed handouts, and archival

**Template:** `goal-breakdown-chart-template.md` (design in your preferred tool)

**Includes:**
- One-page goal overview with SMART criteria
- Hierarchical breakdown diagram (goal > sub-goals > milestones)
- Timeline visualization (Gantt-style or horizontal timeline)
- Resource summary matrix
- RAG status dashboard
- Key risks and mitigation summary

**Setup Steps:**
1. Use one of these tools to create the PDF:
   - **Google Slides / PowerPoint:** Create a multi-slide deck, export as PDF
   - **Canva:** Use roadmap or timeline templates, export as PDF
   - **Miro / FigJam:** Build visual roadmap, export selected frames as PDF
   - **Notion:** Export roadmap page as PDF (Page > Export > PDF)
   - **Google Sheets:** Print Dashboard tab to PDF
2. Structure the PDF document:
   - **Page 1:** Goal Overview
     - Goal statement, SMART criteria, timeline, key stakeholders
   - **Page 2:** Sub-Goal Breakdown
     - Hierarchical tree or table showing goal decomposition
   - **Page 3:** Milestone Timeline
     - Gantt chart or horizontal timeline with all milestones
   - **Page 4:** Resource Allocation
     - Team member assignments, budget allocation, capacity overview
   - **Page 5:** Risk Summary
     - Top 5 risks with RAG indicators and mitigation status
   - **Page 6:** Status Dashboard
     - Current progress metrics, milestone completion, trend indicators
3. Before exporting to PDF:
   - Apply redaction per Redaction-Guide.txt (especially for external audiences)
   - Remove any sensitive comments, notes, or metadata
   - Verify all dates, names, and figures are current
4. Set up recurring export schedule:
   - Monthly: Updated PDF for stakeholder distribution
   - Quarterly: Comprehensive review PDF with lessons learned

**Design Tips:**
- Use consistent color coding across all pages (match your roadmap visual)
- Keep text concise -- PDF is for overview, not detailed planning
- Include page numbers and "Last Updated" date on every page
- Add a confidentiality notice if sharing outside the team

**Compatible platforms:**
- Any PDF reader (universal format)
- Google Drive, SharePoint, Dropbox (for sharing)
- Email attachments for stakeholder distribution
- Print for physical meeting handouts

---

## Platform-Specific Integration Guides

### Asana Integration

**Setup Steps:**
1. Create new Asana project: "Goal Roadmap: [Goal Name]"
2. Create sections for each Sub-Goal
3. Add milestones as tasks within each section
4. Configure custom fields: Status, Priority, Owner, Target Date
5. Add subtasks to milestones for detailed action items
6. Set up task dependencies to reflect milestone dependencies
7. Use Timeline view for Gantt-style visualization

**Automation Ideas:**
- When milestone marked complete, notify stakeholders
- When target date approaches (7 days), send reminder to owner
- Weekly: Auto-generate status report from task data

---

### Trello Integration

**Setup Steps:**
1. Create board: "Goal Roadmap: [Goal Name]"
2. Create lists: Backlog, This Sprint, In Progress, Review, Complete
3. Create cards for each milestone
4. Add checklists to cards for sub-tasks
5. Use labels for sub-goal color coding
6. Set due dates for milestone targets
7. Use Calendar Power-Up for timeline view

---

### Monday.com Integration

**Setup Steps:**
1. Create board: "Goal Breakdown: [Goal Name]"
2. Import milestone data from CSV
3. Configure columns: Status, Owner, Timeline, Priority, Dependencies
4. Create Dashboard with milestone completion chart
5. Set up automations for status change notifications
6. Use Timeline view for roadmap visualization

---

## Export Workflow Examples

### Example 1: Export to Notion for Team Collaboration

**Scenario:** You manage a 5-person team and need a shared, living roadmap

**Steps:**
1. Complete goal breakdown using SOP Steps 1-5
2. Create Notion page with Sub-Goals and Milestones databases
3. Populate databases from your AI-assisted breakdown
4. Share page with team, set appropriate permissions
5. Set up weekly review recurring template
6. Use timeline view in weekly standup meetings

**Benefits:**
- Real-time collaboration and updates
- Integrated with existing Notion workspace
- Visual timeline and kanban views built-in
- Easy to link to other project documentation

---

### Example 2: Export to Google Sheets for Stakeholder Reporting

**Scenario:** You need to report progress to leadership monthly

**Steps:**
1. Set up milestone tracker spreadsheet with dashboard tab
2. Update milestone status weekly (15 min/week)
3. Dashboard auto-calculates metrics and charts
4. Monthly: Export Dashboard tab as PDF for leadership distribution
5. Apply redaction for any externally shared versions

**Benefits:**
- Automated calculations and visualizations
- Easy to share with view-only access
- PDF export for formal reporting
- Version history tracks changes over time

---

### Example 3: Export to Asana for Cross-Team Project Management

**Scenario:** Multiple teams contribute to a large, multi-quarter goal

**Steps:**
1. Create Asana project with sections per sub-goal
2. Assign milestones to team leads across departments
3. Set up task dependencies reflecting milestone order
4. Use Portfolio view to track multiple sub-goals simultaneously
5. Configure automated status reports for weekly distribution
6. Use Timeline view in project review meetings

**Benefits:**
- Cross-team visibility and accountability
- Built-in dependency tracking
- Automated reminders and notifications
- Portfolio-level progress overview

---

## File Naming Conventions

When exporting your goal breakdowns, use consistent naming:

```
goal-breakdown-[GOAL-SHORT-NAME]-[DATE]-[VERSION].md
milestone-tracker-[GOAL-SHORT-NAME]-[DATE].csv
roadmap-[GOAL-SHORT-NAME]-[DATE].pdf
risk-register-[GOAL-SHORT-NAME]-[DATE].csv
```

Examples:
- `goal-breakdown-product-launch-2026-02-12-v1.md`
- `milestone-tracker-product-launch-2026-02-12.csv`
- `roadmap-product-launch-2026-02-12.pdf`

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction** (see Redaction-Guide.txt)
2. **Check platform privacy:**
   - Is data encrypted at rest and in transit?
   - Who has access (team only vs. broader organization vs. public)?
   - Where is data stored geographically?
   - Can you delete data permanently if needed?
3. **Verify access controls:**
   - Set appropriate permissions (view-only, comment, edit)
   - Use least-privilege principle for shared documents
   - Audit access regularly and revoke when no longer needed
4. **Consider data sensitivity:**
   - Goal breakdowns may reveal strategic priorities
   - Resource allocations may reveal organizational structure
   - Financial details in budget columns require careful handling
   - Apply redaction levels appropriate to the audience

**HIGH-SENSITIVITY GOALS:** Keep in encrypted, access-controlled storage only. Do not export to cloud platforms without security review.

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Notion Roadmap Page template and setup guide
  - Google Sheets Milestone Tracker with formulas and dashboard
  - PDF Breakdown Chart structure and design guidelines
  - Integration guides for Asana, Trello, Monday.com

---

**Next Steps:**
1. Choose export format based on your primary workflow tool
2. Complete your goal breakdown using main SOP
3. Apply redaction (see Redaction-Guide.txt)
4. Export using appropriate template
5. Set up tracking and review cadence
6. Begin execution following your milestone roadmap
