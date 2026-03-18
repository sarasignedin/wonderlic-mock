import { Router } from "express";
import { generateQuestionsForMode, generateSingleCategory } from "../services/questionGenerator.js";
import { DISTRIBUTION } from "../prompts/questions.js";

const router = Router();

// ─── GET /api/questions/:mode ──────────────────────────────────────────────────
// Generate a full set of questions for a given mode (quick | full)
// Returns: { cognitive: [...], motivation: [...], personality: [...] }
router.get("/:mode", async (req, res) => {
  const { mode } = req.params;

  if (!["quick", "full"].includes(mode)) {
    return res.status(400).json({
      error: `Invalid mode '${mode}'. Must be 'quick' or 'full'.`,
    });
  }

  console.log(`[${new Date().toISOString()}] Generating questions for mode: ${mode}`);
  const startTime = Date.now();

  try {
    const questions = await generateQuestionsForMode(mode);
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

    console.log(`[${new Date().toISOString()}] Generated ${questions.cognitive.length} cognitive, ${questions.motivation.length} motivation, ${questions.personality.length} personality questions in ${elapsed}s`);

    res.json({
      mode,
      generated_at: new Date().toISOString(),
      elapsed_seconds: parseFloat(elapsed),
      counts: {
        cognitive: questions.cognitive.length,
        motivation: questions.motivation.length,
        personality: questions.personality.length,
      },
      questions,
    });
  } catch (err) {
    console.error("Question generation error:", err);
    res.status(500).json({
      error: "Failed to generate questions",
      message: err.message,
    });
  }
});

// ─── GET /api/questions/category/:category ─────────────────────────────────────
// Generate questions for a single category on demand
// Query params: ?count=5
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;
  const count = parseInt(req.query.count) || 5;

  const validCategories = ["Dates", "Opposites", "Series", "Data", "Math", "Verbal", "Logic", "Motivation", "Personality"];
  if (!validCategories.includes(category)) {
    return res.status(400).json({
      error: `Invalid category '${category}'.`,
      valid: validCategories,
    });
  }

  if (count < 1 || count > 20) {
    return res.status(400).json({ error: "count must be between 1 and 20" });
  }

  console.log(`[${new Date().toISOString()}] Generating ${count} ${category} questions`);

  try {
    const questions = await generateSingleCategory(category, count);
    res.json({
      category,
      count: questions.length,
      generated_at: new Date().toISOString(),
      questions,
    });
  } catch (err) {
    console.error("Category generation error:", err);
    res.status(500).json({
      error: `Failed to generate ${category} questions`,
      message: err.message,
    });
  }
});

// ─── GET /api/questions/distribution ──────────────────────────────────────────
// Returns the question distribution config for each mode
router.get("/info/distribution", (req, res) => {
  res.json({ distribution: DISTRIBUTION });
});

export default router;
