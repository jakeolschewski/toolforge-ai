# Quality Control Checklist - Tone-Adaptive Rewrite System

## Pre-Implementation Verification

### 1. Original Text Assessment
- [ ] Full original text read and understood before any rewriting begins
- [ ] Dominant tone of original identified and documented (formal, casual, technical, etc.)
- [ ] Key messages and factual claims listed in a reference document
- [ ] Word count of original recorded
- [ ] Structural format noted (headings, bullets, paragraphs, tables)
- [ ] Domain-specific terminology identified and flagged for preservation
- [ ] Reading level of original assessed (simple, intermediate, advanced)
- [ ] Purpose of original determined (inform, persuade, instruct, entertain)

### 2. Target Tone Specification
- [ ] Primary target tone clearly defined with specific descriptors
- [ ] Secondary tone qualities specified (e.g., "formal but approachable")
- [ ] 2-3 example sentences in the target tone provided as reference
- [ ] Tones to explicitly avoid documented (e.g., "not sarcastic")
- [ ] Target audience demographics described in detail
- [ ] Communication context specified (email, report, social media, etc.)
- [ ] Word count constraints established
- [ ] Brand voice guidelines consulted (if applicable)

### 3. Redaction and Privacy Compliance
- [ ] All personal names replaced with placeholders ([NAME], [CLIENT])
- [ ] Financial data redacted ([REVENUE], [AMOUNT], [BUDGET])
- [ ] Proprietary information generalized or removed
- [ ] Contact information removed (emails, phone numbers, addresses)
- [ ] Internal project codes or identifiers anonymized
- [ ] Legal or contractual language flagged and excluded from AI processing
- [ ] Redaction-Guide.txt reviewed and applied comprehensively
- [ ] Redacted version reviewed to confirm no sensitive data remains

## Tone Accuracy Verification

### 4. First Version Quality Check
- [ ] Rewrite read aloud to evaluate tone by ear
- [ ] Tone matches the specified target (formal, casual, empathetic, etc.)
- [ ] Tone is consistent throughout the entire text (no drifts between sections)
- [ ] Language register is appropriate for the target audience
- [ ] Formality level matches the specified scale (1-10)
- [ ] No unintended tonal shifts at paragraph boundaries
- [ ] Opening sentence sets the correct tone immediately

### 5. Meaning Preservation Verification
- [ ] Every key message from the original is present in the rewrite
- [ ] No factual claims have been altered, exaggerated, or minimized
- [ ] No new information has been added that was not in the original
- [ ] No original points have been omitted or merged in a way that changes meaning
- [ ] Data points, statistics, and quotes preserved exactly
- [ ] Cause-and-effect relationships maintained accurately
- [ ] Conditional statements (if/then, may/might) preserved with correct certainty level
- [ ] Negations preserved correctly (original "not" statements not accidentally reversed)

### 6. Iterative Improvement Tracking
- [ ] At least 2 versions produced before finalizing
- [ ] Each iteration addresses specific identified improvement areas
- [ ] Changes between versions documented in a changelog
- [ ] Tone accuracy score tracked per version (target: 8/10+)
- [ ] Meaning preservation score tracked per version (target: 9/10+)
- [ ] Iteration stopped when diminishing returns observed
- [ ] Best version selected with documented rationale

## Multi-Version Comparison

### 7. Alternative Version Quality
- [ ] At least 2-3 tone variations generated for comparison
- [ ] All versions derived from the same source text for fair comparison
- [ ] Same constraints (word count, preserved terms) applied to all versions
- [ ] Each version labeled clearly with tone descriptor and version number
- [ ] All versions saved in a single accessible location

### 8. Comparison Matrix Completeness
- [ ] Tone accuracy scored for each version (1-10)
- [ ] Meaning preservation scored for each version (1-10)
- [ ] Readability scored for each version (1-10)
- [ ] Audience fit scored for each version (1-10)
- [ ] Natural language quality scored for each version (1-10)
- [ ] Overall ranking established with rationale
- [ ] Specific strengths and weaknesses documented per version
- [ ] Final selection justified with reference to scores and criteria

## Cultural and Sensitivity Review

### 9. Cultural Appropriateness
- [ ] Idioms and metaphors reviewed for cross-cultural clarity
- [ ] No culturally specific references that would confuse the target audience
- [ ] Humor (if present) assessed for appropriateness and risk of offense
- [ ] Formality level matches cultural expectations of the target audience
- [ ] Regional language variations addressed (US vs. UK English, date formats, etc.)
- [ ] No assumptions about shared cultural knowledge or values

### 10. Inclusive Language Check
- [ ] Gender-neutral language used where appropriate
- [ ] No stereotypes or generalizations about demographic groups
- [ ] Disability-related language is respectful and person-first (when appropriate)
- [ ] Age-related references are neutral and non-patronizing
- [ ] Religious or political references are neutral or absent (unless required)
- [ ] Power dynamics in tone do not convey condescension or exclusion
- [ ] Language accessible to non-native speakers of the target language (if applicable)

