// ─── SYSTEM PROMPT ────────────────────────────────────────────────────────────
export const SYSTEM_PROMPT = `You are an expert at creating Wonderlic Select cognitive ability assessment questions. 
Your questions must be original, accurate, and match the exact format and difficulty of real Wonderlic questions.
Always respond with valid JSON only — no markdown, no explanation, no preamble.`;

// ─── QUESTION TYPE PROMPTS ─────────────────────────────────────────────────────
export const CATEGORY_PROMPTS = {

  Dates: (count) => `Generate ${count} unique "Dates" questions in the style of the Wonderlic cognitive assessment.
Each question asks either "Which is the EARLIEST date?" or "Which is the LATEST date?" 
and provides 5 date options in the format "Mon. DD, YYYY" (e.g. "Jan. 16, 1898").
Mix years from different centuries. Make sure one answer is clearly correct.

Return a JSON array with exactly ${count} objects in this format:
[
  {
    "category": "Dates",
    "q": "Which of the following is the earliest date?",
    "options": ["Jan. 16, 1898", "Feb. 21, 1889", "Feb. 2, 1898", "Jan. 7, 1898", "Jan. 30, 1889"],
    "answer": "Jan. 30, 1889",
    "explain": "Step-by-step explanation of how to solve it, including the method and any traps to avoid. End with a Pro tip: starting with 'Always...' or 'For...' or 'Scan...'."
  }
]`,

  Opposites: (count) => `Generate ${count} unique "Opposites in Context" questions in the style of the Wonderlic cognitive assessment.
Each question shows a sentence where one word appears in BOLD (written in ALL CAPS in the q field).
The question asks for the OPPOSITE of that bold/caps word.
Provide 5 answer options. Include at least one trap option that is a synonym of the bold word.
Use a mix of professional, business, and general vocabulary. Difficulty should vary.

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Opposites",
    "q": "One word below appears in BOLD. What is the OPPOSITE?\\n\\n\\"She gave a COMPLEX answer to the question.\\"",
    "options": ["Long", "Better", "Simple", "Wrong", "Kind"],
    "answer": "Simple",
    "explain": "Step-by-step explanation: define the bold word, eliminate synonyms, identify the trap, pick the antonym. End with a Pro tip."
  }
]`,

  Series: (count) => `Generate ${count} unique "Number Series" questions in the style of the Wonderlic cognitive assessment.
Each question shows a number sequence and asks for the next number.
Use a variety of patterns: constant addition, multiplication, decreasing gaps, second-level patterns (gaps that change), alternating operations.
Make sure the series has exactly one correct answer.

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Series",
    "q": "What is the next number in the series?\\n29  41  53  65  77  ___",
    "options": ["75", "88", "89", "98", "99"],
    "answer": "89",
    "explain": "Step-by-step: show the gap calculation, identify the rule, calculate the answer. End with a Pro tip about the method used."
  }
]`,

  Data: (count) => `Generate ${count} unique "Data Interpretation" questions in the style of the Wonderlic cognitive assessment.
Questions should involve: reading trends from described data, calculating averages, totaling values, or identifying patterns.
Include simple scenarios like order counts, sales figures, ticket counts, or scores over time periods.
Keep numbers simple enough to calculate mentally in under 20 seconds.

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Data",
    "q": "A product generated 27, 99, 80, 115, and 213 orders over a 5-hour period. Which best describes this trend?",
    "options": ["Steadily decreasing", "Goes up, dips, then rises sharply", "Perfectly linear", "Flat then sudden spike", "No pattern"],
    "answer": "Goes up, dips, then rises sharply",
    "explain": "Step-by-step: trace direction between each pair (up/down/flat), describe the shape, match to option. End with a Pro tip."
  }
]`,

  Math: (count) => `Generate ${count} unique "Math Word Problem" questions in the style of the Wonderlic cognitive assessment.
Cover a variety of types: percentage calculations, discount/markup problems, rate/speed/distance, worker-time problems, unit rate, fractions, basic algebra.
Include at least one "trap" detail in each question that is irrelevant to solving it.
Numbers should be manageable without a calculator. 5 answer options, only 1 correct.

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Math",
    "q": "A shirt costs $24 after a 20% discount. What was the original price?",
    "options": ["$28", "$29", "$30", "$32", "$36"],
    "answer": "$30",
    "explain": "Step-by-step solution with the formula used. Call out the common trap answer. End with a Pro tip about the method."
  }
]`,

  Verbal: (count) => `Generate ${count} unique "Verbal" questions in the style of the Wonderlic cognitive assessment.
Mix two types equally:
1. ANALOGIES: "A is to B as C is to ___" format (relationship types: creator/creation, tool/user, opposites, category/member, position/sequence)
2. VOCABULARY: "WORD most nearly means:" with 5 options including at least one trap (similar-looking word or opposite)

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Verbal",
    "q": "Book is to Author as Painting is to ___",
    "options": ["Canvas", "Museum", "Artist", "Color", "Frame"],
    "answer": "Artist",
    "explain": "Step-by-step: identify the relationship type, apply to the second pair, call out the traps. End with a Pro tip."
  }
]`,

  Logic: (count) => `Generate ${count} unique "Logic & Deduction" questions in the style of the Wonderlic cognitive assessment.
Cover a variety of types:
- Ordering/ranking (A is taller than B, etc.)
- Syllogisms (All X are Y, some Y are Z, therefore...)
- Odd one out (which doesn't belong in this group?)
- Letter series (what comes next: Z, X, V, T, ___)
- Category identification

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Logic",
    "q": "All managers are employees. Some employees work remotely. Therefore:",
    "options": ["All managers work remotely", "No managers work remotely", "Some managers may work remotely", "All remote workers are managers", "None of the above"],
    "answer": "Some managers may work remotely",
    "explain": "Step-by-step logical deduction. Explain why each wrong answer fails. End with a Pro tip about the logic type."
  }
]`,

  Motivation: (count) => `Generate ${count} unique "Motivation" questions in the style of the Wonderlic Select assessment.
Each question presents 3 work activities and asks which the candidate would MOST like to do.
The activities should map to these 6 work drivers: Hands-On, Service, Creative, Persuasive, Analytical, Clerical.
Each set should have activities from 3 different drivers.
For each option, note which driver it represents and whether it's CSM-aligned (Customer Success Manager roles value Service and Persuasive most).

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Motivation",
    "q": "Which of the following activities would you like to do MOST at work?",
    "options": ["Help a client troubleshoot an issue", "Analyze data trends in a spreadsheet", "Repair computer hardware"],
    "csm": "Help a client troubleshoot an issue",
    "tips": {
      "Help a client troubleshoot an issue": "Strong CSM signal - direct client service and problem-solving.",
      "Analyze data trends in a spreadsheet": "Analytical driver - useful but secondary to client focus for CSM.",
      "Repair computer hardware": "Hands-On driver - not CSM-aligned."
    }
  }
]`,

  Personality: (count) => `Generate ${count} unique "Personality" statements in the style of the Wonderlic Select assessment.
Each statement is a first-person declaration that a test-taker responds to with Agree / Neither Agree nor Disagree / Disagree.
Cover these traits relevant to a Customer Success Manager role: composed/calm, outgoing, reliable, decisive, helpful, proactive, empathetic, flexible, communicator, team-oriented.
For each statement, specify the CSM-ideal answer and explain why it matters for the role.

Return a JSON array with exactly ${count} objects:
[
  {
    "category": "Personality",
    "statement": "I can keep calm, even in heated discussions.",
    "csm": "Agree",
    "trait": "Composed",
    "tip": "CSMs face client escalations regularly - composure is non-negotiable."
  }
]`,
};

// ─── DISTRIBUTION CONFIG ───────────────────────────────────────────────────────
// How many of each type to generate per mode
export const DISTRIBUTION = {
  quick: {
    // 25 cognitive total
    Dates: 3, Opposites: 4, Series: 4, Data: 2, Math: 6, Verbal: 4, Logic: 2,
    // non-cognitive (not used in quick mode)
    Motivation: 0, Personality: 0,
  },
  full: {
    // 50 cognitive total
    Dates: 6, Opposites: 8, Series: 8, Data: 4, Math: 12, Verbal: 8, Logic: 4,
    // full sections
    Motivation: 8, Personality: 20,
  },
};
