import React, { useContext, useEffect, useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShopContext } from '../context/ShopContext';
import Title from './Title';
import ProductItem from './ProductItem';
import { ChevronRight, ChevronLeft, Loader2 } from 'lucide-react';

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 10;
  
  // Categories with descriptive IDs
  const categories = [
    { id: 'all', label: 'All' },
    { id: 'new-arrivals', label: 'New Arrivals' },
    { id: 'best-sellers', label: 'Best Sellers' },
    { id: 'trending', label: 'Trending' }
  ];

  // Get the latest products with useMemo for performance
  const latestProducts = useMemo(() => {
    return products?.slice(0, 30) || [];
  }, [products]);

  // Filter products based on category
  const filteredProducts = useMemo(() => {
    if (!latestProducts.length) return [];
    
    if (activeCategory === 'All') return latestProducts;
    
    return latestProducts.filter((product, index) => {
      switch(activeCategory) {
        case 'New Arrivals': return index % 3 === 0;
        case 'Best Sellers': return index % 3 === 1;
        case 'Trending': return index % 3 === 2;
        default: return true;
      }
    });
  }, [latestProducts, activeCategory]);

  // Calculate pagination data
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Calculate visible page buttons
    let pageButtons = [];
    const maxButtons = 5;
    
    if (totalPages <= maxButtons) {
      pageButtons = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      if (currentPage <= 3) {
        pageButtons = [1, 2, 3, 4, '...', totalPages];
      } else if (currentPage >= totalPages - 2) {
        pageButtons = [1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
      } else {
        pageButtons = [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
      }
    }
    
    return {
      totalPages,
      currentProducts,
      pageButtons,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1
    };
  }, [filteredProducts, currentPage, productsPerPage]);

  // Handle category change with useCallback
  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
    setCurrentPage(1);
  }, []);
  
  // Handle pagination with useCallback
  const handlePageChange = useCallback((newPage) => {
    if (newPage < 1 || newPage > paginationData.totalPages) return;
    setCurrentPage(newPage);
    
    // Scroll to top of product section smoothly
    const productsSection = document.getElementById('products-grid');
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [paginationData.totalPages]);

  // Simulate data loading
  useEffect(() => {
    if (products?.length > 0) {
      const timer = setTimeout(() => {
        setIsLoading(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [products]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05,
        delayChildren: 0.2
      }
    },
    exit: { 
      opacity: 0,
      transition: { staggerChildren: 0.05, staggerDirection: -1 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
  };
  
  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
  };

  // Empty state component
  const EmptyState = () => (
    <div className="col-span-full py-16 text-center">
      <div className="max-w-md mx-auto">
        <h3 className="text-xl font-medium mb-2">No products found</h3>
        <p className="text-gray-600 mb-6">We couldn't find any products in this category. Please try another category or check back later.</p>
        <button 
          onClick={() => handleCategoryChange('All')}
          className="px-6 py-2 bg-black text-white font-medium hover:bg-gray-800 transition-colors"
        >
          View all products
        </button>
      </div>
    </div>
  );
  
  return (
    <section className="my-9 pt-6 bg-white" aria-labelledby="latest-collections-title">
      <div className="container mx-auto px-4">
        {/* Title and Description */}
        <motion.div 
          className="text-center py-8 text-3xl"
          variants={titleVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
        >
          <Title text1={'LATEST'} text2={'COLLECTIONS'} id="latest-collections-title" />
          <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600 mt-4">
            Discover our newest arrivals and trending pieces. Curated selections to elevate your style.
          </p>
        </motion.div>
        
        {/* Category Navigation */}
        <motion.div 
          className="flex flex-wrap justify-center gap-2 md:gap-4 mb-12"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          role="tablist"
          aria-label="Product categories"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => handleCategoryChange(category.label)}
              className={`px-6 py-2 text-sm font-medium transition-all duration-300 border ${
                activeCategory === category.label 
                  ? 'border-black bg-black text-white' 
                  : 'border-gray-300 hover:border-gray-800'
              }`}
              role="tab"
              aria-selected={activeCategory === category.label}
              aria-controls={`category-${category.id}-content`}
              id={`category-${category.id}-tab`}
            >
              {category.label}
            </button>
          ))}
        </motion.div>
        
        {/* Products Grid with Loading State */}
        <div id="products-grid">
          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 size={40} className="animate-spin text-gray-600" />
            </div>
          ) : (
            <div 
              role="tabpanel" 
              id={`category-${categories.find(c => c.label === activeCategory)?.id}-content`}
              aria-labelledby={`category-${categories.find(c => c.label === activeCategory)?.id}-tab`}
            >
              <AnimatePresence mode="wait">
                <motion.div 
                  key={`${activeCategory}-${currentPage}`}
                  className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  viewport={{ once: true, amount: 0.2 }}
                >
                  {paginationData.currentProducts.length > 0 ? (
                    paginationData.currentProducts.map((item, index) => (
                      <motion.div
                        key={`${item._id || index}`}
                        variants={itemVariants}
                        className="transform transition duration-300 hover:-translate-y-2"
                      >
                        <ProductItem 
                          id={item._id} 
                          image={item.image} 
                          name={item.name} 
                          price={item.price} 
                          colors={item.colors}
                          category={activeCategory !== 'All' ? activeCategory : null}
                          isNew={activeCategory === 'New Arrivals' || index % 5 === 0}
                        />
                      </motion.div>
                    ))
                  ) : (
                    <EmptyState />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Enhanced Pagination Controls */}
        {!isLoading && paginationData.currentProducts.length > 0 && paginationData.totalPages > 1 && (
          <nav 
            className="flex justify-center items-center mt-16 gap-4" 
            aria-label="Products pagination"
          >
            <button 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!paginationData.hasPrevPage}
              className="flex items-center justify-center w-10 h-10 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            
            <div className="flex gap-2" role="navigation">
              {paginationData.pageButtons.map((pageNum, i) => {
                return pageNum === '...' ? (
                  <span key={`ellipsis-${i}`} className="flex items-center justify-center px-2">...</span>
                ) : (
                  <button
                    key={`page-${pageNum}`}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-black text-white' 
                        : 'border border-gray-300 hover:border-gray-800 hover:bg-gray-50'
                    }`}
                    aria-label={`Page ${pageNum}`}
                    aria-current={currentPage === pageNum ? 'page' : undefined}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!paginationData.hasNextPage}
              className="flex items-center justify-center w-10 h-10 border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </nav>
        )}
        
        {/* View All Collections Button */}
        <div className="text-center mt-12">
          <motion.a
            href="/collection"
            className="inline-block px-8 py-3 border border-black bg-black text-white font-medium transition-all duration-300 hover:bg-transparent hover:text-black focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            aria-label="View all product collections"
          >
            View All Collections
          </motion.a>
        </div>
      </div>
    </section>
  );
};

export default React.memo(LatestCollection);