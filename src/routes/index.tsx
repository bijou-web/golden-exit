import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { SEED_LISTINGS } from "@/lib/sbs-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  type Featured = {
    id: string;
    headline: string;
    region: string;
    ask_low: number;
    ask_high: number;
    readiness: number;
    verified: boolean;
    serial: string;
    methodology: string;
    revenue_band: string;
    days_listed: number;
    hero_image_url: string | null;
  };
  const seedFeatured: Featured[] = SEED_LISTINGS.slice(0, 3).map((l) => ({
    id: l.id,
    headline: `${l.business_type.replace("_", " ")} · ${l.units} units`,
    region: l.region,
    ask_low: l.ask_low,
    ask_high: l.ask_high,
    readiness: l.readiness,
    verified: l.verified,
    serial: l.serial,
    methodology: l.methodology,
    revenue_band: l.revenue_band,
    days_listed: l.days_listed,
    hero_image_url: null,
  }));
  const [featured, setFeatured] = useState<Featured[]>(seedFeatured);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, headline, region, asking_low, asking_high, readiness_score, verified, created_at, hero_image_url")
        .eq("status", "live")
        .not("hero_image_url", "is", null)
        .order("created_at", { ascending: false })
        .limit(3);
      if (!data || data.length === 0) return;
      const dayMs = 1000 * 60 * 60 * 24;
      setFeatured(
        data.map((l: any) => ({
          id: l.id,
          headline: l.headline ?? "Hospitality business",
          region: l.region ?? "—",
          ask_low: Number(l.asking_low ?? 0),
          ask_high: Number(l.asking_high ?? l.asking_low ?? 0),
          readiness: l.readiness_score ?? 72,
          verified: !!l.verified,
          serial: `SBS-${l.id.slice(0, 8).toUpperCase()}`,
          methodology: "Scraped listing",
          revenue_band: "$—",
          days_listed: Math.max(1, Math.floor((Date.now() - new Date(l.created_at).getTime()) / dayMs)),
          hero_image_url: l.hero_image_url,
        })),
      );
    })();
  }, []);

  return (
    <SiteShell>
      {/* HERO */}
      <section className="border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-20 md:py-28 grid gap-16 lg:grid-cols-[1.1fr_1fr] items-center">
          <div className="reveal">
            <div className="eyebrow">The Baby Boomer exit rail for hospitality</div>
            <h1 className="mt-6 font-display text-5xl md:text-6xl leading-[1.02] text-ink">
              Baby Boomers built it.
              <br />
              Now know what it's worth —
              <br />
              <span className="text-[var(--brass)]">in 60 seconds.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-[var(--sage)] leading-relaxed">
              The exit marketplace built for the Boomer generation of hospitality owners. Connect your booking data. Get a real valuation, an exit-readiness score, and qualified buyers — without a broker who's never heard of ADR.
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
                {l.hero_image_url ? (
                  <div className="aspect-[16/10] w-full overflow-hidden border border-[var(--border)] border-b-0 bg-[var(--sand)]">
                    <img
                      src={l.hero_image_url}
                      alt={l.headline}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                    />
                  </div>
                ) : null}
                <DealTicket
                  compact
                  verified={l.verified}
                  serial={l.serial}
                  low={l.ask_low}
                  high={l.ask_high}
                  methodology={l.methodology}
                  readiness={l.readiness}
                  headline={l.headline}
                  subhead={`${l.region} · ${l.days_listed}d listed`}
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
