# Quality Control Checklist - Data Redaction Basics

## Pre-Implementation Verification

### 1. Sensitive Data Coverage
- [ ] All PII types identified (names, emails, phones, addresses, DOB, SSN)
- [ ] Financial data types identified (credit cards, bank accounts, tax IDs, salary)
- [ ] Health data types identified (medical records, insurance info, diagnoses)
- [ ] Organizational data types identified (internal IPs, project codes, client names)
- [ ] Indirect identifiers cataloged (job title + location + department combinations)
- [ ] Data classification document created and reviewed
- [ ] No real PII used in any examples or training materials
- [ ] Classification covers all document types in your workflow

### 2. Examples and Samples Quality
- [ ] All examples use only fictional, synthetic data
- [ ] Example names are clearly generic (e.g., "Jane Doe", "John Smith")
- [ ] Example emails use safe domains (example.com, example.org)
- [ ] Example phone numbers use reserved ranges (555-0100 to 555-0199)
- [ ] Example addresses are fictional or use generic patterns
- [ ] Example SSNs use clearly fake patterns (000-00-0000)
- [ ] No samples resemble actual customer, employee, or partner data
- [ ] Before/after examples provided for every PII category

### 3. Redaction Token Standards
- [ ] Token mapping documented for all data types ([NAME], [EMAIL], [PHONE], etc.)
- [ ] Numbered tokens defined for multi-instance documents ([NAME_1], [NAME_2])
- [ ] Token format is consistent across all documentation
- [ ] Team has reviewed and agreed on token standards
- [ ] Token reference sheet is accessible to all team members
- [ ] Tokens are clearly distinguishable from regular text (bracketed, capitalized)
- [ ] Edge cases addressed (partial names, combined fields)

## Tool and Process Quality

### 4. Tool Neutrality Verification
- [ ] SOP does not mandate a single commercial tool
- [ ] Multiple tool options provided for each capability level
- [ ] Open-source alternatives included alongside commercial options
- [ ] Tool recommendations based on team size and budget, not vendor preference
- [ ] No affiliate links or promotional language for specific tools
- [ ] Instructions work with manual methods (no tool dependency for core process)
- [ ] Cloud-based and offline options both available
- [ ] Compliance implications of each tool category noted

### 5. Process Repeatability
- [ ] Each SOP step has clear inputs and outputs
- [ ] Checklists are provided for every major step
- [ ] Process works for different document types (text, spreadsheet, PDF, image)
- [ ] Process works for different team sizes (solo, small team, department)
- [ ] Steps can be followed by someone with no prior redaction experience
- [ ] Time estimates are realistic and provided for each step
- [ ] Rollback or correction steps defined (what to do if redaction is incomplete)
- [ ] Process produces consistent results regardless of who performs it

### 6. Compliance Reference Accuracy
- [ ] GDPR references are accurate and current
- [ ] HIPAA references are accurate (if included)
- [ ] CCPA/CPRA references are accurate (if included)
- [ ] PCI DSS references are accurate (if included)
- [ ] No legal advice is implied (educational disclaimer present)
- [ ] Compliance frameworks mentioned as guidance, not as legal interpretation
- [ ] References direct users to official regulatory sources
- [ ] Disclaimer states that users should consult legal/compliance professionals

## Redaction Quality Assurance

### 7. Input Redaction Completeness
- [ ] Pre-submission checklist covers all PII types for AI inputs
- [ ] File upload sanitization steps documented (metadata, properties, comments)
- [ ] "Never send to AI" list clearly defined (SSNs, passwords, financial accounts)
- [ ] "Redact before sending" list clearly defined (names, emails, addresses)
- [ ] Prompt templates include redaction placeholders
- [ ] AI input rules posted visibly in workspace documentation
- [ ] Process covers all AI tools used by the team
- [ ] Emergency procedure defined for accidental PII submission to AI

### 8. Output Redaction Completeness
- [ ] Post-generation scan checklist provided
- [ ] Pattern search for emails (xxx@xxx.com) documented
- [ ] Pattern search for phone numbers documented
- [ ] Pattern search for names and addresses documented
- [ ] AI-hallucinated PII detection addressed
- [ ] Downstream distribution checks defined (email, publish, share, store)
- [ ] Output logging process established
- [ ] Verification step required before any AI output is shared externally

### 9. Verification Process Quality
- [ ] Automated verification scans defined (regex, PII detection tools)
- [ ] Manual verification process documented (re-read, cross-reference)
- [ ] Peer review step included in process
- [ ] Indirect identifier assessment included (quasi-identifier combinations)
- [ ] Metadata check included in verification
- [ ] Verification produces a documented pass/fail result
- [ ] Failed verification triggers re-redaction cycle
- [ ] Verification is performed by someone other than the original redactor

## Documentation and Audit

### 10. Audit Trail Quality
- [ ] Redaction log template created with all required fields
- [ ] Log entries capture: date, document, redactor, verifier, data types, method
- [ ] Logs are stored in a secure, access-controlled location
- [ ] Log retention period defined (per compliance requirements)
- [ ] Logs are searchable for audit purposes
- [ ] Sample log entries provided as reference
- [ ] Log format compatible with compliance reporting requirements
- [ ] Process for handling log discrepancies documented

### 11. Policy Documentation Quality
- [ ] Redaction policy document is complete and approved
- [ ] Scope is clearly defined (what data, which workflows, which teams)
- [ ] Roles and responsibilities are assigned
- [ ] Escalation procedures documented (when to involve legal/compliance)
- [ ] Exception handling process defined (when standard redaction is not possible)
- [ ] Policy review schedule established (quarterly minimum)
- [ ] Policy version history maintained
- [ ] All team members have acknowledged reading the policy

