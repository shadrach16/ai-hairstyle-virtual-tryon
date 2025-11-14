// src/components/LandingPage.tsx

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import {
    Sparkles,
    ChevronRight,
    ChevronLeft,
    Quote,
    Camera,
    Scan,
    Wand2,
    CheckCircle,
    Loader2
} from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import GoogleSignInButton from './GoogleSignInButton'; // Import the sign-in button
import { toast } from 'sonner';

// --- Sub Components (AnimatedTextCharacter, RevealSlider) ---
const AnimatedTextCharacter = ({ text }: { text: string }) => {
  const letters = Array.from(text);
  const container = { hidden: { opacity: 0 }, visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.04, delayChildren: i * 0.1 }, }), };
  const child = { visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 12, stiffness: 200 } }, hidden: { opacity: 0, y: 20 }, };
  return ( <motion.div variants={container} initial="hidden" animate="visible" className="flex flex-wrap justify-center overflow-hidden"> {letters.map((letter, index) => ( <motion.span variants={child} key={index}> {letter === " " ? "\u00A0" : letter} </motion.span> ))} </motion.div> );
};

const RevealSlider = ({ before, after, className }: { before: React.ReactNode, after: React.ReactNode, className?: string }) => {
  const [sliderValue, setSliderValue] = useState(50);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  return ( <div ref={ref} className={cn("relative w-full h-full overflow-hidden", className)}> <motion.div animate={{ scale: isInView ? 1 : 1.1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 w-full h-full">{before}</motion.div> <motion.div className="absolute inset-0 w-full h-full" style={{ clipPath: `inset(0 ${100 - sliderValue}% 0 0)` }}> <motion.div animate={{ scale: isInView ? 1 : 1.1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="absolute inset-0 w-full h-full">{after}</motion.div> </motion.div> <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-11/12 md:w-1/3 z-10 p-2 bg-white/50 backdrop-blur-sm rounded-full shadow-lg"> <Slider defaultValue={[50]} max={100} step={1} onValueChange={(value) => setSliderValue(value[0])} className="w-full" /> </div> </div> );
};
// --- End Sub Components ---


// --- Store Button Components ---
const GooglePlayButton = ({ href, className, onClick }: { href: string, className?: string, onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void }) => (
  <a
    href={href}
    onClick={onClick}
    className={cn(
      "inline-flex items-center justify-center gap-2",
      "bg-slate-900 hover:bg-slate-800 text-white font-bold",
      "px-5 py-2 h-14 md:h-[68px] ",
      "rounded-lg text-base",
      "shadow-md hover:shadow-lg",
      "transition-all duration-300 transform hover:-translate-y-1",
      className
    )}
    target="_blank"
    rel="noopener noreferrer"
  >
    <svg width="24px" height="24px" viewBox="-29.45 0 466.9 466.9" xmlns="http://www.w3.org/2000/svg" fill="#ffffff">
         <path d="M261.7 142.3L15 1.3C11.9-.5 8-.4 5 1.4c-3.1 1.8-5 5-5 8.6 0 0 .1 13 .2 34.4l179.7 179.7 81.8-81.8z" fill="#63BE6B"/>
         <path d="M.2 44.4C.5 121.6 1.4 309 1.8 402.3L180 224.1.2 44.4z" fill="#3EC6F2"/>
         <path d="M402.9 223l-141.2-80.7-81.9 81.8 92.4 92.4L403 240.3c3.1-1.8 5-5.1 5-8.6 0-3.6-2-6.9-5.1-8.7z" fill="#FAA51A"/>
         <path d="M1.7 402.3c.2 33.3.3 54.6.3 54.6 0 3.6 1.9 6.9 5 8.6 3.1 1.8 6.9 1.8 10 0l255.3-148.9-92.4-92.4L1.7 402.3z" fill="#EC3B50"/>
    </svg>
    <div className="text-left leading-tight">
      <span className="text-xs block font-normal">GET IT ON</span>
      <span className="text-lg font-semibold">Google Play</span>
    </div>
  </a>
);

const AppStoreButton = ({ className }: { className?: string }) => (
  <span
    className={cn(
      "inline-flex items-center justify-center gap-2",
      "bg-gray-400 text-white font-bold",
      "px-5 py-2 h-14 md:h-[68px]",
      "rounded-lg text-base",
      "shadow-inner",
      "opacity-60 cursor-not-allowed",
      className
    )}
    aria-disabled="true"
  >
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" className="w-6 h-6 md:w-7 md:h-7 fill-current">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C39.3 141.2 0 184.8 0 248.4c0 51.7 33.5 107.4 75.8 143.7 20.8 18.2 46.4 34.6 78.4 34.6 28.5 0 52.8-16.8 84.8-16.8 32 0 54.7 16.8 84.8 16.8 32.8 0 58.6-17.7 78.4-35.6 19.3-16.8 32.8-37.8 32.8-61.9 0-33.7-24.3-56.4-55.8-56.4zm-29.4-191.2c13.7-15.6 21.6-35.7 21.6-56.8 0-16.8-6.4-32.8-18.8-44.6-13.7-12.8-31.5-20.7-52.8-20.7-18 0-36.8 7.9-50 20.7-13.7 12.8-21.6 31.5-21.6 50 0 16.8 6.4 32.8 18.8 44.6 13.7 12.8 31.5 20.7 52.8 20.7 18 0 36.8-7.9 50-20.7z"/>
    </svg>
    <div className="text-left leading-tight">
      <span className="text-xs block font-normal">Download on the</span>
      <span className="text-lg font-semibold">App Store</span>
    </div>
  </span>
);
// -----------------------------------------------------------------------


/**
 * Main Landing Page Component
 */
export default function LandingPage() {
    const { isAuthenticated, isLoading: authLoading } = useAuth();

    const [referralCode, setReferralCode] = useState<string | null>(null);
    const [referralActivated, setReferralActivated] = useState(false);
    // Base Play Store URL (no referrer)
    const basePlayStoreUrl = `https://play.google.com/store/apps/details?id=${import.meta.env.VITE_ANDROID_PACKAGE_NAME || 'com.hairstudio.app'}`;
    // Play Store URL that might include the referrer
    const [playStoreUrl, setPlayStoreUrl] = useState(basePlayStoreUrl);
    
    const initialCheckDone = useRef(false);

    // Effect 1: Extract Referral Code on Load
    useEffect(() => {
        if (initialCheckDone.current || isAuthenticated) return; // Only run once AND if user isn't already logged in
        localStorage.setItem("studio_status", 'landing');

        try {
            const params = new URLSearchParams(window.location.search);
            const refCodeFromUrl = params.get('ref');

            if (refCodeFromUrl) {
                const trimmedCode = refCodeFromUrl.trim();
                 if (trimmedCode) {
                    setReferralCode(trimmedCode);
                    setPlayStoreUrl(`${basePlayStoreUrl}&referrer=${encodeURIComponent(trimmedCode)}`);
                    localStorage.removeItem('referral_code'); // Clear any old pending codes

                    // Clean ref code from the URL bar visually
                    const cleanUrl = new URL(window.location.href);
                    cleanUrl.searchParams.delete('ref');
                    window.history.replaceState({}, document.title, cleanUrl.pathname + cleanUrl.search);
                 } else {
                     localStorage.removeItem('referral_code');
                 }

            } else {
                localStorage.removeItem('referral_code');
            }
        } catch (e) {
            console.error('[LandingPage Effect 1] Error parsing URL:', e);
            localStorage.removeItem('referral_code');
        }
        initialCheckDone.current = true;
    }, [isAuthenticated, basePlayStoreUrl]); // Rerun if auth state changes (e.g., on logout)

    // Effect 2: Check Activation Status After Auth State Changes
    // This runs if the user was ALREADY logged in when landing, or logs in
     useEffect(() => {
        
        if (referralCode && isAuthenticated && !referralActivated) {
            setReferralActivated(true);
            toast.success("Referral bonus activated!", { description: "Your free credits are now linked to your account." });
        }
    }, [isAuthenticated, referralCode, referralActivated]); // Run when these change

    // --- Prepare for Sign-In ---
    // This function is passed to the GoogleSignInButton's onBeforeSignIn prop
    const handleStoreReferralCode = useCallback(() => {
        if (referralCode && !isAuthenticated) { // Check auth state again just in case
            localStorage.setItem('referral_code', referralCode); 
            localStorage.setItem('basePlayStoreUrl', `${basePlayStoreUrl}&referrer=${encodeURIComponent(referralCode)}` ); 

        } else {
             localStorage.removeItem('referral_code'); // Ensure no old code lingers
        }
    }, [referralCode, isAuthenticated]); // Dependencies


    // --- Testimonial Data & Logic ---
     const testimonials = [
      { quote: "Seeing the locs on me first gave me all the confidence. The realism is incredible. I'm in love with my new hair!", name: "Amina Okoro", location: "Lagos, Nigeria", avatar: "https://res.cloudinary.com/djpcokxvn/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1759899063/Hairstyles/Helper/images_psbadr.jpg" },
      { quote: "Finally, an AI that gets our hair! The braid styles are incredibly authentic. It's like having a personal stylist in my pocket.", name: "Jelani Carter", location: "Atlanta, GA", avatar: "https://res.cloudinary.com/djpcokxvn/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1759895132/Hairstyles/1%20Credits/f6d9e7d05fcbcc3ce565d18c0b89caa4_mzoofj.jpg" },
      { quote: "As a hairstylist, this is a game-changer for consultations. My clients feel so much more comfortable making a big change.", name: "Sade Adebayo", location: "London, UK", avatar: "https://randomuser.me/api/portraits/women/79.jpg" }
    ];
    const [[page, direction], setPage] = useState([0, 0]);
    const testimonialIndex = (page % testimonials.length + testimonials.length) % testimonials.length;
    const paginate = (newDirection: number) => setPage([page + newDirection, newDirection]);

    // --- Hero Scroll Animation Hooks ---
    const heroRef = useRef(null);
    const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"], });
    const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
    const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
    const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
    const scale = useTransform(scrollYProgress, [0, 1], [1, 0.85]);
    const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

    // Determine the current state for rendering CTAs
    const showReferralFlow = referralCode && !isAuthenticated && !referralActivated;
    const showStandardFlow = !referralCode || isAuthenticated || referralActivated;
    const showActivatedSuccess = referralCode && isAuthenticated && referralActivated;

    return (
        <div className="bg-[#f8f5f2] text-slate-900 font-sans antialiased overflow-x-hidden">
            <main>

                {/* Hero Section */}
                <section ref={heroRef} className="relative h-screen overflow-hidden">
                    <motion.div style={{ scale, opacity }} className="h-full w-full flex flex-col justify-center items-center text-center sticky top-0 px-4">
                        {/* Background shapes */}
                        <motion.div style={{ y: y1 }} className="absolute top-[10%] left-[5%] w-20 h-28 md:w-32 md:h-40 bg-amber-200 rounded-2xl opacity-70 -z-10" />
                        <motion.div style={{ y: y2 }} className="absolute bottom-[15%] left-[20%] w-16 h-16 md:w-24 md:h-24 bg-rose-200 rounded-full opacity-70 -z-10" />
                        <motion.div style={{ y: y3 }} className="absolute top-[15%] right-[8%] w-28 h-40 md:w-40 md:h-56 bg-teal-200 rounded-2xl opacity-70 -z-10" />
                        <motion.div style={{ y: y2 }} className="absolute bottom-[10%] right-[15%] w-20 h-20 md:w-28 md:h-28 bg-indigo-200 rounded-full opacity-70 -z-10" />

                        <div className="relative z-10 container mx-auto justify-center flex flex-col items-center">
                            {/* --- Conditional Hero Content --- */}
                            {showReferralFlow && !authLoading && (
                                <>
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-slate-800">
                                        <AnimatedTextCharacter text="You're Invited!" />
                                    </h1>
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-amber-600 mb-4">
                                        <AnimatedTextCharacter text="Activate Your Bonus!" />
                                    </h1>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }} className="text-base sm:text-lg text-slate-600 mt-6 max-w-xl mx-auto">
                                        Sign in to activate your <span className="font-semibold text-amber-700">5 FREE credits</span>, or continue to download the app.
                                    </motion.p>
                                </>
                            )}
                            {showActivatedSuccess && (
                                <>
                                     <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', delay: 0.5 }}>
                                         <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mb-4"/>
                                     </motion.div>
                                    <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold tracking-tight leading-tight text-slate-800">
                                        <AnimatedTextCharacter text="Referral Activated!" />
                                    </h1>
                                    <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold tracking-tight text-amber-600 mt-2 mb-4">
                                        <AnimatedTextCharacter text="Free Credits Added!" />
                                    </h2>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }} className="text-base sm:text-lg text-slate-600 mt-6 max-w-xl mx-auto">
                                        Success! Download the app via Google Play to start. Your credits are waiting in your account. 💇🏾‍♀️
                                    </motion.p>
                                </>
                            )}
                             {!referralCode && ( // Standard landing page text
                                <>
                                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter leading-none text-slate-800">
                                        <AnimatedTextCharacter text="Hair Studio. Transform." />
                                    </h1>
                                    <h1 className="text-5xl sm:text-6xl md:text-8xl font-extrabold tracking-tighter text-amber-600">
                                        <AnimatedTextCharacter text="Instantly." />
                                    </h1>
                                    <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.2, ease: "easeOut" }} className="text-lg text-slate-600 mt-6 max-w-xl mx-auto">
                                        No more guessing. Upload a photo and let our AI show you how you'll look in hundreds of hairstyles.
                                    </motion.p>
                                </>
                            )}
                            {/* --- End Conditional Hero Content --- */}


                            {/* --- Conditional CTA --- */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 1.4, ease: "easeOut" }}
                                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full max-w-lg mx-auto"
                            >
                                {authLoading && (
                                     <div className="flex items-center justify-center text-slate-600 h-14">
                                         <Loader2 className="w-6 h-6 mr-2 animate-spin"/> Checking session...
                                     </div>
                                )}
                                
                                {showReferralFlow && !authLoading && (
                                    <>
                                        {/* Option 1: Activate Referral */}
                                        <GoogleSignInButton
                                            onBeforeSignIn={handleStoreReferralCode} // <-- Pass the callback
                                            variant="default" // Make it prominent
                                            size="lg"
                                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-14 md:h-[68px] rounded-lg text-lg shadow-lg shadow-blue-200/50 hover:shadow-xl"
                                        >
                                            Activate Referral & Sign In
                                        </GoogleSignInButton>

                                        {/* Option 2: Skip & Download */}
                                        <GooglePlayButton 
                                            href={playStoreUrl} 
                                            className="w-full sm:w-auto" // Adjust sizing
                                        />
                                    </>
                                )}

                                {showStandardFlow && !authLoading && (
                                     // Show normal download buttons
                                     <>
                                        <GooglePlayButton href={playStoreUrl} />
                                        <AppStoreButton />
                                     </>
                                )}
                            </motion.div>
                            {showReferralFlow && !authLoading && (
                                 <p className="text-xs text-slate-500 mt-3 max-w-xs mx-auto">
                                    Sign in to get 5 free credits for you and your friend. Or, skip and download the app directly.
                                 </p>
                            )}
                            {/* --- End Conditional CTA --- */}
                        </div>
                    </motion.div>
                </section>

                {/* --- How it works --- */}
                <section className="py-16 sm:py-24 bg-white">
                     <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center mb-12 sm:mb-16">
                          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">See Your New Look in 3 Steps</h2>
                          {referralActivated && <p className="text-green-600 font-medium">Your free credits are ready!</p>}
                        </motion.div>
                        <div className="max-w-4xl mx-auto">
                           {[{ icon: <Camera/>, title: "1. Upload Photo", desc: "Start with a clear, forward-facing selfie in the app." },
                            { icon: <Scan/>, title: "2. Choose Style", desc: "Explore hundreds of authentic hairstyles." },
                            { icon: <Wand2/>, title: "3. See the Magic!", desc: referralActivated ? "Use your free credits & let the AI work!" : "Sign up in the app & let the AI work!" }
                          ].map((step, index) => (
                              <motion.div key={index} initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: index * 0.1, ease: "easeOut" }} className="flex flex-col md:flex-row items-center gap-6 md:gap-8 my-10 md:my-12">
                                <div className={cn("text-center md:text-left md:w-1/2", index % 2 !== 0 && "md:order-1 md:text-right")}>
                                  <Badge className="mb-2 md:mb-3 bg-amber-100 text-amber-800 text-sm">{step.title}</Badge>
                                  <p className="text-base sm:text-lg text-slate-600">{step.desc}</p>
                                </div>
                                <div className={cn("w-20 h-20 md:w-24 md:h-24 bg-[#f8f5f2] rounded-full flex-shrink-0 flex items-center justify-center text-amber-600 shadow-sm", index % 2 !== 0 && "md:order-2 md:ml-auto")}>
                                  {React.cloneElement(step.icon, { className: "w-8 h-8 md:w-10 md:h-10" })}
                                </div>
                              </motion.div>
                          ))}
                        </div>
                      </div>
                 </section>

                {/* --- Reveal Slider --- */}
                <section className="py-16 sm:py-24">
                     <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">From Vision to Reality</h2>
                            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto">Drag the slider to experience the transformation. See how our AI seamlessly blends new styles.</p>
                        </motion.div>
                        <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1, ease: 'easeOut' }}>
                            <RevealSlider
                                className="aspect-[4/3] sm:aspect-[16/7] rounded-xl md:rounded-2xl shadow-xl shadow-slate-200 border border-slate-200"
                                before={ <img src="https://res.cloudinary.com/djpcokxvn/image/upload/v1759895132/Hairstyles/1%20Credits/f6d9e7d05fcbcc3ce565d18c0b89caa4_mzoofj.jpg" alt="Before hairstyle" className="w-full h-full object-cover"/>}
                                after={ <img src="https://res.cloudinary.com/djpcokxvn/image/upload/v1759899063/Hairstyles/Helper/images_psbadr.jpg" alt="After AI hairstyle" className="w-full h-full object-cover"/>}
                            />
                        </motion.div>
                    </div>
                </section>

                {/* --- Testimonials --- */}
                 <section className="py-16 sm:py-24 bg-white">
                     <div className="container mx-auto px-4">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 0.8 }} className="text-center mb-12 sm:mb-16">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900">Real Stories, Real Confidence</h2>
                        </motion.div>
                        <div className="relative h-64 md:h-56 flex items-center justify-center overflow-hidden">
                            <AnimatePresence initial={false} custom={direction}>
                                <motion.div key={page} custom={direction} variants={{ enter: (d: number) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }), center: { x: 0, opacity: 1 }, exit: (d: number) => ({ x: d < 0 ? '100%' : '-100%', opacity: 0 }) }} initial="enter" animate="center" exit="exit" transition={{ type: 'spring', stiffness: 200, damping: 25 }} className="absolute w-full max-w-3xl px-4">
                                    <CardContent className="text-center p-0">
                                        <p className="text-xl md:text-2xl font-medium text-slate-700 mb-6 italic">"{testimonials[testimonialIndex]?.quote}"</p>
                                        <div className="flex items-center justify-center">
                                            <img src={testimonials[testimonialIndex]?.avatar} alt={testimonials[testimonialIndex].name} className="w-12 h-12 rounded-full mr-4 border-2 border-amber-200" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-base">{testimonials[testimonialIndex].name}</h4>
                                                <p className="text-sm text-slate-500">{testimonials[testimonialIndex].location}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </motion.div>
                            </AnimatePresence>
                        </div>
                        <div className="flex justify-center mt-8 gap-4">
                             <Button onClick={() => paginate(-1)} variant="outline" size="icon" aria-label="Previous testimonial" className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-slate-50"><ChevronLeft className="w-5 h-5"/></Button>
                             <Button onClick={() => paginate(1)} variant="outline" size="icon" aria-label="Next testimonial" className="w-10 h-10 rounded-full bg-white shadow-sm hover:bg-slate-50"><ChevronRight className="w-5 h-5"/></Button>
                        </div>
                    </div>
                 </section>

                {/* --- Footer --- */}
                <footer className="bg-white border-t border-slate-100">
                    <div className="container mx-auto px-4 py-16 sm:py-20 text-center">
                        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, amount: 0.5 }} transition={{ duration: 1 }}>
                            {/* Conditional Footer Content */}
                             {showReferralFlow && !authLoading && (
                                 <>
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Activate Your Bonus!</h2>
                                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Don't miss out! Sign in to link your referral and get <span className="font-semibold text-amber-700">5 free credits</span>!</p>
                                     <GoogleSignInButton
                                        onBeforeSignIn={handleStoreReferralCode}
                                        variant="default"
                                        size="lg"
                                        className="w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 h-14 rounded-lg text-lg shadow-lg shadow-blue-200/50 hover:shadow-xl"
                                    >
                                        Activate Referral & Sign In
                                    </GoogleSignInButton>
                                 </>
                             )}
                             {showActivatedSuccess && (
                                  <>
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Ready to Start?</h2>
                                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Your bonus is active! Download the app now and your free credits await.</p>
                                    <GooglePlayButton href={playStoreUrl} className="mx-auto" />
                                    {referralActivated && ( <p className="text-xs text-green-600 mt-4 font-medium">Referral bonus linked to your account!</p> )}
                                 </>
                             )}
                             {!referralCode && !authLoading && ( // Standard footer
                                 <>
                                    <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-slate-900">Find Your Signature Look</h2>
                                    <p className="text-lg sm:text-xl text-slate-600 mb-10 max-w-2xl mx-auto">Get your first 5 credits free and start your style journey today. No credit card required.</p>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <GooglePlayButton href={playStoreUrl} />
                                        <AppStoreButton />
                                    </div>
                                 </>
                             )}
                             {authLoading && (
                                 <Loader2 className="w-8 h-8 mx-auto animate-spin text-slate-400"/>
                             )}
                        </motion.div>
                    </div>
                    <div className="container mx-auto px-4 py-6 text-center text-slate-500 text-sm border-t border-slate-100">
                        <p>&copy; {new Date().getFullYear()} Hair Studio. All Rights Reserved.</p>
                    </div>
                </footer>
            </main>
        </div>
    );
}