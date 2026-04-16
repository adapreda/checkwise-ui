import { useMemo, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { Send, Loader2 } from "lucide-react";
import AgentCard from "@/components/AgentCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { agents } from "@/lib/mock-data";
import { verifyText, type TextVerificationResponse } from "@/lib/statistical-agent";

const MAX_CHARS = 10000;
const MIN_TEXT_CHARS = 10;

const formatVisibleVerdictLabel = (result: TextVerificationResponse) =>
  result.verdict === "likely AI-generated"
    ? `${result.percentage}% likely AI-written`
    : `${result.percentage}% likely human-written`;

interface CheckerPageProps {
  userEmail?: string;
}

const CheckerPage = ({ userEmail }: CheckerPageProps) => {
  const [text, setText] = useState("");
  const [url, setUrl] = useState("");
  const [openAgent, setOpenAgent] = useState<string | null>(null);
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlStatus, setUrlStatus] = useState<string | null>(null);
  const [textLoading, setTextLoading] = useState(false);
  const [textValidationError, setTextValidationError] = useState<string | null>(null);
  const resolvedUserEmail =
    userEmail ??
    (typeof window !== "undefined"
      ? (() => {
          const storedUser = window.localStorage.getItem("checkwise-user");
          if (!storedUser) return undefined;

          try {
            const parsedUser = JSON.parse(storedUser) as { email?: string };
            return parsedUser.email;
          } catch {
            return undefined;
          }
        })()
      : undefined);
  const trimmedUserEmail = resolvedUserEmail?.trim();

  const textVerificationMutation = useMutation<
    TextVerificationResponse,
    Error,
    { text: string }
  >({
    mutationFn: ({ text }) => {
      console.log("handleVerifyText: mutationFn started", {
        hasUserEmail: Boolean(trimmedUserEmail),
        textLength: text.length,
      });

      if (!trimmedUserEmail || trimmedUserEmail.length < 3) {
        throw new Error("Please sign in before verifying text.");
      }

      console.log("handleVerifyText: calling verifyText");
      return verifyText({ userEmail: trimmedUserEmail, text });
    },
    onError: (error) => {
      console.error("Text verification mutation failed", error);
    },
  });

  const handleTextSubmit = async () => {
    const trimmedText = text.trim();
    setTextValidationError(null);
    console.log("handleVerifyText: button clicked", {
      rawLength: text.length,
      trimmedLength: trimmedText.length,
      isPending: textVerificationMutation.isPending,
      textLoading,
    });

    if (!trimmedText) {
      console.warn("handleVerifyText: aborting because text is empty");
      setTextValidationError("Please paste or type text before verifying.");
      return;
    }

    if (textLoading || textVerificationMutation.isPending) {
      console.warn("handleVerifyText: aborting because a text verification request is already running");
      return;
    }

    if (trimmedText.length < MIN_TEXT_CHARS) {
      console.warn("handleVerifyText: aborting because text is too short");
      setTextValidationError(`Please enter at least ${MIN_TEXT_CHARS} characters of text.`);
      return;
    }

    if (!trimmedUserEmail || trimmedUserEmail.length < 3) {
      console.warn("handleVerifyText: aborting because the user email is invalid");
      setTextValidationError("Please sign in with a valid email before verifying text.");
      return;
    }

    try {
      setTextLoading(true);
      console.log("handleVerifyText: invoking mutateAsync");
      await textVerificationMutation.mutateAsync({ text: trimmedText });
      console.log("handleVerifyText: mutation resolved successfully");
    } catch (error) {
      console.error("handleVerifyText: mutation rejected", error);
    } finally {
      setTextLoading(false);
      console.log("handleVerifyText: loading state reset");
    }
  };

  const handleUrlSubmit = () => {
    if (!url.trim() || urlLoading) return;
    setUrlLoading(true);
    setUrlStatus(null);
    setTimeout(() => {
      setUrlStatus("URL verification is not connected to the backend yet.");
      setUrlLoading(false);
    }, 1200);
  };

  const highlightedText = useMemo(() => {
    const result = textVerificationMutation.data;
    const spans = result?.highlights?.length ? result.highlights : [];

    if (!result || spans.length === 0) {
      return textVerificationMutation.data ? [text] : null;
    }

    const sortedSpans = [...spans].sort((a, b) => a.start - b.start);
    const nodes: ReactNode[] = [];
    let cursor = 0;

    sortedSpans.forEach((span, index) => {
      const safeStart = Math.max(cursor, span.start);
      const safeEnd = Math.min(text.length, span.end);
      if (safeStart > cursor) {
        nodes.push(<span key={`plain-${index}-${cursor}`}>{text.slice(cursor, safeStart)}</span>);
      }
      if (safeEnd > safeStart) {
        nodes.push(
          <mark
            key={`highlight-${index}-${safeStart}`}
            className="rounded bg-blue-500/20 px-0.5 text-foreground"
            title={"reason" in span ? span.reason : "highlighted signal"}
          >
            {text.slice(safeStart, safeEnd)}
          </mark>,
        );
        cursor = safeEnd;
      }
    });

    if (cursor < text.length) {
      nodes.push(<span key={`plain-final-${cursor}`}>{text.slice(cursor)}</span>);
    }

    return nodes;
  }, [text, textVerificationMutation.data]);

  const scorePercentage = textVerificationMutation.data
    ? textVerificationMutation.data.percentage
    : null;
  const visibleVerdictLabel = textVerificationMutation.data
    ? formatVisibleVerdictLabel(textVerificationMutation.data)
    : null;

  const statisticalAgentModalContent = textVerificationMutation.data ? (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-background/40 p-4">
        <h2 className="mb-2 text-base font-semibold text-foreground">{textVerificationMutation.data.verification_title}</h2>
        <p className="text-sm text-muted-foreground">
          Result: <span className="font-semibold text-foreground">{visibleVerdictLabel}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          Confidence: <span className="font-semibold text-foreground">{textVerificationMutation.data.document_assessment.confidence}</span>
        </p>
      </div>

      <div className="rounded-lg border border-border bg-background/40 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Why this text received this rating</h3>
        <div className="space-y-2 text-sm leading-7 text-muted-foreground">
          {textVerificationMutation.data.summary.map((reason) => (
            <p key={reason}>- {reason}</p>
          ))}
        </div>
      </div>

      {textVerificationMutation.data.limitations.length > 0 && (
        <div className="rounded-lg border border-border bg-background/40 p-4">
          <h3 className="mb-3 text-sm font-semibold text-foreground">What lowered confidence</h3>
          <div className="space-y-2 text-sm leading-7 text-muted-foreground">
            {textVerificationMutation.data.limitations.map((item) => (
              <p key={item}>- {item}</p>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border bg-background/40 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Detector details</h3>
        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Detector status: <span className="font-semibold text-foreground">{textVerificationMutation.data.detector_details.status.replaceAll("_", " ")}</span>
          </p>
          {textVerificationMutation.data.detector_details.raw_score !== null && (
            <p>
              Raw score extracted: <span className="font-semibold text-foreground">{textVerificationMutation.data.detector_details.raw_score}</span>
            </p>
          )}
          {textVerificationMutation.data.detector_details.observations.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Observations</h4>
              <div className="space-y-2 leading-7">
                {textVerificationMutation.data.detector_details.observations.map((item) => (
                  <p key={item}>- {item}</p>
                ))}
              </div>
            </div>
          )}
          {textVerificationMutation.data.detector_details.influential_phrases.length > 0 && (
            <div>
              <h4 className="mb-2 text-sm font-semibold text-foreground">Influential phrases</h4>
              <div className="space-y-2 leading-7">
                {textVerificationMutation.data.detector_details.influential_phrases.map((item) => (
                  <p key={item}>- {item}</p>
                ))}
              </div>
            </div>
          )}
          {textVerificationMutation.data.detector_details.technical_note && (
            <div className="border-t border-border pt-3">
              <h4 className="mb-2 text-sm font-semibold text-foreground">Technical note</h4>
              <p>{textVerificationMutation.data.detector_details.technical_note}</p>
            </div>
          )}
          {(textVerificationMutation.data.detector_details.invoke_error_type ||
            textVerificationMutation.data.detector_details.invoke_error_status_code ||
            textVerificationMutation.data.detector_details.diagnostic_timestamp) && (
            <details className="border-t border-border pt-3">
              <summary className="cursor-pointer text-sm font-semibold text-foreground">
                Developer diagnostics
              </summary>
              <div className="mt-3 space-y-2">
                {textVerificationMutation.data.detector_details.invoke_error_type && (
                  <p>Exception type: {textVerificationMutation.data.detector_details.invoke_error_type}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_message && (
                  <p>Error message: {textVerificationMutation.data.detector_details.invoke_error_message}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_status_code !== null &&
                  textVerificationMutation.data.detector_details.invoke_error_status_code !== undefined && (
                    <p>Status code: {textVerificationMutation.data.detector_details.invoke_error_status_code}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_provider && (
                  <p>Provider: {textVerificationMutation.data.detector_details.invoke_error_provider}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_model && (
                  <p>Model: {textVerificationMutation.data.detector_details.invoke_error_model}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_base_url && (
                  <p>Base URL: {textVerificationMutation.data.detector_details.invoke_error_base_url}</p>
                )}
                {textVerificationMutation.data.detector_details.schema_present_keys &&
                  textVerificationMutation.data.detector_details.schema_present_keys.length > 0 && (
                    <p>Returned keys: {textVerificationMutation.data.detector_details.schema_present_keys.join(", ")}</p>
                )}
                {textVerificationMutation.data.detector_details.invoke_error_timeout_seconds !== null &&
                  textVerificationMutation.data.detector_details.invoke_error_timeout_seconds !== undefined && (
                    <p>Timeout (read): {textVerificationMutation.data.detector_details.invoke_error_timeout_seconds}</p>
                )}
                {textVerificationMutation.data.detector_details.raw_output_excerpt && (
                  <p>Raw output excerpt: {textVerificationMutation.data.detector_details.raw_output_excerpt}</p>
                )}
                {textVerificationMutation.data.detector_details.diagnostic_timestamp && (
                  <p>Captured at: {textVerificationMutation.data.detector_details.diagnostic_timestamp}</p>
                )}
              </div>
            </details>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-background/40 p-4">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Highlighted Signals In The Original Text</h3>
        <div className="whitespace-pre-wrap text-sm leading-7 text-foreground">{highlightedText}</div>
      </div>
    </div>
  ) : null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 pb-12 pt-24"
    >
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-2xl font-bold">AI Text Checker</h1>
          <p className="mb-6 text-sm text-muted-foreground">
            Paste your text or submit a URL below and let our 4 agents analyze it.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-4 rounded-lg border border-border bg-card p-1"
        >
          <div className="px-4 pt-4">
            <Label htmlFor="checker-text" className="text-sm font-medium">
              Check text
            </Label>
          </div>
          <div className="relative">
            {textVerificationMutation.data && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 overflow-hidden whitespace-pre-wrap break-words p-4 text-sm leading-normal text-foreground"
              >
                {highlightedText}
              </div>
            )}
            <textarea
              id="checker-text"
              value={text}
              onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
              placeholder="Paste or type your text here..."
              className={`min-h-[200px] w-full resize-none rounded-md bg-transparent p-4 text-sm placeholder:text-muted-foreground focus:outline-none ${
                textVerificationMutation.data ? "relative z-10 text-transparent caret-foreground" : "text-foreground"
              }`}
            />
          </div>
          <div className="flex items-center justify-between border-t border-border px-4 py-2">
            <span className="font-mono text-xs text-muted-foreground">
              {text.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
            </span>
            <button
              type="button"
              onClick={handleTextSubmit}
              disabled={!text.trim() || textLoading}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2 text-sm font-bold text-primary-foreground transition-all cyber-glow hover:cyber-glow-strong disabled:opacity-40"
            >
              {textLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Verify Text
                </>
              )}
            </button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mb-6 rounded-lg border border-border bg-card p-4"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-2">
              <Label htmlFor="checker-url" className="text-sm font-medium">
                Check a URL
              </Label>
              <Input
                id="checker-url"
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Paste a URL to analyze its extracted text"
                className="h-11 bg-background"
                aria-describedby="checker-url-help"
              />
              <p id="checker-url-help" className="text-xs text-muted-foreground">
                Submit a webpage URL so the agents can fetch and analyze its extracted text.
              </p>
            </div>
            <button
              onClick={handleUrlSubmit}
              disabled={!url.trim() || urlLoading}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-bold text-primary-foreground transition-all cyber-glow hover:cyber-glow-strong disabled:opacity-40 sm:min-w-[140px]"
            >
              {urlLoading ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Verify URL
                </>
              )}
            </button>
          </div>
          {urlStatus && <p className="mt-3 text-xs text-muted-foreground">{urlStatus}</p>}
        </motion.div>

        <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {agents.map((agent, i) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              index={i}
              isOpen={openAgent === agent.id}
              onToggle={() => setOpenAgent(openAgent === agent.id ? null : agent.id)}
              modalContent={agent.id === "statistic" ? statisticalAgentModalContent : undefined}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          {(textValidationError || textVerificationMutation.isError) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              {textValidationError ?? textVerificationMutation.error.message}
            </motion.div>
          )}

          {textVerificationMutation.data && scorePercentage !== null && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="rounded-lg border border-border bg-card p-5">
                <h2 className="mb-2 text-lg font-semibold">{textVerificationMutation.data.verification_title}</h2>
                <p className="text-sm text-muted-foreground">
                  Result: <span className="font-semibold text-foreground">{visibleVerdictLabel}</span>
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Open the <span className="font-semibold text-foreground">Statistic Agent</span> card above to view the full analysis details.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default CheckerPage;
