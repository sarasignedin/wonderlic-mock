import { useState, useEffect, useRef } from "react";

// ─── COGNITIVE QUESTIONS ─────────────────────────────────────────────────────
const COGNITIVE_QUESTIONS = [
  // DATE COMPARISONS
  { id:1,  category:"Dates",     q:"Which of the following is the earliest date?",  options:["Jan. 16, 1898","Feb. 21, 1889","Feb. 2, 1898","Jan. 7, 1898","Jan. 30, 1889"],  answer:"Jan. 30, 1889",  explain:"Sort by year: 1889 < 1898, so ignore all 1898 dates. Two 1889 dates remain: Jan. 30 and Feb. 21. January (month 1) comes before February (month 2), so Jan. 30, 1889 is earliest. ✏️ Always sort Year → Month → Day." },
  { id:2,  category:"Dates",     q:"Which of the following is the LATEST date?",   options:["Nov. 3, 2001","Oct. 31, 2001","Nov. 11, 2001","Dec. 1, 2000","Nov. 3, 2002"],  answer:"Nov. 3, 2002",   explain:"Scan years first — 2002 is the highest year. That's your answer immediately, no need to compare months or days. ✏️ For 'latest' questions, highest year wins instantly." },
  { id:3,  category:"Dates",     q:"Which of the following is the earliest date?",  options:["Aug. 8, 1985","Aug. 18, 1985","Jul. 28, 1985","Aug. 1, 1984","Sep. 2, 1984"],  answer:"Aug. 1, 1984",   explain:"Two dates in 1984 (earlier than 1985): Aug. 1 and Sep. 2. August comes before September, so Aug. 1, 1984 wins. ✏️ Eliminate by year first, then break ties by month, then day." },
  { id:4,  category:"Dates",     q:"Which of the following is the LATEST date?",   options:["Mar. 3, 2015","Mar. 13, 2015","Feb. 28, 2015","Mar. 3, 2016","Apr. 1, 2015"],  answer:"Mar. 3, 2016",   explain:"Only one date is in 2016. Done in 3 seconds. ✏️ Always scan years first — it usually gives you the answer before you even read the months." },

  // OPPOSITES IN CONTEXT
  { id:5,  category:"Opposites", q:'One word below appears in BOLD. What is the OPPOSITE?\n\n"She gave a COMPLEX answer to the question and we all agreed with her."', options:["Long","Better","Simple","Wrong","Kind"],  answer:"Simple",      explain:"COMPLEX = complicated. Opposite = SIMPLE (easy to understand). Trap: 'wrong' is about correctness, not complexity. ✏️ Define the bold word first, then find its direct antonym from the list." },
  { id:6,  category:"Opposites", q:'One word below appears in BOLD. What is the OPPOSITE?\n\n"The new manager had a CAUTIOUS approach to making changes in the team."',  options:["Reckless","Slow","Careful","Timid","Measured"], answer:"Reckless",   explain:"CAUTIOUS = careful, risk-averse. Opposite = RECKLESS. Traps: 'Slow,' 'Careful,' and 'Timid' are all similar TO cautious — eliminate them first. ✏️ Watch for trap answers that are synonyms of the bold word." },
  { id:7,  category:"Opposites", q:'One word below appears in BOLD. What is the OPPOSITE?\n\n"The client was SATISFIED with the outcome of the project."',               options:["Angry","Unsatisfied","Neutral","Pleased","Indifferent"], answer:"Unsatisfied", explain:"SATISFIED = content with results. Direct opposite = UNSATISFIED. 'Angry' is tempting but it's an emotion, not the precise antonym. ✏️ Look for the most precise opposite, not just any negative word." },
  { id:8,  category:"Opposites", q:'One word below appears in BOLD. What is the OPPOSITE?\n\n"Her presentation was CONCISE and well-received by the board."',            options:["Long-winded","Clear","Polished","Brief","Simple"], answer:"Long-winded", explain:"CONCISE = brief, using few words. Opposite = LONG-WINDED. Trap: 'Brief' is actually a synonym of concise — eliminate it immediately. ✏️ Define first, then scan options. Don't assume words that 'sound right' are correct." },
  { id:9,  category:"Opposites", q:'One word below appears in BOLD. What is the OPPOSITE?\n\n"The security alert was deemed CRITICAL by the incident response team."',   options:["Urgent","Minor","Important","Severe","Necessary"], answer:"Minor",      explain:"CRITICAL = extremely serious, high severity. Opposite = MINOR (small, not serious). Traps: 'Urgent' and 'Severe' are near-synonyms of critical — eliminate them. ✏️ Eliminate synonyms of the bold word to narrow down fast." },

  // NUMBER SERIES
  { id:10, category:"Series", q:"What is the next number in the series?\n29  41  53  65  77  ___", options:["75","88","89","98","99"],   answer:"89", explain:"Find gaps: 41-29=12, 53-41=12, 65-53=12, 77-65=12. Rule: +12 each time. 77+12=89. ✏️ Always subtract consecutive pairs to find the rule before looking at answers." },
  { id:11, category:"Series", q:"What is the next number in the series?\n3  6  12  24  48  ___",   options:["72","84","96","100","108"], answer:"96", explain:"6÷3=2, 12÷6=2, 24÷12=2, 48÷24=2. Rule: ×2 each time. 48×2=96. ✏️ If adding doesn't give a constant gap, try multiplying. Common multipliers: ×2, ×3." },
  { id:12, category:"Series", q:"What is the next number in the series?\n100  91  83  76  70  ___", options:["60","63","65","64","66"],  answer:"65", explain:"Gaps: -9, -8, -7, -6 (decreasing by 1 each time). Next gap: -5. 70-5=65. ✏️ When gaps change, find the pattern in the gaps themselves — often ±1." },
  { id:13, category:"Series", q:"What is the next number in the series?\n1  2  4  7  11  16  ___",  options:["20","21","22","23","24"],  answer:"22", explain:"Gaps: +1, +2, +3, +4, +5. Next gap: +6. 16+6=22. ✏️ Second-level pattern — when gaps aren't equal, find their own pattern." },
  { id:14, category:"Series", q:"What is the next number in the series?\n2  5  10  17  26  ___",    options:["35","36","37","38","39"],  answer:"37", explain:"Gaps: +3, +5, +7, +9 (odd numbers). Next gap: +11. 26+11=37. ✏️ Same second-level approach — gaps themselves follow a pattern." },
  { id:15, category:"Data",   q:"A product generated 27, 99, 80, 115, and 213 orders over 5 hours. Which best describes this trend?", options:["Steadily decreasing","Goes up, dips, then rises sharply","Perfectly linear","Flat then sudden spike","No pattern"], answer:"Goes up, dips, then rises sharply", explain:"Track up/down: 27→99 (↑), 99→80 (↓ dip), 80→115 (↑), 115→213 (↑ sharp). Pattern: up, dip, then sharp rise. ✏️ Just track the direction between each pair — up, down, or flat." },
  { id:16, category:"Data",   q:"Sales were $40K in Q1, $55K in Q2, $50K in Q3, $70K in Q4. What is the average quarterly revenue?", options:["$50K","$52.5K","$53.75K","$55K","$57.5K"], answer:"$53.75K", explain:"Sum: 40+55+50+70=215. Average: 215÷4=53.75. ✏️ Average = sum ÷ count. Add all values first. Don't rush the addition — misadding is the #1 mistake under time pressure." },
  { id:17, category:"Data",   q:"A team closed 12 tickets Mon, 8 Tue, 15 Wed, 10 Thu, 5 Fri. Total tickets closed that week?", options:["45","48","50","52","55"], answer:"50", explain:"12+8=20, +15=35, +10=45, +5=50. ✏️ Add left to right in running pairs — faster and less error-prone than adding all 5 at once." },
  { id:18, category:"Math",   q:"If a train travels 60 miles per hour, how many miles will it travel in 90 minutes?", options:["80","90","100","120","150"], answer:"90", explain:"Convert time: 90 min = 1.5 hours. Distance = 60 × 1.5 = 90 miles. ✏️ Always convert minutes to hours first (divide by 60), then multiply by speed." },
  { id:19, category:"Math",   q:"A shirt costs $24 after a 20% discount. What was the original price?", options:["$28","$29","$30","$32","$36"], answer:"$30", explain:"$24 = 80% of original (100%-20%). Original = 24 ÷ 0.80 = $30. ✏️ Common trap: adding 20% to $24 gives $28.80 — wrong. Work backwards: sale price ÷ (1 - discount rate)." },
  { id:20, category:"Math",   q:"If 5 workers complete a job in 12 days, how many days will 3 workers take?", options:["15","18","20","24","30"], answer:"20", explain:"Total work = 5×12 = 60 worker-days. With 3 workers: 60÷3 = 20 days. ✏️ Formula: Workers × Days = total work (constant). Divide total by new worker count." },
  { id:21, category:"Math",   q:"What is 15% of 240?", options:["30","32","36","40","42"], answer:"36", explain:"10% of 240 = 24. Half of that (5%) = 12. Add: 24+12 = 36. ✏️ Break into 10% chunks — faster than calculating 0.15 × 240 mentally." },
  { id:22, category:"Math",   q:"A store marks up goods 40% then offers a 20% discount. What is the net change?", options:["-8%","+8%","+12%","+20%","+28%"], answer:"+12%", explain:"Start at $100. +40% → $140. Then -20% of $140 = -$28. $140-$28 = $112. Net = +12%. ✏️ Never add/subtract % directly (40%-20% ≠ 20%). Apply each sequentially to a base of $100." },
  { id:23, category:"Math",   q:"A car travels 180 miles on 6 gallons. How many gallons for 270 miles?", options:["7","8","9","10","11"], answer:"9", explain:"Rate: 180÷6 = 30 mpg. Gallons needed: 270÷30 = 9. ✏️ Find unit rate first (per 1 gallon), then divide total distance by that rate." },
  { id:24, category:"Math",   q:"A tank is 1/3 full. After adding 80 liters it is 3/4 full. Total capacity?", options:["160L","180L","192L","200L","240L"], answer:"192L", explain:"Added fraction: 3/4 - 1/3 = 9/12 - 4/12 = 5/12. So 5/12 of tank = 80L. Full tank = 80 × 12/5 = 192L. ✏️ Find what fraction the added amount represents, then scale to the whole." },
  { id:25, category:"Math",   q:"If 3x + 7 = 22, what is x?", options:["3","4","5","6","7"], answer:"5", explain:"Subtract 7 from both sides: 3x = 15. Divide by 3: x = 5. ✏️ Isolate x step by step — subtract constants first, then divide by the coefficient." },
  { id:26, category:"Math",   q:"What is the average of 14, 18, 22, 26, and 30?", options:["20","21","22","23","24"], answer:"22", explain:"Shortcut: evenly spaced list — the average IS the middle value. Middle of 5 items = 3rd item = 22. ✏️ When numbers are equally spaced, skip the math and just pick the middle one." },
  { id:27, category:"Math",   q:"A 12-inch pizza is cut into 8 equal slices. What is the angle of each slice?", options:["30°","40°","45°","50°","60°"], answer:"45°", explain:"Full circle = 360°. 360÷8 = 45°. The 12-inch size is irrelevant — a deliberate distraction. ✏️ Pizza/pie slices = 360° ÷ number of slices. Ignore size details." },
  { id:28, category:"Math",   q:"A store sells 3 items for $7.50. How much would 8 items cost?", options:["$18.00","$19.50","$20.00","$22.00","$24.00"], answer:"$20.00", explain:"Cost per item: $7.50÷3 = $2.50. Cost for 8: $2.50×8 = $20.00. ✏️ Find the unit rate first (per 1 item), then multiply by the new quantity." },
  { id:29, category:"Math",   q:"How many minutes are in 2.5 hours?", options:["120","130","140","150","160"], answer:"150", explain:"2 hrs = 120 min. 0.5 hrs = 30 min. Total = 150. Or: 2.5 × 60 = 150. ✏️ Simple but easy to rush. Multiply hours × 60." },
  { id:30, category:"Math",   q:"A security team has 3 analysts each reviewing 8 alerts/hr. After 2 hours, 12 are escalated. How many were NOT escalated?", options:["24","30","36","42","48"], answer:"36", explain:"Total alerts: 3 × 8 × 2 = 48. Not escalated: 48-12 = 36. ✏️ Multi-step — calculate the total first, then subtract. Don't forget the word 'NOT' in the question." },
  { id:31, category:"Verbal", q:"LOW is to HIGH as EASY is to ___", options:["Successful","Pure","Tall","Interesting","Difficult"], answer:"Difficult", explain:"LOW and HIGH are opposites. Apply the same relationship: EASY needs its opposite. DIFFICULT. ✏️ Name the relationship type first (opposites, synonyms, tool/user, category). Here: opposites." },
  { id:32, category:"Verbal", q:"LOQUACIOUS most nearly means:", options:["Quiet","Talkative","Logical","Graceful","Stubborn"], answer:"Talkative", explain:"Root 'loqu' (Latin) = to speak. LOQUACIOUS = talking a great deal. ✏️ Word roots are powerful shortcuts. Loquacious → loqui → speak → talkative." },
  { id:33, category:"Verbal", q:"MITIGATE most nearly means:", options:["Worsen","Ignore","Lessen","Transfer","Measure"], answer:"Lessen", explain:"MITIGATE = to make something less severe. Eliminate 'Worsen' (opposite) immediately. ✏️ Common in business: 'mitigate risk' = reduce risk. Eliminate the obvious opposite first." },
  { id:34, category:"Verbal", q:"EPHEMERAL most nearly means:", options:["Eternal","Short-lived","Spiritual","Historical","Fragrant"], answer:"Short-lived", explain:"EPHEMERAL = lasting a very short time. 'Eternal' is the opposite — eliminate it first. ✏️ Greek root 'hemera' = day. Think: here today, gone tomorrow." },
  { id:35, category:"Verbal", q:"Book is to Author as Painting is to ___", options:["Canvas","Museum","Artist","Color","Frame"], answer:"Artist", explain:"Relationship: a [creator] makes a [creation]. Author creates Book. Who creates Painting? Artist. ✏️ Canvas = what it's made on (not the creator). Gallery = where it's shown. Both are traps." },
  { id:36, category:"Verbal", q:"PRAGMATIC most nearly means:", options:["Idealistic","Practical","Pessimistic","Precise","Passive"], answer:"Practical", explain:"PRAGMATIC = dealing with things sensibly based on real conditions. Synonym: practical. 'Idealistic' is the opposite — eliminate it. ✏️ Pragmatic ≈ practical, realistic, no-nonsense." },
  { id:37, category:"Verbal", q:"TENACIOUS most nearly means:", options:["Fragile","Persistent","Flexible","Cautious","Generous"], answer:"Persistent", explain:"TENACIOUS = holding firm, refusing to give up. Synonym: persistent. 'Fragile' is the opposite. ✏️ Think 'tenacity' — determination and grit. Tenacious = persistent = dogged." },
  { id:38, category:"Verbal", q:"CANDID most nearly means:", options:["Hidden","Frank","Careful","Clever","Polite"], answer:"Frank", explain:"CANDID = open, honest, not hiding anything. Synonym: frank. 'Hidden' is the opposite — eliminate it first. ✏️ Candid and frank both mean directly honest. Think 'candid camera' — unposed and honest." },
  { id:39, category:"Verbal", q:"JANUARY : JULY as MONDAY : ___", options:["Wednesday","Friday","Sunday","Thursday","Saturday"], answer:"Sunday", explain:"January = month 1, July = month 7: gap of 6. Monday = day 1. Day 1+6 = day 7 = Sunday. ✏️ Count the positional gap (6), then apply it to the second pair starting from Monday." },
  { id:40, category:"Verbal", q:"VERBOSE most nearly means:", options:["Quiet","Concise","Wordy","Rude","Vague"], answer:"Wordy", explain:"VERBOSE = using more words than needed. Synonym: wordy. 'Concise' is the opposite — eliminate it. ✏️ Verbose = long-winded = wordy. All mean saying too much." },
  { id:41, category:"Verbal", q:"Surgeon is to Scalpel as Painter is to ___", options:["Canvas","Gallery","Brush","Easel","Color"], answer:"Brush", explain:"Relationship: professional → primary tool. Surgeon's tool = Scalpel. Painter's tool = Brush. ✏️ Canvas = surface worked on (not the tool). Easel = support structure. Both are traps." },
  { id:42, category:"Verbal", q:"SUPERFLUOUS most nearly means:", options:["Superior","Unnecessary","Surprising","Superficial","Sufficient"], answer:"Unnecessary", explain:"SUPERFLUOUS = more than what is needed, excessive. Trap: 'Superior' looks similar (both start with 'super'). 'Sufficient' = enough — actually the opposite. ✏️ Don't let similar-looking words fool you. Define the word before scanning options." },
  { id:43, category:"Logic",  q:"All managers are employees. Some employees work remotely. Therefore:", options:["All managers work remotely","No managers work remotely","Some managers may work remotely","All remote workers are managers","None of the above"], answer:"Some managers may work remotely", explain:"Managers ⊂ Employees. Some employees work remotely — that 'some' might include managers or not. We can't say ALL or NONE. Only 'some may' is safe. ✏️ In logic, never assume more than the statement allows. 'All' and 'none' are almost always wrong." },
  { id:44, category:"Logic",  q:"A is taller than B. C is shorter than A but taller than B. Who is shortest?", options:["A","B","C","A and C","Cannot determine"], answer:"B", explain:"Build the chain: A > C > B. B is at the bottom. ✏️ Write out the order tall→short using clues. The last person in the chain is shortest." },
  { id:45, category:"Logic",  q:"Which number does NOT belong? 3, 7, 11, 14, 19, 23", options:["3","7","11","14","19"], answer:"14", explain:"3, 7, 11, 19, 23 are all prime (divisible only by 1 and themselves). 14 = 2×7, so it's NOT prime. ✏️ Find the shared property of most numbers, then identify which one breaks it." },
  { id:46, category:"Logic",  q:"What comes next? Z, X, V, T, ___", options:["S","R","Q","P","O"], answer:"R", explain:"Assign numbers: Z=26, X=24, V=22, T=20. Pattern: subtract 2 each time. 20-2=18=R. ✏️ When letter patterns aren't obvious, assign numbers (A=1...Z=26) and look for numeric patterns." },
  { id:47, category:"Logic",  q:"Which is the odd one out? Firewall, IDS, Phishing, VPN, Antivirus", options:["Firewall","IDS","Phishing","VPN","Antivirus"], answer:"Phishing", explain:"Firewall, IDS, VPN, Antivirus are all security TOOLS/DEFENSES. Phishing is an ATTACK TYPE — completely different category. ✏️ Find the shared category, then find what breaks it." },
  { id:48, category:"Logic",  q:"If all roses are flowers and some flowers fade quickly, which must be true?", options:["All roses fade quickly","Some roses may fade quickly","No roses fade quickly","All flowers are roses","Roses never fade"], answer:"Some roses may fade quickly", explain:"Roses are flowers. Some flowers fade — that 'some' might or might not include roses. We can't confirm ALL or NONE. Only 'some may' is logically safe. ✏️ 'Must be true' = only what's guaranteed. Avoid 'all' and 'none' conclusions from 'some' premises." },
  { id:49, category:"Logic",  q:"Sara is older than Drew. Drew is older than Jessica. Who is youngest?", options:["Sara","Drew","Jessica","Cannot tell","All the same"], answer:"Jessica", explain:"Chain: Sara > Drew > Jessica. Jessica is last = youngest. ✏️ Build the chain from clues in order. The final link is always youngest/smallest/least." },
  { id:50, category:"Logic",  q:"A rectangle has perimeter 36 and width 7. What is its area?", options:["77","88","99","110","121"], answer:"77", explain:"Perimeter = 2(L+W). 36 = 2(L+7) → L+7=18 → L=11. Area = 11×7 = 77. ✏️ Two steps: use perimeter formula to find length first, then multiply length × width for area." },
];

