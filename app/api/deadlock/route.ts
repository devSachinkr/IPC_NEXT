import { NextResponse } from "next/server";

export async function POST() {
  await new Promise(r => setTimeout(r, 1500));
  return NextResponse.json({
    logs: [
      "⚠️ Simulating DEADLOCK Scenario...",
      "Worker 1: Acquiring Lock 1...",
      "Worker 2: Acquiring Lock 2...",
      "Worker 1: Trying to acquire Lock 2... (DEADLOCK)",
      "Worker 2: Trying to acquire Lock 1... (DEADLOCK)",
      "🔴 DEADLOCK DETECTED! Both threads stuck.",
      "💡 Solution: Use consistent lock order or timeouts.",
    ],
  });
}
