import path from "path";
import fs from "fs/promises";
import { createServer } from "./index";
import * as express from "express";
import { initializeDatabase } from "./database/database.js";

const __dirname = import.meta.dirname;
const distPath = path.join(__dirname, "../spa");
const uploadsPath = path.join(__dirname, "../public/uploads");

// التأكد من وجود مجلد الرفع (لحفظ الصور أونلاين)
fs.mkdir(uploadsPath, { recursive: true }).then(() => {
  console.log("📁 Uploads directory ready:", uploadsPath);
}).catch((err) => {
  console.warn("⚠️  Uploads directory creation failed:", err?.message ?? err);
});

// تهيئة قاعدة البيانات عند التشغيل لحفظ التعديلات والصور أونلاين
initializeDatabase().then(() => {
  console.log("🗄️  Database ready for admin data");
}).catch((err) => {
  console.warn("⚠️  Database init failed, admin data will use JSON files:", err?.message ?? err);
});

const app = createServer();
const port = process.env.PORT || 3000;

// Serve static files
app.use(express.static(distPath));

// Serve uploaded images
app.use("/uploads", express.static(uploadsPath));

// Handle React Router - serve index.html for all non-API routes
app.get("*", (req, res) => {
  // Don't serve index.html for API routes
  if (req.path.startsWith("/api/") || req.path.startsWith("/health")) {
    return res.status(404).json({ error: "API endpoint not found" });
  }

  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(port, () => {
  console.log(`🚀 Fusion Starter server running on port ${port}`);
  console.log(`📱 Frontend: http://localhost:${port}`);
  console.log(`🔧 API: http://localhost:${port}/api`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 Received SIGTERM, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 Received SIGINT, shutting down gracefully");
  process.exit(0);
});
