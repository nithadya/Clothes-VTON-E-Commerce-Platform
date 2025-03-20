import React, { useState } from 'react';
import axios from 'axios';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';
import { PlusIcon, TrashIcon, ArrowUpCircleIcon } from 'lucide-react';

// Form validation
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.name.trim()) errors.name = 'Product name is required';
  if (!formData.description.trim()) errors.description = 'Product description is required';
  if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required';
  if (formData.sizes.length === 0) errors.sizes = 'At least one size must be selected';
  if (!formData.images.some(img => img)) errors.images = 'At least one image is required';
  
  return errors;
};

const ProductAdd = ({ token, onSuccess }) => {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Men',
    subCategory: 'Topwear',
    bestseller: false,
    sizes: [],
    images: [null, null, null, null]
  });
  
  // UI states
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState([]);

  // Category options
  const categories = [
    { value: 'Men', label: 'Men' },
    { value: 'Women', label: 'Women' },
    { value: 'Kids', label: 'Kids' }
  ];
  
  const subCategories = {
    Men: [
      { value: 'Topwear', label: 'Topwear' },
      { value: 'Bottomwear', label: 'Bottomwear' },
      { value: 'Winterwear', label: 'Winterwear' },
      { value: 'Footwear', label: 'Footwear' },
      { value: 'Accessories', label: 'Accessories' }
    ],
    Women: [
      { value: 'Topwear', label: 'Topwear' },
      { value: 'Bottomwear', label: 'Bottomwear' },
      { value: 'Winterwear', label: 'Winterwear' },
      { value: 'Footwear', label: 'Footwear' },
      { value: 'Accessories', label: 'Accessories' }
    ],
    Kids: [
      { value: 'Topwear', label: 'Topwear' },
      { value: 'Bottomwear', label: 'Bottomwear' },
      { value: 'Footwear', label: 'Footwear' }
    ]
  };
  
  const availableSizes = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
    { value: 'XXL', label: 'XXL' }
  ];

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Handle size selection
  const handleSizeToggle = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size]
    }));
    
    // Clear size error if it exists
    if (errors.sizes) {
      setErrors(prev => ({
        ...prev,
        sizes: undefined
      }));
    }
  };

  // Handle image upload with preview
  const handleImageChange = (file, index) => {
    if (!file) return;
    
    // Update image in form data
    const newImages = [...formData.images];
    newImages[index] = file;
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    // Update preview
    const newPreviews = [...imagePreview];
    newPreviews[index] = URL.createObjectURL(file);
    setImagePreview(newPreviews);
    
    // Clear image error if it exists
    if (errors.images) {
      setErrors(prev => ({
        ...prev,
        images: undefined
      }));
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...formData.images];
    newImages[index] = null;
    
    setFormData(prev => ({
      ...prev,
      images: newImages
    }));
    
    // Update preview
    const newPreviews = [...imagePreview];
    if (newPreviews[index]) URL.revokeObjectURL(newPreviews[index]);
    newPreviews[index] = null;
    setImagePreview(newPreviews);
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      
      // Show toast for the first error
      const firstError = Object.values(validationErrors)[0];
      toast.error(firstError);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create form data for submission
      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('category', formData.category);
      submitData.append('subCategory', formData.subCategory);
      submitData.append('bestseller', formData.bestseller.toString());
      submitData.append('sizes', JSON.stringify(formData.sizes));
      
      // Append images with appropriate keys
      formData.images.forEach((image, index) => {
        if (image) {
          submitData.append(`image${index + 1}`, image);
        }
      });
      
      const response = await axios.post(
        `${backendUrl}/api/product/add`, 
        submitData, 
        { headers: { token } }
      );
      
      if (response.data.success) {
        toast.success(response.data.message || 'Product added successfully!');
        
        // Clear form
        setFormData({
          name: '',
          description: '',
          price: '',
          category: 'Men',
          subCategory: 'Topwear',
          bestseller: false,
          sizes: [],
          images: [null, null, null, null]
        });
        setImagePreview([]);
        
        // Callback if provided
        if (onSuccess) onSuccess(response.data.product);
      } else {
        toast.error(response.data.message || 'Failed to add product');
      }
    } catch (error) {
      console.error('Add product error:', error);
      toast.error(error.response?.data?.message || error.message || 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8">
        <div className="border-b pb-4">
          <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
          <p className="text-gray-500 mt-1">Fill in the details to add a new product to your inventory</p>
        </div>

        {/* Image Upload Section */}
        <div className="space-y-4">
          <label className="block font-medium text-gray-700">Product Images</label>
          <p className="text-sm text-gray-500 mb-2">Upload up to 4 images. First image will be used as the main product image.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="relative">
                {formData.images[index] ? (
                  <div className="relative h-32 w-full rounded-lg overflow-hidden group">
                    <img 
                      src={imagePreview[index]} 
                      alt={`Product ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="p-1 bg-red-500 rounded-full text-white hover:bg-red-600"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <ArrowUpCircleIcon className="w-8 h-8 text-gray-400 mb-1" />
                      <p className="text-xs text-gray-500">Upload</p>
                    </div>
                    <input 
                      type="file" 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => handleImageChange(e.target.files[0], index)} 
                    />
                  </label>
                )}
                
                {index === 0 && (
                  <span className="absolute top-0 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-tl-lg rounded-br-lg">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
          
          {errors.images && (
            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
          )}
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="block font-medium text-gray-700 mb-1">
              Product Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter product name"
              className={`w-full px-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          {/* Product Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="block font-medium text-gray-700 mb-1">
              Product Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              placeholder="Describe your product with details like material, fit, care instructions..."
              className={`w-full px-4 py-2 border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Subcategory - Dynamic based on Category */}
          <div>
            <label htmlFor="subCategory" className="block font-medium text-gray-700 mb-1">
              Subcategory
            </label>
            <select
              id="subCategory"
              name="subCategory"
              value={formData.subCategory}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {subCategories[formData.category].map(subCategory => (
                <option key={subCategory.value} value={subCategory.value}>
                  {subCategory.label}
                </option>
              ))}
            </select>
          </div>

          {/* Price */}
          <div>
            <label htmlFor="price" className="block font-medium text-gray-700 mb-1">
              Price ($)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500">$</span>
              </div>
              <input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                className={`w-full pl-8 pr-4 py-2 border ${errors.price ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
            </div>
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>

          {/* Bestseller Toggle */}
          <div className="flex items-center">
            <label htmlFor="bestseller" className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  id="bestseller"
                  name="bestseller"
                  type="checkbox"
                  className="sr-only"
                  checked={formData.bestseller}
                  onChange={handleChange}
                />
                <div className={`block w-14 h-8 rounded-full ${formData.bestseller ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition transform ${formData.bestseller ? 'translate-x-6' : ''}`}></div>
              </div>
              <div className="ml-3 font-medium text-gray-700">Mark as Bestseller</div>
            </label>
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block font-medium text-gray-700 mb-2">
            Available Sizes
          </label>
          <div className="flex flex-wrap gap-3">
            {availableSizes.map((size) => (
              <div
                key={size.value}
                onClick={() => handleSizeToggle(size.value)}
                className={`px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                  formData.sizes.includes(size.value)
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {size.label}
              </div>
            ))}
          </div>
          {errors.sizes && (
            <p className="text-red-500 text-sm mt-1">{errors.sizes}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full md:w-auto px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding Product...
              </span>
            ) : (
              <span className="flex items-center">
                <PlusIcon className="w-5 h-5 mr-2" />
                Add Product
              </span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductAdd;