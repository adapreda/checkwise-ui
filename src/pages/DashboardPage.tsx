import { motion } from "framer-motion";
import { historyData } from "@/lib/mock-data";
import { Calendar, Percent, FileText } from "lucide-react";

const DashboardPage = () => {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="min-h-screen px-4 pt-24 pb-12">
      <div className="container mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="mb-2 text-2xl font-bold">Dashboard</h1>
          <p className="mb-6 text-sm text-muted-foreground">Your analysis history at a glance.</p>
        </motion.div>

        {/* Stats row */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          {[
            { icon: FileText, label: "Total Checks", value: historyData.length },
            { icon: Percent, label: "Avg Score", value: `${Math.round(historyData.reduce((a, h) => a + h.score, 0) / historyData.length)}%` },
            { icon: Calendar, label: "Last Check", value: historyData[0].date },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="rounded-lg border border-border bg-card p-4"
            >
              <s.icon size={16} className="mb-2 text-primary" />
              <div className="text-xl font-bold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Table */}
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
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">#</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Text Snippet</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Score</th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {historyData.map((item, i) => (
                  <motion.tr
                    key={item.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + i * 0.05 }}
                    className="border-b border-border last:border-0 hover:bg-muted/30"
                  >
                    <td className="px-4 py-3 font-mono text-muted-foreground">{item.id}</td>
                    <td className="max-w-[300px] truncate px-4 py-3">{item.snippet}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          item.score > 70
                            ? "bg-destructive/10 text-destructive"
                            : item.score > 40
                            ? "bg-primary/10 text-primary"
                            : "bg-emerald-500/10 text-emerald-500"
                        }`}
                      >
                        {item.score}% AI
                      </span>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.date}</td>
                  </motion.tr>
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
