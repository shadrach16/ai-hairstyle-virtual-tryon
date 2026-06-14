# Hair Studio Professional Mobile Upgrade Strategy

Date: 2026-04-20
Scope: Mobile app upgrade strategy across monetization, AI result quality, UI/UX modernization, and retention features.

## Executive Verdict

Hair Studio already has the foundation of a real business: native mobile payments, web payments, credits, referrals, ads, streaks, a working AI generation flow, and a focused core use case. It is not yet operating at a professional product standard because the commercial system, the image pipeline, and the mobile experience are not aligned around one clear promise.

The three biggest gaps are:

1. Pricing logic is fragmented across frontend, backend plans, and webhook product mappings.
2. The AI pipeline is still a single-pass, prompt-heavy generation flow without masking, quality gates, or model benchmarking.
3. The mobile experience is close to usable, but key surfaces are overloaded or inconsistent, especially monetization and web-mobile actions.

The right move is not to add many features immediately. The right move is to run a four-workstream upgrade program with specialist teams, independent review teams, and hard approval gates.

## Current Audit Summary

### Commerce and payments

- Native mobile payments are active through [../src/hooks/usePayment.ts](../src/hooks/usePayment.ts) and [../backend/routes/webhook.js](../backend/routes/webhook.js).
- Web credit purchases are active through Dodo webhooks in [../backend/routes/webhook.js](../backend/routes/webhook.js).
- Rewarded ads, referrals, and basic streak mechanics are already live in [../backend/routes/auth.js](../backend/routes/auth.js).
- Paystack fields and service traces still exist, but the active payment architecture is RevenueCat plus Dodo, not Paystack. The schema still carries Paystack-era fields in [../backend/models/User.js](../backend/models/User.js).
- Pricing is inconsistent between [../backend/routes/payments.js](../backend/routes/payments.js), [../backend/routes/webhook.js](../backend/routes/webhook.js), and [../src/lib/pricingSystem.ts](../src/lib/pricingSystem.ts).
- Subscription fields exist in [../backend/models/User.js](../backend/models/User.js), but the app does not yet have a complete professional subscription operating model.

### AI generation and prompts

- The current active generation route is in [../backend/routes/generations.js](../backend/routes/generations.js).
- The live image model is `gemini-2.5-flash-image`.
- The hairstyle analysis model is `gemini-2.5-flash`.
- Prompting is driven by very long templates in [../backend/prompts/all_prompts.js](../backend/prompts/all_prompts.js).
- The current flow does not use explicit segmentation, explicit masking, identity scoring, or automatic quality rejection.
- The current flow refunds on failure, but does not maintain a dedicated credit transaction ledger.

### Mobile UX

- The main app structure and mobile-first state machine are strong.
- The mobile action flow should be regression-tested on native and web-mobile, but the current [../src/components/studio/MobileActionBar.tsx](../src/components/studio/MobileActionBar.tsx) file is already mobile-first and should be treated as a verification point, not assumed broken.
- [../src/components/PricingModal.tsx](../src/components/PricingModal.tsx) already uses separate tabs, but it still concentrates too many jobs into one modal and should be simplified into clearer surfaces.
- [../src/components/ResultsViewer.tsx](../src/components/ResultsViewer.tsx) already supports sharing, collage creation, and export, which is a good product base.

## Program Structure

This upgrade should be executed through four specialist teams and four review teams.

### Team model

| Workstream | Expert Team Mission | Review Team Mission | Exit Gate |
| --- | --- | --- | --- |
| Commerce | Rebuild pricing, credits, subscriptions, refunds, and payment reliability | Validate profitability, store compliance, fraud resistance, and clarity | Margin-safe and easy to understand |
| AI Quality | Benchmark models, redesign prompts, add masking and quality control | Validate realism, identity retention, cost, and data accuracy | Chosen model beats current baseline |
| UX Modernization | Simplify the mobile app, modernize surfaces, and reduce friction | Validate usability, accessibility, and visual consistency | Faster first-time success and cleaner flow |
| Retention and Growth | Add a small set of high-return features and lifecycle mechanics | Validate complexity, retention lift, and brand fit | Retention value without product bloat |

