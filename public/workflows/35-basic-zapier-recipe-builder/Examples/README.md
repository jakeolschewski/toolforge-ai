# Examples - Basic Zapier Recipe Builder

## Example 1: Form Submission to CRM Contact Creation

**Scenario:** A freelance marketing consultant receives leads through a Typeform contact form on their website. Currently, they manually copy each submission into their HubSpot CRM, which takes 5-10 minutes per lead and sometimes leads to missed entries.

**Automation Built:**
- **Trigger**: Typeform - New Entry
- **Action**: HubSpot - Create Contact
- **Field Mapping**:
  - Typeform "Full Name" -> HubSpot "First Name" + "Last Name" (using Formatter to split)
  - Typeform "Email" -> HubSpot "Email"
  - Typeform "Phone" -> HubSpot "Phone Number"
  - Typeform "Service Interest" -> HubSpot "Lead Source Notes"
  - Static value "Website Form" -> HubSpot "Lead Source"
- **Filter**: Only create contact if email field is not empty
- **Result**: 15 leads per week now auto-created in CRM. Saves 75-150 minutes weekly. Zero missed leads since activation.

---

## Example 2: Invoice Payment to Bookkeeping Entry

**Scenario:** A solopreneur graphic designer uses Stripe for payments and tracks income in a Google Sheets bookkeeping spreadsheet. Each week they spend 30 minutes manually logging payments. Occasionally entries are missed, causing reconciliation headaches at tax time.

**Automation Built:**
- **Trigger**: Stripe - New Payment (successful charges only)
- **Action 1**: Formatter - Format date to "MM/DD/YYYY"
- **Action 2**: Formatter - Convert amount from cents to dollars
- **Action 3**: Google Sheets - Create Spreadsheet Row
- **Field Mapping**:
  - Stripe "Created" (formatted) -> Sheets "Date"
  - Stripe "Amount" (converted) -> Sheets "Amount"
  - Stripe "Customer Email" -> Sheets "Client"
  - Stripe "Description" -> Sheets "Service"
  - Static value "Stripe" -> Sheets "Payment Method"
- **Result**: Every successful payment automatically logged within minutes. Monthly reconciliation time reduced from 2 hours to 15 minutes. No missed entries in 6 months of operation.

---

## Example 3: New Client Onboarding Sequence

**Scenario:** A small agency signs 3-5 new clients per month. Each new client requires: a welcome email, a project folder in Google Drive, a Slack channel notification to the team, and a task created in Asana. The manual process takes 20 minutes per client and steps are occasionally forgotten.

**Automation Built:**
- **Trigger**: Airtable - New Record in "Clients" table (when Status = "Signed")
- **Action 1**: Gmail - Send Email (welcome email template to client)
- **Action 2**: Google Drive - Create Folder (named "[Client Name] - [Project Type]")
- **Action 3**: Slack - Send Channel Message (to #new-clients with client details)
- **Action 4**: Asana - Create Task (onboarding checklist assigned to account manager)
- **Field Mapping**: Client name, email, project type, and account manager pulled from Airtable record and distributed across all four actions
- **Filter**: Only triggers when Status field changes to "Signed" (prevents duplicate triggers)
- **Result**: Complete onboarding sequence executes in under 2 minutes with zero missed steps. Team immediately notified of new clients. Consistent client experience from day one.
