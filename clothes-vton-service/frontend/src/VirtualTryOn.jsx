import React, { useState } from "react";
import axios from "axios";
import "./App.css";

const App = () => {
  const [personImage, setPersonImage] = useState(null);
  const [personImagePreview, setPersonImagePreview] = useState(null);
  const [garmentImages, setGarmentImages] = useState([]);
  const [garmentPreviews, setGarmentPreviews] = useState([]);
  const [selectedGarment, setSelectedGarment] = useState(null);
  const [outputImageUrl, setOutputImageUrl] = useState("");
  const [maskedImageUrl, setMaskedImageUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePersonImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPersonImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPersonImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGarmentImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setGarmentImages([...garmentImages, ...files]);
      
      // Create previews for all new files
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setGarmentPreviews(prev => [...prev, {
            id: Date.now() + Math.random().toString(36).substr(2, 9),
            src: reader.result,
            file: file,
            name: file.name
          }]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleTryOn = async (garment) => {
    if (!personImage) {
      setError("Please upload a person image first");
      return;
    }

    setSelectedGarment(garment);
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("personImage", personImage);
    formData.append("garmentImage", garment.file);

    try {
      const response = await axios.post("http://localhost:5050/api/tryon", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { outputImageUrl, maskedImageUrl } = response.data;
      setOutputImageUrl(outputImageUrl);
      setMaskedImageUrl(maskedImageUrl);
    } catch (error) {
      console.error("Error during virtual try-on:", error);
      setError("Failed to process virtual try-on. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeGarment = (id) => {
    setGarmentPreviews(garmentPreviews.filter(garment => garment.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">StyleFit</h1>
          <nav className="flex space-x-8">
            <a href="#" className="text-gray-900 hover:text-indigo-600">Home</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600">Collection</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600">Try-On</a>
            <a href="#" className="text-gray-900 hover:text-indigo-600">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Virtual Try-On Experience</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Upload Section */}
              <div className="lg:col-span-1 space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Photo</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="personImage"
                      className="hidden"
                      onChange={handlePersonImageChange}
                      accept="image/*"
                    />
                    <label
                      htmlFor="personImage"
                      className="cursor-pointer flex flex-col items-center justify-center py-6"
                    >
                      {personImagePreview ? (
                        <img
                          src={personImagePreview}
                          alt="Person preview"
                          className="max-h-64 max-w-full rounded"
                        />
                      ) : (
                        <>
                          <svg
                            className="w-12 h-12 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                            ></path>
                          </svg>
                          <p className="mt-2 text-sm text-gray-600">
                            Click to upload your photo
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            (PNG, JPG up to 10MB)
                          </p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Garments</h3>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                    <input
                      type="file"
                      id="garmentImage"
                      className="hidden"
                      onChange={handleGarmentImageChange}
                      accept="image/*"
                      multiple
                    />
                    <label
                      htmlFor="garmentImage"
                      className="cursor-pointer flex flex-col items-center justify-center py-6"
                    >
                      <svg
                        className="w-12 h-12 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        ></path>
                      </svg>
                      <p className="mt-2 text-sm text-gray-600">
                        Click to upload garment images
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        (PNG, JPG up to 10MB)
                      </p>
                    </label>
                  </div>
                </div>

                {error && (
                  <div className="p-3 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}
              </div>

              {/* Middle Column - Garment Cards */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Your Garments</h3>
                
                {garmentPreviews.length === 0 ? (
                  <div className="bg-gray-50 rounded-lg p-8 text-center">
                    <p className="text-gray-500">No garments uploaded yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 max-h-96 overflow-y-auto p-2">
                    {garmentPreviews.map((garment) => (
                      <div
                        key={garment.id}
                        className={`bg-white border rounded-lg shadow-sm overflow-hidden ${
                          selectedGarment?.id === garment.id ? "ring-2 ring-indigo-500" : ""
                        }`}
                      >
                        <div className="relative h-48 w-full bg-gray-200">
                          <img
                            src={garment.src}
                            alt={garment.name}
                            className="h-full w-full object-contain p-2"
                          />
                          <button
                            onClick={() => removeGarment(garment.id)}
                            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-sm hover:bg-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                          </button>
                        </div>
                        <div className="p-3">
                          <h4 className="font-medium text-gray-900 truncate">
                            {garment.name}
                          </h4>
                          <button
                            onClick={() => handleTryOn(garment)}
                            className="mt-2 w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            disabled={loading}
                          >
                            {loading && selectedGarment?.id === garment.id
                              ? "Processing..."
                              : "Try On"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Right Column - Results */}
              <div className="lg:col-span-1">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Try-On Results</h3>
                
                {outputImageUrl ? (
                  <div className="space-y-4">
                    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-medium">Final Result</h4>
                      </div>
                      <div className="p-4">
                        <img
                          src={outputImageUrl}
                          alt="Output"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                    
                    <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-medium">Masked Image</h4>
                      </div>
                      <div className="p-4">
                        <img
                          src={maskedImageUrl}
                          alt="Masked"
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center h-64 flex items-center justify-center">
                    <p className="text-gray-500">
                      {loading
                        ? "Processing your virtual try-on..."
                        : "Select a garment and click 'Try On' to see results"}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="md:flex md:justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold">StyleFit</h2>
              <p className="mt-2 text-gray-400">Virtual try-on for your perfect look</p>
            </div>
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Shop</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">New Arrivals</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Collections</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Trending</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Sale</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Support</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">Help Center</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Contact Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Returns & Exchanges</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Shipping Info</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Company</h3>
                <ul className="mt-4 space-y-2">
                  <li><a href="#" className="text-gray-300 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Privacy Policy</a></li>
                  <li><a href="#" className="text-gray-300 hover:text-white">Terms of Service</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-8 border-t border-gray-700 pt-8 md:flex md:items-center md:justify-between">
            <p className="text-gray-400 text-sm">&copy; 2025 StyleFit. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Facebook</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;