// ─── MOTIVATION — 2-STEP FORCED RANKING ──────────────────────────────────────
// Each question: pick MOST preferred from 3, then pick favorite of remaining 2
// csm = the option most aligned with CSM role; tip = coaching note
const MOTIVATION_QUESTIONS = [
  {
    id:1,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Help a client troubleshoot an issue","Analyze data trends in a spreadsheet","Write internal policy documentation"],
    csm:"Help a client troubleshoot an issue",
    tips:{ "Help a client troubleshoot an issue":"✅ Strong CSM signal — direct client problem-solving is at the heart of this role.", "Analyze data trends in a spreadsheet":"Neutral — data skills are useful but secondary to client focus.", "Write internal policy documentation":"Less aligned — CSMs are outward-facing, not process-documentation focused." }
  },
  {
    id:2,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Conduct a product demo for a new customer","Build a financial model","Manage server infrastructure"],
    csm:"Conduct a product demo for a new customer",
    tips:{ "Conduct a product demo for a new customer":"✅ Demonstrating value to customers is a core CSM activity.", "Build a financial model":"Useful for business cases but not a primary CSM motivator.", "Manage server infrastructure":"Technical ops — signals engineering motivation, not CSM." }
  },
  {
    id:3,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Train a new client on how to use a product","Review code for security vulnerabilities","Create a quarterly budget report"],
    csm:"Train a new client on how to use a product",
    tips:{ "Train a new client on how to use a product":"✅ Client education is one of the highest-value CSM activities.", "Review code for security vulnerabilities":"Engineering/security motivation — not CSM-aligned.", "Create a quarterly budget report":"Finance motivation — secondary in a CSM context." }
  },
  {
    id:4,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Build relationships with key client stakeholders","Design a new database schema","Write automated test scripts"],
    csm:"Build relationships with key client stakeholders",
    tips:{ "Build relationships with key client stakeholders":"✅ Relationship-building is the highest-signal CSM motivation.", "Design a new database schema":"Technical — signals software/data engineering motivation.", "Write automated test scripts":"QA/engineering signal — not client-facing." }
  },
  {
    id:5,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Resolve a customer escalation quickly","Develop a new product feature","Configure network access controls"],
    csm:"Resolve a customer escalation quickly",
    tips:{ "Resolve a customer escalation quickly":"✅ De-escalation and urgency around client issues are highly valued CSM traits.", "Develop a new product feature":"Product motivation — useful context but not CSM-primary.", "Configure network access controls":"Security/IT ops signal." }
  },
  {
    id:6,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Lead a customer check-in call","Write a penetration test report","Optimize database queries"],
    csm:"Lead a customer check-in call",
    tips:{ "Lead a customer check-in call":"✅ Proactive client engagement is a defining CSM behavior.", "Write a penetration test report":"Security analyst motivation.", "Optimize database queries":"Data/backend engineering motivation." }
  },
  {
    id:7,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Create onboarding materials for a new client","Analyze server logs for anomalies","Develop a machine learning model"],
    csm:"Create onboarding materials for a new client",
    tips:{ "Create onboarding materials for a new client":"✅ Client enablement and onboarding content are central to CSM success.", "Analyze server logs for anomalies":"Security/ops motivation.", "Develop a machine learning model":"Data science motivation." }
  },
  {
    id:8,
    q:"Which of the following activities would you like to do MOST at work?",
    options:["Advocate internally to resolve a client's problem","Audit firewall configurations","Build CI/CD pipelines"],
    csm:"Advocate internally to resolve a client's problem",
    tips:{ "Advocate internally to resolve a client's problem":"✅ Internal advocacy for clients is a defining CSM competency.", "Audit firewall configurations":"Security compliance motivation.", "Build CI/CD pipelines":"DevOps/engineering motivation." }
  },
];

