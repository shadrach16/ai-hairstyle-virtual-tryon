# Hair Studio Sprint Execution Backlog

Date: 2026-04-20
Companion to: [PROFESSIONAL_MOBILE_UPGRADE_STRATEGY.md](PROFESSIONAL_MOBILE_UPGRADE_STRATEGY.md)

## Purpose

This document converts the upgrade strategy into an execution backlog with:

- sprint-by-sprint delivery sequencing
- workstream epics
- owner roles
- review ownership
- cross-team dependencies
- exit gates per sprint

## Program Owners

| Workstream | Expert Team | Primary Owner | Review Owner | Core Objective |
| --- | --- | --- | --- | --- |
| Commerce | Commerce and Revenue Integrity | Commerce Lead / Payments Architect | Revenue Integrity Review Team | unify pricing, subscriptions, credits, refunds, and payment reliability |
| AI Quality | AI Generation Excellence Team | AI/ML Engineering Lead | AI Quality Review Team | choose the right model and modernize the generation pipeline |
| UX Modernization | Mobile Experience and Product Design Squad | Lead Product Designer + Frontend Engineering Lead | UX Review Team | simplify the app and make the experience feel premium and clear |
| Retention and Growth | Growth and Engagement Squad | Growth Lead | Growth Review Team | increase repeat usage, sharing, and practical user value |

## Sprint Model

Recommended cadence:

- Sprint 0: 1 week for alignment, cleanup, and setup
- Sprints 1 to 6: 1 to 2 weeks each
- Release model: staged rollout after Sprint 5, broader launch after Sprint 6 gate

## Sprint Roadmap

| Sprint | Duration | Primary Goal | Major Epics | Primary Owners | Key Dependencies | Exit Gate |
| --- | --- | --- | --- | --- | --- | --- |
| Sprint 0 | 1 week | Stabilize the foundation and align teams | C1, C2 foundation, A1 setup, U1 audit, G1 setup | Commerce Lead, AI Lead, UX Lead, Growth Lead | none | source-of-truth plan agreed and benchmark setup approved |
| Sprint 1 | 1 week | Unify pricing and start AI benchmark | C1, C2, A1, U1 | Commerce Lead, AI Lead, UX Lead | existing payment code and product mapping audit | pricing catalog contract approved and benchmark harness runnable |
| Sprint 2 | 1.5 weeks | Finish model benchmark and lock UX architecture | A1 complete, C3 design start after A1 cost memo, U1 complete, U2 design, G1 discovery | AI Lead, Commerce Lead, UX Lead, Growth Lead | pricing catalog draft, benchmark credentials, A1 cost memo | production model recommendation approved |
| Sprint 3 | 1.5 weeks | Rebuild core product surfaces and data models | A2, C3 build, U2, U3 start, G1 technical foundation, G3 start | AI Lead, Commerce Lead, UX Lead, Growth Lead | model decision, pricing catalog, auth and generation contracts | structured prompts and new UX flows approved |
| Sprint 4 | 1.5 weeks | Ship modernized generation flow and monetization surfaces | A3, A4 start, C4, U3, U4 start, G2 start | AI Lead, Commerce Lead, UX Lead, Growth Lead | ledger, subscription logic, design system tokens | masked edit path, paywall split, and navigation ship candidate ready |
| Sprint 5 | 1.5 weeks | Add premium value and retention loops | A4 complete, U4, G2, G3, G1 build and polish, LT1 items 1-7 | AI Lead, UX Lead, Growth Lead, Frontend Engineering Lead | stable generation and new shell | staged rollout candidate with analytics and retention instrumentation and all five thresholds measurable |
| Sprint 6 | 1 week | Validate, polish, and decide on optional social layer | C4 polish, U4 polish, G3 complete, G4 gate, LT1 items 8-10 | Commerce Lead, UX Lead, Growth Lead | live usage metrics from staged rollout and LT1 Sprint 5 complete | launch readiness approved with thresholds passing and G4 decision made |

