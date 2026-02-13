# Export Templates - Content Idea Generator

## Overview

This directory contains export templates for transferring your content ideas and editorial planning outputs into your preferred project management, spreadsheet, or content management platform.

## Available Export Formats

### 1. Markdown Editorial Calendar
**Best for:** Notion, Obsidian, GitHub wikis, and markdown-compatible CMS platforms

**Template:** `content-ideas-calendar.md`

**Includes:**
- Scored idea list with composite rankings
- Content briefs for each selected idea
- Monthly editorial calendar view
- Backlog of unselected ideas for future rounds

**Setup Instructions:**
1. Copy the template to your markdown-compatible workspace
2. Replace placeholder sections with your scored ideas
3. Adjust the calendar grid to match your publication cadence
4. Link each idea entry to its detailed content brief
5. Archive completed ideas and rotate backlog items in

**Compatible platforms:**
- Notion (paste as markdown or import)
- Obsidian (save as .md file in your vault)
- GitHub/GitLab wikis
- Any static site generator

---

### 2. CSV Idea Tracker
**Best for:** Excel, Google Sheets, Airtable, and database-driven content tools

**Template:** `content-ideas-tracker.csv`

**Includes:**
- Idea title, description, and category columns
- Scoring columns (Relevance, Alignment, Uniqueness, Feasibility, Timeliness)
- Composite score with auto-calculation formula notes
- Status tracking (Backlog, Planned, In Progress, Published)
- Target date and assigned writer columns

**Setup Instructions:**
1. Import the CSV into your spreadsheet application
2. Enable formula columns for composite score calculation
3. Apply conditional formatting to highlight top-scoring ideas
4. Set up filters by status, pillar, and content format
5. Connect to your editorial calendar if using Airtable or Sheets

**Compatible platforms:**
- Google Sheets (import CSV)
- Microsoft Excel (open directly)
- Airtable (import as new table)
- Smartsheet

---

### 3. JSON Feed for Automation
**Best for:** Zapier, Make (Integromat), custom dashboards, and API-driven workflows

**Template:** `content-ideas-feed.json`

**Includes:**
- Structured idea objects with all scoring metadata
- Tags array for filtering by pillar, format, and journey stage
- Status field for workflow automation triggers
- Timestamps for creation and last-modified tracking

**Setup Instructions:**
1. Download the JSON template and customize the schema to your needs
2. Populate with your scored ideas from the ideation session
3. Connect to Zapier or Make to trigger actions when ideas move to "Planned"
4. Use the JSON feed to populate custom dashboards or internal tools
5. Set up automated notifications when backlog items exceed 90 days without review

**Compatible platforms:**
- Zapier (webhook trigger)
- Make / Integromat (JSON module)
- Custom web dashboards
- Slack or Teams via webhook integrations
