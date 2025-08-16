// lib/ai.ts
export async function generateSummary({
    transcript,
    instruction,
  }: {
    transcript: string;
    instruction: string;
  }) {
    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
  
    // Build a single prompt that includes user instruction and transcript.
    const system = `You are a helpful assistant that writes clear, structured summaries. 
  - Respect the user's instruction exactly.
  - Keep the output concise and well formatted for easy editing.`;
  
    const user = `Instruction:\n${instruction}\n\nTranscript:\n${transcript}`;
  
    if (groqKey) {
      const model = process.env.GROQ_MODEL || "llama-3.1-70b-versatile";
      const resp = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
        }),
      });
  
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`GROQ error: ${resp.status} ${text}`);
      }
      const data = await resp.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    }
  
    if (openaiKey) {
      const model = process.env.OPENAI_MODEL || "gpt-4o-mini";
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: system },
            { role: "user", content: user },
          ],
          temperature: 0.2,
        }),
      });
  
      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`OpenAI error: ${resp.status} ${text}`);
      }
      const data = await resp.json();
      return data.choices?.[0]?.message?.content?.trim() || "";
    }
  
    throw new Error("No AI provider configured. Set GROQ_API_KEY or OPENAI_API_KEY.");
  }
  