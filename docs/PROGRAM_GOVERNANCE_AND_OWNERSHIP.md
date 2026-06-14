# Hair Studio Program Governance and Ownership

Date: 2026-04-20
Companion docs:

- [PROFESSIONAL_MOBILE_UPGRADE_STRATEGY.md](PROFESSIONAL_MOBILE_UPGRADE_STRATEGY.md)
- [SPRINT_EXECUTION_BACKLOG.md](SPRINT_EXECUTION_BACKLOG.md)

## Purpose

This document defines how the upgrade program is run across teams, how decisions are reviewed, and how dependencies are managed. It keeps the specialist-team model from the strategy intact during execution.

## Program Structure

| Layer | Responsibility |
| --- | --- |
| Steering Group | approve priorities, approve model choice, approve launch gates, resolve cross-team tradeoffs |
| Expert Teams | design and implement within their workstream |
| Review Teams | independently challenge quality, assumptions, and release readiness |
| Program Manager | maintain sprint plan, dependency map, and escalation log |

## Expert Teams and Review Teams

| Workstream | Expert Team | Primary Owner | Review Team | Review Scope |
| --- | --- | --- | --- | --- |
| Commerce | Commerce and Revenue Integrity | Commerce Lead / Payments Architect | Revenue Integrity Review Team | margin, compliance, refund integrity, catalog consistency |
| AI Quality | AI Generation Excellence Team | AI/ML Engineering Lead | AI Quality Review Team | realism, identity preservation, cost, benchmark validity |
| UX Modernization | Mobile Experience and Product Design Squad | Lead Product Designer + Frontend Engineering Lead | UX Review Team | usability, accessibility, simplicity, consistency |
| Retention and Growth | Growth and Engagement Squad | Growth Lead | Growth Review Team | retention lift, complexity control, marketing readiness |

## Ownership Rules

1. Each workstream has one primary owner role, even if multiple disciplines contribute.
2. Expert teams can propose scope changes, but only the Steering Group can approve changes that affect timeline, pricing, or launch gates.
3. Review teams do not implement their own review findings. Findings go back to the expert team.
4. No workstream may self-certify its own release gate.

## Decision Rights

| Decision | Decision Owner | Must Be Consulted | Final Approval |
| --- | --- | --- | --- |
| pricing catalog changes | Commerce Lead | Growth Lead, UX Lead | Steering Group |
| production image model selection | AI Lead | Commerce Lead, UX Lead | Steering Group |
| paywall and shell UX changes | UX Lead | Commerce Lead, Growth Lead | Steering Group for material changes |
| compare mode, referral, and push features | Growth Lead | Commerce Lead, UX Lead | Steering Group if monetization or risk changes |
| staged rollout and launch | Program Manager coordinates | all workstream leads and review leads | Steering Group |

## Core Artifacts by Team

### Commerce

- pricing catalog specification
- ledger schema and refund integrity report
- subscription operating model
- paywall and rewards API contract

### AI Quality

- benchmark rubric and results pack
- model recommendation memo
- structured prompt and hairstyle schema docs
- quality threshold tuning report

### UX Modernization

- IA map and navigation specification
- onboarding and paywall flow spec
- component system and accessibility checklist
- result and history UX spec

### Retention and Growth

- growth instrumentation plan
- feature launch brief for compare, save, rate, and export
- lifecycle messaging plan
- retention review and social-launch gate memo

## Sprint Rituals

### Weekly expert team check-in

Every workstream lead should report:

- completed deliverables
- current blockers
- dependency risks
- changes to sprint forecast

The Program Manager must also review the dependency tracker in this meeting and flag all new at-risk dependencies.

### Weekly review board

Review leads should inspect:

- whether new work stays aligned with the strategy
- whether evidence supports the proposed implementation
- whether new work increases unnecessary complexity

### Steering review at sprint close

The Steering Group should decide:

- pass gate
- pass with conditions
- send back for revision
- de-scope or re-sequence

## Review Workflow

Every major workstream deliverable should follow this loop:

1. Expert team submits artifact or feature candidate.
2. Review team logs findings by severity.
3. Expert team addresses findings.
4. Review team verifies closure.
5. Steering Group approves or rejects gate passage.

