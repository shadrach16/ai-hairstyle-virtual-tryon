// src/HomePage.js
import React, { useState, useEffect } from 'react';
import { 
  ChevronDownIcon, 
  ChevronUpIcon, 
  ArrowLeftIcon, 
  ArrowRightIcon, 
  Bars3Icon, 
  XMarkIcon, 
  SparklesIcon, 
  CameraIcon, 
  ShareIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-play carousel
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [carouselIndex]);

  const faqItems = [
    { question: 'What is Hair Studio?', answer: 'Hair Studio is a revolutionary mobile app that allows you to virtually try on hundreds of hairstyles and colors before you ever step into a salon.' },
    { question: 'How realistic are the try-ons?', answer: 'Our advanced AI and AR technology provides hyper-realistic previews, matching styles to your face shape and hair texture for truly accurate results.' },
    { question: 'Can I share my new looks?', answer: 'Absolutely! You can easily save your favorite styles and share them with friends, family, or your stylist directly from the app.' },
    { question: 'Are there styles for all hair types?', answer: 'Yes, we offer a diverse range of styles, lengths, and colors designed to cater to all genders, hair textures, and preferences.' },
    { question: 'Is the app free to use?', answer: 'Hair Studio offers a free basic version with premium features and extended style libraries available through subscription.' },
  ];

  const carouselItems = [
    { id: 4, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761163911/generated_images/tqkenqg7osgqo9mfwzvk.png', alt: 'Vibrant colored hair' },
    { id: 6, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1762947502/generated_images/ptuvad2p50qonu1jwfwm.png', alt: 'Vibrant colored hair' },
    { id: 5, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1762947657/generated_images/crapape6e4lkqrltxsgw.png', alt: 'Vibrant colored hair' },
    { id: 1, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761249663/generated_images/puuahczpjwy01rmrsybf.png', alt: 'Stylish short haircut' },
    { id: 2, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761249601/generated_images/tzsa7cpno0wozcuotikm.png', alt: 'Long wavy hair with highlights' },
    { id: 3, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761041926/generated_images/hnqmb4dxr8hjmrzkjnnm.png', alt: 'Modern men\'s haircut' },
  ];

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };
   
  const handleNavLinkClick = (e, targetId) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false); 
  };

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans overflow-x-hidden">
      
      {/* Background Ambient Glows */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-purple-200/30 blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-amber-200/30 blur-[100px]" />
      </div>

      {/* Navbar */}
      <nav className={`fixed w-full top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' : 'bg-transparent py-4'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-amber-600 rounded-full blur opacity-25 group-hover:opacity-75 transition duration-200"></div>
                <img className='relative w-10 h-10 rounded-full border-2 border-white' src={'https://res.cloudinary.com/djpcokxvn/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1763046539/campusprint_kyc-documents/cropped_circle_image_1_ymbe1t.png'} alt="Hair Studio Logo" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-tight">Hair Studio<span className="text-amber-600">.</span></span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8 font-medium">
            {['Home', 'Features', 'About'].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => handleNavLinkClick(e, item.toLowerCase())} className="text-gray-600 hover:text-purple-600 transition-colors text-sm uppercase tracking-wide">
                    {item}
                </a>
            ))}
            <a 
                href="/download" 
                className="bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full hover:bg-gray-800 transition-transform hover:scale-105 shadow-lg shadow-gray-900/20"
            >
                Download App
            </a>
          </div>

          {/* Mobile Menu Toggle */}
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden text-gray-800 p-2">
            {isMobileMenuOpen ? <XMarkIcon className="h-7 w-7" /> : <Bars3Icon className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
            {isMobileMenuOpen && (
            <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
            >
                <div className="flex flex-col p-6 space-y-4">
                {['Home', 'Features', 'About'].map((item) => (
                    <a key={item} href={`#${item.toLowerCase()}`} onClick={(e) => handleNavLinkClick(e, item.toLowerCase())} className="text-lg font-semibold text-gray-800">
                        {item}
                    </a>
                ))}
                <a href="/download" className="bg-purple-600 text-white text-center py-3 rounded-lg font-semibold">Download App</a>
                </div>
            </motion.div>
            )}
        </AnimatePresence>
      </nav>

      {/* Hero Section */}
      <section id="home" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6">
        <div className="container mx-auto max-w-5xl text-center">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-sm font-semibold mb-4">
                <SparklesIcon className="w-4 h-4" />
                <span>The #1 AI Hairstyle Try-On App</span>
            </motion.div>

            <motion.h1 variants={fadeInUp} className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              New Hair. <br className="hidden md:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-purple-600 to-pink-500">No Regrets.</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Upload your photo or choose a custom style. Our AI maps realistic haircuts to your face instantly.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
              <button
                onClick={() => navigate('/?studio_status=upload')}
                className="relative overflow-hidden bg-gray-900 text-white font-bold py-4 px-8 rounded-full shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 transition-all transform hover:-translate-y-1 group"
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    <CameraIcon className="w-5 h-5" />
                    Try On Styles Now
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
              
              <a 
                href='https://youtu.be/BhIiOgPFtY4' 
                target="_blank" 
                rel="noreferrer"
                className="bg-white text-gray-900 border border-gray-200 font-bold py-4 px-8 rounded-full hover:bg-gray-50 transition-all flex items-center justify-center gap-2 group"
              >
                 <span>Watch Demo</span>
                 <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Carousel Section - Floating Cards Look */}
      <section className="py-10 overflow-hidden">
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="container mx-auto px-4"
        >
            <div className="relative max-w-5xl mx-auto aspect-[4/3] md:aspect-[16/9] rounded-2xl overflow-hidden shadow-2xl shadow-gray-400/20">
                 {/* Image Slider */}
                <div className="absolute inset-0 bg-gray-100">
                    {carouselItems.map((item, idx) => (
                        <motion.img
                            key={item.id}
                            src={item.image}
                            alt={item.alt}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: idx === carouselIndex ? 1 : 0, scale: idx === carouselIndex ? 1 : 1.05 }}
                            transition={{ duration: 0.7 }}
                            className="absolute inset-0 w-full h-full object-contain"
                        />
                    ))}
                     {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 md:p-12">
                        <div className="text-white">
                            <p className="text-sm font-semibold tracking-wider uppercase text-purple-300 mb-2">Real Results</p>
                            <h3 className="text-2xl md:text-3xl font-bold">{carouselItems[carouselIndex].alt}</h3>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="absolute bottom-8 right-8 flex gap-3">
                    <button onClick={prevSlide} className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-black transition-colors border border-white/20">
                        <ArrowLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={nextSlide} className="p-3 rounded-full bg-white/10 backdrop-blur-md hover:bg-white text-white hover:text-black transition-colors border border-white/20">
                        <ArrowRightIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </motion.div>
      </section>

      {/* Features - Bento Grid Style */}
      <section id="features" className="py-20 bg-gray-50/50">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Why Everyone is Switching</h2>
            <p className="text-gray-600 text-lg">More than just a filter. It's a complete makeover tool.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "AI Vision", desc: "Precision face mapping that understands your structure.", color: "bg-indigo-50 text-indigo-900", icon: <SparklesIcon className="w-6 h-6 text-indigo-600"/>, btn: "Learn More" },
                { title: "Color Lab", desc: "From Platinum Blonde to Neon Green, instantly.", color: "bg-amber-50 text-amber-900", icon: <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-red-500 to-yellow-500"/>, btn: "Try Colors" },
                { title: "Community", desc: "Get feedback from a community of stylists.", color: "bg-pink-50 text-pink-900", icon: <ShareIcon className="w-6 h-6 text-pink-600"/>, btn: "Join Now" }
            ].map((feature, idx) => (
                <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -5 }}
                    className={`p-8 rounded-3xl ${feature.color} relative overflow-hidden group shadow-sm hover:shadow-md transition-all`}
                >
                    <div className="mb-6 p-3 bg-white rounded-2xl inline-block shadow-sm">{feature.icon}</div>
                    <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
                    <p className="opacity-80 mb-8 leading-relaxed">{feature.desc}</p>
                    <span className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2 group-hover:gap-3 transition-all cursor-pointer">
                        {feature.btn} <ArrowRightIcon className="w-4 h-4" />
                    </span>
                </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works - Timeline */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">3 Steps to a New You</h2>
            
            <div className="grid md:grid-cols-3 gap-8 relative">
                {/* Connecting Line (Desktop) */}
                <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-purple-200 via-amber-200 to-purple-200" />

                {[
                    { step: "01", title: "Upload Photo", desc: "Take a selfie or upload a clear photo of your face.", detail: "📸 Ensure good lighting" },
                    { step: "02", title: "Choose Style", desc: "Select from our library or upload any image from the web.", detail: "✨ Endless possibilities" },
                    { step: "03", title: "Save & Share", desc: "Download your high-res makeover or send to your stylist.", detail: "💌 Get opinions first" }
                ].map((item, idx) => (
                    <motion.div 
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.2 }}
                        className="relative flex flex-col items-center text-center bg-white p-6 z-10"
                    >
                        <div className="w-24 h-24 rounded-full bg-white border-4 border-purple-50 shadow-xl flex items-center justify-center mb-6 text-2xl font-bold text-purple-600">
                            {item.step}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                        <p className="text-gray-600 mb-4 text-sm">{item.desc}</p>
                        <span className="bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full font-medium">{item.detail}</span>
                    </motion.div>
                ))}
            </div>
        </div>
      </section>

      {/* Newsletter - Gradient Block */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl bg-gray-900 rounded-[2.5rem] p-8 md:p-16 text-center relative overflow-hidden">
            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600 rounded-full blur-[80px] opacity-20 translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-600 rounded-full blur-[80px] opacity-20 -translate-x-1/2 translate-y-1/2"></div>

            <div className="relative z-10">
                <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/80 text-xs font-medium tracking-wider mb-6 border border-white/10">
                    EARLY ACCESS
                </span>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Join the hairstyle revolution.</h2>
                <p className="text-gray-400 mb-10 max-w-lg mx-auto">Get exclusive access to new AI models and premium filters before anyone else.</p>
                
                <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
                    <input 
                        type="email" 
                        placeholder="email@example.com" 
                        className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-6 py-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 w-full transition-all"
                    />
                    <button className="bg-white text-gray-900 font-bold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg shadow-white/10">
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-2xl">
            <h2 className="text-3xl font-bold text-center mb-12">Common Questions</h2>
            <div className="space-y-4">
            {faqItems.map((item, index) => (
                <div key={index} className="border border-gray-100 rounded-2xl hover:border-purple-100 transition-colors overflow-hidden">
                <button
                    className="flex justify-between items-center w-full px-6 py-5 text-left font-semibold text-gray-800"
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                    {item.question}
                    {openFaq === index ? <ChevronUpIcon className="h-5 w-5 text-purple-600" /> : <ChevronDownIcon className="h-5 w-5 text-gray-400" />}
                </button>
                <AnimatePresence>
                    {openFaq === index && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="px-6 pb-5 text-gray-600 leading-relaxed"
                        >
                            {item.answer}
                        </motion.div>
                    )}
                </AnimatePresence>
                </div>
            ))}
            </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
                 <img className='w-8 h-8 rounded-full grayscale opacity-50' src={'https://res.cloudinary.com/djpcokxvn/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1763046539/campusprint_kyc-documents/cropped_circle_image_1_ymbe1t.png'} alt="Logo" />
                 <span className="text-gray-500 font-medium">Hair Studio</span>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-gray-400">
                <span>Powered by Gemini Nano</span>
                <span>•</span>
                <span>AI Vision</span>
                <span>•</span>
                <span>© {new Date().getFullYear()}</span>
            </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;