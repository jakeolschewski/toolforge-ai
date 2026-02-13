# Export Templates - Personal AI Tool Stack Quiz & Builder

## Overview

This directory contains export templates and integration guides to help you transfer your AI tool stack assessment results into your preferred project management, documentation, or collaboration platforms.

## Available Export Formats

### 1. Markdown (Universal)
**Best for:** Documentation, GitHub, Notion, Obsidian, any markdown-compatible system

**Template:** `tool-stack-template.md`

**Includes:**
- Current state assessment
- Requirements matrix
- Tool recommendations with comparison tables
- Implementation roadmap
- Cost-benefit analysis

**Usage:**
1. Copy template contents
2. Fill in your assessment details
3. Import to your markdown-compatible tool

**Compatible platforms:**
- Notion (paste as markdown)
- Obsidian (save as .md file)
- GitHub/GitLab (documentation)
- VS Code (with markdown preview)
- Any text editor

---

### 2. CSV (Spreadsheet-Compatible)
**Best for:** Excel, Google Sheets, Airtable, database imports

**Template:** `tool-stack-comparison.csv`

**Includes:**
- Tool comparison matrix
- Cost tracking spreadsheet
- Privacy/security scorecard
- Implementation timeline

**Usage:**
1. Download CSV template
2. Open in spreadsheet application
3. Fill in your data
4. Use for sorting, filtering, calculations

**Compatible platforms:**
- Microsoft Excel
- Google Sheets
- Apple Numbers
- Airtable
- Any CSV-compatible database

---

### 3. JSON (API & Automation)
**Best for:** Custom integrations, automation workflows, developer tools

**Template:** `tool-stack-schema.json`

**Includes:**
- Structured data schema for tool assessments
- Machine-readable format for automations
- Integration with Make.com, Zapier, custom scripts

**Usage:**
1. Copy JSON template
2. Populate with your assessment data
3. Use in automation workflows or custom apps

**Compatible platforms:**
- Make.com (JSON modules)
- Zapier (webhooks)
- Custom scripts (Python, JavaScript, etc.)
- API integrations
- No-code database tools (Airtable API)

---

### 4. Notion Database Template
**Best for:** Notion users building comprehensive tool management systems

**Template:** Notion database structure (see `notion-setup-guide.md`)

**Includes:**
- Tools database with relations
- Implementation tracker
- Cost calculator
- Privacy compliance matrix

**Usage:**
1. Follow Notion setup guide
2. Duplicate provided database template
3. Populate with your assessment

**Features:**
- Automated cost calculations
- Privacy score filtering
- Implementation status tracking
- Related content (SOPs, documentation)

---

### 5. Project Management Formats
**Best for:** Tracking implementation progress in PM tools

**Templates Available:**
- `asana-import.csv` - Asana project import
- `trello-checklist.md` - Trello card checklists
- `monday-board.csv` - Monday.com board import
- `clickup-tasks.csv` - ClickUp task import

**Usage:**
1. Select template for your PM tool
2. Follow platform-specific import instructions
3. Track implementation progress

---

## Platform-Specific Integration Guides

### Google Sheets Integration

**Setup Steps:**
1. Open Google Sheets
2. File → Import → Upload → Select `tool-stack-comparison.csv`
3. Import location: "Create new spreadsheet"
4. Separator type: "Comma"
5. Convert text to numbers: Yes

**Enhancements:**
- Add data validation for dropdown fields (tool categories, privacy scores)
- Create pivot tables for cost analysis by category
- Use conditional formatting for privacy scores (red < 6, yellow 6-7, green 8+)
- Set up Google Apps Script for automated calculations

**Sample formulas:**
```
// Total Monthly Cost
=SUM(E2:E100)

// Average Privacy Score
=AVERAGE(F2:F100)

// ROI Calculation
=(G2*H2-E2)/E2*100
// Where G2 = hours saved/month, H2 = hourly rate, E2 = monthly cost
```

---

### Notion Integration

**Setup Steps:**
1. Create new Notion page
2. Type `/database` → Select "Table - Inline"
3. Import CSV: Click "..." → "Merge with CSV"
4. Map columns to properties

**Recommended properties:**
- Tool Name: Title
- Category: Select (dropdown)
- Privacy Score: Number (1-10)
- Monthly Cost: Number
- Status: Select (Not Started, In Progress, Active, Cancelled)
- Implementation Date: Date
- Notes: Text

**Advanced setup:**
- Create relations to "Projects" database
- Link to "SOPs" database for documentation
- Build rollups for total cost by category
- Create filtered views: "Essential Tools", "Privacy Concerns", "To Implement"

**Template link:** See `notion-setup-guide.md` for detailed instructions

---

### Airtable Integration

**Setup Steps:**
1. Create new base or table
2. Import CSV: Add Table → CSV file
3. Configure field types after import

