# Quality Control Checklist - Basic Zapier Recipe Builder

### 1. Task Identification Quality
- [ ] At least 3-5 repetitive tasks identified for automation
- [ ] Each task rated by frequency and time consumption
- [ ] Tasks verified as rule-based and suitable for automation
- [ ] All involved apps confirmed as supported on Zapier
- [ ] Current manual process documented for each task
- [ ] Automation priority ranking completed based on ROI

### 2. Trigger Configuration
- [ ] Correct trigger app selected for each Zap
- [ ] Trigger event accurately matches the real-world starting condition
- [ ] Trigger app account authenticated and connected
- [ ] Sample trigger data pulled successfully
- [ ] Trigger data fields reviewed and understood
- [ ] Trigger polling interval set appropriately

### 3. Action Configuration
- [ ] Correct action app selected for each Zap
- [ ] Action event matches the desired outcome
- [ ] Action app account authenticated and connected
- [ ] All required action fields populated
- [ ] Optional fields reviewed and configured as needed
- [ ] Action output verified in the destination app

### 4. Field Mapping Accuracy
- [ ] Every required action field mapped to a trigger field or static value
- [ ] Data types match between trigger and action fields (text, number, date)
- [ ] Date and time formats converted correctly between apps
- [ ] Name fields handled properly (full name vs. first/last split)
- [ ] Phone numbers and addresses formatted for the destination app
- [ ] No trigger fields accidentally left unmapped that should be included
- [ ] Formatter steps added where data transformation is needed

### 5. Filters and Conditional Logic
- [ ] Filters applied only when specific conditions should prevent the action
- [ ] Filter logic tested with both passing and failing data
- [ ] Path steps configured correctly for branching workflows
- [ ] Conditional logic matches documented business rules
- [ ] Edge cases considered in filter conditions
- [ ] Unnecessary filters removed to reduce complexity

### 6. Testing and Validation
- [ ] Each Zap step tested individually using Zapier's test feature
- [ ] End-to-end test completed with real-world data
- [ ] Edge cases tested (empty fields, special characters, long text)
- [ ] No duplicate records created in destination app
- [ ] Data accuracy verified in the destination app
- [ ] Error scenarios tested (invalid data, missing fields)
- [ ] Zap history log reviewed for warnings or errors
- [ ] Performance acceptable under expected data volume

### 7. Deployment and Monitoring
- [ ] Zap named with consistent naming convention
- [ ] Zap placed in the correct organizational folder
- [ ] Error notification alerts configured
- [ ] Zap turned on and running at correct interval
- [ ] First live trigger monitored for successful completion
- [ ] Task usage impact assessed against plan limits
- [ ] 30-day review date scheduled

### 8. Documentation and Knowledge Sharing
- [ ] Zap purpose and description documented
- [ ] Trigger-to-action flow documented with field mappings
- [ ] Automation library entry created
- [ ] Any known limitations or edge cases noted
- [ ] Team members notified of new automation
- [ ] Rollback procedure documented in case Zap needs to be disabled

### 9. Security and Privacy
- [ ] Connected accounts use appropriate credentials (team vs. personal)
- [ ] Sensitive data fields identified and handled appropriately
- [ ] No API keys or passwords hardcoded in Zap steps
- [ ] Third-party app permissions reviewed and minimized
- [ ] Data transfer complies with relevant privacy requirements
- [ ] Unused app connections removed from Zapier account

### 10. Maintenance Planning
- [ ] Quarterly review schedule established for all active Zaps
- [ ] Process for handling app updates or API changes documented
- [ ] Backup plan defined for critical automations
- [ ] Task usage monitoring and alerting in place
- [ ] Ownership assigned for each Zap (who maintains it)
- [ ] Criteria defined for when to retire or rebuild a Zap
