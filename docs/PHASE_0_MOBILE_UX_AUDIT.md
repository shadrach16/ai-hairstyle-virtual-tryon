# Phase 0 — Mobile UX Audit + Design Spec

**Date:** January 31, 2026  
**Status:** ✅ COMPLETE  
**Target:** Mobile-first (Capacitor native + Mobile Web)

---

## 1. Mobile Journey / State Machine

### 1.1 State Machine Definition

The studio operates via URL-driven state machine in `useStudioPageLogic.tsx`:

```typescript
type StudioState = 'home' | 'upload' | 'ready' | 'processing' | 'results';
type UploadMode = 'camera' | 'library';
```

### 1.2 State Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MOBILE USER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────────────┘

    ┌──────────┐         ┌──────────┐         ┌──────────┐
    │   HOME   │ ──────► │  UPLOAD  │ ──────► │  READY   │
    │ (web only)│         │          │         │          │
    └──────────┘         └──────────┘         └──────────┘
         │                    │                    │
         │                    │                    │
    (native skips)       Photo selected      Hairstyle selected
         │                    │                    │
         └────────────────────┼────────────────────┘
                              ▼
                      ┌──────────────┐
                      │  PROCESSING  │
                      │  (progress)  │
                      └──────────────┘
                              │
                    Generation complete
                              │
                              ▼
                      ┌──────────────┐
                      │   RESULTS    │
                      │ (share/save) │
                      └──────────────┘
                              │
                      "Try Another"
                              │
                              ▼
                      ┌──────────────┐
                      │   UPLOAD     │
                      │   (reset)    │
                      └──────────────┘
