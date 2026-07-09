import "dotenv/config";
import express from "express";
import cors from "cors";
import { extractAll } from "./aiExtractor.js";
import { validateBatch } from "./validators.js";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors()); // allow the Vite frontend (different origin) to call this
app.use(express.json({ limit: "20mb" })); // CSVs can be large

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/extract", async (req, res) => {
  try {
    const rawRows: Record<string, any>[] = req.body.rows;

    if (!Array.isArray(rawRows) || rawRows.length === 0) {
      return res.status(400).json({ error: "No rows provided" });
    }

    const aiResults = await extractAll(rawRows);
    const validated = validateBatch(aiResults);

    res.json(validated);
  } catch (err) {
    console.error("Extract API error:", err);
    res.status(500).json({ error: "Failed to process CSV" });
  }
});

app.listen(PORT, () => {
  console.log(`GrowEasy CSV backend running on http://localhost:${PORT}`);
});
