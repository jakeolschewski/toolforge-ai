# Data Redaction Basics for Beginners - Standard Operating Procedure

## Overview and Objectives

The Data Redaction Basics Workflow provides a systematic approach to identifying, masking, and removing sensitive data from documents, datasets, AI inputs, and AI outputs. This workflow prevents accidental exposure of personally identifiable information (PII), financial data, health records, and other protected information while maintaining the usability of your content.

**Primary Objectives:**
- Establish repeatable processes for identifying sensitive data types
- Implement manual and tool-based redaction techniques
- Apply redaction consistently to both AI inputs and AI outputs
- Verify post-redaction completeness and accuracy
- Document redaction processes for compliance audits and team handoffs

**Expected Outcomes:**
- Zero instances of real PII, financial data, or protected information in shared documents
- Documented inventory of sensitive data types relevant to your workflows
- Standardized redaction patterns and replacement tokens (e.g., [NAME], [EMAIL])
- Verified redaction checklists for every data type encountered
- Compliance-ready audit trail of redaction decisions and actions

**W.E.D.G.E Framework Integration:**
- **Workflow**: Systematizes data redaction as a repeatable, auditable process
- **Education**: Builds awareness of sensitive data types and redaction best practices
- **Data**: Protects PII, financial records, and proprietary information from exposure
- **Guidance**: Provides clear step-by-step procedures for manual and automated redaction
- **Empowerment**: Enables individuals and teams to handle sensitive data confidently

## Prerequisites

- Access to documents, datasets, or AI workflows containing potentially sensitive data
- Text editor or word processor for manual redaction
- Basic understanding of PII categories (names, emails, phone numbers, addresses)
- 45-60 minutes for initial setup and first redaction pass
- Optional: Automated redaction tool (Microsoft Presidio, Amazon Comprehend, or similar)

## Step-by-Step Instructions

### Step 1: Define Your Sensitive Data Categories (10-15 minutes)

Create a comprehensive classification of data types you need to redact:

1. **Identify PII Categories:**
   - [ ] Full names (first, last, middle)
   - [ ] Email addresses (personal and professional)
   - [ ] Phone numbers (mobile, landline, fax)
   - [ ] Physical addresses (street, city, state, ZIP, country)
   - [ ] Dates of birth and ages
   - [ ] Social Security Numbers (SSN) or national ID numbers
   - [ ] Driver's license and passport numbers
   - [ ] Usernames, screen names, and account IDs

2. **Identify Financial Data:**
   - [ ] Credit card numbers (full or partial)
   - [ ] Bank account and routing numbers
   - [ ] Tax identification numbers (EIN, ITIN)
   - [ ] Salary, compensation, and billing amounts
   - [ ] Invoice numbers linked to individuals
   - [ ] Insurance policy numbers

3. **Identify Health and Protected Data:**
   - [ ] Medical record numbers (MRN)
   - [ ] Diagnosis codes, treatment details
   - [ ] Health insurance information
   - [ ] Biometric data (fingerprints, facial recognition IDs)
   - [ ] Genetic information

4. **Identify Organizational/Proprietary Data:**
   - [ ] Internal project codenames
   - [ ] Client or customer names (if confidential)
   - [ ] Trade secrets, proprietary processes
   - [ ] Non-public financial figures (revenue, costs)
   - [ ] Internal IP addresses, server names, API endpoints

**Output:** Sensitive Data Classification Document listing all categories relevant to your workflows

---

### Step 2: Establish Redaction Tokens and Conventions (5-10 minutes)

Define standardized replacement patterns for each data category:

1. **Create Token Mapping:**

   | Data Type | Redaction Token | Example Before | Example After |
   |-----------|----------------|----------------|---------------|
   | Full Name | [NAME] | John Smith | [NAME] |
   | First Name | [FIRST_NAME] | John | [FIRST_NAME] |
   | Last Name | [LAST_NAME] | Smith | [LAST_NAME] |
   | Email | [EMAIL] | john@example.com | [EMAIL] |
   | Phone | [PHONE] | (555) 123-4567 | [PHONE] |
   | Address | [ADDRESS] | 123 Main St, City, ST 12345 | [ADDRESS] |
   | SSN | [SSN] | 123-45-6789 | [SSN] |
   | Credit Card | [CC_NUMBER] | 4111-1111-1111-1111 | [CC_NUMBER] |
   | Date of Birth | [DOB] | 01/15/1990 | [DOB] |
   | Company Name | [COMPANY] | Acme Corp | [COMPANY] |
   | Account ID | [ACCOUNT_ID] | USR-9847362 | [ACCOUNT_ID] |
   | IP Address | [IP_ADDRESS] | 192.168.1.42 | [IP_ADDRESS] |