## Detailed Backlog by Workstream

## Commerce

### C1. Unified Pricing Catalog

**Owner:** Commerce Lead / Payments Architect  
**Review Owner:** Revenue Integrity Review Team  
**Dependencies:** existing pricing definitions in [../backend/routes/payments.js](../backend/routes/payments.js), [../backend/routes/webhook.js](../backend/routes/webhook.js), and [../src/lib/pricingSystem.ts](../src/lib/pricingSystem.ts)

**Deliverables**

1. Create a canonical pricing catalog service and endpoint.
2. Map RevenueCat products and Dodo products to the same internal catalog IDs.
3. Remove obsolete Paystack service code and schema remnants.
4. Update frontend monetization surfaces to read from the backend catalog.
5. Add catalog versioning and validation checks.
6. Remove Paystack fields from the user subscription schema and related persistence logic.

**Definition of done**

- one pricing source of truth exists
- all channels resolve to the same pack and subscription definitions
- no active Paystack dependency remains in payment flow
- user schema no longer carries obsolete Paystack subscription fields

### C2. Credit Ledger and Refund Integrity

**Owner:** Commerce Lead / Backend Engineer  
**Review Owner:** Revenue Integrity Review Team  
**Dependencies:** C1 pricing catalog

**Deliverables**

1. Create `CreditTransaction` model and indexes.
2. Log all purchases, spends, refunds, ad rewards, referral rewards, streak rewards, and support adjustments.
3. Add refund reason logging for generation failures.
4. Build a ledger API and customer-visible credit history surface.
5. Add anomaly alerts for refund abuse and ledger mismatches.

**Definition of done**

- every credit movement is auditable
- refund visibility exists for the user and support staff
- fraud rules can detect abnormal refund behavior

### C3. Subscription Operating Model

**Owner:** Commerce Lead / Payments Architect  
**Review Owner:** Revenue Integrity Review Team  
**Dependencies:** C1, C2, AI production cost band from A1 delivered in Sprint 2

**Deliverables**

1. Finalize subscription tiers and monthly allowances.
2. Implement subscription endpoints and state transitions.
3. Add RevenueCat subscription handling for native.
4. Add Dodo subscription handling for web if retained.
5. Implement monthly refresh and rollover rules.
6. Implement expiry, cancellation, and restore flows.

**Definition of done**

- subscriptions are purchasable and enforceable
- credit refresh and rollover work correctly
- churn and renewal analytics are trackable

### C4. Paywall and Rewards Surface Split

**Owner:** Commerce Lead + Frontend Engineer  
**Review Owner:** UX Review Team  
**Dependencies:** C1, C3, U2

**Deliverables**

1. Split paywall and rewards into separate surfaces.
2. Add cost visibility before generation.
3. Add refund reassurance copy and purchase trust cues.
4. Add restore purchases and subscription management entry points.
5. Add low-credit upgrade prompts tied to actual plan catalog data.
6. Decompose [../src/components/PricingModal.tsx](../src/components/PricingModal.tsx) by moving reward tabs into a dedicated rewards surface.

**Definition of done**

- monetization is easy to understand in under 90 seconds
- rewards are no longer mixed into the core paywall decision surface

## AI Quality

### A1. Benchmark and Production Model Selection

**Owner:** AI/ML Engineering Lead  
**Review Owner:** AI Quality Review Team  
**Dependencies:** access credentials, fixed evaluation dataset, commerce pricing bands

**Deliverables**

1. Build benchmark harness and golden evaluation set.
2. Benchmark FLUX Kontext Pro.
3. Benchmark Gemini 3.1 Flash Image.
4. Benchmark Gemini 3 Pro Image and GPT-image-1.5 for premium mode.
5. Produce recommendation memo with cost, latency, and quality score.

**Definition of done**

