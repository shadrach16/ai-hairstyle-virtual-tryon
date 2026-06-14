# Ad Campaign QA Revisions — All Issues

---

## ISSUE 1 FIX (Critical) — iOS Exclusion: Android-Only Device Targeting

### Rationale
Hair Studio AI is available **only on Google Play** (Android). Instagram, TikTok, and Meta all serve ads to iOS users by default. Without explicit exclusion, ~50% of US social media impressions go to iPhone users who **cannot install the app**. This is pure waste.

### Revised Platform Targeting Tables

#### Meta (Instagram + Facebook) — Android-Only Targeting
| Parameter | Original | **Revised** |
|---|---|---|
| Device Platforms | All (default) | **Android devices only** |
| Mobile OS | Not specified | **Android 8.0+** |
| Placements | IG Reels, Stories, Feed | IG Reels, Stories, Feed *(unchanged)* |
| Excluded | — | **iOS, Desktop** |
| Age | 18–35 | 18–35 *(unchanged)* |
| Interests | Hair, barbershops, grooming, African hairstyles | *(unchanged)* |
| Geo | US, UK, NG, GH, ZA, KE | *(unchanged)* |

**Meta Implementation:** In Ads Manager → Ad Set → Placements → Show More Options → Specific Mobile Devices & Operating Systems → **Android Only**.

#### TikTok Ads — Android-Only Targeting
| Parameter | Original | **Revised** |
|---|---|---|
| Operating System | All (default) | **Android** |
| OS Version | Not specified | **Android 8.0+** |
| Placements | TikTok In-Feed, TopView | *(unchanged)* |
| Excluded | — | **iOS** |
| Age | 18–34 | *(unchanged)* |
| Interests | Beauty & Personal Care, Hair Care | *(unchanged)* |
| Geo | US, UK, NG, GH, ZA, KE | *(unchanged)* |

**TikTok Implementation:** TikTok Ads Manager → Targeting → Device → Operating System → select **Android**.

#### Google Ads (YouTube + Discovery) — Android-Only Targeting
| Parameter | Original | **Revised** |
|---|---|---|
| Device | All (default) | **Mobile phones — Android** |
| OS | Not specified | **Android 8.0+** |
| Campaign Type | App Install (Play Store link) | *(unchanged)* |
| Excluded | — | **iOS, Tablets, Desktop** |
| Age | 18–35 | *(unchanged)* |
| Interests | Beauty, Hair Styling, Barbershop | *(unchanged)* |
| Geo | US, UK, NG, GH, ZA, KE | *(unchanged)* |

**Google Implementation:** Google Ads → Campaign → Settings → Devices → Set specific targeting → **Mobile phones, Android operating system**.

### Revised Reach & CPI Estimates (iOS Exclusion Impact)

Excluding iOS removes ~45–55% of the audience on Instagram/TikTok (varies by geo).

| Platform | Original Est. Reach | **Revised Reach (Android)** | Original CPI | **Revised CPI** |
|---|---|---|---|---|
| Meta (IG) | 2.8M–4.2M | **1.4M–2.3M** | $0.80–$1.50 | **$0.60–$1.20** |
| TikTok | 3.0M–5.0M | **1.5M–2.7M** | $0.50–$1.00 | **$0.40–$0.85** |
| Google (YT) | 1.5M–2.5M | **0.9M–1.6M** | $0.30–$0.70 | **$0.25–$0.55** |

> **Note:** CPI actually *improves* with Android-only targeting because every impression now reaches an installable device. Zero wasted clicks on users who can't install. Expect 15–25% CPI reduction from eliminating the iOS dead-end funnel.

---

## ISSUE 4 FIX (Major) — UTM Attribution Structure

### UTM Parameter Schema

All campaign links must use this standardized UTM structure for Play Store attribution:

```
https://play.google.com/store/apps/details?id=com.hairstudioai.app
  &utm_source={platform}
  &utm_medium={placement}
  &utm_campaign={campaign_name}
  &utm_content={creative_concept}
  &utm_term={variant}
```

