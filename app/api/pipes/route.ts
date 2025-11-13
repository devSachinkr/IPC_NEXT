import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { message } = await req.json();
  await new Promise(r => setTimeout(r, 1200));
  return NextResponse.json({
    logs: [
      "🧪 Testing PIPE Communication...",
      `Message received: '${message}'`,
      "Processing through pipe...",
      `✅ Pipe Response: Processed: ${message}`,
    ],
  });
}
