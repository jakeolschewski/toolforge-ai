# Secure API Key Management Workflow - Standard Operating Procedure

## Overview and Objectives

The Secure API Key Management Workflow provides a systematic approach to creating, storing, rotating, and auditing API keys and authentication credentials for AI tools and services. This workflow prevents security breaches, credential leakage, and unauthorized access while maintaining operational efficiency.

**Primary Objectives:**
- Establish secure API key generation and storage practices
- Implement least-privilege access principles
- Create rotation schedules and audit trails
- Prevent credential exposure in code, documents, and shared environments
- Enable team collaboration without compromising security

**Expected Outcomes:**
- Zero credentials stored in plain text or version control
- Documented inventory of all API keys and their purposes
- Automated rotation reminders and expiration tracking
- Incident response plan for credential compromise
- Compliance with security best practices (SOC 2, ISO 27001 principles)

**W.E.D.G.E Framework Integration:**
- **Workflow**: Systematizes credential lifecycle management
- **Education**: Builds security awareness and best practices
- **Data**: Protects authentication credentials as sensitive data
- **Guidance**: Provides clear procedures for secure key management
- **Empowerment**: Enables secure self-service credential management

## Prerequisites

- Access to systems requiring API key configuration
- Password manager or secrets management tool
- Basic understanding of API authentication concepts
- 45-60 minutes for initial setup
- Text editor for environment variable configuration

## Step-by-Step Instructions

### Step 1: Inventory Existing API Keys (10-15 minutes)

Create comprehensive list of all current API keys and credentials:

1. **Audit Current Locations:**
   - [ ] Check code repositories (search for "api_key", "API_KEY", "token", "secret")
   - [ ] Review configuration files (.env, config.json, settings.py)
   - [ ] Check documentation and wikis
   - [ ] Search email for "API key" or "credentials"
   - [ ] Review password managers
   - [ ] Check browser saved passwords
   - [ ] Look in note-taking apps (Notion, Evernote, etc.)

2. **Document Each Credential:**
   - Service name (e.g., "OpenAI API", "Anthropic Claude")
   - Key identifier (last 4 characters only, never full key)
   - Purpose/use case
   - Current storage location
   - Creation date (if known)
   - Last rotation date
   - Access scope/permissions
   - Who has access (individual or team)

3. **Identify High-Risk Credentials:**
   - Keys in version control history
   - Keys in shared documents (Google Docs, Confluence)
   - Keys in email or chat histories
   - Keys with full account access (vs. limited scope)
   - Keys shared with multiple people
   - Keys never rotated (> 90 days old)

**Output:** API Key Inventory spreadsheet/database

---

### Step 2: Establish Secure Storage System (10-15 minutes)

Choose and configure appropriate credential storage solution:

**Option A: Password Manager (Individual Use)**
- **Best for:** Freelancers, small teams (1-5 people)
- **Recommended tools:** 1Password, Bitwarden, LastPass
- **Setup:**
  1. Create dedicated vault for "API Keys & Credentials"
  2. Use structured naming: "[Service] API Key - [Environment] - [Purpose]"
  3. Enable 2FA on password manager account
  4. Set up secure sharing for team members (if applicable)

**Option B: Environment Variables + Encrypted Files (Developers)**
- **Best for:** Individual developers, local development
- **Setup:**
  1. Create `.env` file in project root (add to .gitignore)
  2. Use environment variable manager (direnv, dotenv)
  3. Store `.env` backup in password manager
  4. Never commit .env to version control

**Option C: Secrets Management Service (Teams/Enterprise)**
- **Best for:** Teams, production environments, compliance needs
- **Recommended tools:** HashiCorp Vault, AWS Secrets Manager, Azure Key Vault, Google Secret Manager
- **Setup:**
  1. Provision secrets management service
  2. Configure access policies (IAM roles, permissions)
  3. Implement SDK/CLI for application access
  4. Set up audit logging

