# 💇‍♀️ AI Hairstyle Studio: Virtual Try-On SaaS

![Status](https://img.shields.io/badge/Status-Live_SaaS-success)
![AI Model](https://img.shields.io/badge/Model-Stable_Diffusion_Inpainting-blue)
![Payment](https://img.shields.io/badge/Payment-Paystack_|_Dodo_Payments-green)

> **"Stop guessing. Start seeing."**
> A B2C SaaS platform that allows users to upload a selfie and realistically "try on" hundreds of hairstyles using Generative AI before visiting the salon.

---

## 📸 The Result (Before & After)

<div align="center">
  <img src="./assets/2025-11-18 23_58_01-Hair Studio - AI Hairstyle Try-On" alt="AI Hairstyle Transformation Example" width="800">
  <p><em>Figure 1: Original Selfie vs. AI Generated "Bob Cut" with color adaptation.</em></p>
</div>

---

## 🚀 Project Overview

**ChangeYourHairstyle** is a direct-to-consumer web application solving a common anxiety: *"Will this haircut look good on me?"*

Unlike simple overlay apps (which just paste a png sticker on a face), this application uses **Stable Diffusion In-painting** to generate hair that respects the user's head shape, lighting conditions, and skin tone for a hyper-realistic result.

---

## 💰 Monetization & Business Logic

This project is not just code; it is a functioning business.
* **Credit System:** Users purchase "Makeover Credits" packs (e.g., 5 styles for ₦2,000).
* **Payment Integration:**
    * **Paystack:** For seamless Naira (NGN) transactions.
    * **Dodo Payments:** For cross-border/crypto payments.
* **Webhook Architecture:** Securely listens for payment success events to instantly top up the user's wallet in the database.

---

## ✨ Key Features

### 1. AI-Driven "In-Painting"
The core engine identifies the hair region of the uploaded image and uses a Generative Adversarial Network (GAN) / Diffusion model to "repaint" that specific area with the requested texture (e.g., Braids, Afro, Straight) while keeping the face unchanged.

### 2. Custom Style Prompting
Users aren't limited to presets. They can type "Messy bun with pink highlights" and the Node.js backend translates this into an optimized prompt for the AI model.

### 3. Progressive Web App (PWA)
Optimized for mobile browsers, allowing users to install it as a native-like app on Android/iOS.

---

## 🛠️ Tech Stack

* **Frontend:** `React.js` (State management for image uploads and gallery).
* **Backend:** `Node.js` / `Express` (API orchestration).
* **AI Engine:** Integration with Stable Diffusion API (via Replicate or custom Python flask server).
* **Database:** `MongoDB` (User profiles, credit ledger, image history).
* **Storage:** `Cloudinary` / `AWS S3` (Temporary storage for generated images).

---

## 👨‍💻 Developer Role

**Tunde Oluwamo**
*Full Stack Developer & SaaS Founder*
[ linkedin.com/in/oluwamo-shadrach-740242185 ]