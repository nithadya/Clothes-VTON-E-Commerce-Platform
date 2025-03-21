// VTon.jsx
import React, { useState, useEffect } from "react";
import { Box, Image, Text, Spinner, Grid, Button } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { toaster } from "@/components/ui/toaster";
import Title from "../components/Title";

const MotionBox = motion(Box);

const VTon = () => {
  const { productId } = useParams();
  const [productData, setProductData] = useState(null);
  const [personImage, setPersonImage] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  // Handle image upload and try-on process
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toaster.error({ title: "Error", description: "Please upload a valid image file" });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toaster.error({ title: "Error", description: "File size exceeds 5MB" });
      return;
    }

    setLoading(true);
    const reader = new FileReader();
    
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
          setResultImage(data.outputImageUrl);
          toaster.success({
            title: "Success!",
            description: "Virtual try-on completed",
          });
        } else {
          throw new Error(data.error || "Try-on failed");
        }
      } catch (err) {
        toaster.error({
          title: "Error",
          description: err.message || "Failed to process try-on",
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
    }
  };

  if (error) {
    return <Text p={4} color="red.500">{error}</Text>;
  }

  if (!productData) {
    return <Spinner size="xl" m={4} />;
  }

  return (
    <div className="my-0">
      <div className="text-center py-8 text-3xl">
        <Title text1={"VIRTUAL"} text2={"TRY ON"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Try on your favorite clothes virtually!
        </p>
      </div>

      <Grid
        templateColumns={{ base: "1fr", md: "1fr 1fr 1fr" }}
        gap={6}
        p={6}
        maxWidth="1200px"
        mx="auto"
      >
        {/* Product Images */}
        <MotionBox
          borderWidth="2px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="md"
          height="400px"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
            Product Images
          </Text>
          <Image
            src={productData.image[0]}
            boxSize="100%"
            objectFit="cover"
            alt={productData.name}
          />
        </MotionBox>

        {/* Upload Image */}
        <MotionBox
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="md"
          height="400px"
          position="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
            Your Image
          </Text>
          {personImage ? (
            <Image
              src={personImage}
              boxSize="100%"
              objectFit="cover"
              borderRadius="md"
            />
          ) : (
            <Text color="gray.500">Upload your image</Text>
          )}
          <Button
            className="flex items-center gap-3 bg-black text-white hover:bg-zinc-950"
            onClick={() => document.getElementById("image-upload").click()}
            position="absolute"
            bottom="10px"
            left="0"
            right="0"
            margin="0 auto"
            width="50%"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
              />
            </svg>
            Upload Image
          </Button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: "none" }}
          />
        </MotionBox>

        {/* Try-on Result */}
        <MotionBox
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          p={4}
          boxShadow="md"
          height="400px"
          position="relative"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Text fontSize="lg" fontWeight="bold" color="gray.700" mb={2}>
            Try-on Result
          </Text>
          {loading ? (
            <Spinner size="xl" />
          ) : resultImage ? (
            <Box position="relative" height="100%">
              <Image
                src={resultImage}
                boxSize="100%"
                objectFit="cover"
                borderRadius="md"
              />
              <Button
                className="flex items-center gap-3 bg-black text-white hover:bg-zinc-950"
                onClick={downloadImage}
                position="absolute"
                bottom="20px"
                left="0"
                right="0"
                margin="0 auto"
                width="55%"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
                  />
                </svg>
                Download
              </Button>
            </Box>
          ) : (
            <Text color="gray.500">Result will appear here</Text>
          )}
        </MotionBox>
      </Grid>
    </div>
  );
};

export default VTon;