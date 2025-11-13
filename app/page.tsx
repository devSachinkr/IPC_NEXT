"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogConsole } from "@/components/LogConsole";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RTooltip,
  ResponsiveContainer,
} from "recharts";

type IPCType = "pipes" | "queue" | "shared" | "deadlock";

export default function IPCDebuggerPage() {
  const [message, setMessage] = useState("⚙️ System Online. Awaiting Commands...");
  const [logs, setLogs] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [counts, setCounts] = useState<Record<IPCType, number>>({
    pipes: 0,
    queue: 0,
    shared: 0,
    deadlock: 0,
  });
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({
    pipes: false,
    queue: false,
    shared: false,
    deadlock: false,
  });

  const appendLog = (line: string) => {
    setLogs((l) => [...l, `${new Date().toLocaleTimeString()} — ${line}`]);
  };

  useEffect(() => {
    appendLog("🧠 Neural Link Established");
    appendLog("💀 Cyber Debugger Ready for Execution");
  }, []);

  const callApi = async (type: IPCType) => {
    setIsLoading((s) => ({ ...s, [type]: true }));
    appendLog(`⚔️ Running ${type.toUpperCase()} Protocol...`);
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        data.logs.forEach((line: string, i: number) =>
          setTimeout(() => appendLog(line), i * 200)
        );
      } else appendLog("✅ Operation Complete");
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
    } catch (e) {
      appendLog(`❌ Fatal Error: ${String(e)}`);
    } finally {
      setIsLoading((s) => ({ ...s, [type]: false }));
    }
  };

  const sendAll = () => {
    appendLog("🚀 Deploying All IPC Protocols...");
    setRunning(true);
    setTimeout(() => callApi("pipes"), 500);
    setTimeout(() => callApi("queue"), 2500);
    setTimeout(() => callApi("shared"), 4500);
    setTimeout(() => callApi("deadlock"), 6500);
    setTimeout(() => setRunning(false), 8500);
  };

  const clearOutput = () => {
    setLogs([]);
    appendLog("🧹 Console Purged.");
  };

  const chartData = [
    { name: "Pipes", value: counts.pipes },
    { name: "Queue", value: counts.queue },
    { name: "Shared", value: counts.shared },
    { name: "Deadlock", value: counts.deadlock },
  ];

  return (
    <main className="min-h-screen bg-[#050a06] text-[#d9f99d] font-mono flex justify-center items-start p-8 relative overflow-hidden antialiased">
      {/* Background grid & glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(132,204,22,0.15),transparent_70%)] animate-pulse" />
      <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.92),rgba(0,0,0,0.92)),url('/grid.svg')] bg-[length:40px_40px] opacity-40" />

      {/* neon orbs */}
      <div className="absolute -top-20 left-20 w-96 h-96 bg-lime-400/30 blur-[140px] rounded-full animate-pulse" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-green-700/30 blur-[160px] rounded-full animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl w-full"
      >
        <Card className="relative bg-black/70 border border-lime-400/40 backdrop-blur-xl shadow-[0_0_35px_rgba(132,204,22,0.25)] rounded-3xl p-6 overflow-hidden">
          <div className="absolute inset-0 border border-transparent bg-gradient-to-r from-lime-500/15 to-green-600/15 rounded-3xl pointer-events-none" />

          <CardHeader className="pb-6 text-center">
            <CardTitle className="text-3xl font-extrabold text-lime-400 tracking-widest drop-shadow-[0_0_10px_#84cc16]">
              🧩 IPC Debugger Tool — Next.js + shadcn + Framer Motion
            </CardTitle>
            <p className="text-lime-200/80 text-sm mt-2 italic drop-shadow-[0_0_4px_#65a30d]">
              {"Decrypting inter-process chaos..."}
            </p>
          </CardHeader>

          <CardContent className="space-y-8">
            {/* Controls */}
            <div className="flex flex-wrap gap-4 justify-center">
              {[
                { type: "pipes", label: "PIPE PROTOCOL" },
                { type: "queue", label: "QUEUE LINK" },
                { type: "shared", label: "SHARED CORE" },
                { type: "deadlock", label: "DEADLOCK SIM" },
              ].map(({ type, label }) => (
                <motion.button
                  whileHover={{
                    scale: 1.05,
                    boxShadow: "0 0 25px #a3e635",
                    textShadow: "0 0 5px #bef264",
                  }}
                  whileTap={{ scale: 0.96 }}
                  key={type}
                  className={`relative px-5 py-2 bg-gradient-to-br from-lime-500/15 to-green-700/15 border border-lime-400/40 text-lime-200 hover:text-lime-100 transition-all rounded-xl`}
                  onClick={() => callApi(type as IPCType)}
                  disabled={isLoading[type]}
                >
                  {isLoading[type] ? `⚙️ EXECUTING...` : label}
                </motion.button>
              ))}
            </div>

            {/* Input + Send */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-black/60 border border-lime-400/40 text-lime-100 placeholder:text-lime-300/70 focus:border-lime-400 focus:ring-0 rounded-xl"
                placeholder="Type your cyber message..."
              />
              <Button
                className="bg-gradient-to-r from-lime-500 to-green-600 hover:from-lime-400 hover:to-green-500 text-black font-bold shadow-lg shadow-lime-500/30 rounded-xl transition-all"
                onClick={sendAll}
                disabled={running}
              >
                🚀 DEPLOY ALL
              </Button>
              <Button
                variant="ghost"
                className="text-lime-300 hover:text-lime-100"
                onClick={clearOutput}
              >
                🧹 PURGE
              </Button>
            </div>

            {/* Logs + Chart */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-[#0a0f0a]/90 border border-lime-400/30 rounded-xl shadow-inner p-2 overflow-hidden">
                <div className="bg-[#0b1309]/80 p-3 rounded-lg text-[#ccff99] text-sm font-mono overflow-y-auto max-h-96 leading-relaxed selection:bg-lime-400/30 selection:text-black">
                  <LogConsole logs={logs} />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/60 backdrop-blur-lg p-4 rounded-xl border border-lime-400/40 shadow-[0_0_20px_rgba(132,204,22,0.25)]"
              >
                <h3 className="text-lg mb-3 text-center text-lime-300 font-semibold drop-shadow-[0_0_6px_#84cc16]">
                  📊 SYSTEM RUNS
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" stroke="#a3e635" />
                      <YAxis allowDecimals={false} stroke="#a3e635" />
                      <RTooltip
                        contentStyle={{
                          backgroundColor: "#0a0f0a",
                          border: "1px solid #84cc16",
                          color: "#d9f99d",
                          borderRadius: "6px",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#a3e635"
                        strokeWidth={3}
                        dot={{ r: 4, strokeWidth: 2, fill: "#bef264" }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </main>
  );
}