**Selection Criteria:**
- Individual use → Password Manager
- Development team → Environment Variables + Password Manager
- Production apps → Secrets Management Service
- Compliance requirements → Enterprise Secrets Management

**Output:** Configured secure storage system

---

### Step 3: Migrate Existing Keys to Secure Storage (15-20 minutes)

Transfer all credentials from inventory to secure storage:

1. **For Each API Key:**
   - [ ] Copy key to secure storage (password manager or secrets service)
   - [ ] Add metadata:
     - Service name
     - Environment (development, staging, production)
     - Purpose
     - Creation date
     - Rotation schedule
     - Access scope
   - [ ] Test that key still works before deleting from old location
   - [ ] Delete key from insecure location
   - [ ] Document deletion in audit log

2. **Remove from Insecure Locations:**
   - [ ] Delete from code files (replace with environment variable references)
   - [ ] Remove from configuration files (use secrets injection)
   - [ ] Delete from documentation (link to "how to obtain" instead)
   - [ ] Purge from email/chat (if possible)
   - [ ] Clear browser saved passwords
   - [ ] Remove from note-taking apps

3. **Update Code References:**
   ```python
   # BEFORE (Insecure)
   api_key = "sk-1234567890abcdef"

   # AFTER (Secure)
   import os
   api_key = os.environ.get('OPENAI_API_KEY')
   if not api_key:
       raise ValueError("OPENAI_API_KEY environment variable not set")
   ```

4. **Version Control Cleanup:**
   - [ ] If keys were committed to git, they're in history permanently
   - [ ] Rotate those keys immediately (Step 5)
   - [ ] Consider using tools like `git-secrets` or `gitleaks` to scan history
   - [ ] For severe exposures, consider repository rewriting (BFG Repo-Cleaner)

**Output:** All credentials in secure storage, zero in insecure locations

---

### Step 4: Implement Least-Privilege Access (10-15 minutes)

Configure API keys with minimum necessary permissions:

1. **Review Current Permissions:**
   - For each API key, identify what permissions it currently has
   - Determine what permissions are actually needed
   - Note any over-permissioned keys

2. **Create Scoped Keys:**
   - **Instead of:** Full account access key
   - **Use:** Service-specific, permission-limited keys

   **Example (OpenAI):**
   - Don't use: Organization owner key with all permissions
   - Do use: API key restricted to specific models, rate limits

3. **Separate by Environment:**
   - **Development:** Lower rate limits, test data only
   - **Staging:** Medium limits, safe to reset
   - **Production:** Full limits, carefully monitored

4. **Team Access Patterns:**
   - Create separate keys per team member (vs. sharing one key)
   - Use service accounts for automation (not personal keys)
   - Implement key tagging/labeling for tracking

5. **Apply Principle of Least Privilege:**
   - Can the key be read-only? Make it read-only
   - Can usage be limited to specific IP ranges? Add IP restrictions
   - Can rate limits be lowered? Set conservative limits
   - Can key be time-limited? Set expiration dates

**Output:** All API keys scoped to minimum necessary permissions

---

### Step 5: Establish Rotation Schedule (5-10 minutes)

Create systematic key rotation process:

1. **Define Rotation Policies:**

   **High-Risk Keys (rotate every 30 days):**
   - Keys with production data access
   - Keys with write/modify permissions
   - Keys shared among team members
   - Keys for compliance-required systems (HIPAA, PCI, etc.)

   **Medium-Risk Keys (rotate every 90 days):**
   - Keys with read-only access
   - Development/staging environment keys
   - Personal use keys with limited scope

   **Low-Risk Keys (rotate every 180 days or on-demand):**
   - Test environment keys
   - Documentation/demo keys
   - Sandbox environment keys

2. **Create Rotation Reminders:**
   - Add to calendar (recurring events)
   - Set up password manager expiration notifications
   - Use secrets management service TTL/expiration features
   - Create rotation checklist in task manager

