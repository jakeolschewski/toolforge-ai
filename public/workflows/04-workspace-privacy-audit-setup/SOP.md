# Workspace Privacy Audit & Setup - Standard Operating Procedure

## Overview and Objectives

The Workspace Privacy Audit & Setup Workflow provides a structured methodology for evaluating, hardening, and maintaining privacy controls across your AI workspace. This workflow guides you through identifying every tool and data flow, assessing privacy policies, implementing technical safeguards, simulating breach scenarios, and continuously refining your setup based on findings.

**Primary Objectives:**
- Map all tools, services, and data flows within your AI workspace
- Evaluate privacy policies and data handling practices for each tool
- Implement technical privacy controls (VPN, encryption, access restrictions)
- Validate privacy posture through audit simulations
- Establish ongoing monitoring and update cycles

**Expected Outcomes:**
- Complete data flow inventory documenting how information moves through your workspace
- Privacy risk matrix scoring each tool and data path
- Implemented technical controls (VPN, encryption, opt-out settings)
- Validated audit simulation confirming controls work as designed
- Documented setup guide for onboarding and team replication
- Monthly privacy review process integrated into standard operations

**W.E.D.G.E. Framework Integration:**
- **Workflow**: Systematizes privacy auditing into repeatable, scheduled procedures
- **Education**: Builds awareness of privacy risks inherent in AI tool usage
- **Data**: Protects sensitive information through controlled data flows and minimization
- **Guidance**: Provides clear checklists and decision trees for privacy controls
- **Empowerment**: Enables individuals and teams to self-audit without external consultants

## Prerequisites

- Inventory of AI tools and services currently in use (or willingness to create one)
- Access credentials to tool settings and privacy dashboards
- Basic understanding of data privacy concepts (data minimization, consent, encryption)
- VPN service or willingness to set one up
- 60-90 minutes for initial audit and setup
- Text editor or note-taking tool for documenting findings

## Step-by-Step Instructions

### Step 1: Catalog All AI Tools and Services (10-15 minutes)

Create a comprehensive inventory of every tool in your workspace:

1. **Identify Active Tools:**
   - [ ] List all AI assistants (ChatGPT, Claude, Gemini, Copilot, etc.)
   - [ ] List all productivity tools (Notion, Slack, Google Workspace, etc.)
   - [ ] List all development tools (IDEs, terminals, CI/CD platforms)
   - [ ] List all browser extensions with data access
   - [ ] List all mobile apps connected to workspace accounts
   - [ ] List all automation platforms (Zapier, Make, IFTTT, etc.)
   - [ ] List all cloud storage services (Dropbox, Google Drive, OneDrive, etc.)

2. **Document Tool Metadata:**
   - Tool name and version
   - Vendor/provider
   - Account type (free, paid, enterprise)
   - Primary use case in your workflow
   - Data types processed (text, code, images, audio, personal data)
   - Integration points (what other tools does it connect to?)
   - Account owner (individual or shared)

3. **Identify Shadow IT:**
   - [ ] Check browser history for tools used but not formally tracked
   - [ ] Review browser extensions installed across team members
   - [ ] Check for personal tool accounts used for work tasks
   - [ ] Identify any tools with automatic data syncing enabled
   - [ ] Review mobile devices for work-related apps

**Output:** Complete AI Workspace Tool Inventory spreadsheet

---

### Step 2: Map All Data Flows (10-15 minutes)

Trace how data moves between tools and external services:

1. **Document Input Flows:**
   - [ ] What data enters each tool? (user input, file uploads, API calls)
   - [ ] Where does that data originate? (local files, other tools, external sources)
   - [ ] Is data entered manually or automatically synced?
   - [ ] What format is the data in? (plain text, encrypted, structured)

2. **Document Output Flows:**
   - [ ] What data leaves each tool? (exports, API responses, shared links)
   - [ ] Where does output data go? (other tools, cloud storage, email)
   - [ ] Is output data cached or stored by the tool?
   - [ ] Can output data be accessed by the tool vendor?

