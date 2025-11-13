"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LogConsole } from "@/components/LogConsole";
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer } from "recharts";

type IPCType = "pipes" | "queue" | "shared" | "deadlock";

export default function IPCDebuggerPage() {
  const [message, setMessage] = useState("Hello from Next.js IPC Debugger!");
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
    appendLog("🚀 IPC Debugger UI Initialized Successfully");
  }, []);

  const callApi = async (type: IPCType) => {
    setIsLoading((s) => ({ ...s, [type]: true }));
    appendLog(`🧪 Running ${type.toUpperCase()} simulation...`);
    try {
      const res = await fetch(`/api/${type}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        data.logs.forEach((line: string, i: number) =>
          setTimeout(() => appendLog(line), i * 300)
        );
      } else {
        appendLog("✅ Simulation complete");
      }
      setCounts((c) => ({ ...c, [type]: c[type] + 1 }));
    } catch (e) {
      appendLog(`❌ Error: ${String(e)}`);
    } finally {
      setIsLoading((s) => ({ ...s, [type]: false }));
    }
  };

  const sendAll = () => {
    appendLog("📤 Sending message to all IPC methods...");
    setRunning(true);
    setTimeout(() => callApi("pipes"), 500);
    setTimeout(() => callApi("queue"), 2500);
    setTimeout(() => callApi("shared"), 4500);
    setTimeout(() => callApi("deadlock"), 6500);
    setTimeout(() => setRunning(false), 8500);
  };

  const clearOutput = () => {
    setLogs([]);
    appendLog("🧹 Logs cleared.");
  };

  const chartData = [
    { name: "Pipes", value: counts.pipes },
    { name: "Queue", value: counts.queue },
    { name: "Shared", value: counts.shared },
    { name: "Deadlock", value: counts.deadlock },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex justify-center items-start p-8">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl w-full"
      >
        <Card className="bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl rounded-2xl p-6">
          <CardHeader className="pb-4">
            <CardTitle className="text-3xl font-semibold text-center text-sky-400 drop-shadow-sm">
              🧩 IPC Debugger Tool — Next.js + shadcn + Framer Motion
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Controls */}
            <motion.div
              className="flex flex-wrap gap-3 justify-center"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Button
                className="bg-sky-500 hover:bg-sky-600 shadow-md"
                onClick={() => callApi("pipes")}
                disabled={isLoading.pipes}
              >
                {isLoading.pipes ? "Running Pipes..." : "Test Pipes"}
              </Button>
              <Button
                className="bg-emerald-500 hover:bg-emerald-600 shadow-md"
                onClick={() => callApi("queue")}
                disabled={isLoading.queue}
              >
                {isLoading.queue ? "Running Queue..." : "Test Message Queue"}
              </Button>
              <Button
                className="bg-indigo-500 hover:bg-indigo-600 shadow-md"
                onClick={() => callApi("shared")}
                disabled={isLoading.shared}
              >
                {isLoading.shared ? "Running Shared..." : "Test Shared Memory"}
              </Button>
              <Button
                className="bg-rose-500 hover:bg-rose-600 shadow-md"
                onClick={() => callApi("deadlock")}
                disabled={isLoading.deadlock}
              >
                {isLoading.deadlock ? "Simulating Deadlock..." : "Simulate Deadlock"}
              </Button>
            </motion.div>

            {/* Input + Send */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="flex-1 bg-white/10 text-white border-white/30 placeholder:text-slate-300"
                placeholder="Enter test message..."
              />
              <Button
                className="bg-sky-400 hover:bg-sky-500 transition-all shadow-lg"
                onClick={sendAll}
                disabled={running}
              >
                Send Test Data
              </Button>
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-white"
                onClick={clearOutput}
              >
                Clear Output
              </Button>
            </div>

            {/* Console + Chart */}
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <LogConsole logs={logs} />
              </div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white/10 backdrop-blur-lg p-4 rounded-lg border border-white/20 shadow-lg"
              >
                <h3 className="text-lg mb-3 text-center text-sky-300 font-medium">
                  IPC Run Summary
                </h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <XAxis dataKey="name" stroke="#94a3b8" />
                      <YAxis allowDecimals={false} stroke="#94a3b8" />
                      <RTooltip />
                      <Line type="monotone" dataKey="value" stroke="#38bdf8" strokeWidth={3} />
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
