// ─── API SERVICE ──────────────────────────────────────────────────────────────
// Connects the React frontend to the question generation backend

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:3001";

export async function fetchQuestionsForMode(mode) {
  const res = await fetch(`${API_BASE}/api/questions/${mode}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Failed to fetch questions: ${res.status}`);
  }
  return res.json();
}

export async function fetchCategoryQuestions(category, count = 5) {
  const res = await fetch(`${API_BASE}/api/questions/category/${category}?count=${count}`);
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || `Failed to fetch ${category} questions: ${res.status}`);
  }
  return res.json();
}

export async function checkHealth() {
  const res = await fetch(`${API_BASE}/health`);
  return res.json();
}
