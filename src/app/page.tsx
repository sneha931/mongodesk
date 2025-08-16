"use client";

import { useState } from "react";

export default function Home() {
  const [fileText, setFileText] = useState<string>("");
  const [instruction, setInstruction] = useState<string>(
    "Summarize in bullet points for executives. Include key decisions, blockers, owners, and deadlines."
  );
  const [summary, setSummary] = useState<string>("");
  const [emails, setEmails] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string>("");

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    const text = await f.text();
    setFileText(text);
  }

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ transcript: fileText, instruction }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed");
      setSummary(data.summary || "");
    } catch (e: unknown) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  async function sendEmail() {
    setSending(true);
    setError("");
    try {
      const recipients = emails.split(",").map((s) => s.trim());
      const resp = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipients, subject: "AI Summary", body: summary }),
      });
      const data = await resp.json();
      if (!resp.ok) throw new Error(data.error || "Failed");
      alert("✅ Email sent!");
    } catch (e: unknown) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="w-full max-w-3xl bg-white shadow-xl rounded-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          📄 Transcript Summarizer
        </h1>

        {/* Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Transcript (.txt)
          </label>
          <input
            type="file"
            accept=".txt,text/plain"
            onChange={onFileChange}
            className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 
                     file:rounded-full file:border-0 file:text-sm 
                     file:font-semibold file:bg-blue-50 file:text-blue-600 
                     hover:file:bg-blue-100"
          />
        </div>

        {/* Instruction */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Custom Instruction
          </label>
          <textarea
            value={instruction}
            onChange={(e) => setInstruction(e.target.value)}
            rows={4}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Generate Button */}
        <button
          onClick={generate}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "⏳ Generating..." : "⚡ Generate Summary"}
        </button>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        {/* Summary Editor */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Editable Summary
          </label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows={10}
            className="w-full p-3 border rounded-lg shadow-sm font-mono focus:ring-2 focus:ring-green-500"
            placeholder="Your summary will appear here…"
          />
        </div>

        {/* Email Section */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Share via Email (comma-separated)
          </label>
          <input
            type="text"
            value={emails}
            onChange={(e) => setEmails(e.target.value)}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-purple-500"
            placeholder="alice@example.com, bob@example.com"
          />
          <button
            onClick={sendEmail}
            disabled={sending}
            className="mt-3 w-full py-3 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 disabled:opacity-50"
          >
            {sending ? "📤 Sending..." : "📧 Send Email"}
          </button>
        </div>
      </div>
    </main>
  );
}