3. **Document Rotation Procedure:**
   ```
   KEY ROTATION CHECKLIST:
   [ ] Generate new API key in service dashboard
   [ ] Test new key in staging/development environment
   [ ] Update secure storage with new key
   [ ] Deploy new key to production (blue-green if possible)
   [ ] Verify production systems using new key
   [ ] Revoke old key in service dashboard
   [ ] Document rotation in audit log (date, who, why)
   [ ] Confirm old key no longer works
   ```

4. **Emergency Rotation Triggers:**
   - Suspected compromise or exposure
   - Team member departure (if they had access)
   - Service provider security incident
   - Unusual usage patterns detected
   - Key approaching expiration
   - Compliance audit requirement

**Output:** Rotation schedule with calendar reminders and procedures

---

### Step 6: Implement Access Controls (10-15 minutes)

Establish who can access which credentials:

1. **Define Access Tiers:**

   **Tier 1 - Administrators:**
   - Full access to all keys
   - Can create, rotate, revoke keys
   - Access to audit logs

   **Tier 2 - Developers:**
   - Access to development/staging keys
   - Read-only access to production key metadata
   - Cannot revoke production keys

   **Tier 3 - Contractors/Temporary:**
   - Access to specific keys only
   - Time-limited access
   - Cannot share or export keys

