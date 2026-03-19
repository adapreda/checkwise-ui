import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { BarChart3, SpellCheck, SearchCheck, Brain } from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  BarChart3: <BarChart3 size={24} />,
  SpellCheck: <SpellCheck size={24} />,
  SearchCheck: <SearchCheck size={24} />,
  Brain: <Brain size={24} />,
};

interface AgentCardProps {
  agent: {
    id: string;
    name: string;
    icon: string;
    description: string;
    details: string;
    color: string;
  };
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const AgentCard = ({ agent, index, isOpen, onToggle }: AgentCardProps) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.4 }}
        onClick={onToggle}
        className="group cursor-pointer rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/40 hover:cyber-glow"
      >
        <div className={`mb-3 inline-flex rounded-md bg-gradient-to-br ${agent.color} p-2.5 text-primary-foreground`}>
          {iconMap[agent.icon]}
        </div>
        <h3 className="mb-1 text-sm font-semibold">{agent.name}</h3>
        <p className="text-xs text-muted-foreground">{agent.description}</p>
      </motion.div>

      <Dialog open={isOpen} onOpenChange={onToggle}>
        <DialogContent className="border-border bg-card">
          <DialogHeader>
            <div className={`mb-3 inline-flex w-fit rounded-md bg-gradient-to-br ${agent.color} p-3 text-primary-foreground`}>
              {iconMap[agent.icon]}
            </div>
            <DialogTitle>{agent.name}</DialogTitle>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              {agent.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AgentCard;