### UTM Values Per Platform

#### Meta (Instagram/Facebook)
```
https://play.google.com/store/apps/details?id=com.hairstudioai.app&utm_source=meta&utm_medium=ig_reels&utm_campaign=hairstudio_launch_2026q2&utm_content=concept1_transformation&utm_term=v1_hook_a
```

| UTM Param | Value Pattern | Example |
|---|---|---|
| `utm_source` | `meta` | `meta` |
| `utm_medium` | `ig_reels` / `ig_stories` / `ig_feed` / `fb_feed` | `ig_reels` |
| `utm_campaign` | `hairstudio_launch_2026q2` | `hairstudio_launch_2026q2` |
| `utm_content` | `concept{N}_{descriptor}` | `concept1_transformation` |
| `utm_term` | `v{N}_hook_{variant}` | `v1_hook_a` |

**Attribution Method:** Meta supports **native install attribution** via Meta SDK + Google Play Install Referrer API. UTMs serve as a **secondary fallback** and are required for kill-threshold creative analysis in our analytics dashboard.

#### TikTok
```
https://play.google.com/store/apps/details?id=com.hairstudioai.app&utm_source=tiktok&utm_medium=infeed&utm_campaign=hairstudio_launch_2026q2&utm_content=concept2_duet_challenge&utm_term=v1_hook_a
```

| UTM Param | Value Pattern | Example |
|---|---|---|
| `utm_source` | `tiktok` | `tiktok` |
| `utm_medium` | `infeed` / `topview` | `infeed` |
| `utm_campaign` | `hairstudio_launch_2026q2` | `hairstudio_launch_2026q2` |
| `utm_content` | `concept{N}_{descriptor}` | `concept2_duet_challenge` |
| `utm_term` | `v{N}_hook_{variant}` | `v1_hook_a` |

**Attribution Method:** TikTok Events API + TikTok Pixel for web touchpoints. **UTMs are the primary attribution method** for TikTok → Play Store installs since TikTok's native app install attribution for Android relies on the Install Referrer API reading these params.

#### Google Ads (YouTube/Discovery)
```
https://play.google.com/store/apps/details?id=com.hairstudioai.app&utm_source=google&utm_medium=youtube_infeed&utm_campaign=hairstudio_launch_2026q2&utm_content=concept3_glowup&utm_term=v1_hook_a
```

| UTM Param | Value Pattern | Example |
|---|---|---|
| `utm_source` | `google` | `google` |
| `utm_medium` | `youtube_infeed` / `youtube_shorts` / `discovery` | `youtube_infeed` |
| `utm_campaign` | `hairstudio_launch_2026q2` | `hairstudio_launch_2026q2` |
| `utm_content` | `concept{N}_{descriptor}` | `concept3_glowup` |
| `utm_term` | `v{N}_hook_{variant}` | `v1_hook_a` |

**Attribution Method:** Google Ads provides **native install attribution** via Google Play Install Referrer API automatically for App campaigns. UTMs are still tracked and forwarded but Google's own conversion tracking is the primary signal.

### Attribution Method Summary

| Platform | Primary Attribution | UTM Role | Notes |
|---|---|---|---|
| **Meta** | Meta SDK + Install Referrer | Secondary / fallback | Configure Meta App Events in Play Console |
| **TikTok** | Install Referrer API reads UTMs | **Primary** | No native SDK-level install attribution for Play Store |
| **Google Ads** | Native (auto) | Tracked but redundant | Google owns both the ad and the store |

### Kill-Threshold Analysis Mapping

Each `utm_content` value maps 1:1 to a creative concept, enabling per-creative CPI and install-to-D7 retention analysis:

| `utm_content` | Creative | Kill If CPI > | Kill If D7 Retention < |
|---|---|---|---|
| `concept1_transformation` | Concept 1: AI Transformation | $1.50 | 15% |
| `concept2_duet_challenge` | Concept 2: Duet/React Challenge | $1.20 | 15% |
| `concept3_glowup` | Concept 3: Glow-Up Montage | $1.00 | 15% |

