import React, { useState } from 'react';
import { Button }  from '@/components/ui/button';
import {
  UploadCloud,
  Sparkles,
  Gift,
 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

 
// Import your GIFs from assets
import basicGif from '../../assets/basic.gif';
import featuredGif from '../../assets/featured.gif';
import premiumGif from '../../assets/premium.gif';


interface OnboardingGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

// --- Card Data ---
// We define the data for our new full-screen cards here
const tierData = [
   {
    key: 'basic',
    title: 'Basic',
    subtitle: 'The Classics',
    icon: <img src={basicGif}   />,
    description: 'Your essential, timeless looks to get started.',
    bgColor: 'bg-gray-100',
    textColor: 'text-amber-500',
    borderColor: 'border-gray-300',
  }, 
  {
 
        key: 'featured',
    title: 'Featured',
    subtitle: 'The Collections',
    icon: <img src={premiumGif} className='rounded-lg  '   />,
    description: "Curated 'drops' of trending and seasonal hairstyles",
    bgColor: 'bg-yellow-50',
    textColor: 'text-amber-500',
    borderColor: 'border-amber-500',
  },{
     key: 'premium',
    title: 'Premium',
    subtitle: 'The Artist Collabs',
    icon: <img src={featuredGif}   />,
    description: "Exclusive, limited-edition looks from world-class artists.",
    bgColor: 'bg-blue-50',
    textColor: 'text-blue-500',
    borderColor: 'border-blue-500',
  },

];

// --- The New Full-Screen Tier Card ---
const TierCard = ({ data, isActive }: { data: typeof tierData[0], isActive: boolean }) => {
  return (
    <motion.div
      key={data.key}
      className={`absolute inset-0 w-full h-full flex flex-col justify-center items-center p-8 ${data.bgColor}`}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <motion.div
        className={`relative w-full max-w-xs min-h-96 ${data.borderColor} border-2 rounded-2xl ${data.bgColor} shadow-xl flex flex-col justify-center items-center text-center p-6 overflow-hidden`}
        // Give the active card a subtle "lift"
        animate={{ scale: isActive ? 1.05 : 1, y: isActive ? -10 : 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* ✨ THE PREMIUM HOLOGRAPHIC SHIMMER ✨ */}
        {data.key === 'premium' && (
          <motion.div
            className="absolute top-0 left-0 w-full h-full opacity-50"
            style={{
              background:
                'linear-gradient(110deg, transparent 20%, rgba(255,255,255,0.8) 50%, transparent 80%)',
            }}
            // Animate the shimmer across the card
            animate={{ x: ['-100%', '100%'] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'linear',
              delay: 0.5,
            }}
          />
        )}

        <span
          className={`text-xs font-bold bg-amber-100 px-2 py-0.5 mb-2 rounded-full   tracking-widest ${data.textColor}`}
        >
          {data.title}
        </span>
        {data.icon}
        <h3 className="text-2xl font-bold text-gray-800 mt-2">{data.subtitle}</h3>
        <p className="text-gray-600 mt-2 text-md">{data.description}</p>
      </motion.div>
    </motion.div>
  );
};

// --- The New Step 1: Tier Showcase Component ---
const TierShowcase = () => {
  const [activeTier, setActiveTier] = useState(1); // Start with "Featured"

  return (
    <div className="flex flex-col items-center text-center w-full h-full justify-center">
      {/* 1. The Full-Screen Animated Card */}
      <div className="w-full flex-1 relative flex items-center justify-center">
        <AnimatePresence mode="wait">
          <TierCard
            key={tierData[activeTier].key}
            data={tierData[activeTier]}
            isActive={true}
          />
        </AnimatePresence>
      </div>

      {/* 2. The Tier Selector "Tabs" */}
      <div className="flex justify-center space-x-2 p-4 bg-white w-full">
        {tierData.map((tier, index) => (
          <button
            key={tier.key}
            onClick={() => setActiveTier(index)}
            className={`py-2 px-4 rounded-full text-sm font-semibold transition-all ${
              activeTier === index
                ? `bg-amber-600 text-white shadow-md`
                : `bg-gray-100 text-gray-700`
            }`}
          >
            {tier.title}
          </button>
        ))}
      </div>
    </div>
  );
};

// --- Define the NEW "Digital Fashion" steps ---
const onboardingSteps = [
  {
    // ✨ This is now a full-screen interactive component!
    component: <TierShowcase />,
    title: 'Welcome to Hair Studio',
    description:
      "This is your digital fashion closet. Discover the look that defines you.",
  }, 
];

// --- Animation variants (No changes) ---
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
  }),
};

// --- Main Onboarding Guide Component ---
const OnboardingGuide: React.FC<OnboardingGuideProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [direction, setDirection] = useState(1);

  if (!isOpen) {
    return null;
  }

  const handleNext = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setDirection(1);
      setCurrentStep((prev) => prev + 1);
    } else {
      onClose();
    }
  };

  const handleSkip = () => {
    onClose();
  };

  const isLastStep = currentStep === onboardingSteps.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-between bg-white">
      {/* 1. Main Content Area */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentStep}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="absolute w-full h-full flex items-center justify-center"
          >
            {/* ✨ We now render the correct component for the step */}
            <StepContent
              stepData={onboardingSteps[currentStep]}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 2. Bottom Navigation Bar */}
      <div className="flex h-24 w-full items-center justify-between p-6">
        

        <div className=" justify-center gap-2 hidden sm:flex">
          {onboardingSteps.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 rounded-full transition-all ${
                index === currentStep ? 'w-4 bg-amber-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        <Button
          onClick={handleNext}
          className="rounded-full w-full sm:w-60 bg-amber-600 px-6 py-3 font-semibold text-white hover:bg-amber-700"
        >
          {isLastStep ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
};

// --- Helper component for the step content ---
// ✨ This is now smarter: it renders EITHER a custom component OR the default image/text
const StepContent = ({
  stepData,
}: {
  stepData: typeof onboardingSteps[0];
}) => {
  // Check if a custom component is provided (like our TierShowcase)
  if (stepData.component) {
    return (
      <div className="flex flex-col items-center text-center h-full w-full">
        {/* Render the full-screen component */}
        <div className="flex-1 w-full">
          {stepData.component}
        </div>
        
        {/* Render the text *below* the component */}
        <div className="pb-4 px-6">
          <h3 className="text-3xl font-bold text-gray-800 logo">{stepData.title}</h3>
          <p className="mt-4 max-w-sm text-base text-gray-600">{stepData.description}</p>
        </div>
      </div>
    );
  }

  // --- This is the default layout for steps 2, 3, and 4 ---
  return (
    <div className="flex flex-col items-center text-center p-6">
      <div className="mb-10">
        {stepData.image}
      </div>
      <h3 className="text-3xl font-bold text-gray-900">{stepData.title}</h3>
      <p className="mt-4 max-w-sm text-base text-gray-600">{stepData.description}</p>
    </div>
  );
};

export default OnboardingGuide;