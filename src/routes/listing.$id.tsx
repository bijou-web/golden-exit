import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { getListing, formatFull } from "@/lib/sbs-data";

export const Route = createFileRoute("/listing/$id")({
  component: ListingPage,
});

function ListingPage() {
  const { id } = Route.useParams();
  const l = getListing(id);
  const [modal, setModal] = useState(false);
  const [sent, setSent] = useState(false);

  if (!l) {
    return (
      <SiteShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="eyebrow">Not found</div>
          <h1 className="mt-4 font-display text-3xl">This listing is no longer available.</h1>
          <Link to="/marketplace" className="btn-ink mt-8 inline-flex">Back to marketplace</Link>
        </div>
      </SiteShell>
    );
  }

  const sublabels = {
    financial_records: "Financial records",
    revenue_trend: "Revenue trend",
    review_health: "Review health",
    owner_dependency: "Owner dependency",
    channel_mix: "Channel mix",
  } as const;

  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <Link to="/marketplace" className="eyebrow hover:text-ink">← All deals</Link>
        <h1 className="mt-4 font-display text-3xl md:text-4xl text-ink">{l.headline}</h1>
        <div className="mt-2 font-mono-num text-xs text-[var(--sage)] tracking-wider">
          {l.serial} · LISTED {l.days_listed} DAYS AGO
        </div>

        <div className="mt-8">
          <DealTicket
            serial={l.serial}
            low={l.ask_low}
            high={l.ask_high}
            methodology={l.methodology}
            readiness={l.readiness}
            verified={l.verified}
          />
        </div>

        <div className="mt-12 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="eyebrow">Confidential Information Memorandum · teaser</div>
            <p className="mt-4 text-base text-ink leading-relaxed">{l.teaser}</p>

            <div className="mt-10">
              <div className="eyebrow">Verified metrics</div>
              <table className="mt-4 w-full text-sm">
                <tbody className="font-mono-num">
                  {[
                    ["Gross revenue (TTM)", formatFull(l.metrics.revenue)],
                    ["NOI / SDE", formatFull(l.metrics.noi)],
                    ["Occupancy", `${l.metrics.occupancy}%`],
                    ["ADR", `$${l.metrics.adr}`],
                    ["Review score", `${l.metrics.review_score.toFixed(1)}★`],
                    ["Direct bookings", `${l.metrics.direct_pct}%`],
                  ].map(([k, v]) => (
                    <tr key={k} className="border-b border-[var(--border)]">
                      <td className="py-3 text-[var(--sage)] tracking-wider uppercase text-xs">{k}</td>
                      <td className="py-3 text-right text-ink">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-10">
              <div className="eyebrow">Readiness breakdown</div>
              <div className="mt-4 space-y-4">
                {Object.entries(l.subscores).map(([k, s]) => (
                  <div key={k}>
                    <div className="flex justify-between font-mono-num text-xs">
                      <span className="text-ink uppercase tracking-wider">{sublabels[k as keyof typeof sublabels]}</span>
                      <span className={s < 70 ? "text-[var(--signal)]" : "text-ink"}>{s}</span>
                    </div>
                    <div className="mt-1.5 h-1 bg-[var(--sand)]">
                      <div className="h-full bg-ink" style={{ width: `${s}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <aside>
            <div className="border border-ink p-6 bg-[var(--sand)] relative">
              <div className="eyebrow">Deal room · locked</div>
              <div className="mt-4 space-y-2">
                {["P&L (3 yrs)", "Rent roll / unit list", "Tax returns", "SOP library"].map((f) => (
                  <div key={f} className="flex items-center justify-between text-sm p-3 bg-[var(--paper)]/60 border border-ink/10">
                    <span className="text-ink/40 blur-[2px] select-none font-mono-num">{f}</span>
                    <span className="font-mono-num text-xs text-[var(--sage)]">🔒</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setModal(true)} className="btn-ink w-full mt-6">Request deal-room access</button>
              <p className="mt-4 text-xs text-[var(--sage)] leading-relaxed">
                Verified buyers only. Proof-of-funds required. Sellers respond within 48 hours.
              </p>
            </div>
          </aside>
        </div>
      </div>

      {modal && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4" onClick={() => !sent && setModal(false)}>
          <div className="bg-[var(--paper)] max-w-lg w-full p-8 border border-ink" onClick={(e) => e.stopPropagation()}>
            {sent ? (
              <div className="text-center py-8">
                <div className="font-mono-num text-xs text-[var(--brass)] tracking-widest">REQUEST SENT</div>
                <h2 className="mt-4 font-display text-2xl text-ink">Request sent to the seller.</h2>
                <p className="mt-3 text-sm text-[var(--sage)]">Verified buyers hear back within 48 hours.</p>
                <button onClick={() => { setModal(false); setSent(false); }} className="btn-outline-ink mt-8">Close</button>
              </div>
            ) : (
              <>
                <div className="eyebrow">Request deal-room access</div>
                <h2 className="mt-3 font-display text-2xl text-ink">Introduce yourself.</h2>
                <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="mt-6 space-y-4">
                  <input required placeholder="Full name" className={`w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent`} />
                  <input required type="email" placeholder="Email" className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent" />
                  <select className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent font-mono-num">
                    <option>Individual</option><option>Search fund</option><option>Family office</option><option>PE</option><option>Strategic operator</option>
                  </select>
                  <input placeholder="Intended budget (USD)" className="w-full border border-[var(--border)] px-3 py-2 text-sm bg-transparent font-mono-num" />
                  <label className="flex items-start gap-2 text-xs text-[var(--sage)]"><input type="checkbox" required className="mt-0.5" /> I can provide proof of funds within 5 business days.</label>
                  <div className="flex gap-3 pt-2">
                    <button type="button" onClick={() => setModal(false)} className="btn-outline-ink flex-1">Cancel</button>
                    <button type="submit" className="btn-ink flex-1">Send request</button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </SiteShell>
  );
}