### Required operating loop

Each workstream should use the same operating rhythm:

1. Audit brief: current-state facts, user problem, unit economics, constraints.
2. Strategy draft: options, recommendation, tradeoffs, dependencies.
3. Independent review: challenge assumptions, pricing accuracy, research quality, and technical feasibility.
4. Revision round: send issues back to the workstream team to fix.
5. Steering approval: only approved plans move into implementation.

No team should self-approve its own plan.

## Workstream 1: Pricing, Credits, and Payments

### Strategic objective

Create a pricing system that feels fair to customers, stays understandable in the app, and protects margin even if the image model later changes.

### Core principles

1. Price by user outcome, not by hairstyle category.
2. Keep purchased credits simple, permanent, and easy to audit.
3. Use subscriptions for habit users and credit packs for intent users.
4. Keep failure refunds immediate and visible.
5. Keep one commercial source of truth for all plans and product IDs.

### What to change

#### 1. Replace fragmented pricing with one source of truth

Create one shared pricing configuration service used by:

- paywall UI
- backend plan endpoints
- RevenueCat offering mappings
- Dodo product mappings
- analytics events

This removes the current drift between [../backend/routes/payments.js](../backend/routes/payments.js), [../backend/routes/webhook.js](../backend/routes/webhook.js), and [../src/lib/pricingSystem.ts](../src/lib/pricingSystem.ts).

#### 2. Stop charging by hairstyle complexity

Do not create a confusing model where braids cost more than fades or one style costs more than another for reasons the customer cannot predict.

Use mode-based pricing instead:

- Standard try-on: 1 credit
- Premium HD try-on: 2 credits
- Compare 3 looks: 3 credits
- Custom reference or multi-angle package: 3 to 5 credits

This is easier to understand and maps cleanly to model cost.

#### 3. Introduce a professional tier model

Recommended starting structure for planning, not final launch values until pricing catalogs are unified and the production model cost is locked:

| Tier | Price | Offer | Notes |
| --- | --- | --- | --- |
| Free | $0 | 1 first-time premium result, then limited ad-supported previews or limited trial credits | Proves value before hard paywall |
| Starter Pack | $2.99 | 5 standard credits | Casual and low-friction |
| Value Pack | $6.99 | 15 standard credits | Best first purchase |
| Pro Pack | $14.99 | 40 standard credits | Good for active users |
| Basic Subscription | $7.99/mo | 25 credits, watermark-free, saved history | Safe starter subscription |
| Plus Subscription | $14.99/mo | 70 credits, HD output, faster queue | Best recurring option |
| Pro Subscription | $24.99/mo | 150 credits, compare mode, barber export, premium collection access | For heavy users |

Why this structure is safer than the current one:

- it is simple enough to explain inside a mobile paywall
- it leaves room for mobile store fees
- it can work if the chosen production model lands in the $0.04 to $0.10 per successful edit range, but launch values must be revalidated after the benchmark and catalog cleanup

#### 4. Make credits customer-friendly

Recommended rules:

- purchased credits do not expire
- subscription credits refresh monthly
- subscription credits roll over up to 25% of monthly allowance
- free or trial credits can expire
- failed generations auto-refund and appear in a visible credit ledger
- users always see the credit cost before tapping generate

#### 5. Split rewards from the paywall

Ads, referrals, and streaks should not live inside the main paywall.

Create two separate surfaces:

- Paywall: plans, packs, benefits, restore purchases
- Rewards Center: ads, referrals, streaks, invite progress

This makes monetization feel more professional and less cluttered.

#### 6. Add a credit transaction ledger

Add a dedicated ledger model for:

- credit purchase
- credit usage
- generation refund
- streak reward
- referral reward
- ad reward
- manual support adjustment

This is required for fraud detection, customer support, and clean analytics.

### Margin framework for the later model decision

Do not hard-code pricing to the current model. Price against cost bands.

