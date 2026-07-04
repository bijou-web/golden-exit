import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { SEED_LISTINGS, shortTypeLabel } from "@/lib/sbs-data";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const featured = SEED_LISTINGS.slice(0, 3);
  return (
    <SiteShell>
      {/* HERO */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid gap-16 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="reveal">
            <div className="eyebrow">The exit rail for hospitality</div>
            <h1 className="mt-6 font-display text-5xl md:text-6xl leading-[1.02] text-ink">
              Know what your hospitality business is worth.
              <br />
              <span className="text-[var(--brass)]">In 60 seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--sage)] leading-relaxed">
              Connect your booking data. Get a real valuation, an exit-readiness score, and qualified buyers — without a broker who's never heard of ADR.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/valuation" className="btn-ink">Get your free valuation</Link>
              <Link to="/marketplace" className="btn-outline-ink">Browse live deals</Link>
            </div>
            <div className="mt-8 font-mono-num text-xs text-[var(--sage)] tracking-wider">
              NO CARD · NO BROKER · NO OBLIGATION
            </div>
          </div>
          <div className="reveal" style={{ animationDelay: "0.15s" }}>
            <DealTicket
              serial="SBS-2026-00142"
              low={2100000}
              high={2600000}
              methodology="4.6× SDE"
              readiness={84}
              headline="12-unit vacation rental portfolio"
              subhead="Sedona, AZ · Data-verified · Live example"
              verified
            />
          </div>
        </div>
      </section>

      {/* STAT BAND */}
      <section className="bg-ink text-[var(--paper)]">
        <div className="max-w-7xl mx-auto px-6 py-16 grid gap-10 md:grid-cols-3">
          {[
            { n: "$10T", l: "in small-business value changes hands this decade" },
            { n: "51%", l: "of owners are 55+ and eyeing an exit" },
            { n: "0", l: "marketplaces built for hospitality data — until now" },
          ].map((s) => (
            <div key={s.n} className="border-t border-[var(--paper)]/20 pt-6">
              <div className="font-mono-num text-4xl md:text-5xl text-[var(--brass)]">{s.n}</div>
              <div className="mt-3 text-sm text-[var(--paper)]/70 max-w-xs leading-relaxed">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="eyebrow text-center">How it works</div>
        <h2 className="mt-4 font-display text-4xl md:text-5xl text-center text-ink max-w-2xl mx-auto leading-tight">
          Three steps. No broker calls.
        </h2>
        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Connect your data",
              d: "PMS export, Airbnb link, or P&L upload. We read what a broker would spend six weeks asking for.",
            },
            {
              n: "02",
              t: "Get your Deal Ticket",
              d: "A valuation range and readiness score — with the why behind every number, in plain English.",
            },
            {
              n: "03",
              t: "Meet verified buyers",
              d: "Your listing is anonymized. Deal-room access is granted only to proof-of-funds buyers you approve.",
            },
          ].map((s) => (
            <div key={s.n} className="border-t border-ink pt-6">
              <div className="font-mono-num text-sm text-[var(--brass)] tracking-widest">{s.n}</div>
              <h3 className="mt-4 font-display text-2xl text-ink">{s.t}</h3>
              <p className="mt-3 text-sm text-[var(--sage)] leading-relaxed">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARKETPLACE PREVIEW */}
      <section className="bg-[var(--sand)]/50 border-y border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-24">
          <div className="flex items-end justify-between mb-12 flex-wrap gap-4">
            <div>
              <div className="eyebrow">Live on the marketplace</div>
              <h2 className="mt-3 font-display text-4xl text-ink">Deals moving now</h2>
            </div>
            <Link to="/marketplace" className="text-sm text-ink border-b border-ink pb-0.5 hover:text-[var(--brass)] hover:border-[var(--brass)]">
              View all deals →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {featured.map((l) => (
              <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="block group">
                <DealTicket
                  compact
                  verified={l.verified}
                  serial={l.serial}
                  low={l.ask_low}
                  high={l.ask_high}
                  methodology={l.methodology}
                  readiness={l.readiness}
                  headline={l.headline}
                  subhead={`${l.revenue_band} revenue · ${l.days_listed}d listed`}
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* EXIT READY */}
      <section className="max-w-7xl mx-auto px-6 py-24 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="eyebrow">Not selling yet?</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ink leading-tight">Get exit-ready.</h2>
          <p className="mt-6 text-lg text-[var(--sage)] leading-relaxed max-w-lg">
            Track your valuation monthly. Watch your readiness score climb as you close gaps. Get an alert when a buyer profile matches your business.
          </p>
          <Link to="/valuation" className="btn-ink mt-8">Start Exit Ready — $199/mo</Link>
        </div>
        <div className="border border-ink p-8 bg-[var(--sand)] rounded">
          <div className="eyebrow">Exit Ready — included</div>
          <ul className="mt-6 space-y-4 text-sm text-ink">
            {[
              "Monthly re-valuation from live booking data",
              "Prioritized readiness roadmap with dollar impact",
              "Anonymized buyer-match alerts",
              "One 30-min call with a hospitality M&A analyst per quarter",
              "Deal-ready data room, pre-built",
            ].map((f) => (
              <li key={f} className="flex gap-3">
                <span className="text-[var(--brass)] font-mono-num">◆</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CLOSING BAND */}
      <section className="bg-ink text-[var(--paper)]">
        <div className="max-w-4xl mx-auto px-6 py-24 text-center">
          <h2 className="font-display text-6xl md:text-7xl text-[var(--brass)] italic">Sell, baby, sell.</h2>
          <p className="mt-8 text-lg text-[var(--paper)]/80 max-w-2xl mx-auto leading-relaxed">
            Twenty years of 5-star reviews deserve a better exit than a shoebox of receipts.
          </p>
          <Link to="/valuation" className="mt-10 inline-flex items-center justify-center bg-[var(--brass)] text-ink px-8 py-4 text-sm font-medium tracking-wide hover:bg-[var(--paper)] transition-colors">
            Get your free valuation
          </Link>
        </div>
      </section>
    </SiteShell>
  );
}

// silence unused import warning helpers
void shortTypeLabel;
  );
}