### 11. Sensitivity in Tone Choices
- [ ] Formal tone does not read as cold, distant, or dismissive
- [ ] Casual tone does not read as unprofessional or disrespectful
- [ ] Empathetic tone does not read as patronizing or presumptuous
- [ ] Authoritative tone does not read as aggressive or intimidating
- [ ] Persuasive tone does not read as manipulative or misleading
- [ ] Blended tones maintain balance without jarring shifts

## Content Quality

### 12. Language and Grammar
- [ ] Grammar check completed (Grammarly or equivalent tool)
- [ ] Spelling verified (including proper nouns and technical terms)
- [ ] Punctuation consistent and correct throughout
- [ ] Sentence structure varied (no monotonous patterns)
- [ ] Transitions between paragraphs are smooth and logical
- [ ] No run-on sentences or sentence fragments (unless intentional for tone)
- [ ] Active voice preferred unless passive voice serves the tone goal
- [ ] Jargon level appropriate for the target audience

### 13. Structural Integrity
- [ ] Original heading structure preserved (if required by constraints)
- [ ] Bullet points and numbered lists formatted consistently
- [ ] Paragraph length appropriate for the communication channel
- [ ] White space and formatting support readability
- [ ] No orphaned sentences or incomplete thoughts
- [ ] Logical flow maintained from introduction through conclusion

## Security and Compliance

### 14. Data Protection Verification
- [ ] No original sensitive data present in the final output
- [ ] All AI tool interactions used redacted versions of the text
- [ ] AI chat histories containing sensitive content cleared (if applicable)
- [ ] Final document does not expose proprietary methodologies
- [ ] Export files do not contain metadata revealing sensitive information
- [ ] Shared documents have appropriate access permissions set
- [ ] Compliance with organizational data handling policies confirmed

### 15. Intellectual Property Review
- [ ] Rewrite does not inadvertently plagiarize external sources
- [ ] AI-generated language checked for overly generic or templated phrasing
- [ ] Original author credited or acknowledged as appropriate
- [ ] No copyrighted material reproduced without permission
- [ ] Brand trademarks and product names used correctly
- [ ] Legal disclaimers preserved if present in original

## Final Validation

### 16. Export Readiness
- [ ] Final draft exported in required format (Doc/PDF)
- [ ] Tone guide sheet created and populated
- [ ] Version comparison document prepared (if needed for stakeholder review)
- [ ] All placeholder text replaced with actual content
- [ ] Formatting consistent across all exported files
- [ ] File naming follows convention: "[Project]-[Tone]-[Version]-[Date]"
- [ ] Final word count meets specified constraints

### 17. Stakeholder Review Preparation
- [ ] Comparison matrix included for decision-makers (if multiple versions)
- [ ] Rationale for tone choices documented
- [ ] Track changes or markup available for review (if requested)
- [ ] Clear instructions for providing feedback included
- [ ] Deadline for stakeholder review communicated
- [ ] Escalation path defined for conflicting feedback

## Post-Implementation Monitoring

### 18. Version Archive Completeness
- [ ] All versions saved with clear labels (V1, V2, V3, final)
- [ ] Iteration log documenting changes between versions preserved
- [ ] Original text archived alongside rewrites for reference
- [ ] Tone specification and rewrite brief saved for reuse
- [ ] Comparison matrices archived for future reference
- [ ] Prompts used for each version documented
- [ ] Time spent and lessons learned recorded

### 19. Team Consistency (for collaborative projects)
- [ ] Team tone guide distributed to all writers
- [ ] Calibration exercise completed by all team members
- [ ] Peer review conducted on at least one version
- [ ] Tone consistency verified across all team-produced rewrites
- [ ] Discrepancies addressed with specific guidance
- [ ] Team tone guide updated based on lessons learned

### 20. Continuous Improvement
- [ ] Successful tone examples added to reference library
- [ ] Prompt templates updated based on what worked well
- [ ] Common challenges documented for future workflows
- [ ] Feedback from stakeholders incorporated into process improvements
- [ ] Time efficiency tracked against estimates for process optimization

## Quality Gates

**DO NOT PROCEED to finalization if:**
- Meaning preservation score is below 8/10 for any version under consideration
- Any sensitive or confidential data remains in the AI-processed text
- Cultural sensitivity review has not been completed
- No comparison against the original text has been performed
- Tone accuracy score is below 7/10 after two iterations
- Stakeholder-required formats are not available for export

**ESCALATE for additional review if:**
- The rewrite is for a legal, regulatory, or compliance document
- The target audience spans multiple cultural or linguistic groups
- The original text contains disputed or controversial claims
- Multiple stakeholders have conflicting tone preferences
- The rewrite will be distributed publicly or to a large audience
- Brand reputation risk is high if the tone is perceived incorrectly

## Checklist Completion

**Date of Review:** _________________

**Reviewer:** _________________

**Total Items Checked:** _____ / 115+

**Pass Threshold:** 95% (109+ items checked)

**Status:** [ ] PASSED - Rewrite approved for delivery  |  [ ] NEEDS REMEDIATION

**Critical Findings (if any):**
_______________________________________________________________________________
_______________________________________________________________________________

**Remediation Plan:**
_______________________________________________________________________________
_______________________________________________________________________________

**Next Review Date:** _________________