```

### 1.3 Entry Points

| Platform | Entry Point | Initial State | URL Pattern |
|----------|-------------|---------------|-------------|
| **Native (Capacitor)** | `Index.tsx` | `upload` | `/?studio_status=upload&mode=camera` |
| **Web (Desktop)** | `Index.tsx` | `home` | `/` → shows `HomePage` |
| **Web (Mobile)** | `Index.tsx` | `home` | `/` → shows `HomePage` |
| **Deep Link** | `Index.tsx` | Any valid state | `/?studio_status={state}` |

### 1.4 State Transitions (from `useStudioPageLogic.tsx`)

| From | To | Trigger | Handler |
|------|-----|---------|---------|
| `home` | `upload` | User clicks "Start" / Native auto-redirect | `navigate('/?studio_status=upload&mode=camera')` |
| `upload` | `ready` | Photo selected | `handlePhotoSelect()` |
| `ready` | `processing` | Generate clicked | `handleGenerateStyle()` |
| `processing` | `results` | Generation completes | `generationStatus.status === 'completed'` |
| `processing` | `ready` | Generation fails | `generationStatus.status === 'failed'` |
| `results` | `upload` | "Try Another" clicked | `handleTryAnother()` → `handleClearPhoto()` |
| `ready` | `upload` | Photo cleared | `handleClearPhoto()` |

---

## 2. Mobile / Desktop Branch Points

### 2.1 Platform Detection

```typescript
// useStudioPageLogic.tsx
const isNative = useMemo(() => Capacitor.isNativePlatform(), []);
const isMobile = useMemo(() => window.innerWidth < 1024, []);
```

### 2.2 Branch Point Map

| File | Line(s) | Pattern | Mobile Behavior | Desktop Behavior |
|------|---------|---------|-----------------|------------------|
| `Index.tsx` | 142 | `hidden sm:block` | Results actions hidden | Download/Try Another buttons shown |
| `Index.tsx` | 171 | `studioState === 'home' && !Capacitor.isNativePlatform()` | Skip HomePage | Show HomePage first |
| `Index.tsx` | 240 | `hidden lg:block` | Desktop sidebar hidden | Right sidebar gallery visible |
| `MobileActionBar.tsx` | 61 | `lg:hidden` | Fixed bottom bar visible | Hidden on large screens |
| `MobileActionBar.tsx` | 64 | `!Capacitor.isNativePlatform()` | ⚠️ Returns early (web mobile gets limited UI) | N/A |
| `AppHeader.tsx` | 87 | `hidden sm:block` | Chevron hidden | Chevron visible |
| `AppHeader.tsx` | 101 | `lg:hidden` | Sidebar toggle visible | Hidden |
| `AppHeader.tsx` | 148 | `sm:hidden` | Credits inline display | Hidden |
| `AppHeader.tsx` | 186 | `hidden sm:block` | Email hidden | Email visible |
| `PricingModal.tsx` | 387 | `lg:hidden` | Close button visible | Hidden (larger close area) |
| `PricingModal.tsx` | 398 | `flex sm:hidden` | Tab switch buttons visible | Hidden |
| `Sidebar.tsx` | 70 | `lg:hidden` | Hamburger close visible | Hidden |

### 2.3 Critical Issue: Mobile Web Action Bar

**Location:** `MobileActionBar.tsx` lines 63-65

```typescript
if (!Capacitor.isNativePlatform()) {
  return (customThumbnailPath ? <CustomUploadUI /> : <></>);
}
```

**Impact:** Mobile web users see NO action bar unless they've uploaded a custom hairstyle. Primary CTAs (Generate, Download, Try Another) are missing on mobile web.

**Fix Required:** Remove native-only gate or provide mobile web alternatives.

---

## 3. Backend Truth Sources (Mobile Endpoint Audit)

### 3.1 Canonical Endpoints Used by Mobile

| Endpoint | Method | Purpose | Response Shape | Used In |
|----------|--------|---------|----------------|---------|
| `/api/auth/me` | GET | User truth: credits, isPro, subscription | `{ data: { user: {...} } }` | `useAuth()` hook |
| `/api/auth/google` | POST | Sign in/up via Google OAuth | `{ token, data: { user } }` | AuthModal |
| `/api/auth/reward_ad` | POST | Claim rewarded ad credits | `{ data: { user, remainingRewards } }` | PaywallScreen |
| `/api/auth/reward_ad/status` | GET | Check remaining rewards today | `{ data: { remainingRewards, ... } }` | PaywallScreen |
| `/api/generations/generate` | POST | Standard hairstyle generation | `{ success, data: { generation } }` | useGeneration |
| `/api/generations/analyze-hairstyle` | POST | Custom hairstyle analysis + generation | `{ success, data: { generation } }` | useGeneration |
| `/api/generations/history` | GET | Past generations | `{ success, data: [...] }` | HistoryPage |
| `/api/generations/:id/status` | GET | Polling for generation status | `{ status, generatedImageUrl, ... }` | useGeneration |
| `/api/hairstyles` | GET | Browse hairstyles | `{ success, data: [...] }` | useHairstyles |
| `/api/watermark/export` | POST | Export with/without watermark | `{ data: { exportUrl, isClean } }` | ResultsViewer |
| `/api/watermark/export-status` | GET | Check if user can do clean export | `{ data: { canExportClean } }` | ResultsViewer |
| `/api/payments/plans` | GET | Pricing display | `{ data: { creditPacks, subscriptions } }` | PricingModal |
| `/api/payments/history` | GET | Purchase history | `{ success, data: [...] }` | Account section |
| `/api/favorites` | GET/POST/DELETE | Favorite hairstyles | `{ success, data: [...] }` | AfricanHairstyleGrid |
| `/api/streaks/current` | GET | Current streak info | `{ data: { currentStreak, ... } }` | (planned) |
| `/api/analytics/track` | POST | Event tracking | `{ success }` | apiService.trackEvent |
| `/api/push/register-token` | POST | Push notification token | `{ success }` | useNotifications |

### 3.2 User Truth Fields (from `/api/auth/me`)

```typescript
interface UserTruth {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isPro: boolean;                    // Premium status
  credits: number;                   // Current balance
  totalCredits: number;              // Lifetime earned
  remainingTrialCredits: number;     // Trial credits left
  subscription: {
    status: 'active' | 'inactive' | 'cancelled';
    plan?: string;
    expiresAt?: Date;
  };
  freeTrialExpiry: Date | null;
  lastLogin: Date;
  createdAt: Date;
}
```

### 3.3 Endpoint Verification Status

| Endpoint | Mounted | Verified | Notes |
|----------|---------|----------|-------|
| `/api/auth/*` | ✅ | ✅ | Lines 114-127 in server.js |
| `/api/generations/*` | ✅ | ✅ | Rate limited via `generationLimit` |
| `/api/watermark/*` | ✅ | ✅ | Rate limited via `exportLimit` |
| `/api/payments/*` | ✅ | ✅ | Pricing + history working |
| `/api/analytics/*` | ✅ | ✅ | Track + dashboard endpoints |
| `/api/favorites/*` | ✅ | ✅ | CRUD for favorites |
| `/api/streaks/*` | ✅ | ✅ | Current streak endpoint |
| `/api/push/*` | ✅ | ✅ | Token registration + stats |

---

## 4. Mobile Layout Contract

### 4.1 Current Layout Metrics

| Element | Current Value | Source | Issue |
|---------|--------------|--------|-------|
| **Header Height** | ~56px (14 tailwind) | `AppHeader.tsx` | + safe-area-top on native |
| **Bottom Bar Height** | ~68px (p-3 + button h-12) | `MobileActionBar.tsx` | safe-p-b not defined |
| **Content Padding Bottom** | `pb-24` (96px) hardcoded | `Index.tsx:229` | Doesn't account for actual bar |
| **Safe Area Top** | `env(safe-area-inset-top)` | `AppHeader.tsx:95` | Works ✅ |
| **Safe Area Bottom** | `safe-p-b` class used | `MobileActionBar.tsx:23` | ⚠️ Class not defined in CSS |

### 4.2 Safe Area Utilities Status

**Defined in `index.css` (lines 32-33):**
```css
:root {
  --safe-area-top: env(safe-area-inset-top);
  --safe-area-bottom: env(safe-area-inset-bottom);
}
```

**Utility Classes (lines 229-239):**
```css
.app-header {
  padding-top: var(--safe-area-top, 20px);
}

.full-screen-container {
  padding-top: var(--safe-area-top);
  padding-bottom: var(--safe-area-bottom);
}
```

**❌ Missing Classes:**
- `.safe-p-b` (used in `MobileActionBar.tsx` and `Sidebar.tsx`)
- `.safe-p-t` (used in `Sidebar.tsx`)

### 4.3 Required Layout Contract

```css
/* === MOBILE LAYOUT CONTRACT === */

