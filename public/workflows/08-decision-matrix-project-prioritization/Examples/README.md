# Examples - Decision Matrix for Project Prioritization

## Overview

This directory contains example outputs demonstrating how to apply the Decision Matrix for Project Prioritization workflow in realistic scenarios. Each example shows a complete or partial walkthrough of the SOP, illustrating the format, depth, and quality of expected outputs.

## Example Scenarios

---

### Example 1: Startup Quarterly Project Selection

**User Profile:** Product lead at a 30-person B2B SaaS startup, selecting 3 projects to pursue in Q3 from a list of 7 candidates.

**Decision Statement:** "Which 3 of our 7 proposed initiatives should we invest engineering resources in for Q3 2026?"

**Constraint:** 12 engineering person-months available (4 engineers x 3 months)

#### Candidate Projects

| ID | Project | Description | Estimated Effort |
|----|---------|-------------|-----------------|
| P-01 | Search Overhaul | Rebuild full-text search with AI-powered relevance ranking | Large (4 person-months) |
| P-02 | Mobile App v2 | Native mobile app with offline capabilities | Large (5 person-months) |
| P-03 | Analytics Dashboard | Self-serve reporting dashboard for customers | Medium (3 person-months) |
| P-04 | API Rate Limiting | Implement tiered rate limiting for API plans | Small (1.5 person-months) |
| P-05 | Onboarding Wizard | Guided setup flow for new customers | Medium (2 person-months) |
| P-06 | SSO Integration | Enterprise SSO (SAML/OIDC) for larger customers | Medium (2.5 person-months) |
| P-07 | Performance Optimization | Reduce p95 page load time from 3.2s to under 1s | Medium (3 person-months) |

#### Criteria and Weights

| Criterion | Weight | Definition | Scoring Anchors (1-5) |
|-----------|--------|------------|----------------------|
| Revenue Impact | 30% | Direct contribution to new revenue or retention | 1=None, 2=Minor, 3=Moderate ($50K+), 4=Significant ($150K+), 5=Transformational ($300K+) |
| Customer Demand | 20% | Frequency and intensity of customer requests | 1=No requests, 2=Occasional, 3=Regular, 4=Top-5 request, 5=Number 1 request |
| Effort Efficiency | 20% | Value delivered relative to resources consumed | 1=Very high effort/low return, 3=Balanced, 5=Low effort/high return |
| Strategic Alignment | 15% | Fit with annual goal of "Move upmarket to enterprise" | 1=Irrelevant, 3=Somewhat aligned, 5=Directly enables strategy |
| Technical Risk | 15% | Likelihood of technical challenges or delays (inverted: 5=low risk) | 1=Very high risk, 3=Moderate, 5=Well-understood, low risk |

#### Scored Matrix

| Project | Revenue Impact (30%) | Customer Demand (20%) | Effort Efficiency (20%) | Strategic Alignment (15%) | Technical Risk (15%) | Weighted Total | Rank |
|---------|---------------------|----------------------|------------------------|--------------------------|---------------------|---------------|------|
| P-01 Search Overhaul | 3 (0.90) | 4 (0.80) | 2 (0.40) | 3 (0.45) | 2 (0.30) | **2.85** | 5 |
| P-02 Mobile App v2 | 4 (1.20) | 3 (0.60) | 2 (0.40) | 2 (0.30) | 3 (0.45) | **2.95** | 4 |
| P-03 Analytics Dashboard | 4 (1.20) | 5 (1.00) | 3 (0.60) | 4 (0.60) | 4 (0.60) | **4.00** | 1 |
| P-04 API Rate Limiting | 2 (0.60) | 2 (0.40) | 4 (0.80) | 4 (0.60) | 5 (0.75) | **3.15** | 3 |
| P-05 Onboarding Wizard | 3 (0.90) | 4 (0.80) | 4 (0.80) | 3 (0.45) | 4 (0.60) | **3.55** | 2 |
| P-06 SSO Integration | 3 (0.90) | 3 (0.60) | 3 (0.60) | 5 (0.75) | 3 (0.45) | **3.30** | -- |
| P-07 Performance Opt. | 2 (0.60) | 3 (0.60) | 3 (0.60) | 2 (0.30) | 3 (0.45) | **2.55** | 7 |

*Note: P-06 SSO received a tied score of 3.30 with no other project; it ranks between P-04 and P-02.*

