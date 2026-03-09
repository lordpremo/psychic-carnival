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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
        <h1 className="text-2xl font-bold mb-2 text-center">
          BROKEN LORD SCRAPER DASHBOARD
        </h1>
        <p className="text-sm text-slate-400 mb-6 text-center">
          Ingiza URL na CSS selector (optional) kuscrape data kutoka website yoyote.
        </p>

        <form onSubmit={handleScrape} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">URL</label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              CSS Selector (optional)
            </label>
            <input
              type="text"
              value={selector}
              onChange={(e) => setSelector(e.target.value)}
              placeholder="h1, .title, .product-name, n.k."
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-sm transition disabled:opacity-60"
          >
            {loading ? "Inascrape..." : "Scrape Sasa"}
          </button>
        </form>

        {error && (
          <div className="mt-4 text-sm text-red-400 bg-red-950/40 border border-red-700 rounded-lg p-3">
            {error}
          </div>
        )}

        {result && (
          <div className="mt-4">
            <h2 className="text-sm font-semibold mb-2">Matokeo</h2>
            <pre className="w-full max-h-80 overflow-auto text-xs bg-slate-950 border border-slate-700 rounded-lg p-3 whitespace-pre-wrap">
              {typeof result === "string"
                ? result
                : JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <p className="mt-6 text-[11px] text-slate-500 text-center">
          Powered by BROKEN LORD CMD • Public scraping only • Respect robots.txt
        </p>
      </div>
    </main>
  );
        }