---

## ISSUE 8 FIX (Minor) — Budget Reallocation Based on Hook Strength

### Problem
Concept 3 (Glow-Up Montage) scored 9/10 on hook strength but received only $3/day (lowest). Concept 1 (AI Transformation) scored 7/10 but received $10/day (highest). This is inverted.

### Analysis
The original budget split was based on **production maturity** (Concept 1 had the most straightforward production), not on **predicted performance**. For a launch campaign where we're testing creative performance, the budget should be weighted toward predicted winners and let data confirm or correct.

### Revised Daily Budget Split (Total: $20/day)

| Concept | Hook Score | Original Budget | **Revised Budget** | Reasoning |
|---|---|---|---|---|
| **Concept 3: Glow-Up Montage** | 9/10 | $3/day | **$9/day (45%)** | Highest hook score. Montage format proven on Reels/TikTok. Give it the most fuel to validate. |
| **Concept 2: Duet/React Challenge** | 8/10 | $7/day | **$7/day (35%)** | Strong UGC angle. Budget maintained — already competitive. |
| **Concept 1: AI Transformation** | 7/10 | $10/day | **$4/day (20%)** | Solid but lowest hook score. Reduced to a validation minimum. Scale up only if CPI outperforms. |

### Rebalancing Protocol (After 72 Hours)
1. **Kill** any concept with CPI > 2x the best performer.
2. **Scale winner** to 60% of total budget.
3. **Re-test loser** with alternate hook (new first 1.5s) before fully killing.

> This follows a **weighted exploration** model: invest proportionally to predicted performance, then let data over-ride within 72 hours.

---

## ISSUE 10 FIX (Minor) — Remove Unqualified "Free" Language

The app uses a credit system. "Free" implies no-cost with no constraints, which is misleading and risks ad rejection on Meta/Google.

### Revised Ad Copy

#### Concept 1: AI Transformation
| Element | Original | **Revised** |
|---|---|---|
| Hook Text (on-screen) | "See your new look — free" | **"See your new look — try it now"** |
| CTA Caption | "Try it free" | **"Try your first look free"** |
| Headline | "Free AI Hairstyle Preview" | **"AI Hairstyle Preview — Start Free"** |
| Description | "Get your free hairstyle transformation" | **"Get your first hairstyle transformation on us"** |

#### Concept 2: Duet/React Challenge
| Element | Original | **Revised** |
|---|---|---|
| Hook Text | "Free glow-up in 10 seconds" | **"Your glow-up in 10 seconds"** |
| CTA Caption | "It's free, try it" | **"Try your first look free"** |
| Headline | "Free AI Barber" | **"AI Barber — Try It Now"** |
| Description | "100% free hairstyle AI" | **"See your next cut before you sit in the chair"** |

#### Concept 3: Glow-Up Montage
| Element | Original | **Revised** |
|---|---|---|
| Hook Text | "This app gives you free haircuts" | **"This app shows your next haircut in seconds"** |
| CTA Caption | "Download for free" | **"Try your first look free"** |
| Headline | "Free Virtual Haircuts" | **"Virtual Haircuts — Start Free"** |
| Description | "Get unlimited free hairstyle previews" | **"Preview any hairstyle on your face instantly"** |

### Qualified Language Rules (For All Future Copy)
- **Allowed:** "Try your first look free", "Start free", "Try it now", "Your first look is on us"
- **Banned:** "Free" as standalone adjective, "100% free", "unlimited free", "download for free", "get your free ___"
- **Rationale:** The app grants trial credits (5 credits at signup, 48h expiry). "Start free" and "try your first look free" are truthful. Unqualified "free" implies the full product is no-cost.

---

## ISSUE 2 FIX (Critical) — Dual Audio Blueprints (Organic + Paid)

Each concept needs two audio versions: trending sounds for organic posting, and commercially licensed tracks for paid promotion. Timings match the same visual edit.

