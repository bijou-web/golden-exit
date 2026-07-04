import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";

export const Route = createFileRoute("/admin/import")({
  ssr: false,
  component: AdminImport,
});

function AdminImport() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function run() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/public/scrape-listings", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ per_query: 2 }),
      });
      const json = await res.json();
      setResult(json);
    } catch (e: any) {
      setResult({ error: String(e) });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="eyebrow">Admin · Import</div>
        <h1 className="mt-4 font-display text-4xl text-ink">Scrape live listings from the web</h1>
        <p className="mt-4 text-[var(--sage)] max-w-xl">
          Pulls hospitality businesses-for-sale from BizBuySell &amp; BusinessesForSale via Firecrawl,
          extracts structured fields, and inserts as <span className="font-mono-num">verified=false</span> listings.
        </p>
        <button onClick={run} disabled={loading} className="btn-ink mt-8 disabled:opacity-40">
          {loading ? "Scraping…" : "Run scrape"}
        </button>
        {result && (
          <pre className="mt-8 text-xs bg-[var(--sand)] p-4 border border-[var(--border)] overflow-auto max-h-[500px]">
            {JSON.stringify(result, null, 2)}
          </pre>
        )}
      </div>
    </SiteShell>
  );
}