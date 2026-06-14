# U1 Mobile Modal Decomposition Map

This map defines the mobile-first surface split introduced by U1 so primary navigation does not depend on stacked monetization and account modals.

## Primary shell

| Surface | Type | Entry point | Purpose |
| --- | --- | --- | --- |
| Try On | bottom-nav tab | default mobile tab | Upload photo, choose style, generate result |
| Looks | bottom-nav tab | mobile bottom nav | View generation history without re-entering the studio stack |
| Profile | bottom-nav tab | mobile bottom nav | Account summary, paywall entry, rewards entry, help |

## Modal ownership

| Surface | Owner | Opens from | Does not contain |
| --- | --- | --- | --- |
| PricingModal | purchase/paywall | header, profile hub, gated purchase moments | referrals, ad rewards, credit activity |
| RewardsCenterModal | rewards and ledger | profile hub, future reward CTAs | purchase packs, subscription merchandising |
| MobileHairstyleModal | style selection | try-on action bar | payments, rewards, account actions |
| AuthModal | authentication gate | looks/profile/rewards/paywall guarded actions | navigation, purchase logic |

## Mobile interaction rules

1. Bottom navigation owns first-level movement between try-on, looks, and profile.
2. The try-on action bar only appears on the try-on tab.
3. Rewards center closes before tab back-navigation unwinds to try-on.
4. Pricing modal is purchase-only and no longer acts as a reward hub.
5. Looks can be reached directly from the shell without reopening the studio modal stack.

## Current implementation notes

- Try On is still backed by the existing studio state machine in `src/hooks/useStudioPageLogic.tsx`.
- Looks reuses `src/components/HistoryPage.tsx` in embedded mode.
- Profile is provided by `src/components/MobileProfileHub.tsx`.
- Rewards are provided by `src/components/RewardsCenterModal.tsx`.
- Bottom navigation is provided by `src/components/MobileBottomNavigation.tsx`.