/* Fixed dimensions */
--header-height: 56px;
--bottom-bar-height: 68px;

/* Safe areas (iOS notch/home indicator) */
--safe-area-top: env(safe-area-inset-top, 0px);
--safe-area-bottom: env(safe-area-inset-bottom, 0px);

/* Computed values */
--header-total: calc(var(--header-height) + var(--safe-area-top));
--bottom-total: calc(var(--bottom-bar-height) + var(--safe-area-bottom));

/* Content area */
--content-height: calc(100dvh - var(--header-total) - var(--bottom-total));
```

### 4.4 Scroll Rules

1. **One scroll container per screen** — no nested `overflow-y-auto`
2. **Modal/sheet scrolls independently** — body scroll locked when open
3. **Bottom bar never overlaps content** — content has padding equal to bar height
4. **Sticky elements stay visible** — never scrolled out of view within their container

### 4.5 Viewport Meta Tag Fix Required

**Current (`index.html`):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

**Required (for iOS safe-area support):**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

---

## 5. Mobile Screen Specifications

### 5.1 Screen Inventory

| # | Screen | State/Route | Primary Component | Key Elements |
|---|--------|-------------|-------------------|--------------|
| 1 | **Upload** | `?studio_status=upload` | `UploadState.tsx` | Camera/Library picker, Instructions |
| 2 | **Ready** | `?studio_status=ready` | `ReadyState.tsx` | Photo preview, Selected style badge |
| 3 | **Choose Hairstyle** | Modal overlay | `MobileHairstyleModal.tsx` | Grid browser, Search, Filters, Pagination |
| 4 | **Processing** | `?studio_status=processing` | `ProcessingState.tsx` | Progress ring, Status text |
| 5 | **Results** | `?studio_status=results` | `ResultsViewer.tsx` | Before/After, Share, Download |
| 6 | **Paywall** | Modal overlay | `PricingModal.tsx` | Credit packs, Subscription, Rewarded ads |
| 7 | **History** | `/history` | `HistoryPage.tsx` | Generation list, Thumbnails |
| 8 | **Account** | Sidebar/Dropdown | `Sidebar.tsx` / `AppHeader.tsx` | Profile, Credits, Sign out |
| 9 | **Onboarding** | Overlay (first run) | `OnboardingGuide.tsx` | Swiper, Benefits, CTA |
| 10 | **Auth** | Modal overlay | `AuthModal.tsx` | Google sign-in, Benefits |

### 5.2 Screen-by-Screen Mobile Spec

---

#### Screen 1: Upload

**Layout:**
```
┌──────────────────────────────┐
│ [Header: Logo | Credits | ☰] │ <- safe-area-top
├──────────────────────────────┤
│                              │
│     ┌─────────────────┐      │
│     │   Camera Feed   │      │
│     │   or Preview    │      │
│     │                 │      │
│     │  [ 📷 Capture ] │      │
│     └─────────────────┘      │
│                              │
│   [Camera] ●───○ [Library]   │
│                              │
│  "Take or select a photo..." │
│                              │
├──────────────────────────────┤
│ [ Choose Hairstyle (disabled)]│ <- safe-area-bottom
└──────────────────────────────┘
```

**Mobile Considerations:**
- Camera permission prompt on first use
- Library picker uses native UI
- Stepper shows step 1/3 active
- Bottom bar CTA disabled until photo selected

---

#### Screen 2: Ready

**Layout:**
```
┌──────────────────────────────┐
│ [Header: Logo | Credits | ☰] │
├──────────────────────────────┤
│                              │
│     ┌─────────────────┐      │
│     │   Your Photo    │      │
│     │   (preview)     │      │
│     │        [✕]      │      │
│     └─────────────────┘      │
│                              │
│   Selected: [Cornrows]       │
│   Cost: 🪙 2 credits         │
│                              │
│                              │
├──────────────────────────────┤
│ [Choose Style] [🎨 Generate] │
└──────────────────────────────┘
```

**Mobile Considerations:**
- Tapping photo shows fullscreen preview
- Tapping style badge opens hairstyle modal
- Generate CTA becomes primary when style selected
- Stepper shows step 2/3 active

---

#### Screen 3: Choose Hairstyle (Bottom Sheet)

**Layout:**
```
┌──────────────────────────────┐
│ ┌────────────────────────┐   │
│ │ ●●● (drag handle)      │   │
│ ├────────────────────────┤   │
│ │ Choose Hairstyle    ✕  │   │
│ │ [🔍 Search...] [Filter]│   │
│ ├────────────────────────┤   │
│ │ ┌───┐ ┌───┐ ┌───┐      │   │ <- ScrollArea
│ │ │ 🦁│ │ 🔥│ │ 🦌│      │   │
│ │ │2cr│ │3cr│ │1cr│      │   │
│ │ └───┘ └───┘ └───┘      │   │
│ │ ┌───┐ ┌───┐ ┌───┐      │   │
│ │ │   │ │   │ │   │      │   │
│ │ └───┘ └───┘ └───┘      │   │
│ │                        │   │
│ │  [< 1 / 5 >] pagination│   │
│ └────────────────────────┘   │
│ (safe-area-bottom padding)   │
└──────────────────────────────┘
```

**Mobile Considerations:**
- Sheet height: 95vh (covers most of screen)
- Header pinned, grid scrolls
- Grid: 2 columns on mobile, 3 on tablet
- Lazy-load images, skeleton loaders
- Tap to select, closes sheet automatically
- Locked styles show lock overlay + upsell

---

#### Screen 4: Processing

**Layout:**
```
┌──────────────────────────────┐
│ [Header: Logo | Credits | ☰] │
├──────────────────────────────┤
│                              │
│         ┌───────┐            │
│         │ Photo │            │
│         └───────┘            │
│              +               │
│         ┌───────┐            │
│         │ Style │            │
│         └───────┘            │
│                              │
│        ◉────────── 45%       │
│    "Applying hairstyle..."   │
│                              │
├──────────────────────────────┤
│ (no bottom bar during gen)   │
└──────────────────────────────┘
```

**Mobile Considerations:**
- No back button / navigation during generation
- Progress updates every ~2s
- Animated spinner/ring
- Estimated time shown
- Stepper shows step 3/3 active

---

#### Screen 5: Results

**Layout:**
```
┌──────────────────────────────┐
│ [Header: Logo | Credits | ☰] │
├──────────────────────────────┤
│                              │
│  ┌────────────────────────┐  │
│  │                        │  │
│  │   Generated Result     │  │
│  │   (swipe for before)   │  │
│  │                        │  │
│  │                        │  │
│  └────────────────────────┘  │
│                              │
│  [Share 📤] [Collage 🔲]     │
│                              │
├──────────────────────────────┤
│ [⬇️ Download] [🔄 Try Another]│
└──────────────────────────────┘
```

**Mobile Considerations:**
- Pinch-to-zoom on result image
- Swipe left/right for before/after comparison
- Share uses native share sheet (Capacitor)
- Download saves to Photos (with permission)
- Watermark shown for free users
- Stepper hidden on results

---

#### Screen 6: Paywall

**Layout:**
```
┌──────────────────────────────┐
│ ┌────────────────────────┐   │
│ │ Get More Credits    ✕  │   │
│ ├────────────────────────┤   │
│ │ [Credits] [Subscription]│  │
│ ├────────────────────────┤   │
│ │                        │   │
│ │  ⭐ 5 Credits  $2.99   │   │
│ │  🔥 15 Credits $6.99   │   │ <- "POPULAR" badge
│ │  💎 50 Credits $19.99  │   │
│ │                        │   │
│ ├────────────────────────┤   │
│ │ 🎬 Watch Ad (+0.5 cr)  │   │
│ │    3/4 remaining today │   │
│ └────────────────────────┘   │
└──────────────────────────────┘
```

**Mobile Considerations:**
- Modal with blur backdrop
- Native IAP via RevenueCat
- Rewarded ads via AdMob
- Daily cap on rewarded ads (4/day)
- Shows remaining rewards

---

#### Screen 7: History

**Layout:**
```
┌──────────────────────────────┐
│ [← Back]  History    [Filter]│
├──────────────────────────────┤
│                              │
│ ┌─────┐ ┌─────┐ ┌─────┐      │
│ │ Gen │ │ Gen │ │ Gen │      │
│ │  1  │ │  2  │ │  3  │      │
│ │     │ │     │ │     │      │
│ │ Jan │ │ Jan │ │ Jan │      │
│ │ 30  │ │ 29  │ │ 28  │      │
│ └─────┘ └─────┘ └─────┘      │
│                              │
│ ┌─────┐ ┌─────┐              │
│ │ Gen │ │ Gen │              │
│ │  4  │ │  5  │              │
│ └─────┘ └─────┘              │
│                              │
│        Load More...          │
│                              │
└──────────────────────────────┘
```

**Mobile Considerations:**
- Grid layout (3 columns)
- Tap to view full result
- Pull-to-refresh
- Infinite scroll pagination
- Empty state for new users

---

### 5.3 Mobile Component Map

```
App.tsx
└── Routes
    ├── "/" → Index.tsx (StudioPage)
    │   ├── AppHeader.tsx
    │   │   └── Sidebar.tsx (mobile drawer)
    │   ├── OnboardingGuide.tsx (first run overlay)
    │   ├── AuthModal.tsx
    │   ├── [State Views]
    │   │   ├── UploadState.tsx
    │   │   ├── ReadyState.tsx
    │   │   ├── ProcessingState.tsx
    │   │   └── ResultsViewer.tsx
    │   ├── MobileActionBar.tsx (fixed bottom)
    │   ├── MobileHairstyleModal.tsx (bottom sheet)
    │   └── PricingModal.tsx (paywall overlay)
    │
    ├── "/history" → HistoryPage.tsx
    └── "/analytics" → (admin only)

