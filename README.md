# 🍉 Wonderlic Select Mock Test
### by Papaya Kiwi Consulting

A full-featured Wonderlic Select practice app built with React. Matches the real assessment format including all three sections, real instruction screens, and CSM-specific coaching.

---

## Features

- **3 complete sections** — Cognitive, Motivation, Personality
- **2 modes** — Quick (25 Qs / 6 min) or Full (50 Qs / 12 min)
- **Real Wonderlic formats** — Date comparisons, opposites in context, number series, graph/data trends, math word problems, verbal analogies, logic & deduction
- **2-step Motivation** — Matches real forced-ranking format (pick MOST, then favorite of remaining 2)
- **CSM coaching** — Personality and Motivation sections show Customer Success Manager alignment scores and tips
- **Answer explanations** — Every cognitive question includes step-by-step method and common traps
- **📚 Study Guide** — All 7 cognitive question types with methods, traps, and worked examples
- **Pass/Fail verdict** — Realistic 22/50 CSM threshold with role suggestions by score tier
- **Instruction screens** — Verbatim from real Wonderlic Select docs before each section
- **Questions shuffle** every run so you never memorize the order

---

## Getting Started

```bash
# Clone the repo
git clone https://github.com/sarasignedin/wonderlic-mock.git
cd wonderlic-mock

# Install dependencies
npm install

# Run locally
npm start
```

Then open [http://localhost:3000](http://localhost:3000).

---

## Project Structure

```
wonderlic-mock/
├── public/
│   └── index.html
├── src/
│   ├── App.jsx        # Full app — all sections, study guide, results
│   └── index.js       # React entry point
├── .gitignore
├── package.json
└── README.md
```

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

## Built By

**Sara** · [Papaya Kiwi Consulting LLC](https://papaya.kiwi)  
*Teaching security, one sweet byte at a time* 🍉

GitHub: [@sarasignedin](https://github.com/sarasignedin)
