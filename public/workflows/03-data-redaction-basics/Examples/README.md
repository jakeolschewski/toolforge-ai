# Examples - Data Redaction Basics

## Overview

This directory contains practical, hands-on examples demonstrating data redaction techniques for common document types and AI workflows. All examples use entirely fictional, synthetic data -- no real PII is included anywhere in these materials.

---

## Example 1: Basic Text Redaction (Before and After)

### Scenario
A customer support email needs to be shared with a training team for quality review.

### Before Redaction (Original - SENSITIVE)
```
From: sarah.johnson@acmecorp.com
To: support@techtools.io
Date: January 15, 2026
Subject: Billing Issue - Account #TT-847291

Hi Support Team,

My name is Sarah Johnson and I'm having trouble with my billing. My credit
card ending in 3318 was charged $149.99 on January 12, but I only authorized
the $79.99 annual plan.

I've been a customer since March 2024. My account email is
sarah.johnson@acmecorp.com and my phone number is (415) 555-8923.

My billing address is:
1247 Oak Street, Suite 300
San Francisco, CA 94102

Please resolve this as soon as possible. You can reach me at the number above
or email me directly.

Thanks,
Sarah Johnson
VP of Operations, Acme Corp
```

### After Redaction (Safe to Share)
```
From: [EMAIL]
To: support@[COMPANY_B].com
Date: January 15, 2026
Subject: Billing Issue - Account [ACCOUNT_ID]

Hi Support Team,

My name is [NAME] and I'm having trouble with my billing. My credit
card ending in [LAST_4] was charged [AMOUNT] on [DATE], but I only authorized
the [AMOUNT] annual plan.

I've been a customer since [DATE]. My account email is [EMAIL] and my
phone number is [PHONE].

My billing address is:
[ADDRESS]

Please resolve this as soon as possible. You can reach me at the number above
or email me directly.

Thanks,
[NAME]
[JOB_TITLE], [COMPANY]
```

### Redaction Summary

| Data Type | Original Value | Token Used | Count |
|-----------|---------------|------------|-------|
| Name | Sarah Johnson | [NAME] | 2 |
| Email | sarah.johnson@acmecorp.com | [EMAIL] | 2 |
| Phone | (415) 555-8923 | [PHONE] | 1 |
| Address | 1247 Oak Street, Suite 300, San Francisco, CA 94102 | [ADDRESS] | 1 |
| Credit Card (last 4) | 3318 | [LAST_4] | 1 |
| Amount | $149.99, $79.99 | [AMOUNT] | 2 |
| Account ID | TT-847291 | [ACCOUNT_ID] | 1 |
| Company | Acme Corp | [COMPANY] | 1 |
| Job Title | VP of Operations | [JOB_TITLE] | 1 |
| Date | January 12, March 2024 | [DATE] | 2 |

**Total redactions: 14 instances across 10 data types**

---

## Example 2: Spreadsheet / Dataset Redaction

### Scenario
A customer database export needs to be anonymized for use in a data analysis training exercise.

### Before Redaction (Original Dataset - 5 Sample Rows)

| ID | Full Name | Email | Phone | City | State | DOB | Account Type | Balance |
|----|-----------|-------|-------|------|-------|-----|-------------|---------|
| 1001 | Sarah Johnson | sarah.j@acmecorp.com | (415) 555-8923 | San Francisco | CA | 03/15/1987 | Premium | $12,450.00 |
| 1002 | David Chen | d.chen@techstart.io | (212) 555-3047 | New York | NY | 11/22/1992 | Standard | $3,280.50 |
| 1003 | Maria Rodriguez | m.rodriguez@globex.com | (305) 555-6182 | Miami | FL | 07/08/1985 | Premium | $28,915.75 |
| 1004 | James Wilson | j.wilson@initech.com | (312) 555-9401 | Chicago | IL | 01/30/1990 | Standard | $1,745.20 |
| 1005 | Emily Park | e.park@umbrella.co | (206) 555-7238 | Seattle | WA | 09/14/1988 | Premium | $19,320.00 |

### After Redaction (Safe for Training)

| ID | Full Name | Email | Phone | Region | State | Age Range | Account Type | Balance Range |
|----|-----------|-------|-------|--------|-------|-----------|-------------|---------------|
| [ID_1] | [NAME_1] | [EMAIL] | [PHONE] | West | [STATE] | 35-40 | Premium | $10K-$15K |
| [ID_2] | [NAME_2] | [EMAIL] | [PHONE] | Northeast | [STATE] | 30-35 | Standard | $3K-$5K |
| [ID_3] | [NAME_3] | [EMAIL] | [PHONE] | Southeast | [STATE] | 35-40 | Premium | $25K-$30K |
| [ID_4] | [NAME_4] | [EMAIL] | [PHONE] | Midwest | [STATE] | 30-35 | Standard | $1K-$2K |
| [ID_5] | [NAME_5] | [EMAIL] | [PHONE] | West | [STATE] | 35-40 | Premium | $15K-$20K |

### Redaction Decisions

