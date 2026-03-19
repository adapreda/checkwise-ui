export const historyData = [
  { id: 1, snippet: "The quick brown fox jumps over the lazy dog in a manner consistent with...", score: 85, date: "2025-03-18" },
  { id: 2, snippet: "In my personal opinion, the socioeconomic factors that contribute to...", score: 12, date: "2025-03-17" },
  { id: 3, snippet: "According to recent studies, the implementation of machine learning...", score: 92, date: "2025-03-16" },
  { id: 4, snippet: "When I was walking through the park last Tuesday, I noticed something...", score: 8, date: "2025-03-15" },
  { id: 5, snippet: "The advancement of artificial intelligence has led to significant...", score: 78, date: "2025-03-14" },
  { id: 6, snippet: "It is worth noting that the aforementioned paradigm shift represents...", score: 95, date: "2025-03-13" },
];

export const agents = [
  {
    id: "statistic",
    name: "Agent Statistic",
    icon: "BarChart3",
    description: "Analyzes statistical patterns in the text",
    details: "This agent examines connection word repetition frequency, calculates the average sentence length, and measures word predictability using entropy analysis. AI-generated text often shows unnaturally consistent sentence lengths and higher word predictability scores.",
    color: "from-yellow-400 to-amber-500",
  },
  {
    id: "grammatical",
    name: "Agent Grammatical",
    icon: "SpellCheck",
    description: "Evaluates grammar and writing style",
    details: "This agent checks for spelling and punctuation errors, analyzes text formatting patterns, and evaluates the overall writing style. AI text tends to be overly polished with fewer natural errors and a more uniform style compared to human writing.",
    color: "from-cyan-400 to-blue-500",
  },
  {
    id: "factcheck",
    name: "Agent Fact-Check",
    icon: "SearchCheck",
    description: "Verifies factual claims in the text",
    details: "This agent cross-references factual claims made in the text against known databases. AI-generated content sometimes contains plausible-sounding but incorrect or fabricated facts, known as 'hallucinations'.",
    color: "from-emerald-400 to-green-500",
  },
  {
    id: "orchestrator",
    name: "Păpușarul (Orchestrator)",
    icon: "Brain",
    description: "Combines all agent scores into a final verdict",
    details: "The Orchestrator agent weighs the results from the Statistic, Grammatical, and Fact-Check agents. Using an advanced weighting algorithm, it produces a single confidence percentage that represents the overall likelihood the text was AI-generated.",
    color: "from-yellow-400 to-yellow-600",
  },
];

export const mockResults = {
  statistic: 82,
  grammatical: 76,
  factcheck: 88,
  orchestrator: 84,
};