### Concept 1: AI Transformation (15s)

#### Visual Timeline (Shared)
| Timestamp | Visual |
|---|---|
| 0.0s–1.5s | Hook: Subject looks at camera, dissatisfied with current hair |
| 1.5s–3.0s | Opens app, uploads selfie (screen recording) |
| 3.0s–5.0s | Scrolls hairstyle catalog, taps style (screen recording) |
| 5.0s–8.0s | AI processing animation → result reveal (Veo scene: subject reacts) |
| 8.0s–12.0s | Before/after comparison, subject runs hand through new style (Veo) |
| 12.0s–15.0s | CTA overlay: "Try your first look free" + Play Store badge |

#### Audio Version A — Organic (Trending Sound)
| Timestamp | Audio Element | Notes |
|---|---|---|
| 0.0s–1.5s | Trending audio hook (e.g., "Watch this…" or current viral sound) | Select from TikTok/IG trending sounds tab at time of posting. Must be in top 50 trending. |
| 1.5s–8.0s | Trending sound continues (beat drop aligns with result reveal at 5.0s) | Time the beat drop to the AI reveal moment for maximum impact. |
| 8.0s–12.0s | Sound continues | Maintain energy through comparison sequence. |
| 12.0s–15.0s | Sound fades under CTA | Lower volume 50% so CTA text is visually dominant. |

**Posting note:** Select the trending sound within 24h of posting to maximize algorithmic boost. Sound selection is the creator/social manager's responsibility at publish time.

#### Audio Version B — Paid Ads (Licensed)
| Timestamp | Audio Element | Source / License |
|---|---|---|
| 0.0s–1.5s | Licensed Afrobeat/trap intro — rising tension build | Epidemic Sound or Artlist (commercial license for paid social). Track: upbeat, 100–120 BPM. |
| 1.5s–5.0s | Beat builds, subtle percussion | Same track, pre-chorus/verse section. |
| 5.0s–5.5s | Beat drop (synced to AI result reveal) | Hard cut to chorus/drop. This is the emotional peak. |
| 5.5s–12.0s | Full beat, confident energy | Chorus section continues under the before/after comparison. |
| 12.0s–15.0s | Beat fades, clean outro under CTA card | Fade to -12dB under CTA. No vocals competing with on-screen text. |

**License requirement:** Full commercial license for paid social media advertising across Meta, TikTok, Google. Verify license covers "paid social/digital advertising" (not just "social media" which some platforms interpret as organic only). Budget: $15–$50/track from Epidemic Sound or Artlist annual plan.

---

### Concept 2: Duet/React Challenge (12s)

#### Visual Timeline (Shared)
| Timestamp | Visual |
|---|---|
| 0.0s–1.5s | Hook: Split-screen — left: "before" selfie, right: blank/teaser |
| 1.5s–3.5s | App screen recording: upload + style selection |
| 3.5s–6.0s | AI generation + reveal on right side of split (Veo: reaction to result) |
| 6.0s–9.0s | Full-screen result, subject poses with new look (Veo scene) |
| 9.0s–12.0s | CTA: "Your turn — try your first look free" + Play Store badge |

#### Audio Version A — Organic (Trending Sound)
| Timestamp | Audio Element | Notes |
|---|---|---|
| 0.0s–1.5s | Trending duet/react sound (e.g., "Let me show y'all something") | Use a sound already popular in transformation/glow-up niche. |
| 1.5s–6.0s | Sound continues — comedic or hype timing to sync with reveal at 3.5s | If react sound, match the reaction audio to the AI reveal. |
| 6.0s–9.0s | Sound climax or continuation | Energy peak during the beauty shot. |
| 9.0s–12.0s | Sound natural ending or fade | CTA appears over end of sound. |

