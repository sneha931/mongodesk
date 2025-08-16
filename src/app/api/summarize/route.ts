// app/api/summarize/route.ts
import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/ai";

export async function POST(req: Request) {
  try {
    const { transcript, instruction } = await req.json();

    if (!transcript || !instruction) {
      return NextResponse.json(
        { error: "Missing transcript or instruction" },
        { status: 400 }
      );
    }

    const summary = await generateSummary({ transcript, instruction });
    return NextResponse.json({ summary });
  } catch (err: unknown) {
   const error = err as Error;
  console.error(error);
   return NextResponse.json(
    { error: error.message || "Failed to send email" },
    { status: 500 }
  );
  }
}
