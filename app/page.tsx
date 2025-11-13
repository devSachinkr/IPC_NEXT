"use client";

import React, { useEffect, useState, useRef } from "react";
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
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

type IPCType = "pipes" | "queue" | "shared" | "deadlock";

/**
 * Cyberpunk Neon Green Monster — Enhanced UI
 * - Keeps all original labels & functionality unchanged.
 * - Adds animated grid, particles, pulse feedback, radial chart, HUD (read-only).
 */

export default function IPCDebuggerPage() {
  // --- original state & logic (kept intact) ---
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

  // --- New UI-only state (no functional changes to existing logic/data) ---
  const [uptimeSeconds, setUptimeSeconds] = useState(0);
  const startedAtRef = useRef<number | null>(null);
  const [pulseKey, setPulseKey] = useState(0); // triggers global pulse flash
  const [particleSeed] = useState(() =>
    Array.from({ length: 10 }).map((_, i) => ({ id: i, delay: Math.random() * 4 }))
  );

  // start uptime timer on mount
  useEffect(() => {
    startedAtRef.current = Date.now();
    const t = setInterval(() => {
      if (startedAtRef.current) {
        setUptimeSeconds(Math.floor((Date.now() - startedAtRef.current) / 1000));
      }
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const formatUptime = (s: number) => {
    const h = Math.floor(s / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((s % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const sec = Math.floor(s % 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}:${sec}`;
  };

  // radial chart data (visual only)
  const chartData = [
    { name: "Pipes", value: counts.pipes, fill: "#a3e" },
    { name: "Queue", value: counts.queue, fill: "#bef264" },
    { name: "Shared", value: counts.shared, fill: "#00ffff" },
    { name: "Deadlock", value: counts.deadlock, fill: "#ff0000" },
  ];

  // pulse trigger when any button clicked (visual only)
  const triggerPulse = () => setPulseKey((k) => k + 1);

  // wrapper for calls to ensure pulse visual plays (we still call the original functions)
  const handleCall = (t: IPCType) => {
    triggerPulse();
    callApi(t);
  };
  const handleSendAll = () => {
    triggerPulse();
    sendAll();
  };
  const handleClear = () => {
    triggerPulse();
    clearOutput();
  };

  return (
    <main className="min-h-screen bg-[#030712] text-[#d9f99d] font-mono flex justify-center items-start p-8 relative overflow-hidden antialiased">
      {/* STYLE: small embedded CSS only for animations used here */}
      <style>{`
        /* scan line */
        @keyframes scan {
          0% { background-position: 0 0; }
          100% { background-position: 0 60px; }
        }
        .scan-overlay {
          background-image: linear-gradient(rgba(132,204,22,0.04) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(0,0,0,0.6), rgba(0,0,0,0.6));
          background-size: 100% 20px, 100% 100%;
          animation: scan 3s linear infinite;
          pointer-events: none;
        }
        /* slow pulse for HUD / labels */
        @keyframes slowPulse { 0% { opacity: 0.6 } 50% { opacity: 1 } 100% { opacity: 0.6 } }
        .pulse-slow { animation: slowPulse 2.8s ease-in-out infinite; }
        /* click flash */
        .click-flash {
          position: absolute;
          inset: 0;
          border-radius: 18px;
          box-shadow: 0 0 40px rgba(183,230,13,0.18);
          opacity: 0;
          transform: scale(0.96);
          pointer-events: none;
        }
      `}</style>

      {/* animated scan grid background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.06),transparent_70%)]" />
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-[length:36px_36px] opacity-20" />
        <div className="absolute inset-0 scan-overlay" />
      </div>

      {/* floating neon orbs */}
      <div className="absolute -top-24 left-10 w-96 h-96 bg-lime-400/20 blur-[120px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-green-700/12 blur-[160px] rounded-full animate-pulse z-0" />

      {/* animated particles */}
      {particleSeed.map((p) => (
        <motion.span
          key={p.id}
          initial={{ opacity: 0, y: 0, scale: 0.8 }}
          animate={{ opacity: [0, 0.9, 0.15], y: [-6, -40, -8], scale: [0.8, 1.2, 0.9] }}
          transition={{ repeat: Infinity, duration: 6 + Math.random() * 4, delay: p.delay }}
          className="absolute w-1.5 h-1.5 rounded-full bg-lime-300/80 blur-sm z-10"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}

      <div className="max-w-6xl w-full z-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Card className="relative bg-black/70 border border-lime-400/28 backdrop-blur-xl shadow-[0_0_45px_rgba(132,204,22,0.18)] rounded-3xl p-6 overflow-visible">
            {/* click flash (global) */}
            <AnimatePresence>
              <motion.div
                key={pulseKey}
                className="click-flash"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: [0.6, 0], scale: [1, 1.08] }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.9, ease: "easeOut" }}
              />
            </AnimatePresence>

            <CardHeader className="pb-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl md:text-3xl font-extrabold text-lime-300 drop-shadow-[0_0_8px_rgba(132,204,22,0.22)]">
                    🧩 IPC Debugger Tool — Next.js + shadcn + Framer Motion
                  </CardTitle>
                  <p className="mt-1 text-sm text-lime-200/70">
                    Neon monitoring · cyberpunk diagnostics
                  </p>
                </div>

                {/* small HUD */}
                <div className="ml-auto hidden md:flex items-center gap-4 bg-black/40 border border-lime-400/12 rounded-xl px-4 py-2">
                  <div className="text-xs text-lime-200/80">
                    <div className="font-semibold text-sm text-lime-100">Uptime</div>
                    <div className="mt-1 pulse-slow">{formatUptime(uptimeSeconds)}</div>
                  </div>
                  <div className="h-6 border-l border-lime-400/12" />
                  <div className="text-xs text-lime-200/80">
                    <div className="font-semibold text-sm text-lime-100">Messages</div>
                    <div className="mt-1">{counts.pipes + counts.queue + counts.shared + counts.deadlock}</div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Controls */}
              <motion.div
                className="flex flex-wrap gap-3 justify-center"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <Button
                  className="bg-sky-500 hover:bg-sky-600 shadow-md rounded-xl px-4"
                  onClick={() => handleCall("pipes")}
                  disabled={isLoading.pipes}
                >
                  {isLoading.pipes ? "Running Pipes..." : "Test Pipes"}
                </Button>

                <Button
                  className="bg-emerald-500 hover:bg-emerald-600 shadow-md rounded-xl px-4"
                  onClick={() => handleCall("queue")}
                  disabled={isLoading.queue}
                >
                  {isLoading.queue ? "Running Queue..." : "Test Message Queue"}
                </Button>

                <Button
                  className="bg-indigo-500 hover:bg-indigo-600 shadow-md rounded-xl px-4"
                  onClick={() => handleCall("shared")}
                  disabled={isLoading.shared}
                >
                  {isLoading.shared ? "Running Shared..." : "Test Shared Memory"}
                </Button>

                <Button
                  className="bg-rose-500 hover:bg-rose-600 shadow-md rounded-xl px-4"
                  onClick={() => handleCall("deadlock")}
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
                  className="flex-1 bg-black/55 text-lime-100 border border-lime-400/14 placeholder:text-lime-300/50 rounded-lg"
                  placeholder="Enter test message..."
                />
                <Button
                  className="bg-gradient-to-r from-cyan-400 to-lime-400 hover:from-cyan-300 hover:to-lime-300 transition-all shadow-lg rounded-lg px-5"
                  onClick={() => {
                    triggerPulse(); // visual
                    handleSendAll();
                  }}
                  disabled={running}
                >
                  Send Test Data
                </Button>
                <Button
                  variant="ghost"
                  className="text-slate-300 hover:text-white"
                  onClick={() => {
                    triggerPulse();
                    handleClear();
                  }}
                >
                  Clear Output
                </Button>
              </div>

              {/* Console + Right panel */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  {/* console wrapper: improved readability without changing LogConsole */}
                  <div className="bg-[#061007] border border-lime-400/8 rounded-xl p-2 shadow-inner max-h-[420px] overflow-auto">
                    <div className="bg-[#07120a] rounded-md p-3 text-[#d9f99d] text-sm leading-relaxed selection:bg-lime-400/30 selection:text-black">
                      <LogConsole logs={logs} />
                    </div>
                  </div>
                </div>

                <div className="bg-black/50 backdrop-blur-md p-4 rounded-xl border border-lime-400/16 shadow-[0_0_18px_rgba(132,204,22,0.12)]">
                  <h3 className="text-lg mb-2 text-center text-lime-300 font-semibold">IPC Run Summary</h3>

                  <div className="h-44 flex items-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="10%"
                        outerRadius="100%"
                        barSize={12}
                        data={chartData.map((d) => ({ ...d, value: Math.min(d.value, 6) }))}
                        startAngle={180}
                        endAngle={-180}
                      >
                        <RadialBar
                          background={{ fill: "#07120a" }}
                          dataKey="value"
                          cornerRadius={10}
                        />
                        <Legend
                          iconSize={8}
                          layout="vertical"
                          verticalAlign="middle"
                          align="right"
                          wrapperStyle={{ color: "#d9f99d", right: -12, top: 12 }}
                        />
                      </RadialBarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* small metrics */}
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-lime-200/85">
                    <div className="p-2 bg-black/30 border border-lime-400/8 rounded">
                      <div className="font-bold text-sm text-lime-100">Pipes</div>
                      <div>{counts.pipes}</div>
                    </div>
                    <div className="p-2 bg-black/30 border border-lime-400/8 rounded">
                      <div className="font-bold text-sm text-lime-100">Queue</div>
                      <div>{counts.queue}</div>
                    </div>
                    <div className="p-2 bg-black/30 border border-lime-400/8 rounded">
                      <div className="font-bold text-sm text-lime-100">Shared</div>
                      <div>{counts.shared}</div>
                    </div>
                    <div className="p-2 bg-black/30 border border-lime-400/8 rounded">
                      <div className="font-bold text-sm text-lime-100">Deadlock</div>
                      <div>{counts.deadlock}</div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}