| Column | Classification | Action | Rationale |
|--------|---------------|--------|-----------|
| ID | Direct identifier | Token replacement | Unique per person |
| Full Name | Direct identifier | Token replacement | Directly identifies individual |
| Email | Direct identifier | Token replacement | Directly identifies individual |
| Phone | Direct identifier | Token replacement | Directly identifies individual |
| City | Quasi-identifier | Generalized to Region | City + State + other fields could re-identify |
| State | Quasi-identifier | Kept (with caution) | Low risk alone, but monitor in combination |
| DOB | Direct identifier | Generalized to Age Range | Exact DOB is identifying; 5-year range is safer |
| Account Type | Non-sensitive | Kept as-is | No identification risk |
| Balance | Sensitive attribute | Generalized to Range | Exact amounts could correlate with known records |

---

## Example 3: Redaction Checklist (Customer Support Emails)

### Checklist: Redacting Customer Support Emails

**Pre-Scan:**
- [ ] Open email in read-only mode (prevent accidental edits to original)
- [ ] Note total PII instances to track redaction progress

**Identity Information:**
- [ ] Customer full name (From field, signature, body) -> [NAME]
- [ ] Customer email address (From field, body, signature) -> [EMAIL]
- [ ] Customer phone number (body, signature) -> [PHONE]
- [ ] Customer physical address (body) -> [ADDRESS]
- [ ] Customer job title and company (signature) -> [JOB_TITLE], [COMPANY]
- [ ] Support agent name (if present) -> [AGENT_NAME] or "Support Agent"

**Account Information:**
- [ ] Account number or ID -> [ACCOUNT_ID]
- [ ] Order or ticket number -> [ORDER_ID] or [TICKET_ID]
- [ ] Subscription or plan details (if identifying) -> [PLAN_TYPE]
- [ ] Customer since date (if identifying) -> [DATE] or "long-time customer"

**Financial Information:**
- [ ] Credit card numbers (full or partial) -> [CC_NUMBER] or "ending in [LAST_4]"
- [ ] Transaction amounts -> [AMOUNT]
- [ ] Transaction dates -> [DATE]
- [ ] Bank or payment method details -> [PAYMENT_METHOD]

**Technical Information:**
- [ ] IP addresses in headers or body -> [IP_ADDRESS]
- [ ] Device identifiers -> [DEVICE_ID]
- [ ] URLs with user-specific parameters -> [URL]

**Post-Redaction Verification:**
- [ ] Search for "@" symbol (catch remaining emails)
- [ ] Search for "(" or digit sequences (catch remaining phones)
- [ ] Search for "$" (catch remaining financial amounts)
- [ ] Search for capitalized proper nouns (catch remaining names)
- [ ] Read through for indirect identifiers
- [ ] Verify consistent token usage throughout
- [ ] Confirm readability is preserved

**Log Entry:**
- [ ] Record in audit log: document name, date, PII types, count, method, status

---

## Example 4: AI Input/Output Redaction

### Scenario
You want to use AI to draft a response to a customer complaint, but need to redact PII first.

### Step 1: Redact the Input

**Original customer message (DO NOT send this to AI):**
```
"I'm David Chen and I ordered product SKU-4829 on December 3rd. My order
number is ORD-2026-11847. It was shipped to 892 Park Avenue, Apt 4B,
New York, NY 10021. The package never arrived. I paid $234.99 via my
Amex ending in 7742. Please help. My cell is 212-555-3047."
```

**Redacted version (SAFE to send to AI):**
```
"I'm [CUSTOMER_NAME] and I ordered product [PRODUCT_SKU] on [ORDER_DATE].
My order number is [ORDER_ID]. It was shipped to [SHIPPING_ADDRESS].
The package never arrived. I paid [AMOUNT] via my [PAYMENT_METHOD].
Please help. My cell is [PHONE]."
```

### Step 2: Send Redacted Version to AI

**Prompt to AI:**
```
Draft a professional customer service response to this complaint.
The customer ordered a product that never arrived. Be empathetic,
offer to investigate, and provide next steps.

Customer message:
"I'm [CUSTOMER_NAME] and I ordered product [PRODUCT_SKU] on [ORDER_DATE].
My order number is [ORDER_ID]. It was shipped to [SHIPPING_ADDRESS].
The package never arrived. I paid [AMOUNT] via my [PAYMENT_METHOD].
Please help. My cell is [PHONE]."
```

### Step 3: Review AI Output

**AI-generated response (check for PII before using):**
```
Dear [CUSTOMER_NAME],

Thank you for reaching out about your missing order [ORDER_ID]. I sincerely
apologize for the inconvenience.

I've initiated an investigation into the delivery status of your [PRODUCT_SKU]
ordered on [ORDER_DATE]. Here are the next steps:

1. Our shipping team will trace the package within 24-48 hours
2. If the package cannot be located, we will issue either:
   - A full replacement shipped via express delivery, or
   - A complete refund to your [PAYMENT_METHOD]

I'll follow up at [PHONE] or via email once we have an update. In the
meantime, please don't hesitate to reach out if you have any questions.

Best regards,
Customer Support Team
```