Hooks (shared state):
├── useStudioPageLogic.tsx (master state machine)
├── useAuth.tsx (user, isAuthenticated)
├── useHairstyles.tsx (hairstyle catalog)
├── useGeneration.tsx (generation status, polling)
└── useNotifications.tsx (push token registration)

API Layer:
└── lib/api.ts (apiService singleton)
```

---

## 6. Issues & Fixes Required

### 6.1 Critical Issues

| # | Issue | Location | Impact | Priority |
|---|-------|----------|--------|----------|
| 1 | `safe-p-b` class not defined | `index.css` | iOS home indicator overlaps bottom bar | P0 |
| 2 | Viewport missing `viewport-fit=cover` | `index.html` | Safe area insets don't work | P0 |
| 3 | Mobile web gets no action bar | `MobileActionBar.tsx:64` | No CTAs for web mobile users | P0 |
| 4 | Hardcoded `pb-24` doesn't match bar | `Index.tsx:229` | Inconsistent spacing | P1 |
| 5 | Multiple nested scroll containers | `Index.tsx:225-227` | Scroll jank on mobile | P1 |
| 6 | `h-screen` breaks on mobile browsers | `Index.tsx:172` | Address bar causes overflow | P2 |

### 6.2 Recommended Fixes

**Fix 1: Add missing safe-area utility classes**

```css
/* Add to index.css */
.safe-p-t {
  padding-top: var(--safe-area-top, 0px);
}