- chosen production model beats current baseline on defined metrics
- cost band is validated against monetization plan

### A2. Structured Hairstyle Schema and Prompt Redesign

**Owner:** AI/ML Engineering Lead  
**Review Owner:** AI Quality Review Team  
**Dependencies:** A1 model decision, existing hairstyle data

**Deliverables**

1. Define structured hairstyle schema.
2. Build attribute extractor service.
3. Replace monolithic prompt file with model-specific prompt families.
4. Add prompt version tracking to generation analytics.
5. Retire legacy prompt logic from generation flow.

**Definition of done**

- all active hairstyles map to structured attributes
- prompt versions can be compared against user outcomes

### A3. Input Gate and Masked Edit Pipeline

**Owner:** AI/ML Engineering Lead + Backend Engineer  
**Review Owner:** AI Quality Review Team  
**Dependencies:** A1, A2, C2 refund ledger

**Deliverables**

1. Implement input quality scoring for selfie acceptance.
2. Add hair-region mask generation.
3. Redesign generation request payload around edit prompts plus preservation prompts.
4. Integrate chosen image-edit model path.
5. Reject poor inputs without consuming credits.

**Definition of done**

- poor inputs are filtered before generation
- generation uses localized edit logic instead of only long-form prompting

### A4. Output Quality Controls and Premium Modes

**Owner:** AI/ML Engineering Lead  
**Review Owner:** AI Quality Review Team  
**Dependencies:** A3, C2, C3

**Deliverables**

1. Add output quality scoring for identity, pose, and artifact detection.
2. Auto-regenerate once on quality failure.
3. Refund after final failure.
4. Introduce `standard`, `hd`, and `pro` generation modes.
5. Build quality and cost analytics dashboard.

**Definition of done**

- quality checks protect users from obvious bad outputs
- premium modes are measurable and margin-safe

## UX Modernization

### U1. Information Architecture and Navigation Simplification

**Owner:** Lead Product Designer + Frontend Engineering Lead  
**Review Owner:** UX Review Team  
**Dependencies:** current shell audit, C1 pricing contract for downstream surfaces

**Deliverables**

1. Finalize the three-tab mobile IA: Try On, Looks, Profile.
2. Build bottom navigation shell.
3. Audit and remove obsolete modal-heavy surfaces.
4. Separate paywall, rewards, style picker, and result action sheets.
5. Regression-test web-mobile and native action access around [../src/components/studio/MobileActionBar.tsx](../src/components/studio/MobileActionBar.tsx).

**Definition of done**

- app shell is simplified and stable across native and web-mobile
- primary navigation no longer relies on stacked modals

### U2. First-Run Flow and Monetization UX Rebuild

**Owner:** Lead Product Designer  
**Review Owner:** UX Review Team  
**Dependencies:** U1, C1, AI latency expectations from A1 before implementation exit

**Deliverables**

1. Create lightweight onboarding flow with minimal friction.
2. Build self-contained paywall sheet.
3. Show cost, quality, and watermark expectations before generation.
4. Add generation ETA and refund reassurance messaging.
5. Validate first-run completion in usability testing.

**Definition of done**

- a first-time user can complete a try-on flow without external help
- monetization surfaces answer the right questions and no more

### U3. Design System and Component Modernization

**Owner:** Frontend Engineering Lead  
**Review Owner:** UX Review Team  
**Dependencies:** U1, U2

**Deliverables**

1. Refresh design tokens and color usage.
2. Replace overloaded patterns with bottom sheets, segmented controls, chips, cards, and snackbars.
3. Add skeleton loading states.
4. Reduce heavy motion and improve interaction clarity.
5. Run accessibility audit and fix blocking issues.

**Definition of done**

- visual language is consistent, modern, and accessible
- loading and interaction states feel premium rather than busy

### U4. Results, History, and Export Experience

**Owner:** Lead Product Designer + Frontend Engineering Lead  
**Review Owner:** UX Review Team  
**Dependencies:** U2, A4