2. **Implement Technical Controls:**

   **Password Manager:**
   - Create shared vaults with role-based access
   - Use "view-only" permissions where possible
   - Enable access request workflows

   **Secrets Management Service:**
   - Configure IAM policies restricting access
   - Require MFA for sensitive operations
   - Implement approval workflows for production access

   **Environment Variables:**
   - Use server-side injection (don't distribute .env files)
   - Restrict file system permissions (chmod 600)
   - Use encrypted environment variable services (e.g., Doppler, Infisical)

3. **Onboarding/Offboarding Process:**

   **Onboarding New Team Member:**
   - [ ] Assess required access level
   - [ ] Grant minimum necessary key access
   - [ ] Provide security training on key handling
   - [ ] Document access granted (who, what, when)

   **Offboarding Departing Team Member:**
   - [ ] Revoke all password manager/secrets service access
   - [ ] Rotate all shared keys they had access to
   - [ ] Review access logs for unusual activity
   - [ ] Document access revocation

**Output:** Access control policy and technical implementation

---

### Step 7: Set Up Monitoring and Alerts (10-15 minutes)

Implement detection for unusual API key usage:

1. **Enable Service-Side Monitoring:**
   - Activate usage dashboards (most API providers offer this)
   - Set up billing alerts for unexpected usage spikes
   - Enable security notifications from providers
   - Configure rate limit alerts

2. **Monitor for Anomalies:**

   **Usage Patterns to Track:**
   - Requests per day/hour (detect spikes)
   - Geographic locations (detect access from unexpected countries)
   - Error rates (detect credential issues)
   - Cost per day (detect crypto mining or abuse)

   **Alert Thresholds:**
   - Usage > 150% of normal daily average
   - Requests from blacklisted countries
   - Error rate > 25%
   - Daily cost > 2x typical

3. **Set Up Alert Channels:**
   - Email notifications for critical alerts
   - Slack/Teams integration for team awareness
   - PagerDuty/OpsGenie for production incidents
   - Dashboard for at-a-glance status

4. **Audit Logging:**
   - Log all key creation events
   - Log all key rotation events
   - Log all access grant/revoke events
   - Log all failed authentication attempts
   - Retain logs for compliance periods (90 days minimum, 1 year for compliance)

**Example Alert Configuration (OpenAI):**
```
Alert: "OpenAI API Usage Spike"
Condition: Daily token usage > 1.5x 30-day average
Action: Send email + Slack notification
Escalation: If continues for 2 hours, page on-call engineer
```

**Output:** Monitoring dashboards and alert configurations

---

### Step 8: Create Incident Response Plan (5-10 minutes)

Prepare for potential credential compromise:

1. **Develop Response Playbook:**

   **Suspected Key Compromise - Response Steps:**

   **Immediately (< 5 minutes):**
   - [ ] Revoke compromised key in service dashboard
   - [ ] Generate new replacement key
   - [ ] Update production systems with new key
   - [ ] Notify team via emergency channel

   **Within 1 Hour:**
   - [ ] Review service access logs for unauthorized usage
   - [ ] Check billing for unexpected charges
   - [ ] Identify scope of potential data exposure
   - [ ] Document timeline of events

   **Within 24 Hours:**
   - [ ] Complete incident report
   - [ ] Notify affected stakeholders (if data exposed)
   - [ ] Implement additional controls to prevent recurrence
   - [ ] Review and update security procedures

   **Within 1 Week:**
   - [ ] Conduct post-incident review
   - [ ] Update documentation with lessons learned
   - [ ] Provide team training on prevention
   - [ ] Consider third-party security audit

2. **Define Severity Levels:**

   **Critical (P0):**
   - Production key with customer data access compromised
   - Key used in malicious activity (detected via monitoring)
   - Response time: Immediate (< 5 minutes)

   **High (P1):**
   - Staging/development key compromised
   - Suspected exposure (key found in public repository)
   - Response time: < 1 hour

   **Medium (P2):**
   - Key approaching expiration not rotated
   - Anomalous usage detected but not confirmed malicious
   - Response time: < 24 hours

   **Low (P3):**
   - Routine rotation reminder
   - Access audit finding
   - Response time: Next business day

3. **Contact List:**
   - Service provider support (for revocation assistance)
   - Internal security team
   - Legal/compliance (for breach notification requirements)
   - Team leads/managers
   - Incident commander (who coordinates response)

**Output:** Documented incident response playbook

---

### Step 9: Document and Train Team (10-15 minutes)

Create resources for ongoing secure key management:

1. **Create Documentation:**

   **Security Policy Document:**
   - Approved storage methods
   - Rotation requirements
   - Access request procedures
   - Forbidden practices (never commit keys, never email keys, etc.)

   **How-To Guides:**
   - "How to Request API Key Access"
   - "How to Rotate an API Key"
   - "How to Report Suspected Compromise"
   - "Setting Up Environment Variables"

   **Quick Reference:**
   - Service-specific rotation procedures
   - Emergency contact information
   - Common troubleshooting steps

2. **Conduct Training:**

   **Onboarding Training (30 min):**
   - Why API key security matters
   - Tour of secure storage system
   - Hands-on: Setting up environment variables
   - What to do if they suspect compromise

   **Refresher Training (15 min quarterly):**
   - Review recent security incidents (industry-wide)
   - Updates to policies or procedures
   - New tools or features
   - Q&A on common issues

3. **Create Self-Service Resources:**
   - Video walkthrough of common tasks
   - FAQ document
   - Troubleshooting flowchart
   - Internal wiki or knowledge base

**Output:** Complete documentation package and training materials

---

### Step 10: Conduct Regular Audits (Ongoing)

Establish periodic review process:

1. **Monthly Quick Check (15 minutes):**
   - [ ] Review API usage dashboards for anomalies
   - [ ] Check for any expiring keys (next 30 days)
   - [ ] Verify all monitoring alerts are working
   - [ ] Scan for new keys not in inventory

2. **Quarterly Comprehensive Audit (60-90 minutes):**
   - [ ] Review complete API key inventory
   - [ ] Verify all keys are in secure storage
   - [ ] Check compliance with rotation schedules
   - [ ] Review access controls (add/remove users as needed)
   - [ ] Test incident response procedures (tabletop exercise)
   - [ ] Update documentation for any changed procedures
   - [ ] Scan code repositories for exposed credentials (use automated tools)
   - [ ] Review and address findings from previous audit

3. **Annual Security Review (Half day):**
   - [ ] Comprehensive security posture assessment
   - [ ] Review of all incidents and near-misses
   - [ ] Update policies based on new threats or regulations
   - [ ] Evaluate secrets management tools (still appropriate?)
   - [ ] Penetration testing or security audit (if budget allows)
   - [ ] Team security awareness assessment
   - [ ] Executive summary for leadership

**Output:** Audit reports with findings and remediation plans

---

## Best Practices

1. **Never Commit Keys to Version Control:** Use .gitignore, environment variables, and secrets scanning tools
2. **Unique Keys Per Environment:** Different keys for dev, staging, production
3. **Unique Keys Per Team Member:** Avoid sharing keys; create individual credentials
4. **Least Privilege Always:** Grant minimum permissions necessary
5. **Automate Where Possible:** Use secrets management SDKs, rotation automation
6. **Monitor Continuously:** Set up alerts; don't wait for bills to notice compromise
7. **Rotate Proactively:** Don't wait for suspected compromise
8. **Document Everything:** Policies, procedures, incidents
9. **Test Recovery:** Periodically test key rotation to ensure smooth process
10. **Stay Current:** Follow security advisories from API providers

## Common Pitfalls

1. **"Temporary" Hardcoded Keys:** Never acceptable, even for quick tests
   - *Solution:* Use .env files even for local development

2. **Shared Team Keys:** Makes attribution impossible, complicates rotation
   - *Solution:* Issue individual keys, use service accounts for automation

3. **"Security Through Obscurity":** Hiding keys in non-obvious variable names
   - *Solution:* Assume all code is public; use proper secrets management

4. **Forgotten Keys in Old Projects:** Abandoned repos with active keys
   - *Solution:* Inventory and rotate annually; deactivate unused keys

5. **Email or Chat Distribution:** "Here's the API key" in Slack
   - *Solution:* Use secure sharing features in password managers

6. **Screenshot Exposure:** Screenshots of dashboards with keys visible
   - *Solution:* Blur/redact keys before sharing screenshots

7. **Delayed Rotation on Departure:** Former employee retains access
   - *Solution:* Automate offboarding checklist with immediate rotation

8. **No Monitoring:** Not noticing abuse until massive bill arrives
   - *Solution:* Set up billing alerts and usage monitoring from day one

## Time Estimates

- **Initial Setup:** 45-75 minutes (first time)
- **Monthly Maintenance:** 15-20 minutes
- **Quarterly Audits:** 60-90 minutes
- **Key Rotation:** 5-10 minutes per key
- **Incident Response:** 1-8 hours (depending on severity)

## Success Criteria

You've successfully implemented secure API key management when:

- [ ] Zero API keys stored in plain text outside secure storage
- [ ] Complete inventory of all keys with metadata
- [ ] All keys scoped to least-privilege permissions
- [ ] Rotation schedule established with calendar reminders
- [ ] Access controls implemented and documented
- [ ] Monitoring and alerts configured and tested
- [ ] Incident response plan documented and team trained
- [ ] No keys in version control (verified via scanning tools)
- [ ] Team members trained and following procedures
- [ ] Regular audits scheduled and conducted

## Educational Disclaimer

This workflow provides guidance on security best practices for API key management. Organizations should adapt these procedures to their specific security requirements, compliance obligations, and risk tolerance. For regulated industries or high-security environments, consult with qualified security professionals and legal counsel. This SOP does not constitute professional security advice.

## Revision History

- v1.0 (2026-02-12): Initial SOP creation
- Focus areas: Secure storage, rotation, monitoring, incident response

## Related Workflows

- Workflow #1: Personal AI Tool Stack Quiz & Builder
- Workflow #4: Workspace Privacy Audit & Setup
- Workflow #5: Tool Integration Quickstart (No-Code)