## Severity Rules for Review Findings

| Severity | Meaning | Required Action |
| --- | --- | --- |
| Critical | blocks release, violates core goal, or introduces major financial or trust risk | must be fixed before gate passes |
| High | materially weakens quality, profitability, or usability | fix before release unless Steering Group explicitly waives |
| Medium | should be fixed in current or next sprint | schedule and track |
| Low | polish or optimization issue | backlog unless repeated |

## Dependency Management Rules

1. Commerce owns the pricing truth. Other teams consume it.
2. AI owns generation cost evidence. Commerce uses that evidence to finalize pricing.
3. UX owns the shell and interaction clarity. Growth features must fit inside that shell.
4. Growth owns retention experiments, but cannot launch features that undermine product simplicity.
5. The Program Manager maintains a single dependency tracker and raises any at-risk dependency within 24 hours of discovery.

## Dependency Tracker Template

| Dependency ID | From Team | To Team | Needed By Sprint | Status | Risk | Mitigation |
| --- | --- | --- | --- | --- | --- | --- |
| D-01 | Commerce | UX | Sprint 2 | Open | High | freeze pricing API contract in Sprint 1 |
| D-02 | AI | Commerce | Sprint 2 | Open | High | benchmark cost memo required before subscription values lock |
| D-03 | UX | Growth | Sprint 4 | Open | Medium | keep growth features behind the new shell only |

## Review Team Leadership

Each review team should nominate one review lead for sprint ceremonies. The review lead speaks for the review team in steering meetings, but findings still belong to the full review team.

## Escalation Paths

### Scope conflict

If two teams want conflicting implementations, the Program Manager escalates to the Steering Group with:

- tradeoff summary
- timeline impact
- user impact
- recommended decision

### Timeline risk

If a dependency threatens the current sprint exit gate:

1. workstream owner raises it within one business day
2. Program Manager logs it as an active risk
3. Steering Group decides whether to re-sequence, de-scope, or add support

### Quality risk

If a review team finds a critical issue close to release, release is paused until:

- the issue is fixed
- the fix is verified
- the gate is re-run

## Launch Gates

### Foundation Gate

Owned by: Steering Group  
Requires:

- pricing catalog source of truth
- ledger activation
- benchmark harness approval

### Production Design Gate

Owned by: Steering Group  
Requires:

- model choice approved
- IA and shell approved
- paywall and rewards separation approved

### Staged Rollout Gate

Owned by: Steering Group  
Requires:

- new generation pipeline passes quality thresholds
- subscriptions and ledger reconcile correctly
- first-run flow passes usability review
- retention instrumentation is live

### Broad Launch Gate

Owned by: Steering Group  
Requires:

- staged cohort metrics are acceptable
- no unresolved critical findings
- support and monitoring readiness confirmed

Default launch thresholds, unless replaced by a stricter approved target by end of Sprint 2:

- first-run completion rate at least 70%
- generation success rate after retry at least 90%
- day-7 retention no worse than baseline and target at least +5% versus current measured baseline
- no critical ledger reconciliation mismatch
- no unresolved critical review findings

## KPI Ownership

| KPI | Owner | Supporting Teams |
| --- | --- | --- |
| paywall conversion | Commerce Lead | UX, Growth |
| cost per successful generation | AI Lead | Commerce |
| first-run completion rate | UX Lead | AI, Commerce |
| day-7 retention | Growth Lead | UX, AI |
| refund rate and fraud flags | Commerce Lead | AI, Growth |

## Social Feature Governance

The optional public feed is a governance-controlled feature, not a default roadmap item.

The Growth Review Team must submit a written go or no-go memo after staged rollout including:

- retention impact
- support load
- moderation readiness
- projected marketing value
- opportunity cost versus continuing to improve core flows

The Steering Group decides whether G4 starts.

## Recommended Documentation Pack

At minimum, the program should maintain these live documents during execution:

1. strategy document
2. sprint execution backlog
3. governance and ownership document
4. dependency tracker
5. risk and decision log
6. release gate checklist