**Revised ranking with tie resolution:**

| Rank | Project | Score | Tier |
|------|---------|-------|------|
| 1 | P-03 Analytics Dashboard | 4.00 | Tier 1 - High Priority |
| 2 | P-05 Onboarding Wizard | 3.55 | Tier 1 - High Priority |
| 3 | P-06 SSO Integration | 3.30 | Tier 1 - High Priority |
| 4 | P-04 API Rate Limiting | 3.15 | Tier 2 - Medium Priority |
| 5 | P-02 Mobile App v2 | 2.95 | Tier 2 - Medium Priority |
| 6 | P-01 Search Overhaul | 2.85 | Tier 3 - Defer |
| 7 | P-07 Performance Opt. | 2.55 | Tier 3 - Defer |

**Resource Check:** P-03 (3 months) + P-05 (2 months) + P-06 (2.5 months) = 7.5 person-months of 12 available. Remaining 4.5 person-months could accommodate P-04 (1.5 months) with buffer.

**Decision:** Fund P-03, P-05, P-06, and P-04. Total: 9 person-months, leaving 3 person-months as buffer for unexpected work.

#### Sample Rationale

**P-03 Analytics Dashboard (Rank 1, Score 4.00):**
Strongest project across nearly all criteria. It is the number one customer request, directly supports enterprise sales conversations (strategic alignment), and has a well-understood technical approach. Revenue impact is high because three enterprise prospects have cited lack of self-serve reporting as a blocker to signing.

**P-07 Performance Optimization (Rank 7, Score 2.55):**
While important for user experience, performance optimization scored low on revenue impact and strategic alignment. Current performance is "adequate" for most users. Recommend deferring to Q4 or addressing incrementally alongside other work.

---

### Example 2: Simple Grid with Scores (Quick Reference Format)

**Context:** A freelancer deciding which three side projects to focus on over the next month.

**Projects:** Blog redesign, Online course, Newsletter launch, Consulting package, Open-source tool

**Criteria (equal weight, 20% each):** Revenue Potential, Time to Complete, Personal Interest, Market Demand, Skill Growth

```
                    Revenue  Time-to-  Personal  Market   Skill
Project             Potential Complete  Interest  Demand   Growth   TOTAL
---------------------------------------------------------------------------
Blog Redesign          2        4         3        2        2       2.60
Online Course          5        2         4        4        3       3.60
Newsletter Launch      3        5         5        3        4       4.00
Consulting Package     4        3         3        5        2       3.40
Open-Source Tool       1        3         5        2        5       3.20

RANKING:
1. Newsletter Launch    4.00  [HIGH]   -- Low effort, high interest, skill growth
2. Online Course        3.60  [HIGH]   -- Strong revenue, good demand
3. Consulting Package   3.40  [MEDIUM] -- Best market demand, moderate overall
4. Open-Source Tool     3.20  [MEDIUM] -- Great for skills but low revenue
5. Blog Redesign        2.60  [LOW]    -- Quick but limited impact

DECISION: Focus on Newsletter Launch and Online Course. Consider Consulting
Package if time permits. Defer Blog Redesign and Open-Source Tool.
```

---

### Example 3: Team Scoring with Variance Analysis

**Context:** A 4-person product team scoring 5 feature candidates. Each person scored independently before calibration.

**Criteria:** User Value (35%), Dev Effort inverted (25%), Strategic Fit (25%), Risk inverted (15%)

**Individual Scores (User Value criterion only, for illustration):**

| Project | Rater 1 (PM) | Rater 2 (Eng) | Rater 3 (Design) | Rater 4 (Data) | Average | Std Dev | Flag? |
|---------|-------------|---------------|------------------|---------------|---------|---------|-------|
| Feature A | 5 | 4 | 5 | 4 | 4.50 | 0.58 | No |
| Feature B | 3 | 2 | 4 | 3 | 3.00 | 0.82 | No |
| Feature C | 4 | 5 | 3 | 5 | 4.25 | 0.96 | No |
| Feature D | 5 | 2 | 4 | 3 | 3.50 | 1.29 | YES |
| Feature E | 3 | 3 | 3 | 4 | 3.25 | 0.50 | No |

