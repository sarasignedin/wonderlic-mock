# 🍉 Wonderlic Mock — Question Generation Backend

LLM-powered backend that dynamically generates fresh Wonderlic Select questions using Claude. Every test run produces unique, never-repeated questions across all 7 cognitive types plus motivation and personality sections.

---

## Architecture

```
wonderlic-backend/
├── src/
│   ├── index.js                  # Express server entry point
│   ├── api.js                    # Frontend API client (copy to React src/)
│   ├── routes/
│   │   └── questions.js          # REST endpoints
│   ├── services/
│   │   └── questionGenerator.js  # Anthropic API calls + parsing
│   └── prompts/
│       └── questions.js          # Category prompts + distribution config
├── .env.example
└── package.json
```

---

## Setup

```bash
cd wonderlic-backend
npm install

# Copy and fill in your API key
cp .env.example .env
# Edit .env: ANTHROPIC_API_KEY=sk-ant-...

# Development (auto-restart on changes)
npm run dev

# Production
npm start
```

---

## API Endpoints

### `GET /health`
Check server status and available endpoints.

### `GET /api/questions/quick`
Generate a full Quick Mode question set (25 cognitive questions).

**Response:**
```json
{
  "mode": "quick",
  "generated_at": "2026-03-18T12:00:00Z",
  "elapsed_seconds": 4.2,
  "counts": { "cognitive": 25, "motivation": 0, "personality": 0 },
  "questions": {
    "cognitive": [ ...25 questions... ],
    "motivation": [],
    "personality": []
  }
}
```

### `GET /api/questions/full`
Generate a full Full Mode question set (50 cognitive + 8 motivation + 20 personality).

### `GET /api/questions/category/:category`
Generate questions for a single category on demand.

**Parameters:**
- `category`: `Dates | Opposites | Series | Data | Math | Verbal | Logic | Motivation | Personality`
- `?count=5`: Number of questions (1-20, default 5)

### `GET /api/questions/info/distribution`
Returns the question count distribution per mode.

---

## Question Distribution

| Category   | Quick | Full |
|------------|-------|------|
| Dates      | 3     | 6    |
| Opposites  | 4     | 8    |
| Series     | 4     | 8    |
| Data       | 2     | 4    |
| Math       | 6     | 12   |
| Verbal     | 4     | 8    |
| Logic      | 2     | 4    |
| **Total Cognitive** | **25** | **50** |
| Motivation | 0     | 8    |
| Personality| 0     | 20   |

---

## Connecting to the React Frontend

1. Copy `src/api.js` into your React app's `src/` directory
2. Add to `.env` in your React app:
   ```
   REACT_APP_API_URL=http://localhost:3001
   ```
3. In `App.jsx`, replace the `startTest` function:

```javascript
import { fetchQuestionsForMode } from './api';

const startTest = async (key) => {
  setScreen("loading");
  try {
    const data = await fetchQuestionsForMode(key);
    setCogQs(data.questions.cognitive);
    setMotQs(data.questions.motivation);
    setPerQs(data.questions.personality);
    // ... rest of setup
    setScreen("instructions_cog");
  } catch (err) {
    setError(err.message);
    setScreen("intro");
  }
};
```

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `ANTHROPIC_API_KEY` | ✅ Yes | Your Anthropic API key |
| `PORT` | No | Server port (default: 3001) |

---

## Deployment

### Railway / Render / Fly.io
1. Push to GitHub
2. Connect repo to your platform
3. Set `ANTHROPIC_API_KEY` environment variable
4. Deploy — the server auto-starts with `npm start`

### Update React frontend for production
Set `REACT_APP_API_URL` to your deployed backend URL.

---

## Built By

**Sara** · [Papaya Kiwi Consulting LLC](https://papaya.kiwi)  
*Teaching security, one sweet byte at a time* 🍉

GitHub: [@sarasignedin](https://github.com/sarasignedin)
