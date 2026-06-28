import { RequestHandler } from "express";
import express from "express";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "../../public/uploads");
fs.mkdir(uploadsDir, { recursive: true }).catch(console.error);

// Middleware to handle file uploads
const upload = express.raw({ limit: "10mb", type: "image/*" });
const uploadVideo = express.raw({ limit: "100mb", type: "video/*" });

export const handleImageUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const extension = req.headers["content-type"]?.split("/")[1] || "jpg";
    const filename = `image_${timestamp}_${randomStr}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Save file
    await fs.writeFile(filepath, req.body);

    // Return URL
    const imageUrl = `/uploads/${filename}`;
    
    res.json({
      success: true,
      url: imageUrl,
      filename: filename
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
};

export const handleMultipleImageUpload: RequestHandler = async (req, res) => {
  try {
    // For multiple images, we'll accept JSON with base64 images
    const { images } = req.body;
    
    if (!images || !Array.isArray(images)) {
      return res.status(400).json({ error: "Invalid images array" });
    }

    const uploadedUrls: string[] = [];

    for (const imageData of images) {
      if (typeof imageData === "string" && imageData.startsWith("data:image")) {
        // Extract base64 data
        const base64Data = imageData.split(",")[1];
        const matches = imageData.match(/data:image\/(\w+);base64/);
        const extension = matches ? matches[1] : "jpg";
        
        const buffer = Buffer.from(base64Data, "base64");
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const filename = `image_${timestamp}_${randomStr}.${extension}`;
        const filepath = path.join(uploadsDir, filename);

        await fs.writeFile(filepath, buffer);
        uploadedUrls.push(`/uploads/${filename}`);
      } else if (typeof imageData === "string" && imageData.startsWith("http")) {
        // Already a URL, keep it
        uploadedUrls.push(imageData);
      }
    }

    res.json({
      success: true,
      urls: uploadedUrls
    });
  } catch (error) {
    console.error("Error uploading images:", error);
    res.status(500).json({ error: "Failed to upload images" });
  }
};

export const handleVideoUpload: RequestHandler = async (req, res) => {
  try {
    if (!req.body || req.body.length === 0) {
      return res.status(400).json({ error: "No file provided" });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const contentType = req.headers["content-type"] || "video/mp4";
    
    // Extract extension from content type or filename
    let extension = "mp4";
    if (contentType.includes("/")) {
      const parts = contentType.split("/");
      if (parts.length > 1) {
        extension = parts[1].split(";")[0].trim();
      }
    }
    
    // Validate extension
    const validExtensions = ["mp4", "webm", "ogg", "mov", "avi", "mkv"];
    if (!validExtensions.includes(extension.toLowerCase())) {
      extension = "mp4"; // Default to mp4 if extension is invalid
    }
    
    const filename = `video_${timestamp}_${randomStr}.${extension}`;
    const filepath = path.join(uploadsDir, filename);

    // Ensure directory exists
    await fs.mkdir(uploadsDir, { recursive: true });

    // Save file
    await fs.writeFile(filepath, req.body);

    // Return URL
    const videoUrl = `/uploads/${filename}`;
    
    res.json({
      success: true,
      url: videoUrl,
      filename: filename
    });
  } catch (error) {
    console.error("Error uploading video:", error);
    res.status(500).json({ 
      error: "Failed to upload video",
      details: error instanceof Error ? error.message : String(error)
    });
  }
};

