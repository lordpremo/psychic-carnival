"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [selector, setSelector] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleScrape = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch("/api/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, selector })
      });

      const data = await res.json();
      if (!data.success) {
        setError(data.error || "Scrape failed");
      } else {
        setResult(data.data);
      }
    } catch (err) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-neutral-900 border border-neutral-700 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">
          BROKEN LORD SCRAPER
        </h1>
        <p className="text-sm text-neutral-400 mb-4 text-center">
          Ingiza URL na (optional) CSS selector kuscrape text, picha, video, links na metadata.
        </p>

        <form onSubmit={handleScrape} className="space-y-4">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-sm"
          />

          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="CSS Selector (optional) — mfano: h1, .title, .product-name"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700 text-sm"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-emerald-500 text-black font-semibold text-sm disabled:opacity-60"
          >
            {loading ? "Inascrape..." : "Scrape Sasa"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-950 border border-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <pre className="mt-4 bg-neutral-950 border border-neutral-700 p-3 rounded max-h-80 overflow-auto text-xs whitespace-pre-wrap">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}

        <p className="mt-6 text-[11px] text-neutral-500 text-center">
          Powered by BROKEN LORD CMD • Public data only • Respect robots.txt
        </p>
      </div>
    </main>
  );
}
