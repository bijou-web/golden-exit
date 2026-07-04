import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { SEED_LISTINGS, type BusinessType, shortTypeLabel } from "@/lib/sbs-data";

export const Route = createFileRoute("/marketplace")({
  head: () => ({
    meta: [
      { title: "Marketplace — Sell Baby Sell" },
      { name: "description", content: "Live, data-verified hospitality deals. Anonymized listings for vacation rental portfolios, boutique hotels, and inns." },
    ],
  }),
  component: MarketplacePage,
});

function MarketplacePage() {
  const [type, setType] = useState<BusinessType | "all">("all");
  const [sort, setSort] = useState<"new" | "price" | "readiness">("new");
  const [minReady, setMinReady] = useState(0);

  const filtered = SEED_LISTINGS
    .filter((l) => (type === "all" ? true : l.business_type === type))
    .filter((l) => l.readiness >= minReady)
    .sort((a, b) => {
      if (sort === "price") return b.ask_high - a.ask_high;
      if (sort === "readiness") return b.readiness - a.readiness;
      return a.days_listed - b.days_listed;
    });

  return (
    <SiteShell>
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="eyebrow">Marketplace</div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl text-ink">Deals moving now.</h1>
        <p className="mt-4 text-[var(--sage)] max-w-2xl">
          Every listing is anonymized. Every number comes from the seller's booking system, not their memory.
        </p>

        <div className="mt-10 flex flex-wrap gap-3 items-center border-y border-[var(--border)] py-4">
          <select value={type} onChange={(e) => setType(e.target.value as BusinessType | "all")} className="bg-transparent border border-[var(--border)] px-3 py-2 text-sm font-mono-num">
            <option value="all">All types</option>
            <option value="vacation_rental">Vacation rental</option>
            <option value="boutique_hotel">Boutique hotel</option>
            <option value="hotel">Hotel</option>
            <option value="bnb_inn">B&B / Inn</option>
          </select>
          <label className="flex items-center gap-2 text-xs text-[var(--sage)] font-mono-num tracking-wider uppercase">
            Min readiness
            <input type="range" min={0} max={100} value={minReady} onChange={(e) => setMinReady(Number(e.target.value))} />
            <span className="text-ink w-8">{minReady}</span>
          </label>
          <div className="ml-auto flex items-center gap-2 text-xs">
            <span className="eyebrow">Sort</span>
            {(["new", "price", "readiness"] as const).map((s) => (
              <button key={s} onClick={() => setSort(s)} className={`font-mono-num text-xs px-2 py-1 tracking-wider uppercase ${sort === s ? "text-ink border-b border-ink" : "text-[var(--sage)]"}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((l) => (
            <Link key={l.id} to="/listing/$id" params={{ id: l.id }} className="block">
              <DealTicket
                compact
                verified={l.verified}
                serial={l.serial}
                low={l.ask_low}
                high={l.ask_high}
                methodology={l.methodology}
                readiness={l.readiness}
                headline={`${shortTypeLabel[l.business_type]} · ${l.units} ${l.business_type === "vacation_rental" ? "units" : "keys"}`}
                subhead={`${l.region} · ${l.revenue_band} revenue · ${l.days_listed}d listed`}
              />
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}