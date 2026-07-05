import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { scanLedger, isGeminiInitialized } from "./scan";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

// Set high body parsers limits for base64 image scanning
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// API endpoint to scan ledger document
app.post("/api/scan-ledger", async (req, res) => {
  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ error: "Missing image data in request body." });
    }

    const data = await scanLedger(image);
    return res.json({ success: true, data });
  } catch (error: any) {
    console.error("Ledger scan error:", error);
    return res.status(500).json({ success: false, error: error.message || "Failed to scan ledger document" });
  }
});

// Serve health status
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", geminiConfigured: isGeminiInitialized() });
});

// Vite middleware for development or serving index.html in production
export async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}