3. **Document Internal Flows:**
   - [ ] Tool-to-tool integrations (e.g., Zapier connecting Slack to Notion)
   - [ ] Shared credentials or single sign-on connections
   - [ ] Automated data pipelines or scheduled syncs
   - [ ] Backup or replication flows

4. **Create Data Flow Diagram:**
   - Draw or diagram each tool as a node
   - Connect nodes with arrows showing data direction
   - Label arrows with data types (PII, code, general text, credentials)
   - Mark flows crossing organizational boundaries (internal vs. external)

**Output:** Data Flow Map (diagram or structured document)

---

### Step 3: Review Privacy Policies and Data Handling (15-20 minutes)

Evaluate each tool's privacy practices against your requirements:

1. **Privacy Policy Review:**
   - [ ] Locate and read each tool's privacy policy (focus on data collection, use, sharing)
   - [ ] Check Terms of Service for data ownership clauses
   - [ ] Identify whether tool uses your data for model training
   - [ ] Check data retention periods (how long is data stored?)
   - [ ] Verify data deletion procedures (can you delete your data?)
   - [ ] Review third-party data sharing provisions

2. **Data Training Opt-Out Status:**
   - [ ] For each AI tool, determine if your inputs are used for training
   - [ ] Check if opt-out is available and document how to enable it
   - [ ] Verify opt-out is actually applied to your account
   - [ ] Note any tools where opt-out is not possible

3. **Data Residency and Jurisdiction:**
   - [ ] Identify where each tool stores data geographically
   - [ ] Check if data crosses international borders
   - [ ] Verify compliance with applicable regulations (GDPR, CCPA, etc.)
   - [ ] Note any tools with data stored in jurisdictions of concern

4. **Score Each Tool:**
   - Privacy transparency (1-5): How clearly does the policy explain data handling?
   - Data minimization (1-5): Does the tool collect only what it needs?
   - User control (1-5): Can you manage, export, and delete your data?
   - Training opt-out (1-5): Is opt-out available, clear, and verifiable?
   - Overall privacy score: Average of above

**Output:** Privacy Policy Assessment Matrix

---

### Step 4: Identify and Classify Privacy Risks (10-15 minutes)

Categorize risks discovered during policy review and data flow mapping:

1. **Risk Identification:**
   - [ ] Tools with no training opt-out (data used to train models)
   - [ ] Data flows crossing unencrypted channels
   - [ ] Tools with excessive data retention periods
   - [ ] Shared accounts or credentials without audit trails
   - [ ] Tools with broad third-party data sharing
   - [ ] Uncontrolled browser extensions with data access
   - [ ] Shadow IT tools without organizational approval
   - [ ] Data flows containing PII or sensitive information without protection

2. **Risk Classification:**

   **Critical (address immediately):**
   - PII exposed in unencrypted data flows
   - No training opt-out for tools processing sensitive data
   - Tools with known data breach history and no remediation
   - Regulatory non-compliance (GDPR, HIPAA violations)

   **High (address within 1 week):**
   - Tools with unclear privacy policies
   - Data retained longer than necessary
   - Shared credentials without rotation schedule
   - Missing encryption in transit or at rest

   **Medium (address within 1 month):**
   - Excessive permissions granted to tools
   - Browser extensions with broad data access
   - Missing data flow documentation
   - No regular audit schedule

   **Low (address during next review cycle):**
   - Tools with privacy features not yet configured
   - Optimization opportunities for existing controls
   - Documentation gaps

3. **Build Risk Register:**
   - Risk ID and description
   - Affected tool(s) and data flow(s)
   - Classification (critical/high/medium/low)
   - Likelihood (1-5)
   - Impact (1-5)
   - Risk score (likelihood x impact)
   - Recommended mitigation
   - Owner and target date

**Output:** Privacy Risk Register with classifications and scores

---

### Step 5: Implement Technical Privacy Controls (15-20 minutes)

Deploy protective measures based on risk findings:

1. **Network-Level Controls:**
   - [ ] Configure VPN for all AI tool interactions
   - [ ] Enable DNS-over-HTTPS or DNS-over-TLS
   - [ ] Block known tracking domains at the network level
   - [ ] Verify HTTPS enforcement for all tool connections
   - [ ] Configure firewall rules to restrict unnecessary outbound traffic

2. **Tool-Level Controls:**
   - [ ] Enable training opt-out on all AI tools that support it
   - [ ] Disable unnecessary data collection features (analytics, telemetry)
   - [ ] Configure minimum data retention settings
   - [ ] Enable end-to-end encryption where available
   - [ ] Set up data export and deletion procedures for each tool
   - [ ] Disable auto-save or cloud sync for sensitive documents

3. **Browser and Client Controls:**
   - [ ] Install privacy-focused browser extensions (ad blockers, tracker blockers)
   - [ ] Review and restrict browser extension permissions
   - [ ] Configure browser privacy settings (block third-party cookies, etc.)
   - [ ] Use separate browser profiles for work and personal use
   - [ ] Clear browsing data on schedule

4. **Access Controls:**
   - [ ] Enable multi-factor authentication on all tool accounts
   - [ ] Use unique passwords for each tool (via password manager)
   - [ ] Restrict API key scopes to minimum necessary permissions
   - [ ] Review and remove unnecessary integrations between tools
   - [ ] Disable unused accounts and services

5. **Encryption Controls:**
   - [ ] Encrypt local storage (FileVault, BitLocker, LUKS)
   - [ ] Encrypt backups
   - [ ] Use encrypted communication channels for sharing credentials
   - [ ] Verify tools encrypt data at rest and in transit

**Output:** Implemented controls checklist with verification status

---

### Step 6: Configure Privacy Monitoring (10-15 minutes)

Set up ongoing visibility into privacy-relevant events:

1. **Tool Usage Monitoring:**
   - [ ] Enable audit logs where available (admin panels, API usage dashboards)
   - [ ] Configure usage alerts for unusual patterns
   - [ ] Track which team members access which tools
   - [ ] Monitor API call volumes and data transfer sizes

2. **Data Flow Monitoring:**
   - [ ] Set up network monitoring for unexpected data destinations
   - [ ] Configure alerts for data transfers exceeding normal volumes
   - [ ] Monitor for unauthorized tool-to-tool connections
   - [ ] Track data export events

3. **Privacy Event Alerts:**
   - [ ] Configure notifications for privacy policy changes from vendors
   - [ ] Set up alerts for new tool installations or integrations
   - [ ] Monitor for credential leaks (Have I Been Pwned, breach notifications)
   - [ ] Track consent and opt-out status changes

4. **Dashboard Setup:**
   - Create a single-pane view showing:
     - Number of tools in inventory
     - Privacy score distribution
     - Open risk items by severity
     - Control implementation status
     - Last audit date and next scheduled audit

**Output:** Privacy monitoring configuration and dashboard

---

### Step 7: Run Audit Simulation (10-15 minutes)

Validate controls through simulated scenarios:

1. **Data Leak Simulation:**
   - [ ] Attempt to share sensitive test data through each tool
   - [ ] Verify controls prevent unintended data exposure
   - [ ] Check if VPN is properly masking your network identity
   - [ ] Test whether training opt-out is actually preventing data retention
   - [ ] Verify encrypted channels are functioning correctly

2. **Access Control Simulation:**
   - [ ] Test with a non-privileged account to verify access restrictions
   - [ ] Attempt to access tools without MFA to confirm enforcement
   - [ ] Verify removed integrations are actually disconnected
   - [ ] Test data deletion to confirm data is actually removed

3. **Breach Response Simulation:**
   - [ ] Simulate a credential compromise: how quickly can you rotate?
   - [ ] Test data export procedures: can you extract your data promptly?
   - [ ] Verify notification procedures: does the alert chain work?
   - [ ] Test account lockout and recovery processes

