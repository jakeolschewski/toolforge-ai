# Examples - Workspace Privacy Audit & Setup

## Overview

This directory contains example outputs demonstrating what completed privacy audit deliverables look like. All examples use synthetic data and generic tool names. Never use real user data, tool-specific logs, or organizational details in shared examples.

---

## Example 1: Tool Privacy Assessment Entry

**Context:** A single entry from the Tool Inventory after completing Step 3 of the SOP (Privacy Policy Review).

```
Tool Name:       AI Assistant A (General-purpose LLM)
Vendor:          [Vendor Name Redacted]
Category:        AI Assistant
Account Type:    Paid Team Plan
Primary Use:     Drafting content, summarizing documents, brainstorming
Data Types:      General text, occasionally internal documents

Privacy Assessment:
- Privacy Transparency:   3/5 (Policy exists but uses vague language in key areas)
- Data Minimization:      2/5 (Collects usage metadata beyond core functionality)
- User Control:           4/5 (Data export and deletion available via settings)
- Training Opt-Out:       4/5 (Opt-out available and clearly documented)
- Overall Privacy Score:  3.25 / 5

Key Findings:
- Training opt-out: Available and enabled. Verified in account settings.
- Data retention: 30 days for prompts, even with opt-out enabled.
- Third-party sharing: Shares anonymized usage data with analytics partners.
- Data residency: United States. No option for EU data residency.

Risk Level: MEDIUM
Recommended Actions:
1. Maintain training opt-out (already enabled)
2. Avoid submitting PII or confidential data in prompts
3. Request data deletion quarterly via account settings
4. Monitor vendor privacy policy for changes (set calendar reminder)
```

---

## Example 2: Risk Register Entry

**Context:** A risk item identified during Step 4 of the SOP (Risk Identification).

```
Risk ID:          R-007
Description:      AI assistant retains user prompts for 30 days even when
                  training opt-out is enabled, creating a data retention
                  risk for sensitive business information.
Affected Tool:    AI Assistant A
Data Flow:        User input -> AI Assistant A -> Vendor cloud storage (30 days)
Risk Category:    Data Retention
Likelihood:       4/5 (data retention is confirmed behavior, not speculative)
Impact:           3/5 (business-sensitive but not PII; limited exposure window)
Risk Score:       12 (HIGH)
Classification:   HIGH

Mitigation Plan:
- Primary: Do not submit sensitive business data to this tool
- Secondary: Implement pre-submission review checklist for team
- Tertiary: Evaluate alternative tool with shorter retention (or zero retention)
- Timeline: Implement primary and secondary within 1 week; tertiary within 1 month

Owner:            Privacy Champion (rotating role)
Target Date:      2026-03-01
Status:           In Progress
```

---

## Example 3: Data Flow Summary

**Context:** A simplified data flow description from Step 2 of the SOP.

```
DATA FLOW MAP - CUSTOMER SUPPORT WORKFLOW

Flow 1: Support Ticket -> AI Assistant
  Source:        Help desk tool (internal)
  Destination:   AI Assistant A (external vendor)
  Data Type:     Customer inquiry text (may contain PII: names, emails, order IDs)
  Encryption:    HTTPS in transit, encrypted at rest by vendor
  Retention:     30 days by vendor
  Risk:          PII exposure to external vendor
  Mitigation:    Strip PII before submitting to AI; use template prompts

Flow 2: AI Assistant -> Help Desk Response
  Source:        AI Assistant A (external vendor)
  Destination:   Help desk tool (internal)
  Data Type:     Draft response text (no PII in output)
  Encryption:    HTTPS in transit
  Retention:     Stored in help desk system (internal retention policy)
  Risk:          LOW - output does not contain sensitive data
  Mitigation:    Review AI output before sending to customer

Flow 3: Support Ticket -> Team Chat (Automated)
  Source:        Help desk tool (internal)
  Destination:   Team communication tool (external vendor)
  Data Type:     Ticket summary (may contain customer name and issue type)
  Encryption:    HTTPS in transit, encrypted at rest
  Retention:     Indefinite by communication tool vendor
  Risk:          MEDIUM - PII in automated notifications stored indefinitely
  Mitigation:    Configure automation to send ticket ID only (not customer details)

Overall Flow Risk: MEDIUM
Priority Actions:
1. Strip PII from AI assistant prompts (implement immediately)
2. Reconfigure automation to exclude customer details (within 1 week)
3. Review help desk tool's data sharing settings (within 1 week)
```

