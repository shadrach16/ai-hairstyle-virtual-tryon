💇 Hair Studio: AI Hairstyle Try-On Platform🌟 OverviewHair Studio is a full-stack, cross-platform application that leverages AI image generation to allow users to virtually try on new hairstyles.This repository contains the complete codebase, showcasing a production-ready system that integrates secure monetization, a robust Node.js API, and a unified React codebase deployed to both the web and native mobile platforms (iOS/Android) via Capacitor.✨ Core FeaturesAI-Powered Generation: Secure backend integration to handle user-uploaded photos and generate new hairstyle images based on selected styles (e.g., braids, cuts, colors).Unified Codebase: A single React/TypeScript application serves both the responsive web experience and the native mobile applications.Advanced Monetization: Implemented a sophisticated credit-based economy with a free trial, credit packs, and subscription models.Secure Payment Architecture: Integration with multiple payment providers (RevenueCat for mobile, Dodo Payment for web) managed securely via API webhooks.State Management: Comprehensive use of React Hooks, Context, and modern libraries like tanstack/react-query for efficient data fetching and state handling.User Authentication: Implemented secure, frictionless sign-in using Google OAuth.🛠️ Tech StackThis project uses a modern and scalable full-stack architecture:ComponentTechnologyRoleFrontendReact / TypeScriptUser Interface, Responsive Design, and Mobile Wrapper.Cross-PlatformCapacitorBridges the web app to native mobile functionality (Camera, Haptics, Filesystem).Backend APINode.js / Express.jsProvides secure, rate-limited, and authenticated API endpoints.DatabaseMongoDB / MongooseFlexible schema for user data, credits, payments, and generation history.MonetizationRevenueCatManages mobile subscriptions and in-app purchases (via Stripe/Google Pay).Web PaymentsDodo PaymentHandles secure web-based payment processing.🚀 Quick Setup (Web Development)This guide assumes you have Node.js (v18+) and npm installed.1. Backend SetupNavigate to the API directory (e.g., server/).Install dependencies:npm install
Create a .env file in the root of the API directory and add your environment variables (e.g., MONGO_URI, JWT_SECRET, REVENUECAT_WEBHOOK_TOKEN, AI_API_KEY).# Example .env structure
MONGO_URI="mongodb://localhost:27017/hairstudio_db"
JWT_SECRET="YOUR_STRONG_SECRET"
# ... other keys (Google OAuth, AI service credentials)
Start the API server:npm run dev
2. Frontend SetupNavigate to the client directory (e.g., client/ or src/).Install dependencies:npm install
Start the React development server:npm start # or npm run dev
3. Mobile Deployment (Capacitor)Install the Capacitor CLI globally:npm install -g @capacitor/cli
Build the web application:npm run build
Copy web assets to native projects:npx cap copy
Open the native IDE (e.g., Android Studio or Xcode):npx cap open ios # or npx cap open android
Note: This step requires a full build setup for the respective platforms.📂 Project StructureThis is a conceptual structure. Adjust based on your actual file layout./hair-studio/
├── client/              # React Frontend (Web, Mobile Wrapper)
│   ├── src/
│   │   ├── components/  # UI components (PaywallScreen.tsx, MobileHairstyleModal.tsx)
│   │   ├── hooks/       # Custom hooks (useStudioPageLogic.ts, useAuth.ts)
│   │   ├── pages/       # Main views (Index.tsx, Analytics.tsx)
│   │   └── App.tsx      # Main React router and App initialization
├── server/              # Node.js/Express Backend API
│   ├── models/          # Mongoose Schemas (User.js, Payment.js)
│   ├── routes/          # API endpoint logic (auth.js, payments.js, webhook.js)
│   └── server.js        # Main server entry point and configuration
├── .gitignore
└── README.md