2. **Set Numbering Conventions (for multi-instance documents):**
   - Multiple distinct names: [NAME_1], [NAME_2], [NAME_3]
   - Multiple emails: [EMAIL_1], [EMAIL_2]
   - Preserves relationships without revealing identity

3. **Document Your Token Standard:**
   - [ ] Save token mapping in a shared reference document
   - [ ] Ensure all team members use the same tokens
   - [ ] Include tokens in onboarding materials

**Output:** Standardized Redaction Token Reference Sheet

---

### Step 3: Perform Initial Data Scan (10-15 minutes)

Systematically scan your documents or datasets for sensitive information:

1. **Manual Keyword Search:**
   - [ ] Search for common name patterns (capitalized words in context)
   - [ ] Search for email patterns (look for "@" symbol)
   - [ ] Search for phone patterns (parentheses, dashes in digit strings)
   - [ ] Search for address patterns (street, avenue, blvd, suite, ZIP codes)
   - [ ] Search for number patterns (SSN: XXX-XX-XXXX, CC: 16 digits)
   - [ ] Search for date patterns (MM/DD/YYYY, YYYY-MM-DD)

2. **Regex Pattern Matching (if using tools):**
   ```
   Email:     [A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}
   Phone:     \(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}
   SSN:       \d{3}-\d{2}-\d{4}
   IP:        \b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b
   ZIP Code:  \b\d{5}(-\d{4})?\b
   Credit Card: \b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b
   ```

3. **Contextual Scan:**
   - [ ] Read through introductions, signatures, and footers (often contain names/emails)
   - [ ] Check headers, metadata, and file properties
   - [ ] Review embedded images or screenshots for visible PII
   - [ ] Look for indirect identifiers (job title + department + location = identifiable)

4. **Document Findings:**
   - Record each instance of sensitive data found
   - Note its location (page, section, cell, line number)
   - Classify by data type and sensitivity level

**Output:** Sensitive Data Discovery Report listing all instances found

---

### Step 4: Apply Manual Redaction (15-20 minutes)

Replace all identified sensitive data with appropriate redaction tokens:

1. **Text Document Redaction:**
   - [ ] Replace each PII instance with the correct token from your standard
   - [ ] Maintain sentence readability after replacement
   - [ ] Preserve document structure and formatting
   - [ ] Handle edge cases (PII in headers, footers, tables, captions)

   **Example:**
   ```
   BEFORE:
   "Please contact John Smith at john.smith@acmecorp.com or (555) 867-5309
   regarding invoice #INV-2024-0847 for $12,450.00. His office is located at
   742 Evergreen Terrace, Springfield, IL 62704."

   AFTER:
   "Please contact [NAME] at [EMAIL] or [PHONE] regarding invoice
   [INVOICE_ID] for [AMOUNT]. Their office is located at [ADDRESS]."
   ```

2. **Spreadsheet / Dataset Redaction:**
   - [ ] Identify columns containing PII (Name, Email, Phone, Address, SSN)
   - [ ] Replace cell values with tokens or anonymized substitutes
   - [ ] Consider whether aggregate data (totals, averages) is safe to keep
   - [ ] Remove or mask row-level identifiers

3. **PDF Redaction:**
   - [ ] Use dedicated PDF redaction tools (not just black highlight overlays)
   - [ ] Verify that underlying text is actually removed, not just visually obscured
   - [ ] Check OCR layers and metadata for hidden PII
   - [ ] Flatten the PDF after redaction to prevent layer recovery

4. **Image and Screenshot Redaction:**
   - [ ] Use solid-color blocks over sensitive areas (not transparent overlays)
   - [ ] Remove EXIF metadata (location, device info, timestamps)
   - [ ] Verify redaction by zooming to 200%+ to check for partial visibility

**Output:** Redacted versions of all identified documents and datasets

---

### Step 5: Apply Redaction to AI Inputs (10-15 minutes)

Sanitize data before sending it to any AI tool or service:

1. **Pre-Prompt Redaction:**
   - [ ] Before pasting any text into an AI chat, scan for PII
   - [ ] Replace real names, emails, and identifiers with tokens
   - [ ] Use fictional but realistic placeholders if context matters
   - [ ] Never paste raw customer data, even in "private" AI sessions

2. **File Upload Redaction:**
   - [ ] Before uploading documents to AI tools, apply full redaction pass
   - [ ] Redact spreadsheets before using AI data analysis features
   - [ ] Strip metadata from files before upload (author name, organization, GPS)

3. **Prompt Engineering for Privacy:**
   ```
   BEFORE (Risky):
   "Summarize this customer feedback from Jane Doe (jane@realcompany.com)
   about her order #ORD-847291..."

   AFTER (Safe):
   "Summarize this customer feedback from [CUSTOMER_NAME] ([EMAIL])
   about their order [ORDER_ID]..."
   ```

4. **Establish AI Input Rules:**
   - [ ] Create a "never send to AI" list (SSNs, passwords, financial account numbers)
   - [ ] Create a "redact before sending" list (names, emails, addresses)
   - [ ] Create an "safe to send" list (generic questions, public information)
   - [ ] Post rules visibly in your workspace or AI tool documentation

**Output:** Pre-submission redaction checklist and sanitized AI inputs

---

### Step 6: Apply Redaction to AI Outputs (10-15 minutes)

Review and sanitize all content generated by AI tools before sharing:

1. **Post-Generation Scan:**
   - [ ] Read through AI output for any PII that may have been echoed back
   - [ ] Search for patterns: emails (xxx@xxx.com), phone numbers, names
   - [ ] Check for hallucinated PII (AI may generate realistic-looking fake PII)
   - [ ] Verify that placeholder tokens were not replaced with real-seeming data

2. **Output Sanitization:**
   - [ ] Replace any real or realistic PII with redaction tokens
   - [ ] Remove AI-generated sample data that resembles real identifiers
   - [ ] Strip any metadata the AI tool may have embedded in output files

3. **Downstream Distribution Check:**
   - [ ] Before emailing AI output, verify no PII present
   - [ ] Before publishing AI-generated content, run final PII scan
   - [ ] Before adding to shared documents, confirm redaction tokens are used
   - [ ] Before saving to cloud storage, check for unintended PII

4. **AI Output Logging:**
   - [ ] Log what was generated and when
   - [ ] Note any PII found in output (for pattern improvement)
   - [ ] Track redaction actions taken on outputs

**Output:** Sanitized AI outputs ready for safe distribution

---

### Step 7: Verify Redaction Completeness (10-15 minutes)

Conduct thorough verification that all sensitive data has been properly redacted:

1. **Automated Verification Scans:**
   - [ ] Run regex searches for common PII patterns on the redacted document
   - [ ] Use PII detection tools (Microsoft Presidio, Amazon Comprehend, SpaCy NER)
   - [ ] Search for partial matches (first names that might appear without last names)
   - [ ] Check for encoded or obfuscated PII (Base64, URL-encoded strings)

2. **Manual Verification:**
   - [ ] Re-read the entire document with "fresh eyes"
   - [ ] Check every table, chart, and appendix
   - [ ] Verify image redactions are complete (zoom in)
   - [ ] Look for indirect identifiers that together could re-identify someone

3. **Cross-Reference Check:**
   - [ ] Compare redacted version against original to confirm nothing was missed
   - [ ] Verify consistent token usage (same person = same token throughout)
   - [ ] Confirm no orphaned references (e.g., "as John mentioned" when John is redacted elsewhere)

4. **Peer Review:**
   - [ ] Have a second person review the redacted document
   - [ ] Reviewer should not have access to the original (tests if PII leaks through context)
   - [ ] Document reviewer findings and address any gaps

**Output:** Verification report confirming redaction completeness

---

### Step 8: Set Up Automated Redaction Tools (15-20 minutes)

Implement tool-based redaction for efficiency and consistency:

1. **Choose Appropriate Tools:**

   **Option A: Command-Line / Script-Based (Developers)**
   - Regular expressions (sed, grep, Python re module)
   - Best for: Batch processing text files, logs, CSVs
   - Setup: Create reusable scripts with your token mappings

   **Option B: NLP-Based PII Detection (Intermediate)**
   - Microsoft Presidio (open-source, self-hosted)
   - SpaCy with NER models (open-source)
   - Best for: Detecting names, organizations, locations in unstructured text
   - Setup: Install library, configure entity recognizers

   **Option C: Cloud Services (Teams/Enterprise)**
   - Amazon Comprehend PII Detection
   - Google Cloud DLP (Data Loss Prevention)
   - Azure Cognitive Services PII Detection
   - Best for: Large-scale, production workflows with compliance needs
   - Setup: Configure API access, set detection policies

   **Option D: Document-Specific Tools (Non-Technical)**
   - Adobe Acrobat Pro (PDF redaction)
   - Microsoft Word Track Changes + Find/Replace
   - Google Docs Suggestions Mode
   - Best for: One-off document redaction, small teams

2. **Configure Tool Settings:**
   - [ ] Set detection sensitivity (high recall = catches more but may over-redact)
   - [ ] Map detected entities to your token standard
   - [ ] Test with sample data before running on real documents
   - [ ] Configure output format (inline replacement vs. highlighted report)

3. **Create Automation Pipelines:**
   - [ ] Build script or workflow that processes files through PII detection
   - [ ] Auto-generate redaction report showing what was found and replaced
   - [ ] Set up pre-commit hooks or upload triggers for automatic scanning

**Output:** Configured automated redaction pipeline with tested tool settings

---

### Step 9: Document Process for Audits (10-15 minutes)

Create audit-ready documentation of your redaction practices:

1. **Create Redaction Policy Document:**
   - [ ] Define scope (what data, which workflows, which teams)
   - [ ] List all sensitive data categories and their redaction requirements
   - [ ] Specify approved redaction methods (manual, tool-based, or both)
   - [ ] State retention policies (how long to keep originals, redacted copies)
   - [ ] Define roles and responsibilities (who performs, who verifies)

2. **Maintain Redaction Audit Log:**
   ```
   REDACTION LOG ENTRY:
   Date: [DATE]
   Document: [DOCUMENT_NAME]
   Redactor: [ROLE/NAME]
   Verifier: [ROLE/NAME]
   Data Types Found: [LIST]
   Instances Redacted: [COUNT]
   Method Used: [Manual / Tool / Both]
   Tool Version: [IF APPLICABLE]
   Verification Status: [PASSED / NEEDS REVIEW]
   Notes: [ANY EXCEPTIONS OR ISSUES]
   ```

3. **Build Compliance Evidence Package:**
   - [ ] Redaction policy (approved and signed)
   - [ ] Sample redaction log entries
   - [ ] Tool configuration documentation
   - [ ] Training completion records
   - [ ] Verification reports from peer reviews
   - [ ] Incident reports (if any PII was accidentally shared)

4. **Schedule Periodic Policy Reviews:**
   - [ ] Quarterly review of redaction policy for new data types
   - [ ] Annual review of tool effectiveness and compliance alignment
   - [ ] Update documentation when regulations change (GDPR, CCPA, HIPAA)

**Output:** Complete audit documentation package with policy, logs, and evidence

---

### Step 10: Conduct Ongoing Review and Improvement (Ongoing)

Establish periodic review process for continuous redaction quality:

1. **Monthly Quick Check (15 minutes):**
   - [ ] Review redaction logs for completeness
   - [ ] Spot-check 2-3 recently redacted documents for missed PII
   - [ ] Verify automated tools are running and up to date
   - [ ] Check for new data types not covered by current policy

2. **Quarterly Comprehensive Audit (60-90 minutes):**
   - [ ] Review all redaction logs from the quarter
   - [ ] Test automated redaction tools with new sample data
   - [ ] Assess team compliance with redaction procedures
   - [ ] Update token mappings for any new data categories
   - [ ] Review any incidents where PII was accidentally exposed
   - [ ] Update policy documentation with lessons learned
   - [ ] Conduct tabletop exercise (simulate a redaction failure scenario)
   - [ ] Review and address findings from previous audit

3. **Annual Security and Compliance Review (Half day):**
   - [ ] Comprehensive review of redaction policy against current regulations
   - [ ] Evaluate tool landscape (better tools available?)
   - [ ] Assess redaction effectiveness metrics (miss rate, false positive rate)
   - [ ] Update training materials and conduct refresher training
   - [ ] Executive summary for leadership or compliance officers
   - [ ] Third-party review of redaction practices (if budget allows)
   - [ ] Update sensitive data classification for new business activities

**Output:** Audit reports with findings, metrics, and improvement plans

---

## Best Practices