#### Audio Version B — Paid Ads (Licensed)
| Timestamp | Audio Element | Source / License |
|---|---|---|
| 0.0s–1.5s | Licensed upbeat pop/Afro-pop — playful intro | Epidemic Sound / Artlist. Track: fun, energetic, 110–125 BPM. |
| 1.5s–3.5s | Verse section, rhythm builds | Percussion-forward, no lyrics competing with screen recording. |
| 3.5s–4.0s | Musical accent/hit synced to AI reveal | Use a track with a clear "hit" or stab at this point. |
| 4.0s–9.0s | Chorus/hook — highest energy | Full beat under the result showcase. |
| 9.0s–12.0s | Clean fade-out under CTA | Fade to -12dB. No competing vocals. |

---

### Concept 3: Glow-Up Montage (18s)

#### Visual Timeline (Shared)
| Timestamp | Visual |
|---|---|
| 0.0s–2.0s | Hook: Text overlay "This app shows your next haircut in seconds" + subject intro |
| 2.0s–4.0s | Quick app walkthrough: upload photo (screen recording) |
| 4.0s–6.0s | Style browsing + tap to generate (screen recording) |
| 6.0s–8.0s | First result reveal (Veo: frontal reaction) |
| 8.0s–10.0s | Second style: different look generated (Veo: side angle) |
| 10.0s–13.0s | Third style: dramatic change (Veo: full reveal with head turn) |
| 13.0s–16.0s | Rapid-fire 4-panel montage: all styles in grid view |
| 16.0s–18.0s | CTA: "Start free — Hair Studio AI" + Play Store badge |

#### Audio Version A — Organic (Trending Sound)
| Timestamp | Audio Element | Notes |
|---|---|---|
| 0.0s–2.0s | Trending glow-up/montage sound (e.g., viral "before/after" audio) | Select from trending transformation sounds. |
| 2.0s–6.0s | Sound rhythm section — matches screen recording pacing | Steady beat for the UI walkthrough portion. |
| 6.0s–8.0s | First beat drop / accent — synced to first reveal | Time musical peak to first AI result. |
| 8.0s–13.0s | Sound builds through 2nd and 3rd reveals | Each reveal can hit a metric accent in the music. |
| 13.0s–16.0s | Sound climax — maximum energy for rapid montage | The 4-panel montage is the visual peak; music should match. |
| 16.0s–18.0s | Sound outro / fade under CTA | Lower volume for CTA readability. |

#### Audio Version B — Paid Ads (Licensed)
| Timestamp | Audio Element | Source / License |
|---|---|---|
| 0.0s–2.0s | Licensed cinematic Afrobeat — atmospheric intro (piano/strings + light beat) | Epidemic Sound / Artlist. Track: 95–110 BPM, building energy. |
| 2.0s–6.0s | Verse, light percussion builds under screen recording | Instrumental only — no vocal interference with UI demo. |
| 6.0s–8.0s | First chorus hit — synced to first AI reveal at 6.0s | Clear musical "moment" for the first transformation. |
| 8.0s–10.0s | Brief breakdown/bridge — tension rebuild | Quick tension dip before second style hits. |
| 10.0s–13.0s | Second chorus hit at 10.0s, building through third style | Escalating energy: each reveal gets bigger musically. |
| 13.0s–16.0s | Full chorus / drop — maximum energy for montage grid | This is the emotional climax. Full instrumentation. |
| 16.0s–18.0s | Clean 2-bar outro, fade to -12dB under CTA card | No vocals, clean ending. Slight reverb tail OK. |

**License requirement (all concepts):** Same as Concept 1 — full commercial paid social license from Epidemic Sound or Artlist. Pre-clear tracks before editing begins. Keep license receipts on file.

### Audio Budget Line Item
| Item | Cost | Notes |
|---|---|---|
| Epidemic Sound annual plan | $299/yr | Covers unlimited tracks for commercial use incl. paid ads |
| OR Artlist annual plan | $299/yr | Alternative — same coverage |
| Sound selection & timing | 2 hrs/concept | Audio editor matches drops to reveal frames |

---

## ISSUE 6 FIX (Major) — Revised Production Timeline (5 Days)