// ─── PERSONALITY — AGREE / NEITHER / DISAGREE ────────────────────────────────
const PERSONALITY_QUESTIONS = [
  { id:1,  statement:"I can keep calm, even in heated discussions.",               csm:"Agree",    trait:"Composed",      tip:"CSMs face client escalations regularly — composure is non-negotiable." },
  { id:2,  statement:"I am quite comfortable talking to a room full of people.",   csm:"Agree",    trait:"Outgoing",      tip:"QBRs and executive presentations require comfort presenting to groups." },
  { id:3,  statement:"I can be counted upon to complete my work on time.",         csm:"Agree",    trait:"Reliable",      tip:"Follow-through is the #1 trust-builder with clients — agree strongly." },
  { id:4,  statement:"I am often competitive with others.",                        csm:"Neither",  trait:"Competitive",   tip:"CSMs collaborate more than they compete. Neutral here is ideal." },
  { id:5,  statement:"I make decisions quickly and confidently.",                  csm:"Agree",    trait:"Decisive",      tip:"Clients look to CSMs for guidance — hesitation erodes confidence." },
  { id:6,  statement:"I rarely have disagreements with others.",                   csm:"Neither",  trait:"Agreeable",     tip:"Too agreeable is a red flag — CSMs must push back constructively." },
  { id:7,  statement:"I do not like to talk in front of groups of people.",        csm:"Disagree", trait:"Outgoing",      tip:"Disagree strongly — CSMs present to clients and executives constantly." },
  { id:8,  statement:"I like to think creatively when solving a difficult problem.",csm:"Agree",   trait:"Open-Minded",   tip:"Creative problem-solving helps CSMs navigate ambiguous client situations." },
  { id:9,  statement:"I thrive on solving complex problems.",                      csm:"Agree",    trait:"Problem-Solver",tip:"Strong signal for cognitive and behavioral fit across all roles." },
  { id:10, statement:"I often challenge the ideas of others.",                     csm:"Neither",  trait:"Open-Minded",   tip:"Thoughtful challenge is good; reflexive contrarianism is not." },
  { id:11, statement:"I enjoy helping others learn new skills.",                   csm:"Agree",    trait:"Helpful",       tip:"Client education and enablement are pillars of customer success." },
  { id:12, statement:"I prefer to work alone rather than in teams.",               csm:"Disagree", trait:"Team-Oriented", tip:"CSMs coordinate across product, sales, and support constantly." },
  { id:13, statement:"I take initiative without being asked.",                     csm:"Agree",    trait:"Proactive",     tip:"Proactive outreach before issues arise defines top-performing CSMs." },
  { id:14, statement:"I find it easy to understand other people's feelings.",      csm:"Agree",    trait:"Empathetic",    tip:"Empathy is foundational to the CSM client relationship." },
  { id:15, statement:"I prefer structured routines over unpredictable work.",      csm:"Neither",  trait:"Flexible",      tip:"CSM days vary wildly — being too rigid is a risk, but structure helps." },
  { id:16, statement:"I stay motivated even when tasks become repetitive.",        csm:"Agree",    trait:"Resilient",     tip:"QBRs, renewals, and check-ins are cyclical — stamina matters." },
  { id:17, statement:"I often take charge in group settings.",                     csm:"Neither",  trait:"Leadership",    tip:"CSMs lead by influence, not authority — neutral is appropriate." },
  { id:18, statement:"I get frustrated easily when things don't go as planned.",   csm:"Disagree", trait:"Composed",      tip:"Client-facing roles require patience when things go sideways." },
  { id:19, statement:"I enjoy building relationships with new people.",            csm:"Agree",    trait:"Personable",    tip:"Relationship-building is the heart of customer success." },
  { id:20, statement:"I communicate clearly even when the topic is complex.",      csm:"Agree",    trait:"Communicator",  tip:"Translating technical info for non-technical stakeholders is essential." },
];

const MODES = {
  quick: { label:"Quick Mode", cogCount:25, minutes:6,  emoji:"⚡", desc:"Cognitive only · 25 Qs · 6 min" },
  full:  { label:"Full Mode",  cogCount:50, minutes:12, emoji:"🎯", desc:"All 3 sections · closest to real thing" },
};

const CAT = {
  Dates:    { bg:"#E8F5FF", accent:"#5A9EFF", label:"📅" },
  Opposites:{ bg:"#FFF0E8", accent:"#FF8C5A", label:"🔄" },
  Series:   { bg:"#F0E8FF", accent:"#9E5AFF", label:"🔢" },
  Math:     { bg:"#FFF8E8", accent:"#FFAA00", label:"➕" },
  Verbal:   { bg:"#E8FFF0", accent:"#5ABF5A", label:"📖" },
  Logic:    { bg:"#F8E8FF", accent:"#C05AFF", label:"🧩" },
  Data:     { bg:"#E8FFFD", accent:"#00B8A9", label:"📊" },
};

const CORAL = "#FF8C5A";

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length-1; i>0; i--) { const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; }
  return a;
}