**Recommended field types:**
- Tool Name: Single line text (Primary field)
- Category: Single select
- Privacy Score: Number (integer, 1-10)
- Monthly Cost: Currency
- Implementation Phase: Single select
- Status: Single select
- Tool URL: URL
- Notes: Long text

**Automation ideas:**
- Send Slack notification when tool status changes to "Active"
- Calculate monthly cost rollup across all "Active" tools
- Create calendar view for implementation timeline
- Build form for team members to suggest new tools

---

### Asana Integration

**Setup Steps:**
1. Create new project: "AI Tool Stack Implementation"
2. Import tasks: ... → Import → CSV
3. Map CSV columns to Asana fields

**Recommended structure:**
- Sections: Phase 1, Phase 2, Phase 3 (from implementation roadmap)
- Tasks: Individual tool setups
- Subtasks: Setup steps (account creation, configuration, integration, testing)
- Custom fields: Cost, Privacy Score, Category, ROI

**Template setup:**
- Create task templates for each implementation phase
- Set up task dependencies (Tool B requires Tool A)
- Assign due dates based on roadmap timeline
- Add milestones for phase completions

---

### Trello Integration

**Setup Steps:**
1. Create board: "AI Tool Stack"
2. Create lists: Backlog, Phase 1, Phase 2, Phase 3, Active, Cancelled
3. Create cards from markdown checklist (copy from template)

**Card structure:**
- Card title: Tool name
- Description: Use case, cost, privacy score
- Checklist: Setup steps from implementation roadmap
- Labels: Category (color-coded), Priority
- Due date: Implementation deadline
- Attachments: Link to tool documentation, SOPs

**Power-Ups to consider:**
- Custom Fields (for cost, privacy score)
- Calendar (view implementation timeline)
- Card Repeater (for quarterly reviews)

---

### Monday.com Integration

**Setup Steps:**
1. Create new board: "AI Tool Stack Management"
2. Import structure: ... → Import data → Import from CSV
3. Configure column types

**Recommended columns:**
- Tool Name: Text
- Category: Dropdown
- Privacy Score: Rating (1-5 stars = 2-10 scale)
- Monthly Cost: Numbers
- Implementation Phase: Status
- Timeline: Timeline
- Owner: People
- Priority: Priority

**Automations:**
- When status changes to "Active", notify owner
- When implementation phase is complete, move to next phase
- Weekly summary of total costs for active tools
- Alert when privacy score below threshold (< 6)

---

## Export Workflow Examples

### Example 1: Export to Google Sheets for Budget Tracking

**Scenario:** You need to track costs and get approval from finance team

**Steps:**
1. Complete your tool assessment
2. Open `tool-stack-comparison.csv` template
3. Fill in tool names, costs, categories, ROI projections
4. Import to Google Sheets
5. Share with finance team with comment-only access
6. Use comments for approval workflow
7. Create "Approved" column for finance team to mark approved tools

**Benefits:**
- Real-time collaboration
- Easy cost calculations and projections
- Visual formatting for presentations
- Version history for changes

---

### Example 2: Export to Notion for Team Knowledge Base

**Scenario:** Building comprehensive tool documentation for team

**Steps:**
1. Create Notion workspace or page
2. Follow Notion setup guide to create databases:
   - Tools Database
   - Implementation Tracker
   - SOPs Database (link workflow SOPs)
3. Import tool assessment data
4. Create relations between tools and implementation tasks
5. Link to SOPs for each tool
6. Build team directory showing who uses which tools

**Benefits:**
- Centralized knowledge base
- Easy onboarding for new team members
- Searchable documentation
- Living document that evolves with stack

---

### Example 3: Export to Asana for Implementation Project Management

**Scenario:** Managing phased rollout with multiple stakeholders

**Steps:**
1. Create Asana project from template
2. Import implementation roadmap as task list
3. Break down each tool implementation into subtasks:
   - Account setup
   - Configuration
   - Integration with existing tools
   - Training
   - Testing
   - Go-live