### Problem
Original timeline: 2 days for 9 Veo scenes + 3 screen recordings + compositing + editing for 3 concepts, plus dual audio versions. This is unrealistic given Veo regeneration needs and the dual-audio requirement.

### Revised 5-Day Production Timeline

#### Day 1: Pre-Production + Screen Recordings
| Time Block | Task | Output |
|---|---|---|
| Morning (4h) | **Screen recordings for all 3 concepts** — Record app walkthrough sequences on Android device: upload, browse styles, generate, view result. Capture 3 takes each. | 9 screen recording clips (3 per concept × 3 takes) |
| Afternoon (4h) | **Veo prompt finalization** — Write/refine all 9 Veo scene prompts with character consistency descriptors (see Issue 7). Create prompt variants (3 per scene) for regeneration tolerance. Select and license 3 music tracks (paid versions). | 27 Veo prompt variants, 3 licensed audio tracks |

#### Day 2: Veo Generation — Batch 1
| Time Block | Task | Output |
|---|---|---|
| Morning (4h) | **Generate Veo scenes for Concept 1** (3 scenes × 3 variants each = 9 generations). Quality-check outputs. Select best takes. Regenerate any failed scenes with adjusted prompts. | 3 final Veo scenes for Concept 1 |
| Afternoon (4h) | **Generate Veo scenes for Concept 2** (3 scenes × 3 variants each = 9 generations). Quality-check. Select best takes. Regenerate failures. | 3 final Veo scenes for Concept 2 |

#### Day 3: Veo Generation — Batch 2 + Rough Assembly
| Time Block | Task | Output |
|---|---|---|
| Morning (4h) | **Generate Veo scenes for Concept 3** (3 scenes × 3 variants each = 9 generations). This concept has the most scenes (glow-up montage requires 3 distinct style reveals). Quality-check and regenerate. | 3 final Veo scenes for Concept 3 |
| Afternoon (4h) | **Rough-cut assembly for all 3 concepts.** Lay screen recordings + Veo scenes on timeline with placeholder audio. Verify pacing, transitions, and total duration per concept. Flag any Veo re-generation needed. | 3 rough-cut assemblies on timeline |

#### Day 4: Compositing + Dual Audio Edit
| Time Block | Task | Output |
|---|---|---|
| Morning (4h) | **Compositing & motion graphics** — Add text overlays, CTA cards, Play Store badges, before/after split frames, transitions between screen recording and Veo footage. Color grade for consistency. | 3 composited video edits (no audio) |
| Afternoon (4h) | **Audio sync — paid versions.** Sync licensed tracks to each concept following the per-timestamp audio blueprints (Issue 2). Export 3 paid-audio videos. | 3 final videos (paid audio) |

#### Day 5: Organic Audio + QA + Delivery
| Time Block | Task | Output |
|---|---|---|
| Morning (3h) | **Audio sync — organic versions.** Add trending sound placeholders (final sound selected at post time) with beat-matched timing guides. Export 3 organic-audio videos. | 3 final videos (organic audio) |
| Late Morning (2h) | **Veo re-generation buffer.** Reserved for any scenes flagged during Day 3–4 review that need regeneration for character consistency or quality. | Replacement scenes as needed |
| Afternoon (3h) | **QA review** — Check all 6 videos (3 paid + 3 organic) for: audio sync, text readability, brand consistency, CTA timing, Play Store badge visibility, "Start free" language compliance, correct aspect ratios (9:16). **Export final deliverables** in platform-specific formats. | 6 final deliverables + asset folder |

### Deliverables Summary
| Asset | Count | Formats |
|---|---|---|
| Concept 1 — Paid audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| Concept 1 — Organic audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| Concept 2 — Paid audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| Concept 2 — Organic audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| Concept 3 — Paid audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| Concept 3 — Organic audio version | 1 | MP4 9:16, 1080×1920, H.264 |
| **Total** | **6 videos** | |