| Cost band per successful edit | Recommended credit behavior | Pricing implication |
| --- | --- | --- |
| Up to $0.05 | 1-credit standard mode is safe | Highest flexibility for free trials and bundles |
| $0.05 to $0.08 | 1-credit standard still safe, 2-credit premium recommended | Best business balance |
| $0.08 to $0.15 | Standard should stay limited, premium should cost 2 credits | Subscription allowances must stay conservative |
| Above $0.15 | Do not use as the main default mode | Reserve for premium tier or internal benchmark only |

### Implementation priorities

1. Remove dead payment paths and unify pricing definitions.
2. Add the ledger and refund visibility.
3. Launch subscriptions properly through RevenueCat plus backend state handling.
4. Redesign the paywall and separate the Rewards Center.
5. Do not start pricing A/B tests until the ledger is in place and every sales channel reads from the same catalog.

## Workstream 2: AI Result Quality and Realism

### Strategic objective

Make the result look convincingly real while preserving identity, head pose, skin tone, beard lines, and lighting.

### Current problem

The app currently depends too heavily on very long prompt templates and too little on modern editing controls. The current model is cheap, but the pipeline is not yet designed like a professional selfie-editing product.

### Recommended model benchmarking program

Do not choose the next production model by feel. Run a structured benchmark on a fixed evaluation set.

#### Benchmark candidates

| Candidate | Official pricing signal | Why it matters | Role in benchmark |
| --- | --- | --- | --- |
| FLUX.1 Kontext [pro] on fal.ai | $0.04 per image | Edit-first model with explicit character preservation positioning | Primary edit benchmark |
| Gemini 3.1 Flash Image Preview | $0.067 per 1K image, $0.101 per 2K image | Fast Google-native upgrade with multi-turn editing and up to 14 references | Best low-friction Google path |
| Gemini 3 Pro Image Preview | $0.134 per 1K or 2K image, $0.24 per 4K image | High-quality Google option for premium mode | Premium benchmark |
| GPT-image-1.5 | Output pricing starts around $0.034 for medium square images and $0.133 for high square images, plus input tokens | Supports image edits, masks, and high input fidelity | Precision benchmark |
| Imagen 4 / Imagen 4 Ultra | $0.04 and $0.06 per image | Strong photorealism, but currently better positioned for generation than selfie-edit production flow | Reference benchmark, not first choice |

Planning note:

- For financial planning, treat FLUX.1 Kontext [pro] as a roughly $0.04 to $0.06 all-in edit candidate.
- Treat Gemini 3.1 Flash Image as a roughly $0.07 to $0.08 all-in standard candidate.
- Treat Gemini 3 Pro Image and GPT-image-1.5 high-quality mode as premium-only cost bands.

### Recommendation for the next production direction

The most professional near-term strategy is not a text-only prompt upgrade. It is an edit-centric pipeline.

Recommended target architecture:

1. Use a fast multimodal analysis model to normalize hairstyle instructions into structured attributes.
2. Generate a hair-region mask from the selfie before editing.
3. Use an image-edit model as the main generation engine.
4. Run identity and quality checks after generation.
5. Re-run once automatically if the result fails threshold checks.
6. Reserve premium or high-resolution models for paid higher-value modes.

### Modern pipeline design

#### Stage A: Input quality gate

Before generation, score the uploaded photo for:

- face visibility
- head angle suitability
- blur
- lighting quality
- occlusion by hands, hats, or background clutter

If the input is weak, do not spend credits and hope for the best. Ask for a better photo.

#### Stage B: Structured hairstyle representation

Stop feeding one giant descriptive paragraph into the image model.

Convert every hairstyle into structured fields such as:

- base style family
- length
- parting pattern
- fade type
- sideburn rule
- hairline rule
- texture family
- volume profile
- color
- preserve facial hair true or false

The analysis model can still write a natural-language prompt, but the app should keep structured attributes as the source of truth.

#### Stage C: Masked or localized edit

The generation request should include:

- the original selfie
- the hair-region mask
- the selected style reference or structured style attributes
- a short edit prompt
- a short preservation prompt

Example prompt philosophy:

- Change only the scalp hair region.
- Keep the face, beard, ears, skin, pose, clothing, and lighting unchanged.
- Match the new hairstyle to the subject's exact angle and head geometry.

That is better than asking a single model to mentally juggle a thousand-line instruction block.

#### Stage D: Automated quality controls

Every output should be scored before final delivery.

Required checks:

- face similarity threshold
- hairline plausibility
- beard and sideburn continuity
- pose preservation
- no major forehead or ear distortion
- no obvious texture bleed into skin

If the image fails, auto-regenerate once. If it still fails, refund immediately.

#### Stage E: Premium quality mode

Use a higher-cost path only for paid premium outputs:

- 2K export
- stronger identity preservation
- one additional refinement pass
- barber-ready export card

### Prompt and orchestration upgrades

1. Replace the current monolithic prompts in [../backend/prompts/all_prompts.js](../backend/prompts/all_prompts.js) with short model-specific templates.
2. Use separate prompt families per hairstyle class instead of one global template.
3. Store prompt versions and compare them against user rating outcomes.
4. Build a golden benchmark set with representative users, hair textures, lighting, and poses.
5. Track model score, cost, latency, and user rating per generation.

### Important R&D caution

InstantID and IP-Adapter are valuable references for identity-preserving research, but they should not be treated as an immediate commercial production dependency without licensing and operational review.

This matters because the InstantID repository itself notes non-commercial research constraints around some face-model dependencies.

Professional recommendation:

- use them as R&D inspiration or future self-hosted experimentation
- do not base the next launch on them unless legal and infrastructure review is complete

## Workstream 3: UI/UX Modernization

### Strategic objective

Make the app feel simple, premium, and easy to understand for a first-time user, while staying modern and native-feeling on mobile.

### Product design principle

This app should feel like one core flow, not a collection of modal features.

The user journey should be:

1. Add photo
2. Pick style
3. See result

Everything else should support that journey, not compete with it.

### Recommended information architecture

Use a simpler mobile structure:

- Try On
- Looks
- Profile

Support surfaces:

- Paywall sheet
- Rewards Center
- Style picker sheet
- Result action sheet

Do not keep monetization, rewards, and account controls in the same surface.

### Modern component direction

Use stable, familiar mobile patterns inspired by Apple HIG system components and Material 3 components.

Recommended primary components:

- bottom navigation bar
- bottom sheets
- segmented controls
- chips for filters and categories
- cards with one clear primary action
- skeleton loading states
- inline progress indicators with time expectation
- snackbar or toast for quick system feedback

This aligns with the component families documented by Apple and Material 3 without making the app feel overloaded.

### Immediate UX fixes

1. Regression-test web-mobile and native action access around [../src/components/studio/MobileActionBar.tsx](../src/components/studio/MobileActionBar.tsx) and remove any obsolete assumptions from older audits.
2. Split [../src/components/PricingModal.tsx](../src/components/PricingModal.tsx) into separate monetization and rewards surfaces.
3. Add visible generation ETA and refund reassurance during processing.
4. Show output quality and watermark expectations before generation.
5. Add a clear history entry point from the main app shell.

### Experience redesign plan

#### 1. Rebuild the first-run flow

The app should open into a guided but lightweight sequence:

- capture or upload photo
- choose one recommended collection
- select one style
- see credit cost and output quality
- generate

Do not force a large onboarding modal before the user reaches value.

#### 2. Redesign the paywall

The paywall should answer only four questions:

- what do I get
- how much does it cost
- what happens if generation fails
- why should I trust this purchase

The paywall should not also be a referral center or account screen.

#### 3. Make results feel premium

The result screen should include:

- full hero image
- before and after compare
- style name and style notes
- barber-ready export
- try another style from same photo
- save and share

That is more valuable than adding more buttons.

#### 4. Simplify visual design

Direction:

- keep the amber brand as the accent, not the whole interface
- use a restrained neutral base
- reduce visual noise in modal-heavy screens
- use one primary CTA color and one success color
- use softer motion and more skeletons, fewer spinners

### UX quality bar

Required outcomes:

- a first-time user can complete one try-on without asking how the app works
- a mobile user always knows how many credits a result will cost
- a free user always knows the difference between preview and premium output
- a paid user never has to guess whether a failed generation was refunded

## Workstream 4: Feature Additions for Retention and Growth

### Strategic objective

Add only the features that deepen usage, improve sharing, or help users achieve a real-world haircut decision.

### Rule for this workstream

Do not build a complicated social platform before quality, pricing, and core UX are fixed.

### Priority feature set

#### Tier 1: High value, lower complexity

1. Saved looks and collections
2. Rate your result after generation
3. Barber-ready export card with style notes
4. Try three styles from one photo
5. Better history and re-try from the same selfie
6. Rewards Center that makes streaks, referrals, and ad rewards visible

These features build retention without large operational overhead.

#### Tier 2: Medium complexity, strong upside

1. Short before-and-after video export
2. Curated seasonal and trending style collections
3. AI stylist assistant for style recommendation
4. Face-shape or hair-type recommendation layer

#### Tier 3: Only after the core product improves

1. Community feed
2. Public style gallery
3. Barber marketplace or partner booking

These are attractive, but they can distract the team from the core product if started too early.

### Recommended feature positioning

The smartest feature for this product is not a generic social feed. It is a decision-support feature set.

That means prioritizing:

- compare looks
- save favorites
- barber-ready export
- shareable result cards
- recommendation help

These features move users toward a real haircut decision, which is the product's strongest promise.

## Recommended Sequencing

### Phase 0: Stabilize the foundation

Timeline: 1 to 2 weeks

- unify pricing config
- remove dead commerce code
- add credit ledger
- fix web-mobile generation actions
- define benchmark dataset and evaluation rubric

### Phase 1: Benchmark and redesign

Timeline: 2 to 4 weeks

- run model benchmark across the finalist models
- redesign paywall and Rewards Center
- rebuild pricing tiers and subscription handling
- replace monolithic prompts with structured generation templates

### Phase 2: Production-quality upgrade

Timeline: 4 to 8 weeks

- ship winning edit pipeline
- add input quality gate and output quality checks
- ship 3-surface mobile IA
- launch subscription tiers and improved packs
- ship result rating and barber export

### Phase 3: Retention and optimization

Timeline: 8 to 12 weeks

- add compare mode
- add curated style collections
- add lifecycle messaging and push campaigns
- run price and paywall experiments
- decide whether a social layer is justified by the metrics

## Success Metrics

### Commercial

- paywall view to purchase conversion
- first purchase conversion within 7 days
- subscription take rate
- refund rate
- effective revenue per successful generation
- credit abuse or refund fraud rate

### AI quality

- generation success rate
- face similarity score
- user quality rating
- regenerate rate
- latency by model and tier
- cost per successful generation

### UX

- first-session completion rate
- time from app open to first generated result
- drop-off rate at upload, style selection, and paywall
- history revisit rate
- repeat generation rate from the same selfie

### Retention

- day-1, day-7, and day-30 retention
- invite conversion rate
- streak participation rate
- share rate per completed generation

## Final Recommendations

1. Fix the business model and the edit pipeline before chasing feature breadth.
2. Treat model choice as a benchmark decision, not a belief system.
3. Move from hairstyle-priced commerce to mode-priced commerce.
4. Split paywall, rewards, and account into separate experiences.
5. Build the next version around one clear promise: realistic hairstyle try-on that helps the user make a real decision.

## Immediate Next Actions

1. Commerce team: unify plan definitions and design the ledger.
2. AI team: build the benchmark harness and shortlist FLUX Kontext Pro, Gemini 3.1 Flash Image, Gemini 3 Pro Image, and GPT-image-1.5.
3. UX team: redesign the mobile IA and break up the current PricingModal.
4. Growth team: define Tier 1 retention features only, not a social platform.
