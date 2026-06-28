import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs/promises";
import { handleDemo } from "./routes/demo";
import paymentsRouter from "./routes/payments";
import adminDataRouter from "./routes/admin-data";
import { handleImageUpload, handleMultipleImageUpload, handleVideoUpload } from "./routes/upload";
import { resolveDir, uploadsDir } from "./utils/paths.js";

const __dirname = resolveDir(import.meta.url, ["server"]);

export function createServer() {
  const app = express();

  // Middleware with increased limits
  app.use(cors());
  app.use((req, res, next) => {
    if (req.originalUrl.startsWith('/api/payments/webhook')) {
      next();
    } else {
      express.json({ limit: "100mb" })(req, res, next);
    }
  });
  app.use(express.urlencoded({ extended: true, limit: "100mb" }));

  const uploadsPath = uploadsDir();
  fs.mkdir(uploadsPath, { recursive: true }).catch(() => {});
  app.use("/uploads", express.static(uploadsPath));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);
  app.use("/api/payments", paymentsRouter);
  app.use("/api/admin-data", adminDataRouter);

  // Image upload routes
  app.post("/api/upload/image", handleImageUpload);
  app.post("/api/upload/images", express.json({ limit: "100mb" }), handleMultipleImageUpload);
  
  // Video upload routes
  app.post("/api/upload/video", express.raw({ limit: "200mb", type: "video/*" }), handleVideoUpload);

  return app;
}
