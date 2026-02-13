# Export Templates - Basic Zapier Recipe Builder

## Template 1: Zap Blueprint Document

**Purpose:** A structured document format for capturing and sharing complete Zap configurations outside of the Zapier platform.

**Format:** Markdown / Google Docs

**Setup Instructions:**
1. Create a new document titled "Zap Blueprint - [Zap Name]"
2. Include the following sections for each Zap:
   - **Zap Name**: Descriptive name following your naming convention
   - **Purpose**: One-sentence description of what the Zap accomplishes
   - **Trigger**: App name, event type, and key configuration details
   - **Actions**: Each action step with app name, event type, and field mappings
   - **Filters/Paths**: Any conditional logic with conditions specified
   - **Test Results**: Summary of test outcomes and edge cases checked
   - **Status**: Active / Paused / Draft
   - **Owner**: Team member responsible for maintenance
   - **Created**: Date of initial creation
   - **Last Reviewed**: Date of most recent review
3. Use this template each time you build a new Zap to maintain your automation library

---

## Template 2: Automation Inventory Spreadsheet

**Purpose:** A centralized tracking spreadsheet for all active, paused, and retired Zaps across your organization.

**Format:** CSV / Google Sheets / Excel

**Setup Instructions:**
1. Create a spreadsheet with the following columns:
   - Zap ID | Zap Name | Trigger App | Trigger Event | Action App(s) | Action Event(s) | Status | Owner | Created Date | Last Reviewed | Monthly Task Count | Error Rate | Notes
2. Enter one row per Zap
3. Use conditional formatting to highlight:
   - Zaps not reviewed in 90+ days (yellow)
   - Zaps with error rates above 5% (red)
   - Paused Zaps inactive for 60+ days (orange)
4. Add a summary dashboard tab showing total active Zaps, total monthly tasks, and top error-prone Zaps
5. Update monthly as part of your automation review cycle

---

## Template 3: Zap Testing Report

**Purpose:** A standardized report format for documenting Zap testing results before deployment.

**Format:** Markdown / PDF

**Setup Instructions:**
1. Create a report for each new or modified Zap with these sections:
   - **Zap Under Test**: Name and brief description
   - **Test Date**: When testing was performed
   - **Tester**: Who performed the testing
   - **Test Environment**: Live or sandbox
   - **Test Cases Executed**: Table with columns: Test Case | Input Data | Expected Result | Actual Result | Pass/Fail
   - **Edge Cases Tested**: List of edge cases and their outcomes
   - **Error Scenarios Tested**: List of deliberate error tests and results
   - **Duplicate Check**: Confirmation that no duplicate records were created
   - **Performance Notes**: Any observations about speed or reliability
   - **Approval**: Sign-off to move to production
2. Save completed test reports alongside the corresponding Zap Blueprint
3. Reference the test report during quarterly reviews to confirm ongoing accuracy
