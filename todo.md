AI Hair Studio MVP - Development Plan
Core Files to Create/Modify:
src/pages/Index.tsx - Main homepage with upload and gallery
src/components/PhotoUpload.tsx - Photo upload component
src/components/HairstyleGallery.tsx - Gallery of hairstyle options
src/components/ResultsView.tsx - Display generated results
src/components/PaywallModal.tsx - Payment modal for premium features
src/lib/mockData.ts - Mock hairstyle data and AI simulation
src/lib/sessionManager.ts - Session and usage tracking
index.html - Update title and meta tags
Key Features:
Photo upload (jpg/png support)
Hairstyle gallery with filtering
Mock AI hairstyle transfer
Freemium model (5 generations limit)
Watermark for free users
Payment integration mockup
Responsive design
Session-based user tracking
Implementation Strategy:
Use localStorage for session management
Mock AI processing with realistic delays
Simulate hairstyle transfer with overlay effects
Implement Stripe payment mockup
Add watermark overlay for free tier