export default function WonderlicMock() {
  const [screen, setScreen]   = useState("intro");
  const [mode, setMode]       = useState(null);
  const [cogQs, setCogQs]     = useState([]);
  const [motQs, setMotQs]     = useState([]);
  const [perQs, setPerQs]     = useState([]);
  const [cogIdx, setCogIdx]   = useState(0);
  const [motIdx, setMotIdx]   = useState(0);
  const [perIdx, setPerIdx]   = useState(0);
  const [cogAns, setCogAns]   = useState({});
  const [motAns, setMotAns]   = useState({});  // { idx: { first, second } }
  const [perAns, setPerAns]   = useState({});
  const [selected, setSelected] = useState(null);
  const [motStep, setMotStep] = useState(1);   // 1 = pick MOST, 2 = pick from remaining 2
  const [motFirst, setMotFirst] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const timerRef = useRef(null);

  const startTest = (key) => {
    const cfg = MODES[key];
    setCogQs(shuffle(COGNITIVE_QUESTIONS).slice(0, cfg.cogCount));
    setMotQs(shuffle(MOTIVATION_QUESTIONS));
    setPerQs(shuffle(PERSONALITY_QUESTIONS));
    setMode(key); setTimeLeft(cfg.minutes*60);
    setCogIdx(0); setMotIdx(0); setPerIdx(0);
    setCogAns({}); setMotAns({}); setPerAns({});
    setSelected(null); setMotStep(1); setMotFirst(null);
    setSkipped(new Set());
    setScreen("instructions_cog"); // show instructions first
  };

  useEffect(() => {
    if (screen==="cog") {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => { if(t<=1){clearInterval(timerRef.current); advanceFrom("cog"); return 0;} return t-1; });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const fmt = (s) => `${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

  const advanceFrom = (from) => {
    clearInterval(timerRef.current); setSelected(null);
    if (from==="cog") { mode==="full" ? setScreen("instructions_mot") : setScreen("results"); }
    else if (from==="mot") { setScreen("instructions_per"); }
    else { setScreen("results"); }
  };

  // COG handlers
  const cogNext = () => {
    if (selected) setCogAns(a=>({...a,[cogIdx]:selected}));
    setSelected(null);
    if (cogIdx===cogQs.length-1) advanceFrom("cog");
    else setCogIdx(i=>i+1);
  };
  const cogSkip = () => {
    setSkipped(s=>new Set([...s,cogIdx])); setSelected(null);
    if (cogIdx===cogQs.length-1) advanceFrom("cog");
    else setCogIdx(i=>i+1);
  };

  // MOT handlers — 2-step
  const motNext = () => {
    if (motStep===1) {
      // User picked MOST preferred — move to step 2
      setMotFirst(selected);
      setMotStep(2);
      setSelected(null);
    } else {
      // User picked favorite of remaining 2
      setMotAns(a=>({...a,[motIdx]:{first:motFirst, second:selected}}));
      setSelected(null); setMotFirst(null); setMotStep(1);
      if (motIdx===motQs.length-1) advanceFrom("mot");
      else setMotIdx(i=>i+1);
    }
  };

  // PER handler
  const perNext = () => {
    if (selected) setPerAns(a=>({...a,[perIdx]:selected}));
    setSelected(null);
    if (perIdx===perQs.length-1) advanceFrom("per");
    else setPerIdx(i=>i+1);
  };

  // ── Score calculations
  const totalTime = mode ? MODES[mode].minutes*60 : 0;
  const cogScore  = Object.entries(cogAns).filter(([i,a])=>cogQs[i]?.answer===a).length;
  const s50       = mode==="quick" ? cogScore*2 : cogScore;
  const CSM_PASS  = mode==="quick" ? 11 : 22;
  const passed    = cogScore >= CSM_PASS;

  const perAlignment = perQs.reduce((acc,q,i)=>{
    const a=perAns[i]; if(!a) return acc;
    return acc+(a===q.csm||(a==="Neither Agree nor Disagree"&&q.csm==="Neither")?1:0);
  },0);
  const perPct = Object.keys(perAns).length>0 ? Math.round((perAlignment/Object.keys(perAns).length)*100) : 0;

  const motAlignment = motQs.reduce((acc,q,i)=>{
    const a=motAns[i]; if(!a) return acc;
    return acc+(a.first===q.csm?1:0);
  },0);
  const motPct = Object.keys(motAns).length>0 ? Math.round((motAlignment/Object.keys(motAns).length)*100) : 0;

  const getRoleTier = (s) => {
    if(s>=31) return {roles:["Security Analyst 🔐","Software Engineer 💻","Intelligence Analyst 🕵️","Data Scientist 📊"],label:"Technical / Analytical",color:"#7B5EA7",bg:"#F3EEFF",note:"Top 15% of test takers."};
    if(s>=27) return {roles:["Threat Intel Engineer 🛡️","Project Manager 📋","IT Manager 🖥️","Operations Manager 🏢"],label:"Management / Specialist",color:"#5A9EFF",bg:"#EAF3FF",note:"Above average. Competitive for management-track roles."};
    if(s>=22) return {roles:["Customer Success Manager ✅","Account Executive 🤝","Sales Manager 📈","Marketing Coordinator 📣"],label:"Client-Facing / Business",color:"#5ABF5A",bg:"#EDFFF3",note:"Meets the CSM benchmark. Strong fit for relationship-driven roles."};
    if(s>=17) return {roles:["Customer Support Rep 🎧","Admin Assistant 🗂️","Inside Sales Rep 📞","Office Coordinator 📝"],label:"Admin / Support",color:"#FF8C5A",bg:"#FFF3EC",note:"Average range. Suited for structured, process-driven roles."};
    return {roles:["Data Entry Clerk ⌨️","Receptionist 🪑","Warehouse Associate 📦"],label:"Entry-Level / Operational",color:"#FF5A5A",bg:"#FFF0F0",note:"Below average. More practice will help significantly."};
  };
  const tier = getRoleTier(s50);

  // ─── SHARED STYLES
  const card = { background:"white", borderRadius:22, padding:"30px 26px", boxShadow:"0 20px 60px rgba(0,0,0,0.08)" };
  const pill = (bg, color, text) => <span style={{background:bg,color,fontSize:11,fontWeight:700,padding:"3px 11px",borderRadius:20,display:"inline-block"}}>{text}</span>;

  // ═══════════════════════════════════════════════════════════════════════════
  // INTRO
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen==="intro") return (
    <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#FFF5F0,#F0FFF5)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"24px 16px"}}>
      <div style={{maxWidth:540,width:"100%"}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          <div style={{fontSize:50,marginBottom:8}}>🍉</div>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,color:CORAL,fontWeight:700,textTransform:"uppercase",marginBottom:8}}>Papaya Kiwi Test Prep</div>
          <h1 style={{fontSize:28,fontWeight:900,color:"#1a1a1a",margin:"0 0 6px"}}>Wonderlic Select Mock</h1>
          <p style={{color:"#999",fontSize:13,margin:0}}>Cognitive · Motivation · Personality — questions shuffle every run</p>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:20}}>
          {Object.entries(MODES).map(([key,cfg])=>(
            <button key={key} onClick={()=>startTest(key)} style={{background:"white",border:"2px solid #FFE0D0",borderRadius:20,padding:"26px 18px",cursor:"pointer",textAlign:"center",transition:"all 0.2s",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor=CORAL;e.currentTarget.style.transform="translateY(-3px)";e.currentTarget.style.boxShadow="0 16px 36px rgba(255,140,90,0.2)";}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor="#FFE0D0";e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.06)";}}>
              <div style={{fontSize:36,marginBottom:8}}>{cfg.emoji}</div>
              <div style={{fontSize:16,fontWeight:800,color:"#1a1a1a",marginBottom:8}}>{cfg.label}</div>
              <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:8,flexWrap:"wrap"}}>
                {pill("#FFF0E8",CORAL,`${cfg.cogCount} Cognitive`)}
                {pill("#E8F5FF","#5A9EFF",`${cfg.minutes} min`)}
              </div>
              {key==="full" && <div style={{marginTop:4}}>{pill("#E8FFE8","#5ABF5A","+ Motivation + Personality")}</div>}
              <div style={{fontSize:11,color:"#bbb",marginTop:10}}>{cfg.desc}</div>
            </button>
          ))}
        </div>

        <div style={{...card,padding:"20px 24px",marginBottom:14}}>
          <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:"#ccc",textTransform:"uppercase",marginBottom:12}}>What's Included</div>
          {[
            ["🧠","Cognitive","50 Qs · 12 min · Dates, Series, Opposites, Data, Math, Verbal, Logic"],
            ["🎯","Motivation","2-step forced ranking · Pick MOST, then favorite of remaining 2"],
            ["🧬","Personality","Agree / Neither / Disagree · Untimed · Live CSM coaching tips"],
          ].map(([icon,label,desc])=>(
            <div key={label} style={{display:"flex",gap:10,alignItems:"flex-start",marginBottom:10}}>
              <span style={{fontSize:16}}>{icon}</span>
              <div>
                <div style={{fontSize:13,fontWeight:700,color:"#333"}}>{label}</div>
                <div style={{fontSize:11,color:"#aaa",lineHeight:1.5}}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{background:"#FFF8F0",border:"1px solid #FFD5B8",borderRadius:14,padding:"14px 18px"}}>
          <p style={{margin:0,fontSize:12,color:"#666",lineHeight:1.9}}>
            ⚠️ <strong>Real Wonderlic says:</strong> Guessing is NOT likely to improve your score.<br/>
            ✅ If you have a strong hunch, pick it and move on — don't leave blanks.<br/>
            🎯 <strong>CSM threshold:</strong> 11/25 Quick · 22/50 Full (industry standard)
          </p>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // INSTRUCTION SCREENS
  // ═══════════════════════════════════════════════════════════════════════════
  const INSTRUCTIONS = {
    instructions_cog: {
      emoji: "🧠",
      title: "Cognitive Ability Assessment",
      subtitle: "Instructions",
      color: "#FF8C5A",
      bg: "linear-gradient(135deg,#FFF5F0,#F0FFF5)",
      next: "cog",
      nextLabel: "Start Cognitive Test →",
      nextBg: "linear-gradient(135deg,#FF8C5A,#FF6B35)",
      points: [
        "This is a test of problem-solving skills.",
        `The full assessment contains ${mode ? MODES[mode].cogCount : 50} questions that must be answered without using a calculator, dictionary, or other resources.`,
        `You will have exactly ${mode ? MODES[mode].minutes : 12} minutes to provide as many correct answers as you can.`,
        "Many people do not finish all of the questions, but do your best.",
        "Guessing is not likely to improve your score. However, if you think you know the answer but are not sure, then mark your best choice and move on.",
        "Do not skip around or spend too much time on any one question.",
      ],
      tip: "✏️ Papaya Kiwi tip: Work left to right. If a question takes more than ~15 seconds and you're stuck, make your best guess and keep moving — every question is worth the same 1 point.",
    },
    instructions_mot: {
      emoji: "🎯",
      title: "Motivation Assessment",
      subtitle: "Instructions",
      color: "#5ABF5A",
      bg: "linear-gradient(135deg,#F0FFF8,#FFF5F0)",
      next: "mot",
      nextLabel: "Start Motivation Assessment →",
      nextBg: "linear-gradient(135deg,#5ABF5A,#3A9A3A)",
      points: [
        "The full Motivation assessment will present you with sets of work activities.",
        "For each set of three activities, you will be asked to select the activity that you would MOST like to perform as part of your job.",
        "After this, you will be asked to select your favorite of the remaining two.",
        "When making your selections, do not consider whether you have enough education or training to perform the activity, or how much money you would expect to make performing it.",
        "Simply think about how much you would like or dislike doing it.",
      ],
      tip: "✏️ Papaya Kiwi tip: For a CSM role, lean toward Service and Persuasive activities — helping, educating, advising, and guiding people. The algorithm builds a picture across all questions, so one 'off' pick won't hurt you.",
    },
    instructions_per: {
      emoji: "🧬",
      title: "Personality Assessment",
      subtitle: "Instructions",
      color: "#9E5AFF",
      bg: "linear-gradient(135deg,#F5F0FF,#FFF0F8)",
      next: "per",
      nextLabel: "Start Personality Assessment →",
      nextBg: "linear-gradient(135deg,#9E5AFF,#7B35CC)",
      points: [
        "The full Personality Assessment will consist of 150 statements. You must respond to every statement.",
        "This activity is not timed, but typically takes about 15 minutes to complete.",
        "At any point during the test you can go back and review any of your answers.",
        "Read each statement and choose the response that best describes you.",
        "Please respond candidly. It is important that you be as careful and honest as you can, and give responses that describe you best.",
        "Don't choose a response because it describes the way that you might like to be.",
      ],
      tip: "✏️ Papaya Kiwi tip: The assessment has built-in consistency checks — if you flip-flop on similar statements it gets flagged. Answer as your authentic professional self, not your idealized self. For a CSM role, think: composed, helpful, communicative, proactive.",
    },
  };

  if (["instructions_cog","instructions_mot","instructions_per"].includes(screen)) {
    const inst = INSTRUCTIONS[screen];
    return (
      <div style={{minHeight:"100vh",background:inst.bg,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"24px 16px"}}>
        <div style={{maxWidth:520,width:"100%"}}>
          <div style={{textAlign:"center",marginBottom:24}}>
            <div style={{fontSize:48,marginBottom:8}}>{inst.emoji}</div>
            <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:3,color:inst.color,fontWeight:700,textTransform:"uppercase",marginBottom:6}}>Wonderlic Select</div>
            <h2 style={{fontSize:24,fontWeight:900,color:"#1a1a1a",margin:"0 0 4px"}}>{inst.title}</h2>
            <p style={{color:"#aaa",fontSize:13,margin:0}}>{inst.subtitle}</p>
          </div>

          <div style={{background:"white",borderRadius:22,padding:"28px 28px",boxShadow:"0 20px 60px rgba(0,0,0,0.08)",marginBottom:16}}>
            <div style={{fontSize:12,fontFamily:"monospace",letterSpacing:2,color:"#ccc",textTransform:"uppercase",marginBottom:16}}>Read carefully before beginning</div>
            {inst.points.map((pt,i) => (
              <div key={i} style={{display:"flex",gap:12,marginBottom:14,alignItems:"flex-start"}}>
                <div style={{minWidth:22,height:22,borderRadius:"50%",background:inst.color+"18",color:inst.color,fontSize:11,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{i+1}</div>
                <p style={{margin:0,fontSize:14,color:"#333",lineHeight:1.7}}>{pt}</p>
              </div>
            ))}
          </div>

          <div style={{background:"#FFF8F0",border:`1px solid ${inst.color}40`,borderRadius:14,padding:"14px 18px",marginBottom:20}}>
            <p style={{margin:0,fontSize:13,color:"#666",lineHeight:1.7}}>{inst.tip}</p>
          </div>

          <button onClick={()=>setScreen(inst.next)} style={{width:"100%",padding:"16px",background:inst.nextBg,color:"white",border:"none",borderRadius:16,fontSize:16,fontWeight:700,cursor:"pointer",boxShadow:`0 8px 24px ${inst.color}40`}}>
            {inst.nextLabel}
          </button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COGNITIVE
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen==="cog") {
    const q = cogQs[cogIdx]; if(!q) return null;
    const cat = CAT[q.category]||CAT.Math;
    const progress = ((cogIdx+1)/cogQs.length)*100;
    const urgent = timeLeft<60;
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#FFF5F0,#F0FFF5)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"20px 16px"}}>
        <div style={{maxWidth:500,width:"100%"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:12,color:"#888",fontFamily:"monospace"}}>🧠 {cogIdx+1}/{cogQs.length}</div>
            <div style={{fontSize:20,fontWeight:800,color:urgent?"#FF3B30":"#333",fontFamily:"monospace",background:urgent?"#FFF0EE":"#F5F5F5",padding:"5px 14px",borderRadius:18}}>
              {urgent?"⚠️ ":"⏱ "}{fmt(timeLeft)}
            </div>
            <div style={{fontSize:11,color:CORAL,fontWeight:700}}>🍉 Papaya Kiwi</div>
          </div>
          <div style={{height:4,background:"#EEE",borderRadius:4,marginBottom:18}}>
            <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#FF8C5A,#7BC67E)",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
          <div style={card}>
            <div style={{display:"inline-flex",alignItems:"center",gap:6,background:cat.bg,color:cat.accent,fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:18,marginBottom:16}}>
              {cat.label} {q.category}
            </div>
            <p style={{fontSize:16,color:"#1a1a1a",lineHeight:1.7,margin:"0 0 22px",fontWeight:500,whiteSpace:"pre-line"}}>{q.q}</p>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {q.options.map(opt=>{
                const isSel=selected===opt;
                return <button key={opt} onClick={()=>setSelected(opt)} style={{padding:"12px 16px",textAlign:"left",borderRadius:10,cursor:"pointer",fontSize:13,fontWeight:isSel?700:400,transition:"all 0.15s",border:isSel?`2px solid ${cat.accent}`:"2px solid #EEE",background:isSel?cat.bg:"#FAFAFA",color:isSel?cat.accent:"#333"}}>{opt}</button>;
              })}
            </div>
            <div style={{display:"flex",gap:10,marginTop:20}}>
              <button onClick={cogSkip} style={{flex:1,padding:"13px",background:"#F5F5F5",color:"#888",border:"none",borderRadius:12,fontSize:13,fontWeight:600,cursor:"pointer"}}>Skip ⏭</button>
              <button onClick={cogNext} disabled={!selected} style={{flex:2,padding:"13px",background:selected?`linear-gradient(135deg,${cat.accent},#FF6B35)`:"#EEE",color:selected?"white":"#bbb",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:selected?"pointer":"not-allowed",transition:"all 0.2s"}}>
                {cogIdx===cogQs.length-1?(mode==="full"?"Next: Motivation →":"Finish ✓"):"Next →"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MOTIVATION — 2-STEP
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen==="mot") {
    const q = motQs[motIdx]; if(!q) return null;
    const remaining = motStep===2 ? q.options.filter(o=>o!==motFirst) : q.options;
    const progress = ((motIdx + (motStep===2?0.5:0))/motQs.length)*100;
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#F0FFF8,#FFF5F0)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"20px 16px"}}>
        <div style={{maxWidth:500,width:"100%"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:12,color:"#888",fontFamily:"monospace"}}>🎯 Motivation &nbsp;{motIdx+1}/{motQs.length}</div>
            <div style={{background:"#E8FFE8",color:"#5ABF5A",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:18}}>No time limit</div>
            <div style={{fontSize:11,color:CORAL,fontWeight:700}}>🍉 Papaya Kiwi</div>
          </div>
          <div style={{height:4,background:"#EEE",borderRadius:4,marginBottom:18}}>
            <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#5ABF5A,#7BC6FF)",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
          <div style={card}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:14}}>
              <span style={{background:"#E8FFE8",color:"#5ABF5A",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:18}}>🎯 MOTIVATION</span>
              <span style={{background:motStep===1?"#FFF0E8":"#E8F5FF",color:motStep===1?CORAL:"#5A9EFF",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:18}}>
                {motStep===1?"Step 1 of 2: Pick your MOST preferred":"Step 2 of 2: Pick your favorite of the remaining two"}
              </span>
            </div>
            <p style={{fontSize:15,color:"#1a1a1a",lineHeight:1.7,margin:"0 0 6px",fontWeight:600}}>
              {motStep===1 ? q.q : "Which of the remaining two would you prefer?"}
            </p>
            {motStep===2 && <p style={{fontSize:12,color:"#bbb",margin:"0 0 16px"}}>You already picked: <strong style={{color:"#5ABF5A"}}>{motFirst}</strong></p>}
            {motStep===1 && <p style={{fontSize:11,color:"#bbb",margin:"0 0 16px"}}>Don't consider salary or qualifications — just what you'd enjoy most.</p>}
            <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
              {remaining.map(opt=>{
                const isSel=selected===opt;
                return <button key={opt} onClick={()=>setSelected(opt)} style={{padding:"14px 18px",textAlign:"left",borderRadius:12,cursor:"pointer",fontSize:14,fontWeight:isSel?700:400,transition:"all 0.15s",border:isSel?"2px solid #5ABF5A":"2px solid #EEE",background:isSel?"#E8FFE8":"#FAFAFA",color:isSel?"#5ABF5A":"#333",boxShadow:isSel?"0 3px 10px rgba(90,191,90,0.2)":"none"}}>{opt}</button>;
              })}
            </div>
            {/* CSM coaching tip appears in step 2 */}
            {motStep===2 && (
              <div style={{background:"#FFF8F0",border:"1px solid #FFD5B8",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
                <div style={{fontSize:11,fontWeight:700,color:CORAL,marginBottom:6}}>💡 CSM Coaching — what each option signals:</div>
                {remaining.map(opt=>(
                  <div key={opt} style={{fontSize:12,color:"#666",marginBottom:4,lineHeight:1.5}}>
                    <strong style={{color:opt===q.csm?"#5ABF5A":"#333"}}>{opt}:</strong> {q.tips[opt]}
                  </div>
                ))}
              </div>
            )}
            <button onClick={motNext} disabled={!selected} style={{width:"100%",padding:"14px",background:selected?"linear-gradient(135deg,#5ABF5A,#3A9A3A)":"#EEE",color:selected?"white":"#bbb",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:selected?"pointer":"not-allowed",transition:"all 0.2s"}}>
              {motStep===1 ? "Next →" : motIdx===motQs.length-1 ? "Next: Personality →" : "Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // PERSONALITY
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen==="per") {
    const q = perQs[perIdx]; if(!q) return null;
    const progress = ((perIdx+1)/perQs.length)*100;
    const opts = ["Agree","Neither Agree nor Disagree","Disagree"];
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#F5F0FF,#FFF0F8)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"20px 16px"}}>
        <div style={{maxWidth:500,width:"100%"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <div style={{fontSize:12,color:"#888",fontFamily:"monospace"}}>🧬 Personality &nbsp;{perIdx+1}/{perQs.length}</div>
            <div style={{background:"#F3EEFF",color:"#9E5AFF",fontSize:11,fontWeight:700,padding:"5px 14px",borderRadius:18}}>Untimed — be honest</div>
            <div style={{fontSize:11,color:CORAL,fontWeight:700}}>🍉 Papaya Kiwi</div>
          </div>
          <div style={{height:4,background:"#EEE",borderRadius:4,marginBottom:18}}>
            <div style={{height:"100%",width:progress+"%",background:"linear-gradient(90deg,#9E5AFF,#FF8C5A)",borderRadius:4,transition:"width 0.3s"}}/>
          </div>
          <div style={card}>
            <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:16}}>
              <span style={{background:"#F3EEFF",color:"#9E5AFF",fontSize:11,fontWeight:700,padding:"4px 12px",borderRadius:18}}>🧬 PERSONALITY</span>
              <span style={{background:"#F8F8F8",color:"#888",fontSize:11,padding:"4px 12px",borderRadius:18}}>{q.trait}</span>
            </div>
            <p style={{fontSize:18,color:"#1a1a1a",lineHeight:1.7,margin:"0 0 6px",fontWeight:500}}>"{q.statement}"</p>
            <p style={{fontSize:11,color:"#ccc",margin:"0 0 20px"}}>Choose what genuinely describes you — don't pick what you wish were true.</p>
            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {opts.map(opt=>{
                const isSel=selected===opt;
                return <button key={opt} onClick={()=>setSelected(opt)} style={{flex:1,padding:"12px 4px",textAlign:"center",borderRadius:12,cursor:"pointer",fontSize:12,fontWeight:isSel?700:400,transition:"all 0.15s",border:isSel?"2px solid #9E5AFF":"2px solid #EEE",background:isSel?"#F3EEFF":"#FAFAFA",color:isSel?"#9E5AFF":"#666"}}>
                  {opt==="Neither Agree nor Disagree"?"Neither":opt}
                </button>;
              })}
            </div>
            {/* CSM coaching tip */}
            <div style={{background:"#FFF8F0",border:"1px solid #FFD5B8",borderRadius:10,padding:"12px 14px",marginBottom:18}}>
              <div style={{fontSize:11,fontWeight:700,color:CORAL,marginBottom:4}}>💡 CSM Coaching</div>
              <div style={{fontSize:12,color:"#777",lineHeight:1.6}}>
                <strong>CSM-aligned answer: {q.csm==="Neither"?"Neither":q.csm}</strong><br/>{q.tip}
              </div>
            </div>
            <button onClick={perNext} disabled={!selected} style={{width:"100%",padding:"14px",background:selected?"linear-gradient(135deg,#9E5AFF,#7B35CC)":"#EEE",color:selected?"white":"#bbb",border:"none",borderRadius:12,fontSize:14,fontWeight:700,cursor:selected?"pointer":"not-allowed",transition:"all 0.2s"}}>
              {perIdx===perQs.length-1?"View Results ✓":"Next →"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // RESULTS
  // ═══════════════════════════════════════════════════════════════════════════
  if (screen==="results") {
    const timeUsed = totalTime - timeLeft;
    const cogGrade = s50>=31?"Exceptional 🌟":s50>=27?"Strong 💪":s50>=22?"Solid 👍":s50>=17?"Average 📊":"Below Average 📚";
    const cogColor = s50>=31?"#7B5EA7":s50>=27?"#5A9EFF":s50>=22?"#5ABF5A":s50>=17?"#FF8C5A":"#FF5A5A";
    return (
      <div style={{minHeight:"100vh",background:"linear-gradient(135deg,#FFF5F0,#F0FFF5)",fontFamily:"Georgia,serif",padding:"28px 16px"}}>
        <div style={{maxWidth:560,margin:"0 auto"}}>

          {/* PASS / FAIL */}
          <div style={{borderRadius:20,padding:"26px 28px",marginBottom:16,textAlign:"center",background:passed?"linear-gradient(135deg,#E8FFF0,#D0F5E0)":"linear-gradient(135deg,#FFF0F0,#FFE0E0)",border:`2px solid ${passed?"#5ABF5A":"#FF5A5A"}`,boxShadow:passed?"0 12px 36px rgba(90,191,90,0.15)":"0 12px 36px rgba(255,90,90,0.15)"}}>
            <div style={{fontSize:48,marginBottom:8}}>{passed?"🎉":"😓"}</div>
            <div style={{fontSize:19,fontWeight:900,color:passed?"#2E8B57":"#CC3333",marginBottom:8}}>
              {passed?"Congratulations! You qualify for":"Sorry, keep studying for"}
            </div>
            <div style={{display:"inline-block",background:passed?"#2E8B57":"#CC3333",color:"white",fontSize:15,fontWeight:800,padding:"7px 22px",borderRadius:20,marginBottom:10}}>
              Customer Success Manager
            </div>
            <div style={{fontSize:12,color:passed?"#3a9a5a":"#CC3333",fontWeight:600}}>
              {passed?`You scored ${cogScore}/${cogQs.length} — CSM threshold is ${CSM_PASS}/${cogQs.length} (22/50 industry standard).`:`You scored ${cogScore}/${cogQs.length} — you need ${CSM_PASS}/${cogQs.length} (22/50 standard). Keep going! 💪`}
            </div>
          </div>

          {/* SCORE CARDS */}
          <div style={{display:"grid",gridTemplateColumns:mode==="full"?"1fr 1fr 1fr":"1fr",gap:12,marginBottom:16}}>
            <div style={{background:"white",borderRadius:16,padding:"18px 12px",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}>
              <div style={{fontSize:11,color:"#bbb",marginBottom:4}}>🧠 Cognitive</div>
              <div style={{fontSize:28,fontWeight:900,color:cogColor}}>{cogScore}/{cogQs.length}</div>
              <div style={{fontSize:10,color:"#ccc",marginBottom:4}}>~{s50}/50 scaled</div>
              <div style={{fontSize:11,color:cogColor,fontWeight:700}}>{cogGrade}</div>
            </div>
            {mode==="full" && <>
              <div style={{background:"white",borderRadius:16,padding:"18px 12px",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:11,color:"#bbb",marginBottom:4}}>🎯 Motivation</div>
                <div style={{fontSize:28,fontWeight:900,color:"#5ABF5A"}}>{motPct}%</div>
                <div style={{fontSize:10,color:"#ccc",marginBottom:4}}>CSM alignment</div>
                <div style={{fontSize:11,color:"#5ABF5A",fontWeight:700}}>{motPct>=75?"Great fit":motPct>=50?"Good fit":"Review tips"}</div>
              </div>
              <div style={{background:"white",borderRadius:16,padding:"18px 12px",textAlign:"center",boxShadow:"0 8px 24px rgba(0,0,0,0.06)"}}>
                <div style={{fontSize:11,color:"#bbb",marginBottom:4}}>🧬 Personality</div>
                <div style={{fontSize:28,fontWeight:900,color:"#9E5AFF"}}>{perPct}%</div>
                <div style={{fontSize:10,color:"#ccc",marginBottom:4}}>CSM alignment</div>
                <div style={{fontSize:11,color:"#9E5AFF",fontWeight:700}}>{perPct>=75?"Great fit":perPct>=50?"Good fit":"Review tips"}</div>
              </div>
            </>}
          </div>

          {/* ROLE SUGGESTIONS */}
          <div style={{...card,padding:"22px 24px",marginBottom:16}}>
            <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:"#ccc",textTransform:"uppercase",marginBottom:4}}>Your ~{s50}/50 suggests</div>
            <div style={{fontSize:15,fontWeight:800,color:tier.color,marginBottom:4}}>📌 {tier.label}</div>
            <div style={{fontSize:12,color:"#888",marginBottom:14}}>{tier.note}</div>
            <div style={{display:"flex",flexWrap:"wrap",gap:7,marginBottom:18}}>
              {tier.roles.map(r=><span key={r} style={{background:tier.bg,color:tier.color,fontSize:12,fontWeight:700,padding:"5px 12px",borderRadius:18}}>{r}</span>)}
            </div>
            <div style={{borderTop:"1px solid #F5F5F5",paddingTop:14}}>
              <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:"#ccc",textTransform:"uppercase",marginBottom:10}}>Wonderlic Benchmarks (/50)</div>
              {[["31–50","Technical / Engineering","#7B5EA7"],["27–30","Management / Specialist","#5A9EFF"],["22–26","CSM / Sales / Business","#5ABF5A"],["17–21","Admin / Support","#FF8C5A"],["0–16","Entry-Level / Operational","#FF5A5A"]].map(([range,label,color])=>(
                <div key={range} style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <span style={{fontFamily:"monospace",fontSize:11,fontWeight:700,color,minWidth:46}}>{range}</span>
                  <div style={{flex:1,height:5,background:"#F5F5F5",borderRadius:3}}>
                    <div style={{height:"100%",width:`${Math.min(parseInt(range)*1.8,100)}%`,background:color,borderRadius:3,opacity:tier.color===color?1:0.3}}/>
                  </div>
                  <span style={{fontSize:11,color:tier.color===color?color:"#ccc",fontWeight:tier.color===color?700:400,minWidth:190}}>{label}{tier.color===color?" ← you":""}</span>
                </div>
              ))}
            </div>
          </div>

          {/* COGNITIVE ANSWER REVIEW */}
          <div style={{...card,padding:"22px 24px",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:"#333",marginBottom:4}}>🧠 Cognitive — Answer Review & Explanations</div>
            <div style={{fontSize:12,color:"#aaa",marginBottom:16}}>Every question includes the method so you learn the pattern, not just the answer.</div>
            {cogQs.map((q,i)=>{
              const userAns=cogAns[i];
              const correct=userAns===q.answer;
              const wasSkipped=skipped.has(i)&&!userAns;
              return (
                <div key={i} style={{marginBottom:16,paddingBottom:16,borderBottom:i<cogQs.length-1?"1px solid #F5F5F5":"none"}}>
                  <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{fontSize:14,minWidth:20}}>{correct?"✅":wasSkipped?"⏭️":"❌"}</span>
                    <div style={{flex:1}}>
                      <div style={{fontSize:11,color:"#ccc",marginBottom:2}}>Q{i+1} · {q.category}</div>
                      <div style={{fontSize:13,color:"#333",marginBottom:4,lineHeight:1.5,whiteSpace:"pre-line"}}>{q.q}</div>
                      {!correct&&<div style={{fontSize:12,color:"#5ABF5A",fontWeight:600,marginBottom:2}}>✓ Correct: {q.answer}</div>}
                      {!correct&&userAns&&<div style={{fontSize:12,color:"#FF5A5A",marginBottom:4}}>✗ Your answer: {userAns}</div>}
                      {wasSkipped&&<div style={{fontSize:12,color:"#ccc",marginBottom:4}}>Skipped</div>}
                      <div style={{background:"#FFF8F0",border:"1px solid #FFE0C8",borderRadius:8,padding:"8px 12px",marginTop:4}}>
                        <div style={{fontSize:11,fontWeight:700,color:CORAL,marginBottom:3}}>📖 How to solve it</div>
                        <div style={{fontSize:12,color:"#666",lineHeight:1.6}}>{q.explain}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {mode==="full" && perQs.length>0 && (
            <div style={{...card,padding:"22px 24px",marginBottom:16}}>
              <div style={{fontSize:14,fontWeight:700,color:"#333",marginBottom:4}}>🧬 Personality — CSM Coaching Review</div>
              <div style={{fontSize:12,color:"#aaa",marginBottom:14}}>✅ = CSM-aligned · ⚠️ = worth reconsidering for this role</div>
              {perQs.map((q,i)=>{
                const ans=perAns[i]; if(!ans) return null;
                const aligned=ans===q.csm||(ans==="Neither Agree nor Disagree"&&q.csm==="Neither");
                return (
                  <div key={i} style={{marginBottom:12,paddingBottom:12,borderBottom:i<perQs.length-1?"1px solid #F8F8F8":"none"}}>
                    <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
                      <span style={{fontSize:14,minWidth:20}}>{aligned?"✅":"⚠️"}</span>
                      <div>
                        <div style={{fontSize:13,color:"#333",marginBottom:2}}>"{q.statement}"</div>
                        <div style={{fontSize:11,color:"#888"}}>You: <strong>{ans==="Neither Agree nor Disagree"?"Neither":ans}</strong> · CSM ideal: <strong>{q.csm==="Neither"?"Neither":q.csm}</strong></div>
                        {!aligned && <div style={{fontSize:11,color:CORAL,marginTop:3}}>💡 {q.tip}</div>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* ── STUDY GUIDE ── */}
          <StudyGuide />

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <button onClick={()=>startTest(mode)} style={{padding:"14px",background:`linear-gradient(135deg,${CORAL},#FF6B35)`,color:"white",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>Try Again 🔄</button>
            <button onClick={()=>setScreen("intro")} style={{padding:"14px",background:"#F5F5F5",color:"#666",border:"none",borderRadius:14,fontSize:14,fontWeight:700,cursor:"pointer"}}>Change Mode ↩</button>
          </div>
        </div>
      </div>
    );
  }
  return null;
}

// ─── STUDY GUIDE COMPONENT ────────────────────────────────────────────────────
const STUDY_TYPES = [
  {
    id:"dates", emoji:"📅", label:"Dates — Earliest / Latest",
    color:"#5A9EFF", bg:"#EAF3FF",
    method:[
      "Step 1 — Scan years first. Lowest year = earliest. Highest year = latest.",
      "Step 2 — Tie on year? Compare months (Jan=1, Feb=2 ... Dec=12).",
      "Step 3 — Tie on month? Compare day numbers.",
      "If one year stands alone, you're done in 3 seconds — don't read anything else.",
    ],
    traps:["Reading months before eliminating years first — huge time waste.","Confusing earliest (smallest number) with latest (largest number). Re-read the question!"],
    example:{
      q:'Which is the EARLIEST?\nAug. 3, 1995 · Jul. 19, 1995 · Aug. 3, 1994 · Jul. 4, 1996 · Aug. 1, 1994',
      steps:["Year scan: 1994 is the lowest. Two dates have 1994: Aug. 3 and Aug. 1.","Tie on year AND month (both August). Compare days: 1 < 3.","Answer: Aug. 1, 1994 ✅"],
      answer:"Aug. 1, 1994"
    }
  },
  {
    id:"opposites", emoji:"🔄", label:"Opposites in Context",
    color:"#FF8C5A", bg:"#FFF0E8",
    method:[
      "Step 1 — Define the BOLD word in your own words before looking at options.",
      "Step 2 — Eliminate any option that is a SYNONYM of the bold word first.",
      "Step 3 — Eliminate options that are unrelated to the bold word's meaning.",
      "Step 4 — Pick the most precise antonym from what's left.",
    ],
    traps:["Picking an emotional opposite instead of a precise antonym (e.g. 'angry' vs 'unsatisfied').","Choosing a similar-looking word (e.g. 'Superior' for SUPERFLUOUS).","Picking a synonym of the bold word by accident — always eliminate those first."],
    example:{
      q:'"Her presentation was CONCISE and well-received by the board."\nWhat is the OPPOSITE of CONCISE?\n→ Long-winded · Clear · Polished · Brief · Simple',
      steps:["Define: CONCISE = brief, using few words.","Eliminate synonyms: 'Brief' = same as concise. Gone.","Eliminate unrelated: 'Clear' and 'Polished' are about quality, not length.","Remaining: Long-winded vs Simple. LONG-WINDED = using too many words = direct opposite."],
      answer:"Long-winded ✅"
    }
  },
  {
    id:"series", emoji:"🔢", label:"Number Series",
    color:"#9E5AFF", bg:"#F3EEFF",
    method:[
      "Step 1 — Subtract consecutive pairs to find the gaps: b-a, c-b, d-c...",
      "Step 2 — Are the gaps equal? → Simple addition/subtraction rule. Done.",
      "Step 3 — Gaps not equal? → Try multiplying/dividing pairs instead.",
      "Step 4 — Still no pattern? → Look at the gaps themselves — they often +1 or follow odd numbers.",
    ],
    traps:["Jumping straight to answer choices before finding the rule.","Forgetting to check for multiplication when addition gaps aren't constant.","Missing second-level patterns (gaps that have their own pattern)."],
    example:{
      q:"What is the next number?\n1 · 2 · 4 · 7 · 11 · 16 · ___",
      steps:["Find gaps: 2-1=1, 4-2=2, 7-4=3, 11-7=4, 16-11=5.","Gaps aren't equal but they increase by 1 each time (+1,+2,+3,+4,+5).","Next gap = +6. Answer: 16+6 = 22."],
      answer:"22 ✅"
    }
  },
  {
    id:"data", emoji:"📊", label:"Data & Graph Trends",
    color:"#00B8A9", bg:"#E8FFFD",
    method:[
      "Step 1 — Don't look at the graphs first. Read the numbers.",
      "Step 2 — Track direction between each pair: ↑ up, ↓ down, → flat.",
      "Step 3 — Describe the shape in words: 'up, dip, up, sharp rise'.",
      "Step 4 — Match your word description to the graph that fits.",
      "For averages: sum all values ÷ count. Add carefully — rushing causes errors.",
    ],
    traps:["Looking at graphs before tracing the numbers — wastes time and biases you.","Forgetting that irrelevant details (e.g. pizza size, item names) are deliberate distractions.","Misadding a sum under time pressure — write running totals as you add."],
    example:{
      q:"Orders: 27, 99, 80, 115, 213 over 5 hours. Which graph fits?",
      steps:["Trace: 27→99 ↑, 99→80 ↓ (dip), 80→115 ↑, 115→213 ↑ (sharp).","Description: up, dip, up, sharp rise.","Match to graph 4 — goes up, small dip in middle, then climbs steeply."],
      answer:"Graph 4 (up, dip, then sharp rise) ✅"
    }
  },
  {
    id:"math", emoji:"➕", label:"Math Word Problems",
    color:"#FFAA00", bg:"#FFF8E8",
    method:[
      "PERCENTAGES: Break into 10% chunks. 15% = 10% + 5%. Never add % directly.",
      "DISCOUNTS/MARKUP: Apply sequentially to a base of $100. Never subtract % from %.",
      "RATE PROBLEMS: Find the unit rate first (per 1), then scale up.",
      "WORKERS/TIME: Workers × Days = total work. Divide by new worker count.",
      "FRACTIONS: Find the fraction the added amount represents, scale to whole.",
      "CONVERT UNITS FIRST: minutes→hours (÷60), then apply the formula.",
    ],
    traps:["Adding/subtracting percentages directly (40%-20% ≠ 20% net change — always use a base).","Adding 20% to a discounted price instead of working backwards (÷ 0.80).","Ignoring irrelevant info planted in the question (pizza size, item color, etc.)."],
    example:{
      q:"A store marks up goods 40% then offers a 20% discount. Net change?",
      steps:["Start at $100 as your base.","Apply +40%: $100 × 1.40 = $140.","Apply -20% to the NEW price: $140 × 0.80 = $112.","Net change from $100 to $112 = +12%."],
      answer:"+12% ✅ (not +20% — the trap answer)"
    }
  },
  {
    id:"verbal", emoji:"📖", label:"Verbal Analogies & Vocabulary",
    color:"#5ABF5A", bg:"#EDFFF3",
    method:[
      "ANALOGIES: Name the relationship in a sentence before looking at options.",
      "Common relationships: creator→creation, tool→user, category→member, opposites, synonyms.",
      "VOCABULARY: Eliminate the obvious opposite first. Then eliminate near-synonyms of the word.",
      "Word roots help: loqu=speak, mit=send, prag=do, ten=hold, cand=white/pure.",
      "POSITION ANALOGIES (Jan:Jul :: Mon:___): Count the gap, apply to second pair.",
    ],
    traps:["For analogies — picking an answer that's related to the topic but has the WRONG relationship.","For vocab — choosing a word that sounds similar to the target word (Superior vs Superfluous).","For position analogies — forgetting to count from 1 correctly."],
    example:{
      q:"Book is to Author as Painting is to ___\n→ Canvas · Museum · Artist · Color · Frame",
      steps:["Name the relationship: 'An [Author] CREATES a [Book].'","Apply: 'A [___] CREATES a [Painting].'","Canvas = what you paint ON. Museum = where it's shown. Both wrong relationship type.","Answer: Artist — the creator of a painting."],
      answer:"Artist ✅"
    }
  },
  {
    id:"logic", emoji:"🧩", label:"Logic & Deduction",
    color:"#C05AFF", bg:"#F8E8FF",
    method:[
      "ORDERING: Build a chain from the clues (A > B > C). Last = smallest/youngest/least.",
      "SYLLOGISMS: Only conclude what is GUARANTEED. 'Some' never means 'all' or 'none'.",
      "ODD ONE OUT: Find the shared category of most items, identify what breaks it.",
      "LETTER SERIES: Assign numbers (A=1...Z=26), find the numeric pattern.",
      "If the conclusion uses 'all' or 'none' but the premise only says 'some' — it's wrong.",
    ],
    traps:["Over-concluding from 'some' — 'some X are Y' never means 'all X are Y'.", "Picking the odd one out based on surface appearance instead of category.","For letter series — not realizing every other letter is being skipped."],
    example:{
      q:"All managers are employees. Some employees work remotely. Therefore:\n→ All managers work remotely · Some managers may work remotely · No managers work remotely",
      steps:["Managers ⊂ Employees. Some employees work remotely.","That 'some' might include managers... or not. We can't be certain either way.","'All managers' and 'No managers' both over-conclude from 'some'. Eliminate both.","Only safe answer: 'Some managers MAY work remotely.'"],
      answer:"Some managers may work remotely ✅"
    }
  },
];

function StudyGuide() {
  const [open, setOpen] = useState(false);
  const [activeType, setActiveType] = useState(null);

  return (
    <div style={{marginBottom:16}}>
      <button onClick={()=>setOpen(o=>!o)} style={{width:"100%",padding:"16px",background:"white",border:"2px solid #FFE0D0",borderRadius:16,fontSize:14,fontWeight:700,color:"#FF8C5A",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",boxShadow:"0 4px 16px rgba(0,0,0,0.05)"}}>
        <span>📚 Cognitive Study Guide — All 7 Question Types</span>
        <span style={{fontSize:18}}>{open?"▲":"▼"}</span>
      </button>

      {open && (
        <div style={{background:"white",borderRadius:"0 0 16px 16px",padding:"20px 20px",boxShadow:"0 8px 24px rgba(0,0,0,0.06)",borderTop:"none",border:"2px solid #FFE0D0",borderTopWidth:0}}>
          <p style={{fontSize:12,color:"#aaa",margin:"0 0 16px"}}>Tap any type to see the method, traps to avoid, and a worked example.</p>

          {/* Type selector pills */}
          <div style={{display:"flex",flexWrap:"wrap",gap:8,marginBottom:20}}>
            {STUDY_TYPES.map(t=>(
              <button key={t.id} onClick={()=>setActiveType(activeType===t.id?null:t.id)} style={{padding:"7px 14px",borderRadius:20,border:`2px solid ${activeType===t.id?t.color:"#EEE"}`,background:activeType===t.id?t.bg:"#FAFAFA",color:activeType===t.id?t.color:"#888",fontSize:12,fontWeight:700,cursor:"pointer",transition:"all 0.15s"}}>
                {t.emoji} {t.label.split("—")[0].trim()}
              </button>
            ))}
          </div>

          {/* Active type detail */}
          {activeType && (() => {
            const t = STUDY_TYPES.find(x=>x.id===activeType);
            return (
              <div style={{background:t.bg,borderRadius:14,padding:"20px 20px",border:`1px solid ${t.color}30`}}>
                <div style={{fontSize:16,fontWeight:800,color:t.color,marginBottom:16}}>{t.emoji} {t.label}</div>

                <div style={{marginBottom:16}}>
                  <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:t.color,textTransform:"uppercase",marginBottom:10}}>The Method</div>
                  {t.method.map((m,i)=>(
                    <div key={i} style={{display:"flex",gap:10,marginBottom:8,alignItems:"flex-start"}}>
                      <span style={{minWidth:20,height:20,borderRadius:"50%",background:t.color,color:"white",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",marginTop:1}}>{i+1}</span>
                      <p style={{margin:0,fontSize:13,color:"#333",lineHeight:1.6}}>{m}</p>
                    </div>
                  ))}
                </div>

                <div style={{marginBottom:16,background:"#FFF0F0",borderRadius:10,padding:"12px 14px",border:"1px solid #FFD0D0"}}>
                  <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:"#FF5A5A",textTransform:"uppercase",marginBottom:8}}>⚠️ Common Traps</div>
                  {t.traps.map((trap,i)=>(
                    <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                      <span style={{color:"#FF5A5A",fontSize:12,marginTop:1}}>✗</span>
                      <p style={{margin:0,fontSize:12,color:"#666",lineHeight:1.6}}>{trap}</p>
                    </div>
                  ))}
                </div>

                <div style={{background:"white",borderRadius:10,padding:"14px 16px",border:`1px solid ${t.color}30`}}>
                  <div style={{fontSize:11,fontFamily:"monospace",letterSpacing:2,color:t.color,textTransform:"uppercase",marginBottom:10}}>📖 Worked Example</div>
                  <p style={{fontSize:13,color:"#333",fontWeight:600,marginBottom:12,lineHeight:1.6,whiteSpace:"pre-line"}}>{t.example.q}</p>
                  <div style={{marginBottom:10}}>
                    {t.example.steps.map((s,i)=>(
                      <div key={i} style={{display:"flex",gap:8,marginBottom:6,alignItems:"flex-start"}}>
                        <span style={{fontSize:12,color:t.color,minWidth:16}}>→</span>
                        <p style={{margin:0,fontSize:12,color:"#555",lineHeight:1.6}}>{s}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{background:t.bg,borderRadius:8,padding:"8px 12px",display:"inline-block"}}>
                    <span style={{fontSize:13,fontWeight:800,color:t.color}}>Answer: {t.example.answer}</span>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