**Deliverables**

1. Redesign result hero view.
2. Promote before-and-after comparison to first-class interaction.
3. Add barber-ready export and improved sharing.
4. Improve history and retry-from-same-selfie path.
5. Add save and collection affordances.

**Definition of done**

- results feel premium and useful beyond one-time novelty
- retry and export flows are obvious and fast

## Retention and Growth

### G1. Decision Support and Comparison Features

**Owner:** Growth Lead + Feature Lead  
**Review Owner:** Growth Review Team  
**Dependencies:** C1 pricing accuracy for discovery work; A4 stable output modes and U4 result layout before compare mode and video export ship

**Deliverables**

1. Add saved looks model and CRUD flows.
2. Add compare-three-styles mode with transparent pricing.
3. Add barber-ready export card integration.
4. Add quick retry from same selfie.
5. Add generation rating flow.
6. Improve searchable history.
7. Add short before-and-after video export.

**Definition of done**

- users can compare, save, export, and rate results without friction

### G2. Collections and Recommendations

**Owner:** Growth Lead + Backend Lead  
**Review Owner:** Growth Review Team  
**Dependencies:** G1, U1, A2 structured style schema

**Deliverables**

1. Build curated style collections model and APIs.
2. Add trending or seasonal collection carousel.
3. Build AI stylist recommendation layer.
4. Add style context notes and recommendation explanation.
5. Add A/B framework for recommendation variants.

**Definition of done**

- discovery surfaces increase style-to-generation conversion

### G3. Lifecycle Engagement and Rewards Evolution

**Owner:** Growth Lead + Data Lead  
**Review Owner:** Growth Review Team  
**Dependencies:** C2 ledger, existing push infrastructure, U1 profile and rewards surfaces

**Deliverables**

1. Improve streak UI and reward visibility.
2. Add push campaign infrastructure and templates.
3. Add streak-break prevention notifications.
4. Add 7-day habit loop onboarding messages.
5. Upgrade referrals to tiered rewards.
6. Add weekly engagement recap.
7. Build lifecycle dashboard for D1, D7, D30, push engagement, and referral performance.

**Definition of done**

- lifecycle mechanics are visible, measurable, and non-spammy

### G4. Optional Social Velocity Loop

**Owner:** Growth Lead + Backend Lead  
**Review Owner:** Growth Review Team  
**Dependencies:** G1, G2, G3, launch metrics meeting gate thresholds

**Deliverables**

1. Build public result feed model and APIs.
2. Add public/private generation toggle.
3. Add social feed UI and “try this style” entry point.
4. Add like, save, and share interactions.
5. Add trending styles widget and creator profile basics.

**Definition of done**

- social layer proves incremental growth value without harming simplicity

## Launch Threshold Instrumentation

### LT1. Launch Threshold Measurement and Enforcement

**Owner:** Frontend Engineering Lead + Backend Engineer  
**Review Owner:** Program Manager + all four workstream review owners  
**Dependencies:** C2 credit ledger, A4 generation analytics, G3 lifecycle dashboard, U2 onboarding flow, C4 paywall surfaces

**Rationale**

Audit of the five launch thresholds against the current codebase revealed that 8 of 12 instrumentation gaps survive through Sprint 5. No existing epic owns the analytics plumbing repairs, comprehension instrumentation, or reconciliation automation required to actually measure the thresholds at Gate D. This patch epic closes those gaps.

**Deliverables**

Sprint 5 scope (instrument before staged rollout):

