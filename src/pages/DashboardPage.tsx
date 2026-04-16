import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Percent, FileText } from "lucide-react";
import { fetchHistory } from "@/lib/statistical-agent";

interface DashboardPageProps {
  userEmail?: string;
}

const DashboardPage = ({ userEmail }: DashboardPageProps) => {
  const historyQuery = useQuery({
    queryKey: ["history", userEmail],
    queryFn: () => fetchHistory(userEmail ?? ""),
    enabled: Boolean(userEmail),
  });

  const history = historyQuery.data ?? [];
  const averageScore = history.length
    ? `${Math.round(history.reduce((total, item) => total + item.statistical_percentage, 0) / history.length)}%`
    : "0%";
  const lastCheck = history.length ? new Date(history[0].created_at).toLocaleString() : "No checks yet";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-5xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
          <p className="mb-6 text-sm text-muted-foreground">Your analysis history at a glance.</p>
        </motion.div>

        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { icon: FileText, label: "Total Checks", value: history.length },
            { icon: Percent, label: "Avg AI Likelihood", value: averageScore },
            { icon: Calendar, label: "Last Check", value: lastCheck },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <item.icon size={16} className="mb-2 text-primary" />
              <div className="text-xl font-bold">{item.value}</div>
              <div className="text-xs text-muted-foreground">{item.label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Input Type</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Preview</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Rating</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Statistical Agent</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {!userEmail && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      Sign in to view your search history.
                    </td>
                  </tr>
                )}
                {userEmail && historyQuery.isLoading && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      Loading history...
                    </td>
                  </tr>
                )}
                {userEmail && historyQuery.isError && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-destructive">
                      {historyQuery.error.message}
                    </td>
                  </tr>
                )}
                {userEmail && !historyQuery.isLoading && !historyQuery.isError && history.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-muted-foreground">
                      No text verification searches have been stored yet.
                    </td>
                  </tr>
                )}
                {history.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0 hover:bg-muted/30">
                    <td className="px-4 py-3 text-muted-foreground">{item.user_email}</td>
                    <td className="px-4 py-3">{item.input_type}</td>
                    <td className="max-w-[280px] truncate px-4 py-3">{item.text_preview}</td>
                    <td className="px-4 py-3">{item.verification_rating}</td>
                    <td className="px-4 py-3">{item.statistical_percentage}% ({item.confidence})</td>
                    <td className="px-4 py-3 text-muted-foreground">{new Date(item.created_at).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
