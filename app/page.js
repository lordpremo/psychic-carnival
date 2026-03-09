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

        <form onSubmit={handleScrape} className="space-y-4">
          <input
            type="url"
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Enter URL"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
          />

          <input
            type="text"
            value={selector}
            onChange={(e) => setSelector(e.target.value)}
            placeholder="CSS Selector (optional)"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded bg-green-500 text-black font-semibold"
          >
            {loading ? "Scraping..." : "Scrape"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-red-400 bg-red-950 border border-red-700 p-3 rounded">
            {error}
          </div>
        )}

        {result && (
          <pre className="mt-4 bg-neutral-950 border border-neutral-700 p-3 rounded max-h-80 overflow-auto text-xs">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </main>
  );
}