1. Fix analytics schema mismatch: align track route field names (`eventData`/`userAgent`/`page`) to Analytics model schema (`eventName`/`properties`/`metadata`) so stored events query correctly. Affects thresholds 1, 2, and 4.
2. Fix `userId` vs `user` field mismatch in Generation queries across user stats and analytics dashboard routes so generation success rate can be computed.
3. Add `optionalAuth` to analytics track route so `userId` is populated for authenticated users instead of always null.
4. Build first-run completion rate aggregation endpoint: query onboarding `started` vs `completed` events grouped by cohort window, expose as `GET /api/analytics/threshold/first-run-completion`.
5. Build generation success rate after retries endpoint: aggregate Generation records by `status` and `retryCount` over configurable time window, expose as `GET /api/analytics/threshold/generation-success-rate`.
6. Add paywall comprehension instrumentation: emit `cost_confirmed` event when user taps confirm on PreGenerationSheet, emit `cost_sheet_dismissed` when they back out, track `time_on_cost_sheet` duration.
7. Enforce cost visibility on custom-style path: route custom-style generation through PreGenerationSheet instead of bypassing directly to generate from MobileActionBar.

Sprint 6 scope (validate and enforce before launch):

8. Build batch reconciliation job: cross-check Payment records against CreditTransaction ledger and Generation refund records, flag mismatches, expose as `GET /api/analytics/threshold/ledger-reconciliation`.
9. Build launch threshold dashboard surface: consume all five threshold endpoints from a single admin view with pass/fail indicators against configured targets.
10. Add automated pre-release gate check: script that queries all five threshold endpoints and returns pass/fail summary for steering review.

**Definition of done**

- all five launch thresholds are measurable from live data with dedicated endpoints
- analytics ingestion schema is consistent so event queries return accurate counts
- every generation path shows cost before consuming credits
- ledger reconciliation runs on demand and reports zero critical mismatches before launch approval
- threshold dashboard exists for steering review at Gate D

## Cross-Workstream Dependencies

| From | To | Dependency |
| --- | --- | --- |
| C1 | C3, C4, U2, G1 | pricing catalog must exist before final paywall, subscriptions, or compare-mode pricing ships |
| C2 | A3, A4, G3 | credit ledger must exist before failure refunds, premium generation charging, and reward visibility are considered complete |
| A1 | C3, A2, U2 | production model cost and latency must be known before final subscriptions, prompts, and ETA messaging are locked |
| A2 | G2 | structured style metadata is needed for recommendation quality |
| A4 | U4, G1 | premium output modes and quality signals are needed for premium export, ratings, and compare-mode confidence |
| U1 | U2, U3, G2, G3 | simplified shell must exist before layered discovery and retention surfaces are added |
| U4 | G1, G4 | premium result surfaces are needed before decision-support and social sharing features feel coherent |
| C2, A4, G3, U2, C4 | LT1 | analytics schema fixes, generation metrics, lifecycle dashboard, onboarding flow, and paywall surfaces must exist before threshold instrumentation is meaningful |

## Sprint-by-Sprint Delivery Detail

### Sprint 0

**Focus:** alignment, cleanup, and setup

- C1: pricing inventory and product-ID audit
- C2: ledger schema design
- A1: benchmark rubric and dataset design
- U1: current-state UX surface audit
- G1: feature instrumentation plan

**Sprint owner:** Program Manager with all four workstream leads

**Exit gate:** steering sign-off on catalog cleanup, benchmark rubric, and shell simplification plan

### Sprint 1

**Focus:** foundational systems

- C1: build pricing catalog endpoint and mappings
- C2: create credit ledger and start transaction logging
- A1: implement benchmark harness and start first two candidate runs
- U1: prototype bottom navigation and modal decomposition map

**Primary dependency:** none beyond environment access

**Exit gate:** pricing contract approved and first benchmark results available

### Sprint 2

**Focus:** decision points

- A1: complete benchmark and production recommendation
- C3: subscription architecture design and API contracts after A1 cost memo is delivered
- U1: finalize IA and navigation shell
- U2: complete onboarding and paywall design specifications
- G1: saved looks, rating, and compare-mode data contract design only

**Primary dependency:** benchmark credentials and pricing draft