.safe-p-b {
  padding-bottom: var(--safe-area-bottom, 0px);
}

.safe-m-b {
  margin-bottom: var(--safe-area-bottom, 0px);
}
```

**Fix 2: Update viewport meta tag**

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
```

**Fix 3: Remove native-only gate in MobileActionBar**

```typescript
// Remove this block from MobileActionBar.tsx:63-65
// if (!Capacitor.isNativePlatform()) { return ... }

// Or replace with a proper mobile web bar
```

**Fix 4: Use CSS variable for bottom padding**

```typescript
// Index.tsx - replace pb-24 with:
className={`... pb-[var(--bottom-total)]`}
```

**Fix 5: Replace h-screen with 100dvh**

```typescript
// Index.tsx:172 - replace:
<div className="h-screen ...">
// with:
<div className="h-[100dvh] ...">
```

---

## 7. Next Steps (Phase 1 Preview)

1. **Implement Layout Fixes** — Add safe-area utilities, fix viewport meta, consolidate scroll containers
2. **Fix Mobile Web Action Bar** — Ensure CTAs work for web mobile users
3. **Bottom Sheet Standardization** — Consistent height, gestures, safe-area padding
4. **Stepper Redesign** — Mobile-optimized step indicator
5. **Results Action Sheet** — Native-feeling share/download experience

---

## Appendix A: File Reference

| File | Lines | Purpose |
|------|-------|---------|
| `src/pages/Index.tsx` | 1-304 | Main studio page, state rendering |
| `src/hooks/useStudioPageLogic.tsx` | 1-563 | State machine, handlers |
| `src/components/studio/MobileActionBar.tsx` | 1-317 | Fixed bottom bar |
| `src/components/MobileHairstyleModal.tsx` | 1-632 | Hairstyle bottom sheet |
| `src/components/AppHeader.tsx` | 1-250 | Sticky header |
| `src/components/ResultsViewer.tsx` | - | Results display, sharing |
| `src/index.css` | 1-443 | Global styles, safe-area vars |
| `index.html` | 1-60 | Viewport meta, head tags |
| `backend/server.js` | 1-188 | Route mounting, middleware |
| `backend/routes/auth.js` | 1-458 | Auth + reward endpoints |
| `backend/routes/generations.js` | 1-477 | Generation endpoints |
| `backend/routes/watermark.js` | 1-90 | Export endpoints |
| `backend/routes/payments.js` | 1-248 | Pricing + history |

---

**Document Version:** 1.0  
**Generated By:** Phase 0 UX Audit Agent
