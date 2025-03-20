import express from "express";
import multer from "multer";
import fs from "fs/promises";
import cors from "cors";

const app = express();
const PORT = 5050;

// Middleware
app.use(cors());
app.use(express.json());

// Multer for handling file uploads
const upload = multer({ dest: "uploads/" });

// Route to handle virtual try-on
app.post("/api/tryon", upload.single("personImage"), async (req, res) => {
  try {
    const { garmentImageUrl } = req.body;

    // Extract uploaded person image
    const personImagePath = req.file.path;
    const personImage = await fs.readFile(personImagePath);

    // Fetch the garment image from the provided URL
    const garmentImageResponse = await fetch(garmentImageUrl);
    if (!garmentImageResponse.ok) {
      throw new Error(`Failed to fetch garment image: ${garmentImageResponse.statusText}`);
    }
    const garmentImageBuffer = Buffer.from(await garmentImageResponse.arrayBuffer());

    // Dynamically import the Gradio client
    const { client } = await import("@gradio/client");

    // Initialize Gradio client
    const appClient = await client("paroksh-mason/Virtual-Try-On");

    // Call the /tryon endpoint
    const result = await appClient.predict("/tryon", [
      personImage, // Blob | File | Buffer for "Human Mask"
      garmentImageBuffer, // Blob | File | Buffer for "Garment"
      "Hello!!",
      null,
      true,
      true,
      20,
      20,
    ]);

    // Extract URLs from the API response
    const [outputImageObj, maskedImageObj] = result.data;

    // Ensure the objects have valid `url` properties
    const outputImageUrl = outputImageObj?.url;
    const maskedImageUrl = maskedImageObj?.url;

    if (!outputImageUrl || typeof outputImageUrl !== "string") {
      throw new Error("Invalid or missing URL for output image");
    }

    if (!maskedImageUrl || typeof maskedImageUrl !== "string") {
      throw new Error("Invalid or missing URL for masked image");
    }

    // Return the URLs to the frontend
    res.json({ outputImageUrl, maskedImageUrl });
  } catch (error) {
    console.error("Error processing virtual try-on:", error);
    res.status(500).json({ error: "Failed to process virtual try-on" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});