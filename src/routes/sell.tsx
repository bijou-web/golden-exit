import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { getAllValuations, type Valuation, formatMoney } from "@/lib/sbs-data";

export const Route = createFileRoute("/sell")({
  ssr: false,
  component: SellPage,
});

function SellPage() {
  const [vals, setVals] = useState<Valuation[]>([]);
  useEffect(() => {
    const all = getAllValuations();
    setVals(Object.values(all).sort((a, b) => (b.issued_at > a.issued_at ? 1 : -1)));
  }, []);

  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="eyebrow">Seller dashboard</div>
        <h1 className="mt-3 font-display text-4xl text-ink">Your Deal Tickets & listings.</h1>

        {vals.length === 0 ? (
          <div className="mt-16 border border-[var(--border)] p-12 text-center bg-[var(--sand)]/40">
            <p className="text-[var(--sage)]">No valuations yet.</p>
            <Link to="/valuation" className="btn-ink mt-6 inline-flex">Get your first valuation</Link>
          </div>
        ) : (
          <div className="mt-10 border-t border-ink">
            {vals.map((v) => (
              <div key={v.id} className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-6 items-center py-6 border-b border-[var(--border)]">
                <span className="font-mono-num text-xs text-[var(--sage)] tracking-wider">{v.serial}</span>
                <div>
                  <div className="text-ink text-sm">{v.input.units}-unit · {v.input.city}, {v.input.state}</div>
                  <div className="font-mono-num text-xs text-[var(--sage)] mt-1">{new Date(v.issued_at).toLocaleDateString()}</div>
                </div>
                <div className="font-mono-num text-[var(--brass)] text-sm">{formatMoney(v.low)}–{formatMoney(v.high)}</div>
                <span className="text-[10px] font-mono-num tracking-widest border border-[var(--sage)] text-[var(--sage)] px-2 py-0.5">DRAFT</span>
                <Link to="/dashboard/$id" params={{ id: v.id }} className="text-xs text-ink border-b border-ink hover:text-[var(--brass)] hover:border-[var(--brass)]">Open →</Link>
              </div>
            ))}
          </div>
        )}

        <div className="mt-16">
          <div className="eyebrow">Deal-room requests</div>
          <p className="mt-4 text-sm text-[var(--sage)]">No requests yet. Requests appear here once your listing is live.</p>
        </div>
      </div>
    </SiteShell>
  );
}