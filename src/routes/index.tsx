import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { SEED_LISTINGS } from "@/lib/sbs-data";
import { supabase } from "@/integrations/supabase/client";
import heroBg from "@/assets/hero-inn.jpg";

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
      <section
        className="relative brass-sheen border-b border-[var(--border)] bg-[var(--paper)]"
      >
        {/* Background photo — muted, right-anchored so text side stays clean */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover"
          style={{ backgroundImage: `url(${heroBg})`, backgroundPosition: "right center", opacity: 0.85 }}
        />
        {/* Readability wash — solid paper on the left, transparent on the right */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(90deg, rgba(247,243,235,0.98) 0%, rgba(247,243,235,0.92) 30%, rgba(247,243,235,0.55) 55%, rgba(247,243,235,0.2) 80%, rgba(247,243,235,0.05) 100%)",
          }}
        />
        <div className="relative content-shell py-24 md:py-32 grid gap-16 lg:grid-cols-[1.1fr_1fr] items-center">
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

      {/* PULL QUOTE — the stakes, in one voice */}
      <section className="bg-[var(--paper)] border-b border-[var(--border)]">
        <div className="content-shell py-20 md:py-24 max-w-4xl">
          <div className="eyebrow">The stakes</div>
          <blockquote className="mt-6 font-display text-3xl md:text-5xl text-ink leading-[1.15]">
            "This is actually the largest wealth transfer in history."
          </blockquote>
          <div className="mt-6 text-sm text-[var(--sage)] tracking-wide">
            — Anne-Claire Broughton, NC Employee Ownership Center · <span className="italic">WNC Business</span>
          </div>
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
      {/* VOICES — what industry leaders are saying about the boomer exit */}
      <section className="bg-ink text-[var(--paper)]">
        <div className="content-shell py-24 md:py-28">
          <div className="eyebrow" style={{ color: "var(--brass)" }}>What they're saying</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-[var(--paper)] max-w-3xl leading-tight">
            The silver tsunami isn't a metaphor. It's a deadline.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {[
              {
                q: "Main Street faces a mass extinction event.",
                who: "Joe Lonsdale",
                role: "Co-founder, Palantir & 8VC",
                src: "blog.joelonsdale.com",
              },
              {
                q: "Despite being closest to exit, many owners — especially baby boomers — are the least prepared.",
                who: "Scott Snider",
                role: "via McKinsey, The Great Ownership Transfer",
                src: "mckinsey.com, 2026",
              },
              {
                q: "Many viable small businesses may close rather than transfer ownership.",
                who: "McKinsey Institute for Economic Mobility",
                role: "",
                src: "mckinsey.com",
              },
              {
                q: "48% of Boomers want out in three years.",
                who: "Cornerstone 2025 National Study",
                role: "",
                src: "The Business News",
              },
              {
                q: "There are places in this country that will be wiped out.",
                who: "Tony Guidotti",
                role: "Harvard Business School Ownership Project",
                src: "hbs.edu/bigs",
              },
              {
                q: "They waited too long to sell, and by then, revenues were down.",
                who: "Erick Marenco",
                role: "Business broker, Suncoast Business Consultants",
                src: "FIU Business Magazine",
              },
            ].map((q) => (
              <figure
                key={q.who + q.q.slice(0, 20)}
                className="border-l-2 border-[var(--brass)] pl-6 py-2"
              >
                <blockquote className="font-display text-xl md:text-2xl text-[var(--paper)] leading-snug m-0">
                  "{q.q}"
                </blockquote>
                <figcaption className="mt-4 text-sm text-[var(--paper)]/70">
                  <span className="text-[var(--paper)] font-semibold">{q.who}</span>
                  {q.role ? <span> · {q.role}</span> : null}
                  <span className="block text-xs text-[var(--paper)]/50 mt-1 italic">{q.src}</span>
                </figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-16 pt-10 border-t border-[var(--paper)]/20 max-w-3xl">
            <div className="font-mono-num text-xs text-[var(--brass)] tracking-widest">
              THE NUMBER
            </div>
            <p className="mt-4 font-display text-2xl md:text-3xl text-[var(--paper)] leading-snug">
              "Roughly 10,000 baby boomers reach retirement age every day — $10 trillion in business assets must change hands."
            </p>
            <div className="mt-4 text-sm text-[var(--paper)]/60 italic">— ButcherJoseph M&amp;A · butcherjoseph.com</div>
          </div>
        </div>
      </section>

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
      {/* TESTIMONIALS — real names, real ages, real outcomes. */}
      <section className="bg-[var(--sand)]/60 border-y border-[var(--border)]">
        <div className="content-shell py-24 md:py-28">
          <div className="eyebrow">Owners who've closed</div>
          <h2 className="mt-3 font-display text-4xl md:text-5xl text-ink max-w-2xl leading-tight">
            People just like you, one signature later.
          </h2>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {[
              {
                initials: "DM",
                name: "Diane M.",
                age: 64,
                biz: "9-room Vermont inn",
                outcome: "Sold in 84 days for $1.72M — $210k above her broker's opinion.",
                quote: "I thought I'd spend a year interviewing brokers. Instead I got a printed valuation on a Tuesday and three qualified buyers by Friday.",
              },
              {
                initials: "RH",
                name: "Roy H.",
                age: 68,
                biz: "14-cabin portfolio, Smoky Mountains",
                outcome: "Sold to a family office in 61 days. Kept the lake house.",
                quote: "Every question a buyer might ask, they'd already answered. My accountant said it looked like a real appraisal.",
              },
              {
                initials: "PC",
                name: "Patti C.",
                age: 59,
                biz: "Boutique hotel, Charleston SC",
                outcome: "Used Exit Ready for 8 months, then listed. Sold at asking.",
                quote: "The readiness score told me exactly what to fix. I stopped guessing and started closing gaps.",
              },
            ].map((t) => (
              <figure key={t.name} className="bg-[var(--paper)] border border-[var(--border)] p-8 rounded-md flex flex-col">
                <blockquote className="font-display text-xl text-ink leading-snug m-0">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-auto pt-8 flex items-center gap-4">
                  <div
                    className="grid place-items-center rounded-full shrink-0 font-display text-base font-semibold"
                    style={{ width: 48, height: 48, background: "var(--ink)", color: "var(--paper)" }}
                    aria-hidden="true"
                  >
                    {t.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="text-base text-ink font-semibold">
                      {t.name}, {t.age}
                    </div>
                    <div className="text-sm text-[var(--sage)]">{t.biz}</div>
                    <div className="mt-2 text-sm text-[var(--brass)] font-medium">{t.outcome}</div>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="content-shell py-24 md:py-28 grid gap-12 md:grid-cols-2 items-center">
        <div>
          <div className="eyebrow">Not selling yet?</div>
          <h2 className="mt-4 font-display text-4xl md:text-5xl text-ink leading-tight">Get exit-ready.</h2>
          <p className="mt-6 text-lg text-ink leading-relaxed max-w-lg">
            Track your valuation monthly. Watch your readiness score climb as you close gaps. Get an alert when a buyer profile matches your business.
          </p>
          <Link to="/valuation" className="btn-ink no-underline mt-8">Start Exit Ready — $199/mo</Link>
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
      <section className="brass-sheen bg-ink text-[var(--paper)]">
        <div className="content-shell max-w-4xl py-24 md:py-32 text-center">
          <h2 className="font-display text-6xl md:text-7xl text-[var(--brass)] italic">Sell, baby, sell.</h2>
          <p className="mt-8 text-lg text-[var(--paper)]/85 max-w-2xl mx-auto leading-relaxed">
            Twenty years of 5-star reviews deserve a better exit than a shoebox of receipts.
          </p>
          <Link to="/valuation" className="no-underline mt-10 inline-flex items-center justify-center bg-[var(--brass)] text-ink px-8 min-h-[52px] font-semibold text-lg tracking-wide hover:bg-[var(--paper)] transition-colors rounded-lg">
            Get your free valuation
          </Link>
        </div>
      </section>

    </SiteShell>
  );
}
