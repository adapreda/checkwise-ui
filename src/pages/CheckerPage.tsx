import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AgentCard from "@/components/AgentCard";
import ScoreGauge from "@/components/ScoreGauge";
import { agents, mockResults } from "@/lib/mock-data";
import { Send, Loader2 } from "lucide-react";

const MAX_CHARS = 10000;

const CheckerPage = () => {
  const [text, setText] = useState("");
  const [openAgent, setOpenAgent] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<typeof mockResults | null>(null);

  const handleSubmit = () => {
    if (!text.trim() || loading) return;
    setLoading(true);
    setResults(null);
    setTimeout(() => {
      setResults(mockResults);
      setLoading(false);
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 pt-24 pb-12"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-2xl font-bold">AI Text Checker</h1>
          <p className="mb-6 text-sm text-muted-foreground">Paste your text below and let our 4 agents analyze it.</p>
        </motion.div>

        {/* Input area */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 rounded-lg border border-border bg-card p-1"
        >
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
            placeholder="Paste or type your text here..."
            className="min-h-[200px] w-full resize-none rounded-md bg-transparent p-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim() || loading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all disabled:opacity-40 cyber-glow hover:cyber-glow-strong"
            >
              {loading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Verifică
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Agent cards */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              isOpen={openAgent === agent.id}
              onToggle={() => setOpenAgent(openAgent === agent.id ? null : agent.id)}
            />
          ))}
        </div>

        {/* Loading animation */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-col items-center justify-center gap-4 py-16"
            >
              <motion.div
                className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <p className="text-sm text-muted-foreground">Agents are analyzing your text...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {results && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
              className="rounded-lg border border-border bg-card p-6"
            >
              <h2 className="mb-6 text-center text-lg font-bold">Analysis Results</h2>

              {/* Orchestrator score */}
              <div className="mb-8 flex justify-center">
                <div className="flex flex-col items-center">
                  <ScoreGauge score={results.orchestrator} label="Final Verdict" size="lg" />
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="mt-3 text-xs text-muted-foreground"
                  >
                    {results.orchestrator > 70
                      ? "High probability of AI-generated text"
                      : results.orchestrator > 40
                      ? "Mixed signals — partially AI-generated"
                      : "Likely human-written"}
                  </motion.p>
                </div>
              </div>

              {/* Agent scores */}
              <div className="grid grid-cols-3 gap-6">
                <ScoreGauge score={results.statistic} label="Statistic" />
                <ScoreGauge score={results.grammatical} label="Grammatical" />
                <ScoreGauge score={results.factcheck} label="Fact-Check" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckerPage;
