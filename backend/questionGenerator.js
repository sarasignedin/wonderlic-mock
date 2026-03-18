import Anthropic from "@anthropic-ai/sdk";
import { SYSTEM_PROMPT, CATEGORY_PROMPTS, DISTRIBUTION } from "../prompts/questions.js";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

// ─── GENERATE QUESTIONS FOR ONE CATEGORY ──────────────────────────────────────
async function generateCategory(category, count) {
  if (count === 0) return [];

  const promptFn = CATEGORY_PROMPTS[category];
  if (!promptFn) throw new Error(`Unknown category: ${category}`);

  const response = await client.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: promptFn(count) }],
  });

  const text = response.content[0].text.trim();

  // Strip markdown fences if present
  const clean = text.replace(/^```json\s*/i, "").replace(/```\s*$/, "").trim();

  let parsed;
  try {
    parsed = JSON.parse(clean);
  } catch (err) {
    console.error(`JSON parse error for ${category}:`, err.message);
    console.error("Raw response:", text.slice(0, 500));
    throw new Error(`Failed to parse ${category} questions from LLM response`);
  }

  if (!Array.isArray(parsed)) {
    throw new Error(`Expected array for ${category}, got ${typeof parsed}`);
  }

  // Add sequential IDs
  return parsed.map((q, i) => ({ ...q, category }));
}

// ─── GENERATE ALL QUESTIONS FOR A MODE ────────────────────────────────────────
export async function generateQuestionsForMode(mode) {
  const dist = DISTRIBUTION[mode];
  if (!dist) throw new Error(`Unknown mode: ${mode}`);

  const cogCategories = ["Dates", "Opposites", "Series", "Data", "Math", "Verbal", "Logic"];
  const motCategories = ["Motivation"];
  const perCategories = ["Personality"];

  // Generate all categories in parallel
  const categoryPromises = Object.entries(dist)
    .filter(([, count]) => count > 0)
    .map(([category, count]) => generateCategory(category, count));

  const results = await Promise.allSettled(categoryPromises);
  const categories = Object.keys(dist).filter((_, i) => dist[Object.keys(dist)[i]] > 0);

  const allQuestions = { cognitive: [], motivation: [], personality: [] };
  let idCounter = 1;

  results.forEach((result, i) => {
    const category = Object.entries(dist).filter(([, count]) => count > 0)[i][0];

    if (result.status === "rejected") {
      console.error(`Failed to generate ${category}:`, result.reason.message);
      return;
    }

    const questions = result.value.map((q) => ({ ...q, id: idCounter++ }));

    if (cogCategories.includes(category)) {
      allQuestions.cognitive.push(...questions);
    } else if (motCategories.includes(category)) {
      allQuestions.motivation.push(...questions);
    } else if (perCategories.includes(category)) {
      allQuestions.personality.push(...questions);
    }
  });

  // Shuffle cognitive questions
  allQuestions.cognitive = shuffle(allQuestions.cognitive);

  return allQuestions;
}

// ─── GENERATE A SINGLE CATEGORY (for on-demand refresh) ───────────────────────
export async function generateSingleCategory(category, count = 5) {
  const questions = await generateCategory(category, count);
  return questions.map((q, i) => ({ ...q, id: i + 1 }));
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
