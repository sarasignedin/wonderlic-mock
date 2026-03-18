import "dotenv/config";
import express from "express";
import cors from "cors";
import questionsRouter from "./routes/questions.js";

const app = express();
const PORT = process.env.PORT || 3001;

// ─── MIDDLEWARE ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    "http://localhost:3000",  // React dev server
    "http://localhost:5173",  // Vite dev server
    /\.vercel\.app$/,         // Vercel deployments
    /\.netlify\.app$/,        // Netlify deployments
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ─── REQUEST LOGGING ──────────────────────────────────────────────────────────
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// ─── ROUTES ───────────────────────────────────────────────────────────────────
app.use("/api/questions", questionsRouter);

// ─── HEALTH CHECK ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Wonderlic Mock — Question Generation API",
    version: "1.0.0",
    anthropic_key_set: !!process.env.ANTHROPIC_API_KEY,
    endpoints: {
      "GET /api/questions/quick":                "Generate full question set for Quick mode (25 cognitive)",
      "GET /api/questions/full":                 "Generate full question set for Full mode (50 cognitive + motivation + personality)",
      "GET /api/questions/category/:category":   "Generate questions for a single category (?count=5)",
      "GET /api/questions/info/distribution":    "View question distribution config",
    },
  });
});

app.get("/", (req, res) => {
  res.redirect("/health");
});

// ─── 404 HANDLER ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.path} not found` });
});

// ─── ERROR HANDLER ─────────────────────────────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", message: err.message });
});

// ─── START ────────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`
  🍉 Wonderlic Mock — Question Generation API
  ─────────────────────────────────────────
  Server:   http://localhost:${PORT}
  Health:   http://localhost:${PORT}/health
  Quick Qs: http://localhost:${PORT}/api/questions/quick
  Full Qs:  http://localhost:${PORT}/api/questions/full

  Anthropic key: ${process.env.ANTHROPIC_API_KEY ? "✅ Set" : "❌ Missing — add to .env"}
  `);
});
