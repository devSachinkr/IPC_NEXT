import { NextResponse } from "next/server";

let sharedValue = 0;

export async function POST() {
  const oldVal = sharedValue;
  sharedValue += 5;
  await new Promise(r => setTimeout(r, 800));
  return NextResponse.json({
    logs: [
      "🧪 Testing SHARED MEMORY...",
      `Original Value: ${oldVal}`,
      "Incrementing shared memory by +5...",
      `✅ Shared Memory Updated: ${oldVal} → ${sharedValue}`,
    ],
  });
}