**Post-output verification:**
- [x] No real names present (only [CUSTOMER_NAME] token) -- PASS
- [x] No real email addresses -- PASS
- [x] No real phone numbers (only [PHONE] token) -- PASS
- [x] No real addresses -- PASS
- [x] No real financial details -- PASS
- [x] No AI-hallucinated PII -- PASS
- [x] Tokens preserved correctly -- PASS

**Result:** Output is safe to use. Replace tokens with actual customer data only in the final sent email (not in any shared or logged version).

---

## Example 5: Common Redaction Mistakes

### Mistake 1: Visual-Only PDF Redaction

**The problem:**
```
A user draws a black rectangle over a name in a PDF using annotation tools.
The text "Sarah Johnson" is visually hidden but still exists in the PDF text layer.

Test: Copy-paste from the "redacted" area still yields "Sarah Johnson"
Test: Ctrl+F search for "Sarah" still finds the text
Test: Screen reader announces "Sarah Johnson"
```

**The fix:**
```
Use a proper PDF redaction tool:
1. Adobe Acrobat Pro: Tools > Redact > Mark for Redaction > Apply
2. The tool permanently removes the text content
3. Flatten the PDF afterward (removes all layers)
4. Verify: Ctrl+F for "Sarah" returns 0 results
5. Verify: Copy-paste from area returns nothing
```

### Mistake 2: Forgetting Metadata

**The problem:**
```
Document properties still contain:
  Author: Sarah Johnson
  Company: Acme Corp
  Last Modified By: David Chen
  Created: 2026-01-15 14:32:17
  GPS (in image): 37.7749, -122.4194
```

**The fix:**
```
Before sharing any file:
1. Right-click > Properties > Details > "Remove Properties and Personal Information"
2. Or: File > Info > Check for Issues > Inspect Document > Remove All
3. For images: exiftool -all= image.jpg
4. Verify: Check properties show no personal information
```

### Mistake 3: Inconsistent Tokens

**The problem:**
```
Paragraph 1: "Contact [NAME] at [EMAIL] for details."
Paragraph 5: "As Sarah mentioned in her email..."
Paragraph 8: "The project lead (sarah.j@) confirmed the timeline."
```

**The fix:**
```
1. Use Find/Replace for each PII value across the ENTIRE document
2. Search for partial matches (first name only, email prefix only)
3. Search for indirect references ("the VP", "the project lead from SF")
4. Have a second reviewer check for consistency
```

### Mistake 4: Leaving PII in Spreadsheet Hidden Areas

**The problem:**
```
- Hidden columns B and C contain full names and SSNs
- Filtered rows hide 50 records with PII (but data still exists)
- Comment on cell D4: "Check with Sarah Johnson about this figure"
- Pivot table source range includes unredacted data
```

**The fix:**
```
1. Unhide ALL columns and rows before redacting
2. Remove all filters to reveal all data
3. Delete all comments and notes
4. Check named ranges for PII references
5. Rebuild pivot tables from redacted data (or remove them)
6. Check for hidden sheets (right-click sheet tabs > Unhide)
```

---

## Key Principles Demonstrated

1. **Always use synthetic data in examples** -- Every name, email, phone, and address in this document is entirely fictional.

2. **Redact before sharing, not after** -- The original sensitive version should never leave secure storage.

3. **Use consistent tokens** -- [NAME], [EMAIL], [PHONE], [ADDRESS] are used the same way throughout all examples.

4. **Verify after redacting** -- Every example includes a verification step to confirm completeness.

5. **Document your redactions** -- The summary table in Example 1 demonstrates audit-ready logging.

6. **Consider indirect identifiers** -- Example 2 shows how city + state + age range might still identify someone.

7. **Redact AI inputs AND outputs** -- Example 4 demonstrates the full lifecycle of working with AI safely.

8. **Learn from common mistakes** -- Example 5 highlights the most dangerous errors to avoid.

---

## Using These Examples

**For Self-Study:**
1. Read through each example to understand the pattern
2. Practice by creating your own synthetic documents
3. Apply the redaction process and compare to the examples
4. Use the checklists to verify your work

**For Team Training:**
1. Walk through Example 1 as a group exercise
2. Assign Example 2 as hands-on practice (provide unredacted synthetic data)
3. Use Example 3 as a daily-use checklist template
4. Demonstrate Example 4 live with an AI tool
5. Quiz the team on Example 5 mistakes ("What's wrong with this?")

**For Compliance Evidence:**
1. Reference these examples in your redaction policy
2. Show auditors that training uses only synthetic data
3. Use the checklist format (Example 3) as your standard operating template
4. Maintain completed checklists as evidence of process adherence

---

## Disclaimer

All data in these examples is entirely fictional and created specifically for educational purposes. Any resemblance to real individuals, organizations, email addresses, phone numbers, or addresses is purely coincidental. These examples are provided for training and reference only and do not constitute legal or compliance advice. No redaction method is 100% foolproof; always consult qualified professionals for regulated data handling.

---

## Changelog

- **v1.0 (2026-02-12):** Initial examples collection
  - 5 practical examples covering text, datasets, checklists, AI workflows, and common mistakes
  - All synthetic data, zero real PII