1. **Always Use Anonymized Samples:** Never use real PII for testing, training, or examples; create synthetic data instead
2. **Redact Before Sharing, Not After:** Apply redaction as the first step, not a cleanup afterthought
3. **Standardize Your Tokens:** Use consistent replacement tokens ([NAME], [EMAIL]) across all documents and teams
4. **Layer Manual and Automated Methods:** Automated tools catch patterns; human review catches context-dependent sensitivity
5. **Post-Output PII Scan:** After every AI interaction, search outputs for patterns like xxx@xxx.com and remove them
6. **Verify with Fresh Eyes:** Have someone unfamiliar with the original review redacted documents
7. **Redact Metadata Too:** File properties, EXIF data, tracked changes, and comments can contain PII
8. **When in Doubt, Redact:** Over-redaction is safer than under-redaction; you can always restore from the original
9. **Version Control Redacted Copies Separately:** Never store originals and redacted versions in the same shared location
10. **Stay Tool-Neutral:** Avoid dependency on a single vendor; ensure your redaction process works across platforms

## Common Pitfalls

1. **Visual-Only Redaction in PDFs:** Black highlighting over text does not remove the underlying data
   - *Solution:* Use true redaction tools that remove text content, then flatten the PDF

2. **Forgetting Metadata:** Author names, organization fields, GPS coordinates hidden in file properties
   - *Solution:* Strip all metadata before sharing; use tools like ExifTool or built-in "Remove Properties"

3. **Inconsistent Token Usage:** Using [NAME] for one person and [PERSON] for another in the same document
   - *Solution:* Maintain a token reference sheet and use find-replace systematically

4. **Ignoring Indirect Identifiers:** "The CEO of [COMPANY] in [CITY]" can still identify someone
   - *Solution:* Assess combinations of quasi-identifiers; redact additional context if needed

5. **Trusting AI Tools Completely:** Automated PII detection has false negatives, especially for non-English text or unusual formats
   - *Solution:* Always follow automated redaction with manual review

6. **Redacting Copies but Not Originals in Shared Drives:** Leaving unredacted originals accessible to unauthorized users
   - *Solution:* Store originals in access-controlled locations; only share redacted copies

7. **Skipping AI Output Review:** Assuming AI-generated content is PII-free because you redacted the input
   - *Solution:* AI can hallucinate realistic PII; always scan outputs before distribution

8. **No Audit Trail:** Performing redaction without documenting what was redacted and by whom
   - *Solution:* Maintain a redaction log for every document processed; required for compliance

## Time Estimates

- **Initial Setup:** 45-75 minutes (defining categories, tokens, and first redaction pass)
- **Per-Document Redaction:** 10-30 minutes (depending on document size and PII density)
- **Monthly Maintenance:** 15-20 minutes (spot checks and log review)
- **Quarterly Audits:** 60-90 minutes (comprehensive review)
- **Tool Setup (Automated):** 30-60 minutes (one-time configuration)

## Success Criteria

You have successfully implemented data redaction basics when:

- [ ] All PII types relevant to your workflows are identified and classified
- [ ] Standardized redaction tokens are documented and used consistently
- [ ] All shared documents contain zero instances of real PII
- [ ] AI inputs are sanitized before submission (no real names, emails, or identifiers)
- [ ] AI outputs are scanned for PII before distribution
- [ ] Redaction verification has been performed by a second reviewer
- [ ] No real data is used in examples, training materials, or documentation
- [ ] Redaction audit log is maintained with entries for each processed document
- [ ] Automated redaction tools are configured and tested (if applicable)
- [ ] Team members are trained and following redaction procedures

## Educational Disclaimer

This workflow provides guidance on data redaction best practices for individuals and small teams working with AI tools. Redaction is an important layer of data protection but is not foolproof; it should be part of a broader privacy and security strategy. Organizations handling regulated data (HIPAA, PCI DSS, GDPR) should consult with qualified privacy professionals and legal counsel. This SOP does not constitute professional legal or compliance advice, and no redaction method guarantees 100% protection against re-identification.

## Revision History

- v1.0 (2026-02-12): Initial SOP creation
- Focus areas: PII identification, manual and automated redaction, AI input/output sanitization, verification, audit documentation

## Related Workflows

- Workflow #1: Personal AI Tool Stack Quiz & Builder
- Workflow #2: Secure API Key Management
- Workflow #4: Workspace Privacy Audit & Setup
- Workflow #5: Tool Integration Quickstart (No-Code)