---

## Example 4: Audit Simulation Results

**Context:** Results from Step 7 of the SOP (Audit Simulation).

```
AUDIT SIMULATION REPORT
Date: 2026-02-12
Conducted by: [Role: Privacy Champion]

TEST 1: VPN Effectiveness
  Description:   Verified VPN routes all AI tool traffic through encrypted tunnel
  Method:        Used IP leak test and DNS leak test while connected to VPN
  Expected:      No IP or DNS leaks detected
  Actual:        PASS - All traffic routed through VPN; no leaks detected
  Notes:         WebRTC leak detected in one browser; disabled WebRTC

TEST 2: Training Opt-Out Verification
  Description:   Confirmed training opt-out is active on all AI tools
  Method:        Checked settings page for each AI tool in inventory
  Expected:      Opt-out enabled on all tools
  Actual:        PARTIAL PASS - 4 of 5 tools had opt-out enabled; 1 tool
                 had reset to default after a recent update
  Remediation:   Re-enabled opt-out on affected tool; added to monthly check

TEST 3: Data Deletion Request
  Description:   Tested data deletion procedure on one AI tool
  Method:        Submitted deletion request via account settings
  Expected:      Confirmation of deletion within stated timeframe
  Actual:        PASS - Received confirmation within 24 hours; verified
                 data no longer accessible via account history
  Notes:         Cannot independently verify deletion from vendor's servers

TEST 4: Access Control Test
  Description:   Tested that non-admin team member cannot access admin-only tools
  Method:        Logged in with non-admin test account; attempted restricted actions
  Expected:      Access denied for admin-only operations
  Actual:        PASS - All restricted operations properly denied
  Notes:         None

TEST 5: Breach Response Drill
  Description:   Tabletop simulation of credential compromise scenario
  Method:        Walked through incident response procedure with team
  Expected:      Team follows documented procedure; key rotated within 15 minutes
  Actual:        PARTIAL PASS - Procedure followed, but key rotation took 25 minutes
                 due to unfamiliarity with one tool's dashboard
  Remediation:   Created quick-reference card for key rotation on each tool

SUMMARY:
- Tests Passed:    3 of 5
- Partial Passes:  2 of 5 (with remediation plans)
- Tests Failed:    0 of 5
- Overall Status:  SATISFACTORY (with remediation items)
- Next Simulation: Scheduled for 2026-05-12 (quarterly)
```

---

## Example 5: Monthly Quick Audit Output

**Context:** Output from Step 10 of the SOP (Monthly Routine).

```
MONTHLY PRIVACY QUICK AUDIT - February 2026
Auditor: [Privacy Champion]
Duration: 25 minutes

1. TOOL INVENTORY CHECK
   - Tools in inventory: 7
   - New tools added this month: 1 (automation platform for internal use)
   - Tools removed: 0
   - Action: Run privacy assessment on new tool (scheduled for this week)

2. PRIVACY POLICY CHANGES
   - Vendor policy updates detected: 1 (AI Assistant A updated ToS on 2026-02-05)
   - Change summary: Updated data retention clause; no material impact on our usage
   - Action: None required; documented change in audit log

3. CONTROL VERIFICATION
   - VPN active: YES
   - Training opt-out (all tools): YES (verified)
   - MFA (all accounts): YES
   - Encryption (disk): YES
   - Action: None required

4. MONITORING REVIEW
   - Anomalies detected: 0
   - Unusual usage patterns: None
   - Cost within expected range: YES
   - Action: None required

5. OPEN RISK ITEMS
   - Critical: 0
   - High: 1 (R-007: data retention issue; mitigation in progress)
   - Medium: 3 (on track for quarterly remediation)
   - Low: 2 (deferred to next quarter)
   - Action: Follow up on R-007 mitigation progress

OVERALL PRIVACY HEALTH SCORE: 7.5 / 10
Trend: Stable (7.5 last month, 7.0 two months ago)

NEXT AUDIT: March 2026 (monthly) / May 2026 (quarterly comprehensive)
```

---

## Usage Notes

- These examples are illustrative only and use synthetic data throughout
- Adapt the format and depth to your specific workspace and requirements
- All tool names, scores, and findings are fictional
- When creating your own outputs, apply the Redaction Guide before sharing externally
- Store completed audit outputs in encrypted or access-controlled storage
- Maintain a historical archive of audit outputs for trend analysis
