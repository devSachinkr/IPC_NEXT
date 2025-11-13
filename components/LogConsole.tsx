"use client";
import { motion, AnimatePresence } from "framer-motion";

export const LogConsole: React.FC<{ logs: string[] }> = ({ logs }) => (
  <div className="bg-black/70 border border-white/20 rounded-lg p-3 h-64 overflow-y-auto font-mono text-sm shadow-inner">
    <AnimatePresence initial={false}>
      {logs.map((line, i) => (
        <motion.div
          key={i + line}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.2 }}
          className="text-sky-300 whitespace-pre-wrap"
        >
          {line}
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
);
