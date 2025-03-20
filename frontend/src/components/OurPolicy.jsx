import React from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets';

const PolicySection = () => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };

  // Policy data with your original assets
  const policyData = [
    {
      icon: assets.exchange_icon,
      title: "Easy Exchange Policy",
      description: "We offer hassle-free exchanges within 15 days of purchase"
    },
    {
      icon: assets.quality_icon,
      title: "7 Days Return Policy",
      description: "Not satisfied? Return items within 7 days for a full refund"
    },
    {
      icon: assets.support_img,
      title: "Best Customer Support",
      description: "Our team is available 24/7 to assist you with any queries"
    }
  ];

  return (
    <section className="bg-gray-100 py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Our Policies</h2>
          <div className="w-16 h-1 bg-black mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-lg mx-auto">
            Shop with confidence knowing we have policies designed with your satisfaction in mind
          </p>
        </div>

        {/* Policy cards container */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {policyData.map((policy, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="bg-gray-50 rounded-lg p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow duration-300 border border-gray-100"
            >
              <div className="bg-white rounded-full p-4 mb-6 shadow-sm">
                <img 
                  src={policy.icon} 
                  alt={policy.title} 
                  className="w-12 h-12 object-contain"
                />
              </div>
              
              <h3 className="text-xl font-bold mb-3 text-gray-800">
                {policy.title}
              </h3>
              
              <p className="text-gray-600">
                {policy.description}
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-6 text-sm font-medium text-black border-b border-black pb-1 inline-flex items-center group"
              >
                Learn more
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </motion.button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default PolicySection;