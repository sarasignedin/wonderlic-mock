# 🍉 Wonderlic Select Mock Test
### by Papaya Kiwi Consulting

A full-featured Wonderlic Select practice app built with React, backed by an LLM-powered question generation API using Claude. Every test run produces unique, dynamically generated questions across all 7 cognitive types plus motivation and personality sections.

---

## Features

- **3 complete sections** — Cognitive, Motivation, Personality
- **2 modes** — Quick (25 Qs / 6 min) or Full (50 Qs / 12 min)
- **LLM-generated questions** — Claude dynamically generates fresh questions every run via the backend API
- **Real Wonderlic formats** — Date comparisons, opposites in context, number series, graph/data trends, math word problems, verbal analogies, logic & deduction
- **2-step Motivation** — Matches real forced-ranking format (pick MOST, then favorite of remaining 2)
- **CSM coaching** — Personality and Motivation sections show Customer Success Manager alignment scores and tips
- **Answer explanations** — Every cognitive question includes step-by-step method and common traps
- **📚 Study Guide** — All 7 cognitive question types with methods, traps, and worked examples
- **Pass/Fail verdict** — Realistic 22/50 CSM threshold with role suggestions by score tier
- **Instruction screens** — Verbatim from real Wonderlic Select docs before each section

---

## Architecture

```
React Frontend (port 3000)
        │
        ▼
Express Backend (port 3001)
        │
        ▼
Anthropic Claude API
(generates questions in parallel)
```

All 7 cognitive question categories are generated in parallel via `Promise.allSettled`, so a full set of 50 questions is ready in ~4–5 seconds.

---

## Getting Started

### Frontend only (static questions)

```bash
git clone https://github.com/sarasignedin/wonderlic-mock.git
cd wonderlic-mock
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### With LLM backend (dynamic questions)

```bash
# 1. Start the backend
cd wonderlic-mock/backend
npm install
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
npm run dev

# 2. In a new terminal, start the frontend
cd wonderlic-mock
REACT_APP_API_URL=http://localhost:3001 npm start
```

---

## Project Structure

```
wonderlic-mock/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx              # Full React app — all sections, study guide, results
│   ├── api.js               # Frontend API client for backend integration
│   └── index.js             # React entry point
├── backend/
│   ├── src/
│   │   ├── index.js         # Express server entry point
│   │   ├── routes/
│   │   │   └── questions.js # REST endpoints
│   │   ├── services/
│   │   │   └── questionGenerator.js  # Anthropic API calls + JSON parsing
│   │   └── prompts/
│   │       └── questions.js # Category prompts + distribution config
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docs/
│   ├── screenshot-intro.png
│   ├── screenshot-motivation.png
│   └── screenshot-personality.png
├── .gitignore
├── package.json
└── README.md
```

---

## Backend API

| Endpoint | Description |
|----------|-------------|
| `GET /health` | Server status + available endpoints |
| `GET /api/questions/quick` | Generate 25 cognitive questions |
| `GET /api/questions/full` | Generate 50 cognitive + 8 motivation + 20 personality |
| `GET /api/questions/category/:cat` | Generate questions for one category (`?count=5`) |
| `GET /api/questions/info/distribution` | View question count distribution |

### Question categories
`Dates` · `Opposites` · `Series` · `Data` · `Math` · `Verbal` · `Logic` · `Motivation` · `Personality`

---

## Wonderlic Score Benchmarks (/50)

| Score | Role Tier |
|-------|-----------|
| 31–50 | Technical / Engineering |
| 27–30 | Management / Specialist |
| **22–26** | **Customer Success Manager ✅** |
| 17–21 | Admin / Support |
| 0–16  | Entry-Level / Operational |

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ | Your Anthropic API key |
| `PORT` | No | Server port (default: 3001) |

### Frontend (`.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_API_URL` | No | Backend URL (default: `http://localhost:3001`) |

---

## Deploying

### Backend — Railway / Render / Fly.io
1. Push to GitHub
2. Connect the `backend/` folder as the root
3. Set `ANTHROPIC_API_KEY` as an environment variable
4. Deploy — starts automatically with `npm start`

### Frontend — Vercel / Netlify
1. Connect the repo root
2. Set `REACT_APP_API_URL` to your deployed backend URL
3. Deploy

---

## Built By

**Sara** · [Papaya Kiwi Consulting LLC](https://papaya.kiwi)  
*Teaching security, one sweet byte at a time* 🍉

GitHub: [@sarasignedin](https://github.com/sarasignedin)
