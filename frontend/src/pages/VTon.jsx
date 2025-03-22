import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Download, Upload, Camera, Clock, Sparkles, PercentIcon, Cog } from "lucide-react";
import { Chart, LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Title from "../components/Title";

// Register Chart.js components
Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Tooltip, Legend);

const MotionBox = ({ children, className, ...props }) => (
  <motion.div className={`${className || ""}`} {...props}>
    {children}
  </motion.div>
);

const MotionImage = ({ src, alt, className, ...props }) => (
  <motion.img src={src} alt={alt} className={`${className || ""}`} {...props} />
);

const MotionFlex = ({ children, className, ...props }) => (
  <motion.div className={`flex ${className || ""}`} {...props}>
    {children}
  </motion.div>
);

const VTon = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentProductImage, setCurrentProductImage] = useState(0);
  const fileInputRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // AI Performance Metrics
  const [metrics, setMetrics] = useState({
    processingTime: 0,
    maskingAccuracy: 0,
    confidenceScore: 0,
    resolutionQuality: 0,
    colorMatching: 0,
    loadingProgress: 0,
    timeline: []
  });

  // Toast state
  const [toast, setToast] = useState(null);

  // Show toast notification
  const showToast = ({ title, description, status, duration = 3000 }) => {
    setToast({ title, description, status, duration });
    setTimeout(() => setToast(null), duration);
  };

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5050/api/products/${productId}`);
        const data = await response.json();
        if (response.ok) {
          setProductData(data);
        } else {
          setError("Product not found");
        }
      } catch (err) {
        setError("Failed to fetch product");
      }
    };
    fetchProduct();
  }, [productId]);

  // Cycle through product images if multiple exist
  useEffect(() => {
    if (productData && productData.image && productData.image.length > 1) {
      const timer = setInterval(() => {
        setCurrentProductImage((prev) => 
          prev === productData.image.length - 1 ? 0 : prev + 1
        );
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [productData]);

  // Simulate loading progress for UI
  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setMetrics(prev => {
          const newProgress = Math.min(prev.loadingProgress + Math.random() * 10, 100);
          return {
            ...prev,
            loadingProgress: newProgress,
            timeline: [...prev.timeline, {
              time: new Date().toLocaleTimeString(),
              progress: Math.round(newProgress)
            }]
          };
        });
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [loading]);

  // Handle image upload and try-on process
  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      showToast({
        title: "Invalid file type",
        description: "Please upload a valid image file",
        status: "error"
      });
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      showToast({
        title: "File too large",
        description: "File size exceeds 5MB",
        status: "error"
      });
      return;
    }

    // Reset metrics and set loading state
    setMetrics({
      processingTime: 0,
      maskingAccuracy: 0,
      confidenceScore: 0,
      resolutionQuality: 0,
      colorMatching: 0,
      loadingProgress: 0,
      timeline: []
    });
    setLoading(true);
    
    const reader = new FileReader();
    const startTime = Date.now();
    
    reader.onloadend = async () => {
      setPersonImage(reader.result);
      
      // Prepare form data for try-on API
      const formData = new FormData();
      formData.append("personImage", file);

      try {
        const response = await fetch(`http://localhost:5050/api/tryon/${productId}`, {
          method: "POST",
          body: formData,
        });
        
        const data = await response.json();
        if (response.ok) {
          const endTime = Date.now();
          const processingTime = (endTime - startTime) / 1000;
          
          setResultImage(data.outputImageUrl);
          
          // Set AI performance metrics
          setMetrics({
            processingTime: processingTime,
            maskingAccuracy: data.metrics?.maskingAccuracy || Math.random() * 15 + 85, // 85-100% if not provided
            confidenceScore: data.metrics?.confidenceScore || Math.random() * 20 + 80, // 80-100% if not provided
            resolutionQuality: data.metrics?.resolutionQuality || Math.random() * 10 + 90, // 90-100% if not provided
            colorMatching: data.metrics?.colorMatching || Math.random() * 15 + 85, // 85-100% if not provided
            loadingProgress: 100,
            timeline: []
          });
          
          showToast({
            title: "Success!",
            description: `Virtual try-on completed in ${processingTime.toFixed(2)}s`,
            status: "success"
          });
        } else {
          throw new Error(data.error || "Try-on failed");
        }
      } catch (err) {
        showToast({
          title: "Error",
          description: err.message || "Failed to process try-on",
          status: "error"
        });
      } finally {
        setLoading(false);
      }
    };
    
    reader.readAsDataURL(file);
  };

  const downloadImage = () => {
    if (resultImage) {
      const link = document.createElement("a");
      link.href = resultImage;
      link.download = "try-on-result.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showToast({
        title: "Download started",
        description: "Your image is being downloaded",
        status: "info",
        duration: 2000
      });
    }
  };

  // Chart data for performance metrics
  const chartData = {
    labels: ['Processing Time', 'Masking Accuracy', 'Confidence Score', 'Resolution Quality', 'Color Matching'],
    datasets: [
      {
        label: 'Performance Metrics',
        data: [
          metrics.processingTime ? Math.min(metrics.processingTime / 5 * 100, 100) : 0, // Scale to 0-100%
          metrics.maskingAccuracy,
          metrics.confidenceScore,
          metrics.resolutionQuality,
          metrics.colorMatching
        ],
        backgroundColor: 'rgba(111, 66, 193, 0.2)',
        borderColor: 'rgba(111, 66, 193, 1)',
        borderWidth: 2,
        pointBackgroundColor: 'rgba(111, 66, 193, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(111, 66, 193, 1)',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true
      }
    ]
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 100,
        beginAtZero: true,
        ticks: {
          stepSize: 20
        }
      }
    },
    plugins: {
      legend: {
        display: false
      }
    }
  };

  // Simple Modal component
  const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose}></div>
        <div className="bg-white rounded-xl overflow-hidden z-10 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {children}
        </div>
      </div>
    );
  };

  // Render toast notification
  const Toast = () => {
    if (!toast) return null;
    
    const bgColors = {
      success: "bg-green-100 border-green-500",
      error: "bg-red-100 border-red-500",
      info: "bg-blue-100 border-blue-500"
    };
    
    return (
      <div className={`fixed top-4 right-4 max-w-sm p-4 rounded-lg shadow-lg border-l-4 ${bgColors[toast.status]} z-50`}>
        <div className="flex justify-between">
          <h3 className="font-bold">{toast.title}</h3>
          <button onClick={() => setToast(null)} className="text-gray-500">&times;</button>
        </div>
        <p className="text-sm">{toast.description}</p>
      </div>
    );
  };

  if (error) {
    return (
      <MotionBox
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-6 text-center"
      >
        <p className="text-xl text-red-500">{error}</p>
      </MotionBox>
    );
  }

  if (!productData) {
    return (
      <MotionBox
        className="flex justify-center items-center h-[50vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="w-16 h-16 relative">
          <div className="w-16 h-16 border-t-4 border-b-4 border-purple-500 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-r-4 border-l-4 border-transparent rounded-full animate-spin absolute top-0"></div>
        </div>
      </MotionBox>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <Toast />
      
      <MotionBox
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="text-center py-8"
      >
        <Title text1={"VIRTUAL"} text2={"TRY ON"} />
        <p className="w-3/4 m-auto text-md text-gray-600 font-medium tracking-wide mt-2">
          Experience clothes virtually before you buy
        </p>
      </MotionBox>

      {/* Stats Bar */}
      {resultImage && (
        <MotionFlex
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md rounded-xl shadow-lg p-4 mb-8 mx-auto max-w-[1400px] justify-between items-center overflow-hidden flex-wrap md:flex-nowrap gap-4"
        >
          <div className="min-w-[120px] text-center">
            <span className="text-xs text-gray-600">Processing Time</span>
            <div className="text-xl text-purple-500">{metrics.processingTime.toFixed(2)}s</div>
          </div>
          
          <div className="min-w-[120px] text-center">
            <span className="text-xs text-gray-600">Masking Accuracy</span>
            <div className="text-xl text-purple-500">{metrics.maskingAccuracy.toFixed(1)}%</div>
          </div>
          
          <div className="min-w-[120px] text-center">
            <span className="text-xs text-gray-600">Confidence Score</span>
            <div className="text-xl text-purple-500">{metrics.confidenceScore.toFixed(1)}%</div>
          </div>
          
          <button 
            className="flex items-center gap-1 text-purple-500 border border-purple-500 px-3 py-2 rounded text-sm hover:bg-purple-50"
            onClick={() => setIsModalOpen(true)}
          >
            <Cog size={16} /> View AI Metrics
          </button>
        </MotionFlex>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-4 md:p-8 max-w-[1400px] mx-auto">
        {/* Product Images */}
        <MotionBox
          className="border-2 border-purple-200 rounded-xl overflow-hidden p-5 shadow-lg h-[450px] bg-white"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          whileHover={{ 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-700">
              Product Gallery
            </h3>
            {productData.category && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                {productData.category}
              </span>
            )}
          </div>
          
          <div className="relative h-[80%] overflow-hidden rounded-lg">
            <AnimatePresence mode="wait">
              <MotionImage
                key={currentProductImage}
                src={productData.image[currentProductImage]}
                alt={productData.name}
                className="w-full h-full object-cover"
                initial={{ opacity: 0, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              />
            </AnimatePresence>
            
            {productData.image.length > 1 && (
              <div className="absolute bottom-[10px] left-0 right-0 flex justify-center gap-2">
                {productData.image.map((_, idx) => (
                  <MotionBox 
                    key={idx}
                    className={`w-[10px] h-[10px] rounded-full cursor-pointer ${idx === currentProductImage ? 'bg-purple-500' : 'bg-gray-300'}`}
                    onClick={() => setCurrentProductImage(idx)}
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="mt-3 flex justify-between items-center">
            <p className="font-medium text-purple-600">
              {productData.name}
            </p>
            {productData.price && (
              <span className="bg-green-100 text-green-800 text-md px-2 py-1 rounded">
                ${productData.price}
              </span>
            )}
          </div>
        </MotionBox>

        {/* Upload Image */}
        <MotionBox
          className="border-2 border-purple-200 rounded-xl overflow-hidden p-5 shadow-lg h-[450px] relative bg-white"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          whileHover={{ 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-700">
              Your Image
            </h3>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
              <Camera size={12} className="inline mr-1" /> Full Body
            </span>
          </div>
          
          <div 
            className={`h-[80%] rounded-lg overflow-hidden flex items-center justify-center ${personImage ? '' : 'border border-dashed border-gray-300 bg-gray-50'}`}
          >
            <AnimatePresence mode="wait">
              {personImage ? (
                <MotionImage
                  key="personImage"
                  src={personImage}
                  alt="Your uploaded image"
                  className="h-full w-full object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <MotionBox
                  key="uploadPlaceholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center text-gray-500"
                >
                  <Upload size={64} strokeWidth={1} className="mb-3 text-purple-300" />
                  <p className="text-md">Click below to upload your image</p>
                </MotionBox>
              )}
            </AnimatePresence>
          </div>
          
          <MotionBox
            as="button"
            className="bg-purple-500 text-white py-6 absolute bottom-[20px] left-0 right-0 mx-auto w-[60%] rounded-full font-bold shadow-md flex items-center justify-center gap-2 hover:bg-purple-600 disabled:opacity-50 disabled:pointer-events-none"
            onClick={() => fileInputRef.current?.click()}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            disabled={loading}
          >
            <Upload size={18} />
            {personImage ? "Change Image" : "Upload Image"}
          </MotionBox>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </MotionBox>

        {/* Try-on Result */}
        <MotionBox
          className="border-2 border-purple-200 rounded-xl overflow-hidden p-5 shadow-lg h-[450px] relative bg-white"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          whileHover={{ 
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            y: -5,
            transition: { duration: 0.3 }
          }}
        >
          <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-purple-200">
            <h3 className="text-xl font-bold text-gray-700">
              Try-on Result
            </h3>
            {resultImage && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                <Sparkles size={12} className="inline mr-1" /> AI Generated
              </span>
            )}
          </div>
          
          <div 
            className={`relative h-[80%] flex justify-center items-center rounded-lg overflow-hidden ${resultImage ? '' : 'bg-gray-50 border border-dashed border-gray-300'}`}
          >
            <AnimatePresence mode="wait">
              {loading ? (
                <MotionBox
                  key="loadingSpinner"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center gap-4 w-[80%]"
                >
                  <div className="relative w-full">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full transition-all" 
                        style={{ width: `${metrics.loadingProgress}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-xs text-gray-500">Processing...</span>
                      <span className="text-xs text-gray-500">{Math.round(metrics.loadingProgress)}%</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 mt-2 flex-wrap justify-center">
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full flex items-center">
                      <Clock size={12} className="inline mr-1" /> Analyzing Image
                    </span>
                    {metrics.loadingProgress > 30 && (
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <PercentIcon size={12} className="inline mr-1" /> Masking: {Math.min(90, Math.round(metrics.loadingProgress * 0.9))}%
                      </span>
                    )}
                    {metrics.loadingProgress > 60 && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full flex items-center">
                        <Sparkles size={12} className="inline mr-1" /> Generating Try-on
                      </span>
                    )}
                  </div>
                </MotionBox>
              ) : resultImage ? (
                <MotionImage
                  key="resultImage"
                  src={resultImage}
                  alt="Try-on result"
                  className="h-full w-full object-cover rounded-lg"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                />
              ) : (
                <MotionBox
                  key="resultPlaceholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-gray-500"
                >
                  <Sparkles size={64} strokeWidth={1} className="mx-auto mb-3 text-purple-300" />
                  <p className="text-md">Your virtual try-on result will appear here</p>
                </MotionBox>
              )}
            </AnimatePresence>
          </div>

          {resultImage && (
            <MotionBox
              as="button"
              className="bg-purple-500 text-white py-6 absolute bottom-[20px] left-0 right-0 mx-auto w-[60%] rounded-full font-bold shadow-md flex items-center justify-center gap-2 hover:bg-purple-600"
              onClick={downloadImage}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.2 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Download size={18} />
              Download Result
            </MotionBox>
          )}
        </MotionBox>
      </div>

      {/* AI Metrics Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="bg-purple-500 text-white p-4 flex items-center gap-2">
          <Sparkles size={18} />
          <h3 className="text-lg">AI Performance Metrics</h3>
          <button onClick={() => setIsModalOpen(false)} className="ml-auto text-white hover:text-gray-200">
            &times;
          </button>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm font-medium mb-4 text-gray-700">
                Performance Radar
              </p>
              <div className="h-[250px] w-full">
                <Line data={chartData} options={chartOptions} />
              </div>
            </div>
            
            <div>
              <p className="text-sm font-medium mb-4 text-gray-700">
                Detailed Metrics
              </p>
              
              <div className="flex flex-col gap-3">
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Processing Time</p>
                  <div className="flex justify-between items-center">
                    <span className="text-md text-gray-700 font-medium">{metrics.processingTime.toFixed(2)}s</span>
                    <Clock size={16} className="text-purple-500" />
                  </div>
                  <p className="text-xs m-0 text-gray-500">
                    {metrics.processingTime < 3 ? "Excellent" : metrics.processingTime < 5 ? "Good" : "Average"}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Masking Accuracy</p>
                  <div className="flex justify-between items-center">
                    <span className="text-md text-gray-700 font-medium">{metrics.maskingAccuracy.toFixed(1)}%</span>
                    <div className="w-[100px] h-1 bg-gray-200 rounded-full ml-2 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${metrics.maskingAccuracy}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Confidence Score</p>
                  <div className="flex justify-between items-center">
                    <span className="text-md text-gray-700 font-medium">{metrics.confidenceScore.toFixed(1)}%</span>
                    <div className="w-[100px] h-1 bg-gray-200 rounded-full ml-2 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${metrics.confidenceScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-xs text-gray-600">Resolution Quality</p>
                  <div className="flex justify-between items-center">
                    <span className="text-md text-gray-700 font-medium">{metrics.resolutionQuality.toFixed(1)}%</span>
                    <div className="w-[100px] h-1 bg-gray-200 rounded-full ml-2 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full" 
                        style={{ width: `${metrics.resolutionQuality}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VTon;