4. **Document Results:**
   - For each simulation test:
     - Test description
     - Expected outcome
     - Actual outcome
     - Pass/Fail status
     - Remediation needed (if failed)

**Output:** Audit Simulation Report with pass/fail results

---

### Step 8: Remediate Findings and Update Setup (10-15 minutes)

Address issues discovered during the audit simulation:

1. **Prioritize Remediation:**
   - [ ] Address all failed simulation tests (critical first)
   - [ ] Close critical and high-risk items from the risk register
   - [ ] Update controls that did not perform as expected
   - [ ] Reconfigure tools with inadequate privacy settings

2. **Update Documentation:**
   - [ ] Revise data flow map with any changes
   - [ ] Update tool inventory with new settings
   - [ ] Document control changes and rationale
   - [ ] Update risk register with remediation status

3. **Re-Test After Changes:**
   - [ ] Re-run failed simulation tests after remediation
   - [ ] Verify new controls do not break existing workflows
   - [ ] Confirm all integrations still function correctly
   - [ ] Document re-test results

**Output:** Remediation log with before/after status

---

### Step 9: Create Team Privacy Guidelines (10-15 minutes)

Document standards for team-wide adoption:

1. **Privacy Policy for AI Workspace:**
   - Approved tools list (with privacy scores)
   - Required privacy settings for each tool
   - Data handling procedures (what can and cannot be shared with AI tools)
   - Prohibited practices (e.g., no PII in AI prompts, no sensitive code in public models)
   - Incident reporting procedures

2. **Onboarding Privacy Checklist:**
   - [ ] New member reviews approved tools list
   - [ ] Privacy settings configured on all tools
   - [ ] VPN installed and configured
   - [ ] Training opt-out enabled on all AI tools
   - [ ] MFA enabled on all accounts
   - [ ] Privacy guidelines acknowledged

3. **Quick Reference Card:**
   - DO: Use approved tools, enable VPN, opt out of training
   - DON'T: Share PII with AI tools, use unapproved tools, disable encryption
   - REPORT: Suspicious activity, new tool requests, policy violations

**Output:** Team Privacy Guidelines document and onboarding checklist

---

### Step 10: Integrate Audit into Monthly Routine (5-10 minutes)

Establish recurring privacy maintenance:

1. **Monthly Quick Audit (20-30 minutes):**
   - [ ] Review tool inventory for changes (new tools added, tools removed)
   - [ ] Check privacy policy updates from vendors
   - [ ] Verify all controls still active (VPN, opt-out, MFA)
   - [ ] Review monitoring dashboards for anomalies
   - [ ] Check open risk items and remediation progress
   - [ ] Update privacy scores if policies changed

2. **Quarterly Comprehensive Audit (60-90 minutes):**
   - [ ] Full data flow review and diagram update
   - [ ] Re-run audit simulation for all critical controls
   - [ ] Review team compliance with privacy guidelines
   - [ ] Assess new tools or integrations for privacy impact
   - [ ] Update risk register and close resolved items
   - [ ] Report findings to stakeholders
   - [ ] Evaluate if current tools should be replaced with more private alternatives

3. **Annual Privacy Review (Half day):**
   - [ ] Complete workspace privacy posture assessment
   - [ ] Review all incidents and near-misses from the year
   - [ ] Update policies based on new regulations or threats
   - [ ] Evaluate emerging privacy-enhancing technologies
   - [ ] Conduct team privacy awareness training
   - [ ] Executive summary for leadership

4. **Calendar Setup:**
   - [ ] Schedule monthly quick audit (recurring, 30 min)
   - [ ] Schedule quarterly comprehensive audit (recurring, 90 min)
   - [ ] Schedule annual review (recurring, half day)
   - [ ] Set reminders for vendor policy review dates

**Output:** Recurring audit schedule with calendar entries and procedures

---

## Best Practices

