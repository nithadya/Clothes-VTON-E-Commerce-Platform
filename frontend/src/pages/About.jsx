import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { assets } from '../assets/assets'; // Ensure this path is correct
import NewsletterBox from '../components/NewsletterBox';

// Custom hook for number animation
const useAnimatedNumber = (targetNumber, duration = 2000) => {
  const [number, setNumber] = useState(0);

  useEffect(() => {
    let start = 0;
    const increment = targetNumber / (duration / 16); // 60 frames per second

    const timer = setInterval(() => {
      start += increment;
      if (start >= targetNumber) {
        setNumber(targetNumber);
        clearInterval(timer);
      } else {
        setNumber(Math.ceil(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [targetNumber, duration]);

  return number;
};

const AboutPage = () => {
  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    animate: { transition: { staggerChildren: 0.2 } }
  };

  // Stats data
  const stats = [
    { number: 10, text: 'Years of Experience' },
    { number: 15000, text: 'Happy Customers' },
    { number: 100, text: 'Quality Guaranteed' }
  ];

  // Team members data with image paths from assets
  const teamMembers = [
    { name: 'Devanath ', position: 'GM/HDCSE/CMU/08/32', image: assets.devnath },
    { name: 'Mihisara', position: 'GM/HDCSE/CMU/08/38', image: assets.mihisara },
    { name: 'Prabhath', position: 'GM/HDCSE/CMU/08/36', image: assets.prabath },
    { name: 'Praveen', position: 'GM/HDCSE/CMU/08/26', image: assets.praveen },
    { name: 'Paramee', position: 'GM/HDCSE/CMU/08/01', image: assets.parami }
  ];

  // Features data
  const features = [
    {
      title: 'Quality Assurance',
      description: 'Every product undergoes rigorous quality control to ensure it meets our exacting standards. We use premium materials and follow industry best practices.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      title: 'Innovation',
      description: 'We constantly push boundaries to create products that not only meet current needs but anticipate future demands. Our innovative approach keeps us ahead.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: 'Customer Service',
      description: 'Our dedicated support team is available to assist you with any questions or concerns. We believe in building relationships, not just completing transactions.',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div className="font-sans bg-white ">
      {/* Hero Section - Modernized with parallax effect */}
      <section className="relative h-96 flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-60 z-10"></div>
        <motion.div 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"
        ></motion.div>
        
        <div className="container mx-auto px-6 relative z-20 text-center md:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="md:max-w-xl"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">Our Story</h1>
            <div className="h-1 w-20 bg-white mb-8"></div>
            <p className="text-xl text-white/90 mb-8">Crafting exceptional experiences with passion and precision since 2023.</p>
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 bg-white text-black font-medium hover:bg-white/90 transition duration-300"
            >
              Discover Our Journey
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Reimagined as horizontal scrolling ticker */}
      <section className="relative bg-black py-12 overflow-hidden">
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="container mx-auto px-6"
        >
          <div className="flex flex-wrap md:flex-nowrap justify-between gap-12">
            {stats.map((stat, index) => {
              const animatedNumber = useAnimatedNumber(stat.number);
              return (
                <div key={index} className="w-full md:w-1/3 text-center">
                  <motion.p 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    className="text-5xl md:text-6xl font-bold text-white mb-2"
                  >
                    {animatedNumber}{stat.text === 'Quality Guaranteed' ? '%' : '+'}
                  </motion.p>
                  <p className="text-gray-400 text-lg uppercase tracking-widest">{stat.text}</p>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Our Story Section - With layered design */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            className="flex flex-col-reverse md:flex-row items-center gap-12"
          >
            <motion.div variants={fadeIn} className="md:w-1/2">
              <span className="text-sm text-black/60 uppercase tracking-widest">About Us</span>
              <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Crafting Excellence</h2>
              <div className="prose prose-lg text-gray-700 max-w-none">
                <p>
                Clothing Store is a family-owned business that has been operating for over 20 years. We are dedicated to providing the best quality clothing and accessories for our customers. Our mission is to provide exceptional customer service and convenience to our customers. We are committed to providing the best quality products at affordable prices. We are proud to be a part of the community and look forward to serving you for many years to come. 
                </p>
                <p>
                  We believe in creating lasting relationships with our customers through transparency, integrity, and exceptional service. Our team of passionate professionals work tirelessly to ensure that every interaction with our brand exceeds expectations.
                </p>
                <h3 className="text-2xl font-bold mt-8 mb-4">Our Mission</h3>
                <p>
                Our mission is to provide exceptional customer service and convenience to our customers. We are committed to providing the best quality products at affordable prices. We are proud to be a part of the community and look forward to serving you for many years to come.
                </p>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, backgroundColor: '#000' }}
                whileTap={{ scale: 0.95 }}
                className="mt-8 px-8 py-4 bg-black text-white font-medium border border-black hover:bg-white hover:text-black transition-all duration-300"
              >
                Learn More
              </motion.button>
            </motion.div>
            
            <motion.div variants={fadeIn} className="md:w-1/2">
              <div className="relative">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10"
                >
                  <img 
                    src={assets.about_img} 
                    alt="Our workshop" 
                    className="w-full h-auto object-cover shadow-xl"
                  />
                </motion.div>
                <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-black z-0"></div>
                <div className="absolute -top-4 -left-4 w-2/3 h-2/3 bg-gray-100 -z-10"></div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section - Reimagined as interactive cards */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm text-black/60 uppercase tracking-widest">What Sets Us Apart</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Why Choose Us</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We differentiate ourselves through unwavering commitment to excellence and customer satisfaction
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="bg-white border-b-4 border-transparent hover:border-black transition-all duration-300 p-8 shadow-lg hover:shadow-xl"
              >
                <div className="bg-black text-white p-4 inline-block rounded-full mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
      
      {/* Team Section - Reimagined with full-bleed images */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <span className="text-sm text-black/60 uppercase tracking-widest">The People Behind Our Brand</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-6">Our Team</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Meet the passionate professionals who make our vision a reality
            </p>
          </motion.div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8"
          >
            {teamMembers.map((member, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                className="group"
              >
                <div className="relative overflow-hidden aspect-[3/4]">
                  <img 
                    src={member.image} // Use the image from assets
                    alt={member.name}
                    className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500">
                    <h3 className="text-xl font-bold text-white">{member.name}</h3>
                    <p className="text-white/80 text-sm">{member.position}</p>
                    <div className="flex space-x-4 mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-200">
                      {/* Social icons with hover effects */}
                      <a href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                        </svg>
                      </a>
                      <a href="#" className="text-white hover:text-gray-300 transition-colors">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonial Section - New addition */}
      <section className="py-24 bg-black text-white">
        <div className="container mx-auto px-6">
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
            <span className="text-sm text-white/60 uppercase tracking-widest">What People Say</span>
            <h2 className="text-4xl md:text-5xl font-bold mt-2 mb-12">Client Testimonials</h2>
            
            <blockquote className="text-2xl md:text-3xl font-light italic mb-8">
              "Working with this team has transformed our business. Their attention to detail and commitment to excellence is unmatched in the industry."
            </blockquote>
            
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 rounded-full overflow-hidden mr-4">
                <img src={assets.logo2} alt="Client" className="w-full h-full object-contain" />
              </div>
              <div className="text-left">
                <p className="font-bold">Project</p>
                <p className="text-white/60">BY, Group 01</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section - Reused */}
      <NewsletterBox />
    </div>
  );
};

export default AboutPage;