# Export Templates - Workspace Privacy Audit & Setup

## Overview

This directory contains descriptions of the export templates referenced in the Workspace Privacy Audit & Setup workflow. These templates help you organize and share audit findings, risk assessments, and setup guides in professional formats suitable for team use and stakeholder review.

---

## Template 1: Notion Audit Template

**Format:** Notion page/database template
**Purpose:** Structured workspace for conducting and tracking privacy audits over time

**Template Structure:**

1. **Audit Dashboard (Main Page)**
   - Overall privacy health score (updated monthly)
   - Tool inventory count and status summary
   - Open risk items by severity (critical/high/medium/low)
   - Last audit date and next scheduled audit
   - Quick links to sub-pages

2. **Tool Inventory Database**
   - Columns: Tool Name, Vendor, Category, Account Type, Privacy Score (1-5), Training Opt-Out Status, Data Retention Period, Last Reviewed Date, Notes
   - Filtered views: By privacy score, by category, by review status
   - Linked to Risk Register for cross-referencing

3. **Risk Register Database**
   - Columns: Risk ID, Description, Affected Tool(s), Severity (Critical/High/Medium/Low), Likelihood (1-5), Impact (1-5), Risk Score, Mitigation, Owner, Target Date, Status
   - Filtered views: Open risks, by severity, by owner, overdue items

4. **Audit Log**
   - Date of each audit (monthly, quarterly, annual)
   - Type (quick check / comprehensive / annual review)
   - Findings summary
   - Actions taken
   - Reviewer name/role

5. **Policy and Guidelines Page**
   - Team privacy policy (editable)
   - Approved tools list
   - Data classification guide
   - Incident reporting procedure

**How to Use:**
- Duplicate the template into your Notion workspace
- Populate the Tool Inventory with your current tools
- Run through the SOP steps, recording findings in the Risk Register
- Update the dashboard after each audit cycle
- Share relevant pages with team members (read-only for non-admins)

**Redaction Notes:**
- When sharing the Notion workspace externally, export as PDF and apply Redaction Guide procedures before distribution
- Use role-based labels instead of real names in the Audit Log

---

## Template 2: Google Sheets Risk Matrix

**Format:** Google Sheets spreadsheet
**Purpose:** Quantitative risk assessment and tracking with built-in scoring and visualization

**Sheet Structure:**

1. **Sheet 1: Risk Matrix**
   - Rows: Individual risk items
   - Columns:
     - Risk ID (auto-numbered)
     - Risk Description
     - Affected Tool / Data Flow
     - Risk Category (Data Exposure / Retention / Access / Compliance / Other)
     - Likelihood (1-5 dropdown)
     - Impact (1-5 dropdown)
     - Risk Score (auto-calculated: Likelihood x Impact)
     - Severity (auto-classified: Critical 20-25 / High 12-19 / Medium 6-11 / Low 1-5)
     - Mitigation Action
     - Owner (role, not name)
     - Target Date
     - Status (Open / In Progress / Resolved / Accepted)
   - Conditional formatting: Red for critical, orange for high, yellow for medium, green for low

2. **Sheet 2: Tool Privacy Scores**
   - Rows: Each tool in the inventory
   - Columns: Tool Name, Category, Privacy Transparency (1-5), Data Minimization (1-5), User Control (1-5), Training Opt-Out (1-5), Overall Score (average), Status (Approved / Under Review / Blocked)
   - Summary row with averages

3. **Sheet 3: Heat Map**
   - 5x5 grid: Likelihood (rows) vs. Impact (columns)
   - Each cell shows count of risks at that intersection
   - Color-coded from green (low) to red (critical)
   - Risk IDs listed in each cell for reference

4. **Sheet 4: Trend Tracking**
   - Monthly columns tracking: Total risks, Open risks by severity, Average privacy score, Controls implemented, Audit completion status
   - Sparkline charts for visual trends

**How to Use:**
- Make a copy of the template to your Google Drive
- Populate Sheet 2 (Tool Privacy Scores) first during Step 3 of the SOP
- Add risks to Sheet 1 as you identify them in Step 4
- Heat Map and Trend Tracking auto-populate from entered data
- Review and update monthly during recurring audits

**Redaction Notes:**
- Before sharing externally, replace tool names with generic labels ("Tool A", "Tool B")
- Remove any comments containing specific details
- Use "Share with specific people" rather than "Anyone with link"

---

## Template 3: PDF Setup Guide

**Format:** PDF document (generated from Markdown or word processor)
**Purpose:** Printable, shareable guide for workspace privacy configuration that team members can follow step-by-step

**Document Structure:**

1. **Cover Page**
   - Title: "AI Workspace Privacy Setup Guide"
   - Organization: [Your Organization Name]
   - Version and date
   - Classification: Internal Use Only

2. **Table of Contents**
   - Linked sections for easy navigation

3. **Section 1: Quick Start (1 page)**
   - Top 5 actions to take immediately
   - Estimated time: 15 minutes
   - No technical expertise required

4. **Section 2: Tool-by-Tool Privacy Setup (3-5 pages)**
   - For each approved tool:
     - Required privacy settings (with screenshots or navigation paths)
     - Training opt-out procedure
     - Data retention configuration
     - Access control settings
   - Organized by tool category (AI Assistants, Productivity, Development, Communication)

5. **Section 3: Network and Device Security (1-2 pages)**
   - VPN setup instructions
   - DNS encryption configuration
   - Full disk encryption verification
   - Browser privacy settings

6. **Section 4: Ongoing Maintenance (1 page)**
   - Monthly audit checklist (condensed)
   - What to do when things change (new tool, new team member, policy update)
   - Incident reporting quick reference

7. **Section 5: Reference (1 page)**
   - Approved tools list
   - Privacy score summary
   - Key contacts and escalation paths
   - Glossary of privacy terms

8. **Appendix**
   - Full privacy policy (team guidelines)
   - Data classification table
   - Regulatory quick reference (if applicable)

**How to Use:**
- Generate the PDF after completing the full SOP
- Distribute to all team members during onboarding
- Print and post the Quick Start section in common work areas
- Update and re-distribute when significant changes occur (quarterly minimum)

**Redaction Notes:**
- The PDF Setup Guide is designed for internal distribution only
- If sharing externally, remove all tool-specific configuration details
- Replace organization name with "[Organization]" for external versions
- Remove screenshots that show account-specific information

---

## General Notes

- All templates should be customized to your specific workspace and tools
- Templates are starting points; add or remove sections as needed
- Keep templates under version control (track changes over time)
- Apply the Redaction Guide before any external sharing
- Store completed templates in encrypted or access-controlled locations
- Review and update templates at least quarterly
