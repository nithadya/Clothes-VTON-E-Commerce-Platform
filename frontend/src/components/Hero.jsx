import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { assets } from "../assets/assets";

const Hero = () => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [currentAd, setCurrentAd] = useState(0);
  
  // Cursor splash effect states
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [cursorVisible, setCursorVisible] = useState(false);
  const [splashes, setSplashes] = useState([]);
  const splashIdRef = useRef(0);

  // Sample advertisement data
  const advertisements = [
    {
      id: 1,
      image: assets.tryon,
      title: "Virtul Feature",
      cta: "Try Now",
      bgColor: "bg-white",
      textColor: "text-white-700",
    },
    {
      id: 2,
      title: "Limited Edition",
      description: "Exclusive pieces available for a limited time only",
      cta: "View Limited Items",
      bgColor: "bg-emerald-100",
      textColor: "text-emerald-900",
    },
    {
      id: 3,
      title: "New Arrivals",
      description: "Be the first to explore our newest fashion statements",
      cta: "Explore Now",
      bgColor: "bg-rose-100",
      textColor: "text-rose-900",
    },
  ];

  // Handle responsive layout
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Set initial value
    checkIfMobile();

    // Add event listener
    window.addEventListener("resize", checkIfMobile);

    // Clean up
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  // Auto-rotate advertisements
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % advertisements.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Mouse position tracking for splash effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      
      // Create new splash at intervals or on significant movement
      if (Math.random() > 0.9) {
        createSplash(e.clientX, e.clientY);
      }
    };

    const handleMouseEnter = () => {
      setCursorVisible(true);
    };

    const handleMouseLeave = () => {
      setCursorVisible(false);
    };

    const handleClick = (e) => {
      // Always create a splash on click
      createSplash(e.clientX, e.clientY, true);
    };

    // Add event listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseenter", handleMouseEnter);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseenter", handleMouseEnter);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("click", handleClick);
    };
  }, []);

  // Create splash effect
  const createSplash = (x, y, isClick = false) => {
    const id = splashIdRef.current++;
    const size = isClick ? Math.random() * 100 + 100 : Math.random() * 40 + 20;
    const duration = isClick ? 1.5 : 0.8 + Math.random() * 0.4;
    
    const newSplash = {
      id,
      x,
      y,
      size,
      duration,
      createdAt: Date.now(),
    };

    setSplashes((prevSplashes) => [...prevSplashes, newSplash]);

    // Remove splash after animation completes
    setTimeout(() => {
      setSplashes((prevSplashes) => prevSplashes.filter(splash => splash.id !== id));
    }, duration * 1000);
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleAdNavigation = (index) => {
    setCurrentAd(index);
  };

  return (
    <section className="relative w-full overflow-hidden">
      {/* Cursor Effects Layer - positioned over everything */}
      <div className="fixed inset-0 pointer-events-none z-50">
        {/* Custom Cursor */}
        {cursorVisible && (
          <motion.div
            className="fixed w-6 h-6 rounded-full bg-white bg-opacity-30 mix-blend-difference pointer-events-none"
            style={{
              left: mousePosition.x,
              top: mousePosition.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
          />
        )}

        {/* Splash Effects */}
        {splashes.map(splash => (
          <motion.div
            key={splash.id}
            className="absolute rounded-full bg-white bg-opacity-20 mix-blend-difference pointer-events-none"
            style={{
              left: splash.x,
              top: splash.y,
              translateX: "-50%",
              translateY: "-50%",
            }}
            initial={{ scale: 0, opacity: 0.8 }}
            animate={{ 
              scale: 1,
              opacity: 0
            }}
            transition={{
              duration: splash.duration,
              ease: "easeOut",
            }}
          >
            <div 
              style={{ 
                width: splash.size, 
                height: splash.size,
                borderRadius: '50%',
                border: '2px solid rgba(255, 255, 255, 0.4)'
              }} 
            />
          </motion.div>
        ))}
      </div>

      {/* Hero container */}
      <div className="flex flex-col md:flex-row w-full h-[600px] md:h-[500px]">
        {/* Left side - Advertisements (stacked on mobile) */}
        <div className="w-full md:w-5/12 relative overflow-hidden order-1 md:order-2">
          <div className="relative h-full">
            {/* Advertisement Content */}
            {advertisements.map((ad, index) => (
              <motion.div
                key={ad.id}
                className={`absolute inset-0 flex flex-col justify-center px-6 md:px-12 ${ad.bgColor} ${ad.textColor}`}
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: currentAd === index ? 1 : 0,
                  x: currentAd === index ? 0 : -50,
                  pointerEvents: currentAd === index ? "auto" : "none",
                }}
                transition={{ duration: 0.5 }}
                style={{
                  backgroundImage: ad.image ? `url(${ad.image})` : "none",
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                }}
              >
                {/* Add a semi-transparent overlay to ensure text remains readable */}
                {ad.image && (
                  <div
                    className={`absolute inset-0 ${ad.bgColor} opacity-55`}
                  ></div>
                )}

                {/* Content positioned on top of the background */}
                <div className="relative z-10">
                  <span className="uppercase text-xs font-semibold tracking-wider mb-2">
                    Featured
                  </span>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    {ad.title}
                  </h2>
                  <p className="mb-6 text-sm md:text-base">{ad.description}</p>
                  <button className="bg-black text-white py-3 px-6 rounded-full hover:bg-gray-800 transition duration-300 w-fit text-sm md:text-base">
                    {ad.cta}
                  </button>
                </div>
              </motion.div>
            ))}

            {/* Advertisement navigation dots */}
            <div className="absolute bottom-6 left-6 md:left-12 flex space-x-2">
              {advertisements.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleAdNavigation(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    currentAd === index ? "w-6 bg-black" : "bg-gray-400"
                  }`}
                  aria-label={`View advertisement ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right side - Video (stacked on mobile) */}
        <div className="w-full md:w-7/12 relative z-10 order-2 md:order-1">
          {/* Video Background */}
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <motion.video
              ref={videoRef}
              src="src/assets/video1.mp4"
              autoPlay
              loop
              muted
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              onPlay={handlePlay}
              onPause={handlePause}
              onError={(e) => {
                console.error("Video failed to load:", e);
                e.target.src = "src/assets/fallback.jpg";
              }}
            />

            {/* Gradient overlay for better text visibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          </div>

          {/* Overlay Text Section */}
          <div className="relative z-10 flex flex-col justify-end items-start h-full text-white p-6 md:p-12">
            <div className="max-w-md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 md:w-11 h-[2px] bg-white"></div>
                <motion.p
                  className="font-medium text-sm md:text-base tracking-wider"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  OUR BESTSELLERS
                </motion.p>
              </div>

              <motion.h1
                className="text-3xl md:text-5xl font-bold mb-4"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
              >
                Latest Arrivals
              </motion.h1>

              <motion.p
                className="text-sm md:text-base mb-6 max-w-xs opacity-90"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Discover our curated collection of premium essentials for your
                wardrobe
              </motion.p>

              <motion.button
                className="bg-white text-black py-3 px-8 rounded-full hover:bg-gray-200 transition duration-300 font-medium text-sm md:text-base"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                SHOP NOW
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom scrolling announcement bar */}
      <div className="w-full bg-black text-white py-3 px-4 overflow-hidden">
        <div className="whitespace-nowrap inline-block animate-marquee">
          {/* Duplicate the content to create a seamless loop */}
          <span className="mx-4 text-sm font-medium">
            FREE SHIPPING ON ORDERS OVER $100
          </span>
          <span className="mx-4 text-sm font-medium">
            NEW VIRTUAL TRY-ON FEATURE AVAILABLE
          </span>
          <span className="mx-4 text-sm font-medium">
            USE CODE WELCOME20 FOR 20% OFF YOUR FIRST ORDER
          </span>
          <span className="mx-4 text-sm font-medium">
            FREE SHIPPING ON ORDERS OVER $100
          </span>
          <span className="mx-4 text-sm font-medium">
            NEW VIRTUAL TRY-ON FEATURE AVAILABLE
          </span>
          <span className="mx-4 text-sm font-medium">
            USE CODE WELCOME20 FOR 20% OFF YOUR FIRST ORDER
          </span>
        </div>
      </div>
    </section>
  );
};

export default Hero;