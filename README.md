# 💇‍♀️ AI Hairstyle Studio: Virtual Try-On SaaS

![Status](https://img.shields.io/badge/Status-Live_SaaS-success)
![AI Model](https://img.shields.io/badge/Model-Gemini_Image_Generation-blue)
![Payment](https://img.shields.io/badge/Payment-RevenueCat_|_Dodo_Payments-green)

> **"Stop guessing. Start seeing."**
> A B2C SaaS platform that allows users to upload a selfie and realistically "try on" hundreds of hairstyles using Generative AI before visiting the salon.

---

## 📸 The Result (Before & After)

<div align="center">
  <img src="https://github.com/shadrach16/ai-hairstyle-virtual-tryon/blob/main/assets/hair-transformation.png" alt="AI Hairstyle Transformation Example" width="800">
  <p><em>Figure 1: Original Selfie vs. AI Generated "Bob Cut" with color adaptation.</em></p>
</div>

---

## 🚀 Project Overview

**ChangeYourHairstyle** is a direct-to-consumer web application solving a common anxiety: *"Will this haircut look good on me?"*

Unlike simple overlay apps (which just paste a png sticker on a face), this application uses the backend Gemini image generation pipeline to create hair that respects the user's head shape, lighting conditions, and skin tone for a realistic result.

---

## 💰 Monetization & Business Logic

This project is not just code; it is a functioning business.
* **Credit System:** Users purchase "Makeover Credits" packs (e.g., 5 styles for ₦2,000).
* **Payment Integration:**
  * **RevenueCat:** For native Google Play / App Store purchases.
  * **Dodo Payments:** For web checkout.
* **Webhook Architecture:** Securely listens for payment success events to instantly top up the user's wallet in the database.

---

## ✨ Key Features

### 1. Gemini-Powered Hairstyle Generation
The backend analyzes the uploaded selfie and selected hairstyle, then uses Gemini image generation to create a realistic try-on that respects the user's head shape, lighting conditions, and skin tone.

### 2. Custom Style Prompting
Users aren't limited to presets. They can type "Messy bun with pink highlights" and the Node.js backend translates this into an optimized prompt for the AI model.

### 3. Progressive Web App (PWA)
Optimized for mobile browsers, allowing users to install it as a native-like app on Android/iOS.

---

## 🛠️ Tech Stack

* **Frontend:** `React` / `Vite` / `Capacitor` (mobile-first web/native shell).
* **Backend:** `Node.js` / `Express` (API orchestration).
* **AI Engine:** Gemini analysis and image generation from the backend generation routes/services.
* **Database:** `MongoDB` (User profiles, credit ledger, image history).
* **Storage:** `Cloudinary` (hairstyle thumbnails and generated assets).

---

## Local Development Startup

Prerequisites validated in this workspace: Node.js, npm, pnpm 8.10.0, frontend dependencies, and backend dependencies.

Create local env files from the examples:

```powershell
Copy-Item .env.example .env
Copy-Item backend\.env.example backend\.env
```

Install dependencies:

```powershell
pnpm install
Push-Location backend
npm install
Pop-Location
```

Start the backend API on port 5000:

```powershell
Push-Location backend
npm run dev
Pop-Location
```

Start the frontend on Vite's default port 5173:

```powershell
pnpm dev
```

Use `VITE_API_URL=http://localhost:5000/api` for local frontend-to-backend traffic. The backend health check is `http://localhost:5000/health`.

Useful validation commands:

```powershell
pnpm build
Push-Location backend
node --check server.js
npm test -- --runInBand
Pop-Location
```

## Production/VPS Seed Workflow

Production backend access used by the seed workflow:

```powershell
ssh root@213.136.65.247 "cd /var/www/hairstudio; pm2 status"
ssh root@213.136.65.247 "cd /var/www/hairstudio; node scripts/auditDB.js 2>&1"
scp "C:\Users\HP\Desktop\hairstudio\backend\scripts\seedNewHairstylesXX.js" root@213.136.65.247:/var/www/hairstudio/scripts/
ssh root@213.136.65.247 "cd /var/www/hairstudio; node scripts/seedNewHairstylesXX.js 2>&1"
ssh root@213.136.65.247 "cd /var/www/hairstudio; node scripts/sendNewDropPush.js 2>&1"
```

Seed scripts must match [backend/models/Hairstyle.js](backend/models/Hairstyle.js) enum values and should run on the VPS so they use production MongoDB and Cloudinary credentials.

---

## 👨‍💻 Developer Role

**Tunde Oluwamo**
*Full Stack Developer & SaaS Founder*
[ linkedin.com/in/oluwamo-shadrach-740242185 ]

---

## 📊 Analytics Event Taxonomy (v1)

### North Star Events
These are the critical funnel events that measure activation and retention:

| Event Name | When Fired | Required Properties | Dashboard Impact |
|------------|-----------|---------------------|------------------|
| `page_view` | User views a page | `page` (string) | DAU, session tracking |
| `photo_uploaded` | User uploads a selfie | `source` ('camera' \| 'gallery') | Activation funnel step 1 |
| `hairstyle_selected` | User selects a hairstyle | `hairstyleId`, `hairstyleName`, `category` | Activation funnel step 2 |
| `generation_started` | Generation begins | `generationId`, `hairstyleId` | Activation funnel step 3 |
| `generation_completed` | Generation succeeds | `generationId`, `hairstyleId`, `processingTime` | Activation funnel step 4 (completion) |
| `generation_failed` | Generation fails | `generationId`, `error` | Error rate tracking |
| `paywall_viewed` | User sees paywall/pricing | `source`, `creditsRemaining` | Monetization funnel |

### Secondary Events
| Event Name | When Fired | Properties |
|------------|-----------|------------|
| `user_registered` | New user signs up | `method` ('google'), `referralCode?` |
| `user_signed_in` | User logs in | `method` ('google'), `returning_user` |
| `share_started` | User initiates share | `type` ('image' \| 'collage') |
| `share_completed` | Share action completes | `platform`, `withReferral` |
| `referral_success` | Referred user signs up | `referrerId`, `creditsAwarded` |
| `reward_ad_completed` | User watches rewarded ad | `creditsGranted` |

### Event Tracking Implementation
- **Frontend**: Call `apiService.trackEvent(eventName, properties)` from `@/lib/api`
- **Backend**: Events stored in `Analytics` collection, queryable via `/api/analytics/dashboard`

---