4. Assign tasks to responsible parties
5. Set dependencies (can't configure before account setup)
6. Track progress weekly in status meetings

**Benefits:**
- Clear accountability
- Visual timeline of rollout
- Dependency management
- Progress reporting for stakeholders

---

## Custom Integration Scripts

### Python Script: CSV to JSON Converter

```python
# convert_assessment.py
import csv
import json

def csv_to_json(csv_file, json_file):
    tools = []
    with open(csv_file, 'r') as f:
        reader = csv.DictReader(f)
        for row in reader:
            tools.append({
                'name': row['Tool Name'],
                'category': row['Category'],
                'privacy_score': int(row['Privacy Score']),
                'monthly_cost': float(row['Monthly Cost']),
                'implementation_phase': row['Phase'],
                'status': row['Status']
            })

    with open(json_file, 'w') as f:
        json.dump({'tools': tools}, f, indent=2)

# Usage
csv_to_json('my-tool-stack.csv', 'my-tool-stack.json')
```

---

### JavaScript: Generate HTML Report

```javascript
// generate_report.js
const fs = require('fs');
const tools = require('./my-tool-stack.json');

function generateReport(tools) {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>AI Tool Stack Report</title>
      <style>
        table { border-collapse: collapse; width: 100%; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
        .high-privacy { background-color: #d4edda; }
        .low-privacy { background-color: #f8d7da; }
      </style>
    </head>
    <body>
      <h1>AI Tool Stack Assessment</h1>
      <table>
        <tr>
          <th>Tool</th>
          <th>Category</th>
          <th>Privacy Score</th>
          <th>Monthly Cost</th>
          <th>Status</th>
        </tr>
  `;

  tools.tools.forEach(tool => {
    const privacyClass = tool.privacy_score >= 7 ? 'high-privacy' : 'low-privacy';
    html += `
      <tr class="${privacyClass}">
        <td>${tool.name}</td>
        <td>${tool.category}</td>
        <td>${tool.privacy_score}/10</td>
        <td>$${tool.monthly_cost}</td>
        <td>${tool.status}</td>
      </tr>
    `;
  });

  html += `
      </table>
    </body>
    </html>
  `;

  fs.writeFileSync('report.html', html);
}

generateReport(tools);
```

---

## Automation Workflows

### Make.com/Zapier: New Tool Alert

**Trigger:** New row added to Google Sheet (Tool Stack spreadsheet)
**Actions:**
1. Send Slack notification to team channel
2. Create Asana task for tool evaluation
3. Add to Notion database
4. Send email to tool champion with setup guide

**Use case:** Team members can suggest tools via Google Form → Sheet, triggering automatic workflows

---

### Make.com: Quarterly Review Automation

**Trigger:** Scheduled (first day of quarter)
**Actions:**
1. Pull all "Active" tools from database
2. Generate utilization report (from integration APIs)
3. Calculate total costs
4. Create Google Doc with review template pre-filled
5. Send to stakeholders for review
6. Schedule review meeting on calendar

**Use case:** Automate quarterly tool stack reviews (SOP Step 10)

---

## File Naming Conventions

When exporting your assessments, use consistent naming:

```
tool-stack-assessment-[YOUR-INITIALS]-[DATE]-[VERSION].md
tool-stack-roadmap-[YOUR-INITIALS]-[DATE].md
tool-comparison-matrix-[YOUR-INITIALS]-[DATE].csv
tool-stack-[YOUR-INITIALS]-[DATE].json
```

Examples:
- `tool-stack-assessment-JD-2026-02-12-v1.md`
- `tool-comparison-matrix-JD-2026-02-12.csv`
- `tool-stack-JD-2026-02-12.json`

**Benefits:**
- Easy sorting by date
- Version tracking
- Multi-user environments (initials identify owner)
- Consistent with professional documentation standards

---

## Privacy Considerations for Exports

**BEFORE exporting to any platform:**

1. **Apply redaction** (see Redaction-Guide.txt)
2. **Check platform privacy:**
   - Is data encrypted at rest?
   - Who has access (team only vs. public)?
   - Where is data stored (US, EU, etc.)?
   - Can you delete data permanently?

3. **Verify access controls:**
   - Set appropriate permissions (view-only, comment, edit)
   - Use least-privilege principle
   - Audit access regularly

4. **Consider data sovereignty:**
   - If subject to GDPR, prefer EU-hosted platforms or GDPR-compliant tools
   - Check if export contains any personal data
   - Ensure compliance with organizational policies

**HIGH-SENSITIVITY DATA:** Keep offline in encrypted storage, don't export to cloud platforms

---

## Support & Resources

**Template Issues:**
- Check that CSV files open correctly (UTF-8 encoding)
- Verify JSON syntax with online validators
- Test imports with sample data before using real assessment

**Platform-Specific Help:**
- Refer to each platform's official import documentation
- Check community forums for platform-specific tips
- Contact platform support for enterprise features

**Custom Integration Needs:**
- Modify provided scripts for your specific requirements
- Consult platform API documentation for advanced automations
- Consider hiring developer for complex integrations

---

## Changelog

- **v1.0 (2026-02-12):** Initial template collection
  - Markdown, CSV, JSON templates
  - Integration guides for 6 major platforms
  - Sample automation workflows

---

## Contributing

Have a template for a platform not listed here? Contributions welcome.
Share your custom templates to help others integrate their tool assessments.

---

**Next Steps:**
1. Choose export format based on your primary workflow tool
2. Complete your tool assessment using main SOP
3. Apply redaction (see Redaction-Guide.txt)
4. Export using appropriate template
5. Set up tracking in your chosen platform
6. Begin implementation following roadmap