1. **Data Minimization First:** Only share the minimum data necessary with each tool; strip PII before submitting prompts
2. **Default to Private:** Configure every new tool with the most restrictive privacy settings before first use
3. **VPN as Standard:** Route all AI tool traffic through a VPN to prevent network-level data leakage
4. **Opt Out of Training:** Always disable model training on your data wherever the option exists
5. **Separate Contexts:** Use different accounts or profiles to isolate personal, work, and client data
6. **Encrypt Everything:** Enable encryption at rest and in transit for all storage and communication
7. **Audit Before Integrating:** Run a privacy assessment on any new tool before connecting it to your workspace
8. **Document Data Flows:** Maintain an up-to-date diagram of how data moves through your workspace
9. **Regular Policy Review:** Privacy policies change; re-read them at least quarterly for each tool
10. **Team Accountability:** Ensure every team member understands and follows privacy guidelines

## Common Pitfalls

1. **Assuming Free Tools Are Private:** Free tiers often monetize through data; read the fine print
   - *Solution:* Score every tool's privacy policy regardless of pricing tier

2. **Ignoring Browser Extensions:** Extensions can read all page content including AI conversations
   - *Solution:* Audit extensions quarterly; remove any with unnecessary permissions

3. **One-Time Audit Mentality:** Privacy is not a checkbox; it requires ongoing maintenance
   - *Solution:* Schedule recurring audits and treat them as non-negotiable appointments

4. **Overlooking Data in Transit:** Focusing on storage encryption while ignoring transmission
   - *Solution:* Verify HTTPS and VPN coverage for all tool interactions

5. **Shadow IT Blind Spots:** Team members using unapproved tools for convenience
   - *Solution:* Maintain an approved tools list and make it easy to request additions

6. **Trusting Opt-Out Blindly:** Clicking opt-out without verifying it actually works
   - *Solution:* Test opt-out by checking data deletion and verifying with support

7. **Generic Privacy Settings:** Applying the same settings to all tools regardless of risk
   - *Solution:* Tailor controls to each tool's risk level and data sensitivity

8. **No Incident Response Plan:** Discovering a privacy issue with no plan to respond
   - *Solution:* Document response procedures before you need them

## Time Estimates

- **Initial Full Audit and Setup:** 60-90 minutes (first time)
- **Monthly Quick Audit:** 20-30 minutes
- **Quarterly Comprehensive Audit:** 60-90 minutes
- **Annual Privacy Review:** 3-4 hours
- **New Tool Privacy Assessment:** 15-20 minutes per tool
- **Incident Response:** 1-4 hours (depending on severity)

## Success Criteria

You have successfully completed your workspace privacy audit and setup when:

- [ ] Complete inventory of all AI tools with privacy scores assigned
- [ ] Data flow map documents all input, output, and internal data movement
- [ ] Privacy policies reviewed and scored for every tool in the workspace
- [ ] Risk register populated with all identified risks classified by severity
- [ ] VPN configured and verified for all AI tool interactions
- [ ] Training opt-out enabled and verified on all AI tools
- [ ] MFA enabled on all tool accounts
- [ ] Encryption verified for data at rest and in transit
- [ ] Audit simulation completed with all critical tests passing
- [ ] Team privacy guidelines documented and distributed
- [ ] Monthly audit schedule established with calendar reminders

## Educational Disclaimer

This workflow provides general guidance on privacy auditing and workspace configuration for AI tools. It is not a substitute for professional legal, compliance, or cybersecurity advice. Organizations subject to specific regulations (GDPR, HIPAA, CCPA, etc.) should consult qualified professionals to ensure full compliance. Privacy requirements vary by jurisdiction, industry, and use case. This SOP does not constitute professional privacy or legal advice.

## Revision History

- v1.0 (2026-02-12): Initial SOP creation
- Focus areas: Tool inventory, data flow mapping, privacy controls, audit simulation

## Related Workflows

- Workflow #1: Personal AI Tool Stack Quiz & Builder
- Workflow #2: Secure API Key Management
- Workflow #3: AI Ethics & Bias Check Template
- Workflow #5: Tool Integration Quickstart (No-Code)
