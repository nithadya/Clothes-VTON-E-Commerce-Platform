import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Fashion gallery component with responsive design
const FashionGallery = () => {
  // Gallery items with fashion-related titles, descriptions, and real image URLs
  const galleryItems = [
    {
      id: 1,
      title: "Spring Collection",
      description: "Vibrant colors and lightweight fabrics perfect for the new season.",
      imageUrl: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "seasonal"
    },
    {
      id: 2,
      title: "Urban Streetwear",
      description: "Bold statement pieces that define contemporary street fashion.",
      imageUrl: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "casual"
    },
    {
      id: 3,
      title: "Evening Elegance",
      description: "Sophisticated designs that capture the essence of modern luxury.",
      imageUrl: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "formal"
    },
    {
      id: 4,
      title: "Minimalist Essentials",
      description: "Timeless pieces with clean lines and neutral tones for everyday style.",
      imageUrl: "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
      category: "casual"
    }
  ];

  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [filteredGallery, setFilteredGallery] = useState(galleryItems);

  // Auto-rotate images
  useEffect(() => {
    if (!isAutoPlay) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, [isAutoPlay, filteredGallery.length]);

  // Handle filtering by category
  useEffect(() => {
    if (activeFilter === "all") {
      setFilteredGallery(galleryItems);
    } else {
      setFilteredGallery(galleryItems.filter(item => item.category === activeFilter));
    }
    setCurrentIndex(0);
  }, [activeFilter]);

  // Open lightbox
  const openLightbox = (item) => {
    setSelectedImage(item);
    setIsAutoPlay(false);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
    setIsAutoPlay(true);
  };

  // Navigation controls
  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % filteredGallery.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + filteredGallery.length) % filteredGallery.length);
  };

  // Unique categories for filter buttons
  const categories = ["all", ...new Set(galleryItems.map(item => item.category))];

  return (
    <div className="w-full bg-gray-50 py-16 px-4 md:px-8">
      {/* Gallery Header */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">
          <span className="text-black">FASHION</span>{" "}
          <span className="text-gray-400">GALLERY</span>
        </h1>
        <div className="w-16 h-1 bg-black mx-auto mb-6"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our curated collection of the latest fashion trends and timeless styles
        </p>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              activeFilter === category
                ? "bg-black text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Gallery Section */}
      {filteredGallery.length > 0 ? (
        <div className="max-w-3xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Content Side */}
          <div className="flex flex-col justify-center order-2 lg:order-1">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="text-center lg:text-left p-4"
              >
                <h2 className="text-3xl font-bold mb-4">{filteredGallery[currentIndex].title}</h2>
                <p className="text-gray-600 mb-6">{filteredGallery[currentIndex].description}</p>
                <button 
                  className="inline-block bg-black text-white px-6 py-3 rounded hover:bg-gray-800 transition-colors"
                  onClick={() => openLightbox(filteredGallery[currentIndex])}
                >
                  View Details
                </button>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Image Side */}
          <div className="relative order-1 lg:order-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="relative aspect-[4/5] overflow-hidden rounded-lg shadow-xl"
              >
                <img
                  src={filteredGallery[currentIndex].imageUrl}
                  alt={filteredGallery[currentIndex].title}
                  className="w-full h-full object-cover cursor-pointer"
                  onClick={() => openLightbox(filteredGallery[currentIndex])}
                />
                
                {/* Navigation controls */}
                <div className="absolute inset-0 flex items-center justify-between px-4 opacity-0 hover:opacity-100 transition-opacity">
                  <button 
                    onClick={handlePrev} 
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button 
                    onClick={handleNext} 
                    className="bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-3 shadow-lg transition-all transform hover:scale-105"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Indicators */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                  {filteredGallery.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentIndex ? "bg-white w-6" : "bg-white bg-opacity-50"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-gray-500">No items match the selected filter.</p>
        </div>
      )}

      {/* Thumbnail Preview */}
      <div className="max-w-6xl mx-auto mt-8 overflow-x-auto">
        <div className="flex gap-4 py-4 px-2 min-w-max">
          {filteredGallery.map((item, idx) => (
            <div 
              key={item.id} 
              className={`relative cursor-pointer w-20 h-20 md:w-24 md:h-24 flex-shrink-0 transition-all ${
                currentIndex === idx ? "ring-2 ring-black scale-105" : "opacity-70 hover:opacity-100"
              }`}
              onClick={() => setCurrentIndex(idx)}
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-full object-cover rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={closeLightbox}
          >
            <div 
              className="relative max-w-screen-sm w-full max-h-screen overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.imageUrl}
                alt={selectedImage.title}
                className="w-full h-auto rounded-lg"
              />
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-6">
                <h2 className="text-white text-2xl font-bold">{selectedImage.title}</h2>
                <p className="text-gray-200 mt-2">{selectedImage.description}</p>
              </div>
              <button
                className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75"
                onClick={closeLightbox}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FashionGallery;