**Exit gate:** model selection approved and UX architecture frozen for build phase

### Sprint 3

**Focus:** core rebuild

- A2: structured hairstyle schema and prompt system
- C3: subscription endpoints and state handling
- U2: implement onboarding, cost visibility, and paywall flow
- U3: apply new component system and skeletons
- G1: build saved looks, ratings, and improved history foundation that do not require premium output-mode dependencies
- G3: begin streak and push campaign UX work

**Primary dependency:** model recommendation and catalog decisions

**Exit gate:** structured generation and redesigned first-run flow pass review

### Sprint 4

**Focus:** production-grade experience

- A3: input gate, mask generation, edit-centric generation path
- A4: quality scoring foundation and retry flow
- C4: rewards center and paywall separation
- U3: complete accessibility pass on the new shell
- U4: result hero redesign and export surface foundation
- G2: ship collections and recommendation MVP

**Primary dependency:** ledger, subscription logic, and structured prompts

**Exit gate:** masked edit candidate and new monetization UX ready for end-to-end test

### Sprint 5

**Focus:** premium value and staged rollout

- A4: premium generation modes and analytics dashboard
- U4: before-and-after compare, barber-ready export, retry flow
- G1: compare mode and video export
- G2: recommendation improvements and collection analytics
- G3: streak prevention campaigns, referral 2.0, lifecycle dashboard
- LT1 items 1-7: fix analytics schema mismatch, fix userId/user field bug, add optionalAuth to track route, build first-run completion endpoint, build generation success rate endpoint, add paywall comprehension events, enforce cost visibility on custom-style path

**Primary dependency:** stable generation and navigation shell

**Exit gate:** staged rollout cohort approved with monitoring in place and all five launch thresholds measurable

### Sprint 6

**Focus:** validation, polish, and growth gate

- C4: monetization refinement from staged rollout feedback
- U4: polish, bug fixes, and performance tuning
- G3: finalize engagement loops and reporting
- G4: decide go/no-go for social MVP based on retention and referral metrics
- LT1 items 8-10: batch ledger reconciliation job, launch threshold dashboard, automated pre-release gate check

**Primary dependency:** real staged-rollout metrics and LT1 Sprint 5 items complete

**Exit gate:** launch approval with all five thresholds passing and documented decision on social layer

## Release Gates

### Gate A: Foundation Ready

- pricing catalog is unified
- credit ledger is active
- benchmark harness is approved

### Gate B: Build Phase Ready

- model choice is approved
- shell and IA are approved
- subscription and paywall API contracts are frozen

### Gate C: Staged Rollout Ready

- masked edit generation path works
- premium modes are measurable
- paywall and rewards surfaces are separated
- analytics instrumentation is live and schema-consistent (LT1 items 1-3)
- all five launch threshold endpoints return data (LT1 items 4-7)

### Gate D: Launch Ready

- first-run success metrics are acceptable
- refund and ledger integrity are validated including batch reconciliation (LT1 item 8)
- retention signals do not regress
- P1 and P2 defects are closed or explicitly accepted
- launch threshold dashboard shows all five thresholds passing (LT1 items 9-10)

### Launch Thresholds

The Steering Group should use these default thresholds unless replaced with a stricter approved target by the end of Sprint 2:

- first-run completion rate: at least 70%
- generation success rate after retries: at least 90%
- paywall comprehension in moderated usability review: at least 85% of participants can explain cost before generation
- staged cohort day-7 retention: no worse than baseline and target at least +5% versus current measured baseline
- refund ledger reconciliation mismatches: zero critical mismatches

## Social Feature Gate

G4 should only proceed if all of the following are true after Sprint 5 metrics review:

1. Day-7 retention meets target.
2. referral participation is healthy.
3. result rating quality is stable.
4. core flows are not generating support noise.
5. the team can support moderation and community operations.

If those conditions are not met, continue improving G1 to G3 instead of launching a feed.