**Variance Analysis:**
- Feature D flagged with standard deviation of 1.29 (threshold: 1.0)
- PM rated 5 (sees strong customer value from support tickets)
- Engineering rated 2 (believes technical limitations reduce actual user value)
- After discussion: team agreed on score of 4 (value is real but partially limited by current architecture; mitigated by phased approach)

**Key Takeaway:** The variance flag caught a genuine disagreement based on different information. The PM had customer data; Engineering had technical context. Discussion led to a more informed score.

---

### Example 4: Sensitivity Analysis Output

**Context:** Testing whether the top pick changes under different weighting scenarios.

**Base Scenario:** Impact 30%, Effort 20%, Alignment 20%, Risk 15%, Urgency 15%

| Project | Base Scenario | Impact-Heavy (50/15/15/10/10) | Risk-Averse (20/15/15/35/15) | Speed-First (15/30/10/10/35) |
|---------|--------------|-------------------------------|------------------------------|------------------------------|
| Project A | **Rank 1** (4.00) | **Rank 1** (4.10) | Rank 2 (3.65) | Rank 3 (3.30) |
| Project B | Rank 2 (3.55) | Rank 3 (3.30) | **Rank 1** (3.80) | **Rank 1** (4.05) |
| Project C | Rank 3 (3.30) | Rank 2 (3.45) | Rank 3 (3.20) | Rank 2 (3.50) |

**Interpretation:**
- **Project A** is the top pick under base and impact-heavy scenarios. It is a "safe bet" when the organization values impact most.
- **Project B** becomes the top pick when risk or speed are prioritized. It is a "swing project" that depends on strategic emphasis.
- **Project C** never reaches rank 1 in any scenario. It is a consistent Tier 2 project.

**Recommendation:** If stakeholders are confident in impact-driven strategy, Project A is robust. If risk tolerance is low or speed is critical, reconsider in favor of Project B.

---

### Example 5: 2x2 Quadrant Visualization

**Context:** Quick visual plotting of projects by Impact (y-axis) vs. Effort (x-axis).

```
HIGH IMPACT
    |
  5 |  [P-03]                          [P-02]
    |     Analytics                        Mobile App
  4 |         [P-05]         [P-01]
    |         Onboarding     Search
  3 |  [P-06]
    |   SSO               [P-04]
  2 |                      Rate Limit     [P-07]
    |                                     Performance
  1 |
    +-------+-------+-------+-------+-------
    1       2       3       4       5
                                      HIGH EFFORT

QUADRANT LABELS:
  Top-Left:     QUICK WINS (High Impact, Low Effort) -- P-03, P-05
  Top-Right:    BIG BETS (High Impact, High Effort) -- P-02, P-01
  Bottom-Left:  FILL-INS (Low Impact, Low Effort) -- P-06, P-04
  Bottom-Right: AVOID (Low Impact, High Effort) -- P-07
```

**Reading the Chart:**
- **Quick Wins (top-left)** are the highest priority: P-03 and P-05 deliver high impact with relatively low effort
- **Big Bets (top-right)** may be worth it for transformational impact: P-02 and P-01, but need careful resource planning
- **Fill-Ins (bottom-left)** are good for spare capacity: P-06 and P-04 are low-effort improvements
- **Avoid (bottom-right)** should be deprioritized: P-07 requires significant effort for limited differentiation

---

## How to Use These Examples

1. **As Format Templates:** Copy the table structures and scoring layouts for your own matrices
2. **As Calibration References:** Compare your scoring granularity and rationale depth to these examples
3. **As Training Materials:** Walk new team members through the examples before their first scoring session
4. **As Presentation Models:** Use the summary formats (Example 2 and Example 5) for stakeholder communication

## Important Notes

- All project names, scores, and details in these examples are fictional
- Real decision matrices should reflect your actual strategic context, criteria, and constraints
- Scores should be based on evidence and data, not copied from examples
- These examples illustrate methodology, not recommended scores for any particular situation
- See the Redaction Guide for how to anonymize your real matrices before sharing

---

## Related Files

- **SOP.md** - Full step-by-step instructions for building your matrix
- **Prompts.txt** - AI prompts for generating matrices, scores, and analysis
- **QC-Checklist.md** - Quality control checklist for verifying matrix completeness
- **Redaction-Guide.txt** - How to anonymize before sharing
- **Export-Templates/README.md** - Templates for Google Sheets, Docs, and other platforms