### 12. Training Material Quality
- [ ] Training covers all PII types and redaction methods
- [ ] Training includes hands-on practice with synthetic data
- [ ] Training materials use only fictional examples (no real PII)
- [ ] Self-assessment or quiz included
- [ ] Quick-reference card available for daily use
- [ ] Onboarding training documented for new team members
- [ ] Refresher training schedule established (quarterly)
- [ ] Training effectiveness is measured (pre/post assessment)

## Output and Deliverable Quality

### 13. Output Clarity and Usability
- [ ] Redacted documents remain readable and coherent
- [ ] Redaction tokens do not break document formatting
- [ ] Context is preserved (reader can understand the document's purpose)
- [ ] Tables, charts, and appendices are properly redacted
- [ ] Redacted PDFs are flattened (no recoverable layers)
- [ ] Redacted spreadsheets have no hidden sheets or filtered rows with PII
- [ ] Redacted images have solid-color blocks (not transparent overlays)
- [ ] File names do not contain PII

### 14. Disclaimer and Limitations
- [ ] Educational disclaimer present stating redaction is not foolproof
- [ ] Disclaimer notes that no method guarantees 100% protection
- [ ] Users directed to consult professionals for regulated data
- [ ] Limitations of automated tools clearly stated
- [ ] Re-identification risks acknowledged
- [ ] Disclaimer appears in SOP, training materials, and policy documents
- [ ] Users informed that redaction is one layer in a broader privacy strategy
- [ ] False sense of security warnings included

## Audit & Compliance

### 15. Ongoing Audit Procedures
- [ ] Monthly spot-check procedure established
- [ ] Quarterly comprehensive audit procedure documented
- [ ] Annual policy and tool review planned
- [ ] Audit findings tracking system established
- [ ] Remediation workflow defined for audit findings
- [ ] Redaction logs retained per compliance requirements
- [ ] First monthly audit successfully completed
- [ ] Audit results documented and reviewed by responsible party

### 16. Compliance Readiness (if applicable)
- [ ] GDPR data minimization principles reflected in redaction process
- [ ] HIPAA de-identification methods referenced (Safe Harbor or Expert Determination)
- [ ] PCI DSS masking requirements addressed for cardholder data
- [ ] CCPA/CPRA consumer data protection measures included
- [ ] Data processing agreements (DPAs) reviewed for tool vendors
- [ ] Right to deletion accommodated in redaction process
- [ ] Compliance documentation package prepared for auditors
- [ ] Legal/compliance team has reviewed procedures (if regulated data involved)

## Final Validation

### 17. End-to-End Testing
- [ ] Complete redaction performed on test document (all PII types present)
- [ ] Automated tools tested with synthetic data (detection accuracy verified)
- [ ] Manual verification completed on test document
- [ ] Peer review completed on test document
- [ ] AI input sanitization tested (redacted content sent to AI, output reviewed)
- [ ] AI output scanning tested (output checked for PII echoes/hallucinations)
- [ ] Audit log entry created for test document
- [ ] Process completed within estimated time frame

### 18. Success Criteria Achievement
- [ ] Zero real PII in any shared document, example, or training material
- [ ] Standardized tokens used consistently across all documentation
- [ ] All AI inputs sanitized before submission
- [ ] All AI outputs scanned before distribution
- [ ] Verification performed by second reviewer on all critical documents
- [ ] Audit log maintained with entries for every processed document
- [ ] Team trained and following procedures
- [ ] Disclaimer on limitations included in all relevant materials

## Post-Implementation Monitoring

### 19. 30-Day Check-in (after initial implementation)
- [ ] Redaction process followed without significant friction
- [ ] No PII exposure incidents in first 30 days
- [ ] Team feedback collected and addressed
- [ ] At least 3 documents successfully redacted and verified
- [ ] Automated tools running as expected (if configured)
- [ ] Audit log entries consistent and complete
- [ ] Any procedural adjustments documented
- [ ] Quick-reference materials updated based on team feedback

### 20. 90-Day Review (quarterly audit)
- [ ] Complete review of all redaction logs from the quarter
- [ ] Spot-check of redacted documents for missed PII
- [ ] Automated tool accuracy assessed (false negatives, false positives)
- [ ] Team compliance measured (are all members following procedures?)
- [ ] New data types assessed and added to classification if needed
- [ ] Incident review (any accidental PII exposures analyzed)
- [ ] Documentation updates reflect any procedural changes
- [ ] Metrics calculated (redaction completion rate, verification pass rate)

## Quality Gates

**DO NOT PROCEED to sharing or distribution if:**
- Any real PII remains in the document after redaction
- Verification has not been completed (automated + manual)
- PDF redaction has not been verified at the text layer (not just visual)
- Metadata has not been stripped from files
- Audit log entry has not been created
- Peer review has not been performed on critical/sensitive documents

**ESCALATE for additional review if:**
- Document contains regulated data (HIPAA, PCI DSS, GDPR)
- Redaction involves a data type not covered by current policy
- Automated tool reports low confidence on PII detection
- Indirect identifiers may still allow re-identification
- Previous PII exposure incident related to this document type
- Legal hold or regulatory investigation is in effect

## Checklist Completion

**Date of Review:** _________________

**Reviewer:** _________________

**Total Items Checked:** _____ / 100+

**Pass Threshold:** 95% (95+ items checked)

**Status:** [ ] PASSED - Redaction implementation complete  |  [ ] NEEDS REMEDIATION

**Critical Findings (if any):**
_______________________________________________________________________________
_______________________________________________________________________________

**Remediation Plan:**
_______________________________________________________________________________
_______________________________________________________________________________

**Next Audit Date:** _________________
