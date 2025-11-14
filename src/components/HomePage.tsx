

// src/HomePage.js
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon, SunIcon, MoonIcon, ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline'; // Importing some icons
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const navigate = useNavigate();

  const faqItems = [
    { question: 'What is Hair Studio?', answer: 'Hair Studio is a revolutionary mobile app that allows you to virtually try on hundreds of hairstyles and colors before you ever step into a salon.' },
    { question: 'How realistic are the try-ons?', answer: 'Our advanced AI and AR technology provides hyper-realistic previews, matching styles to your face shape and hair texture for truly accurate results.' },
    { question: 'Can I share my new looks?', answer: 'Absolutely! You can easily save your favorite styles and share them with friends, family, or your stylist directly from the app.' },
    { question: 'Are there styles for all hair types?', answer: 'Yes, we offer a diverse range of styles, lengths, and colors designed to cater to all genders, hair textures, and preferences.' },
    { question: 'Is the app free to use?', answer: 'Hair Studio offers a free basic version with premium features and extended style libraries available through subscription.' },
  ];

  const carouselItems = [
    { id: 6, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1762947502/generated_images/ptuvad2p50qonu1jwfwm.png', alt: 'Vibrant colored hair' },
    { id: 5, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1762947657/generated_images/crapape6e4lkqrltxsgw.png', alt: 'Vibrant colored hair' },
    { id: 1, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761249663/generated_images/puuahczpjwy01rmrsybf.png', alt: 'Stylish short haircut' },
    { id: 2, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761249601/generated_images/tzsa7cpno0wozcuotikm.png', alt: 'Long wavy hair with highlights' },
    { id: 3, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761041926/generated_images/hnqmb4dxr8hjmrzkjnnm.png', alt: 'Modern men\'s haircut' },
    { id: 4, image: 'https://res.cloudinary.com/djpcokxvn/image/upload/v1761163911/generated_images/tqkenqg7osgqo9mfwzvk.png', alt: 'Vibrant colored hair' },
  ];

  const nextSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex + 1) % carouselItems.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prevIndex) => (prevIndex - 1 + carouselItems.length) % carouselItems.length);
  };

  return (
    <div className="min-h-screen bg-white text-gray-800 font-sans">
      {/* Navbar - Inspired by all images */}
      <nav className="fixed w-full top-0 bg-white shadow-sm z-10 p-4 border-b border-gray-100">
        <div className=" sm:container mx-auto flex justify-between items-center h-7">
          <div className="flex items-center space-x-2 ">
            <img className='w-12 bg-red-600 my-0' src={'https://play-lh.googleusercontent.com/y0T4DaQxzB9aVyFGgkBiQ533Q-Ct4V3a6DaU4d20eAqHoXCuZUvOi9LmFk2MKCnfCNysTraKVJOW-MabI_QKVg=w240-h480-rw'} />
            <span className="text-2xl font-bold text-gray-900 truncate ">Hair Studio</span>
            <span className="bg-amber-600 text-white text-xs px-2 py-1 rounded-md">TRY-ON</span>
          </div>
          <div className="flex items-center space-x-6">
            <a href="#home" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/download" className="text-gray-600 hover:text-gray-900">Download App</a>
            <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
            <a href="#about" className="text-gray-600 hover:text-gray-900">About</a>
            <button className="text-gray-600 hover:text-gray-900 hidden sm:block">
              <SunIcon className="h-6 w-6" /> {/* Could be a dark/light mode toggle */}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section - Inspired by Image 4 & 8 */}
      <section id="home" className=" flex justify-center items-center  min-h-[60vh] pt-24 pb-16 om-purple-50 to-amber-50 text-center ">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
            Your Perfect Hairstyle, Virtually Real.
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Discover your next look with our advanced AI-powered hair try-on app. Experiment with cuts, colors, and styles without the commitment.
          </p>
          <div className="flex justify-center space-x-4 lg:mt-3">
            <button    onClick={() => {
                navigate('/?studio_status=upload');
              }} className="bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300">
              Try Your New Look Now
            </button>
            <button className="bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg shadow-sm transition duration-300">
              Watch Demo
            </button>
          </div>
        </div>
      </section>

   {/* Carousel Component - Inspired by Image 3 */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">See Yourself Differently</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Swipe through inspiring transformations created with Hair Studio.
          </p>
          <div className="relative max-w-4xl mx-auto">
            <div className="overflow-hidden rounded-xl  ">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${carouselIndex * 100}%)` }}
              >
                {carouselItems.map((item) => (
                  <img
                    key={item.id}
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-[50vh]"
                  />
                ))}
              </div>
            </div>
            <button
              onClick={prevSlide}
              className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowLeftIcon className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg text-gray-700 hover:bg-gray-100 transition"
            >
              <ArrowRightIcon className="h-6 w-6" />
            </button>
            <div className="flex justify-center mt-6 space-x-2">
              {carouselItems.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`h-3 w-3 rounded-full ${idx === carouselIndex ? 'bg-purple-600' : 'bg-gray-300'} transition-colors duration-300`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>


      {/* Waitlist/Email Capture - Inspired by Image 1 */}
      <section className="py-16 bg-gray-50 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <p className="text-sm uppercase tracking-wider text-gray-500 mb-2">Launched</p>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sign up for our exclusive early access!</h2>
          <p className="text-lg text-gray-600 mb-6">
            Be the first to experience Hair Studio's revolutionary features.
          </p>
          <div className="flex justify-center space-x-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-full max-w-sm"
            />
            <button className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg shadow-md transition duration-300">
              Subscribe
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-4">
            By subscribing, you agree to receive emails from us. You can unsubscribe at any time.
          </p>
        </div>
      </section>

      {/* Featured Blog Posts / App Highlights - Inspired by Image 1 */}
      <section id="features" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">Unleash Your Inner Stylist</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Explore key features that make Hair Studio your ultimate hair companion.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-8 text-white flex flex-col items-start">
              <span className="text-3xl font-bold mb-3">AI Vision</span>
              <p className="text-lg opacity-90">See hyper-realistic try-ons that adapt to your unique facial features.</p>
              <button className="mt-6 text-sm font-semibold hover:underline">Learn More &rarr;</button>
            </div>
            {/* Card 2 */}
            <div className="bg-gradient-to-br from-red-500 to-amber-600 rounded-xl shadow-lg p-8 text-white flex flex-col items-start">
              <span className="text-3xl font-bold mb-3">Color Lab</span>
              <p className="text-lg opacity-90">Experiment with every shade imaginable, from natural tones to vibrant fantasy colors.</p>
              <button className="mt-6 text-sm font-semibold hover:underline">Explore Colors &rarr;</button>
            </div>
            {/* Card 3 */}
            <div className="bg-white rounded-xl shadow-lg p-8 text-gray-800 flex flex-col items-start">
              <span className="text-3xl font-bold mb-3">Community Styles</span>
              <p className="text-lg text-gray-600">Share your favorite looks, get feedback, and discover trending styles from others.</p>
              <button className="mt-6 text-sm font-semibold text-purple-600 hover:underline">Join &rarr;</button>
            </div>
          </div>
        </div>
      </section>

   

      {/* How It Works / Our Process - Adapted from Image 5, 6, 7 */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">How It Works</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Getting your dream look is easier than ever with Hair Studio.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white flex flex-col space-y-4">
              <span className="text-purple-400 text-lg font-semibold">Step 1</span>
              <h3 className="text-2xl font-bold">Upload Your Photo</h3>
              <p className="text-gray-300">Simply take a selfie or upload a clear photo of your face.</p>
              <div className="bg-gray-700 rounded-lg p-4 font-mono text-sm">
                <p>📸 Open the app and select 'New Look'</p>
                <p>💡 Ensure good lighting for best results</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white flex flex-col space-y-4">
              <span className="text-purple-400 text-lg font-semibold">Step 2</span>
              <h3 className="text-2xl font-bold">Explore Styles & Colors</h3>
              <p className="text-gray-300">Browse thousands of hairstyles, cuts, and a full spectrum of colors.</p>
              <div className="bg-gray-700 rounded-lg p-4 font-mono text-sm">
                <p>✨ Filter by length, texture, or trend</p>
                <p>🎨 Endless color palette to choose from</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="bg-gray-900 rounded-xl shadow-lg p-6 text-white flex flex-col space-y-4">
              <span className="text-purple-400 text-lg font-semibold">Step 3</span>
              <h3 className="text-2xl font-bold">Save & Share</h3>
              <p className="text-gray-300">Save your favorite virtual transformations and share them easily.</p>
              <div className="bg-gray-700 rounded-lg p-4 font-mono text-sm">
                <p>💌 Send to friends for opinions</p>
                <p>💇‍♀️ Show your stylist for perfect execution</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Component - Inspired by Image 2 */}
      <section id="about" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-4xl font-extrabold text-gray-900 text-center mb-4">Frequently Asked Questions</h2>
          <p className="text-xl text-gray-600 text-center mb-12">
            Find answers to common questions about Hair Studio.
          </p>
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div key={index} className="border border-gray-200 rounded-lg bg-white shadow-sm">
                <button
                  className="flex justify-between items-center w-full px-6 py-4 text-left text-lg font-semibold text-gray-800 hover:bg-gray-50 transition"
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  {item.question}
                  {openFaq === index ? (
                    <ChevronUpIcon className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4 text-gray-600">
                    <p>{item.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer / Tech Stack - Inspired by Image 7 & 8 */}
      <footer className="py-12 bg-gray-900 text-white text-center">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-bold mb-6">Powered by the Latest in AI & Design</h3>
          <div className="flex justify-center items-center flex-wrap gap-8 mb-8 opacity-80">
            {/* Replace with actual tech logos if desired, or keep as text */}
            <span className="text-lg">AI Vision</span>
            <span className="text-lg">Gemini</span>
            <span className="text-lg">Nano Image</span>
            <span className="text-lg">Try-On</span>
          </div>
          <p className="text-gray-400">&copy; {new Date().getFullYear()} Hair Studio. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;