### Risk Buffer
- **Day 3 afternoon** includes rough assembly, which surfaces Veo quality issues early enough to regenerate on Day 5 morning.
- **Day 5** has a dedicated 2-hour regeneration buffer.
- If Veo quota/rate limits are hit, Day 2–3 generation can spill into evening with overnight queuing.

---

## ISSUE 7 FIX (Minor) — Veo Character Consistency Mitigation Plan

### Problem
"Repeated clothing/skin descriptors" is necessary but insufficient. Veo (and all current video generation models) have no guaranteed identity persistence across independent generations. A subject's face, skin tone, and features can drift between scenes.

### Concrete Mitigation Plan

#### 1. Anchor Frame Selection (Pre-Production)
Before generating any scenes, generate a **single anchor image** of the subject character using the most detailed prompt. This becomes the reference for all subsequent scenes.

- Generate 10 variants of the anchor image
- Select the one that best matches the intended character
- Extract: exact skin tone hex, facial features description, clothing details, hair texture description, body type, distinguishing features
- All subsequent Veo prompts **must** include these exact descriptors verbatim

#### 2. Tiered Prompt Descriptor System

Every Veo prompt must include ALL of these layers:

```
[IDENTITY BLOCK — copy verbatim across all scenes]
Subject: Black male, early 20s, medium-brown skin (Fitzpatrick type V),
oval face shape, clean-shaven, medium build, 5'10" height.
Wearing: plain white crew neck t-shirt, no logos, no jewelry.
[END IDENTITY BLOCK]

[SCENE-SPECIFIC BLOCK — varies per scene]
Setting: barbershop interior, warm tungsten lighting...
Action: subject turns head 30 degrees to camera right, smiling...
Hair: [specific hairstyle for this scene]
[END SCENE-SPECIFIC BLOCK]
```

The Identity Block is **frozen** — identical text pasted into every prompt across all 9+ scenes.

#### 3. Batch Generation + Cherry-Picking
For each scene, generate **3 variants minimum**:
- Variant A: Standard prompt
- Variant B: Same prompt, append "consistent with reference, photorealistic skin texture"
- Variant C: Same prompt, append "identical subject as previous scene, same facial features"

Select the variant that best matches the anchor frame. Discard others.

#### 4. Post-Production Continuity Fixes
Even with best prompts, some drift is inevitable. Plan for these compositing fixes:

| Issue | Fix | Tool |
|---|---|---|
| Skin tone drift between scenes | Color-match skin tones to anchor frame | DaVinci Resolve color wheels + HSL qualifier |
| Slightly different facial features | Avoid close-up face cuts between scenes; use reaction angles | Editorial choice during rough cut |
| Clothing inconsistency | Identity Block specifies plain white tee — minimal detail = less to drift | Prompt discipline |
| Background inconsistency | Each scene has its own setting (this is OK; they're different locations) | N/A |
| Lighting temperature shift | Grade all scenes to same white balance (5600K daylight or 3200K tungsten per setting) | Color grade pass on Day 4 |

#### 5. Scene Ordering Strategy
Shoot/generate scenes in **reverse chronological order** of the video edit:
- Generate the CTA/final scene first (least character-critical)
- Generate the reveal/result scene second (most important — this is the hero shot)
- Generate the hook/intro scene last — match it to the hero shot

This way the most-viewed frames (hook + reveal) are generated closest together in time, minimizing prompt drift from iteration.

#### 6. Fallback: Same-Seed Consistency (If Available)
If Veo supports seed parameters at the time of production:
- Record the seed value from the best anchor generation
- Re-use the same seed for all subsequent scenes
- This is model-dependent and may not be available — treat as a bonus, not a guarantee

### Quality Gate
Before moving to compositing (Day 4), run a **side-by-side check**:
- Print/display the anchor frame next to each selected Veo scene
- Score 1–5 on: skin tone match, facial feature similarity, clothing match, overall identity coherence
- **Reject and regenerate** any scene scoring below 3/5 on any axis

---

*End of QA Revisions. All 7 issues addressed.*
