import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { SEED_LISTINGS, type BusinessType, shortTypeLabel } from "@/lib/sbs-data";
import { supabase } from "@/integrations/supabase/client";

type DbListing = {
  id: string;
  business_type: string;
  units: number | null;
  region: string | null;
  headline: string | null;
  asking_low: number | null;
  asking_high: number | null;
  readiness_score: number | null;
  verified: boolean | null;
  created_at: string;
  hero_image_url: string | null;
};

const DB_TO_TYPE: Record<string, BusinessType> = {
  vr_portfolio: "vacation_rental",
  boutique_hotel: "boutique_hotel",
  hotel: "hotel",
  bnb_inn: "bnb_inn",
};

type ListingRow = {
  id: string;
  business_type: BusinessType;
  units: number;
  region: string;
  headline: string;
  ask_low: number;
  ask_high: number;
  readiness: number;
  verified: boolean;
  serial: string;
  methodology: string;
  revenue_band: string;
  days_listed: number;
  hero_image_url?: string | null;
};

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
  const [dbRows, setDbRows] = useState<ListingRow[] | null>(null);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("listings")
        .select("id, business_type, units, region, headline, asking_low, asking_high, readiness_score, verified, created_at, hero_image_url")
        .eq("status", "live")
        .order("created_at", { ascending: false });
      if (!data) return;
      const mapped: ListingRow[] = (data as DbListing[]).map((l) => {
        const dayMs = 1000 * 60 * 60 * 24;
        const days = Math.max(1, Math.floor((Date.now() - new Date(l.created_at).getTime()) / dayMs));
        return {
          id: l.id,
          business_type: DB_TO_TYPE[l.business_type] ?? "vacation_rental",
          units: l.units ?? 0,
          region: l.region ?? "—",
          headline: l.headline ?? "",
          ask_low: Number(l.asking_low ?? 0),
          ask_high: Number(l.asking_high ?? l.asking_low ?? 0),
          readiness: l.readiness_score ?? 0,
          verified: !!l.verified,
          serial: `SBS-${l.id.slice(0, 8).toUpperCase()}`,
          methodology: "Verified booking data",
          revenue_band: "$—",
          days_listed: days,
          hero_image_url: l.hero_image_url,
        };
      });
      setDbRows(mapped);
    })();
  }, []);

  const source: ListingRow[] = dbRows && dbRows.length > 0
    ? dbRows
    : SEED_LISTINGS.map((l) => ({
        id: l.id,
        business_type: l.business_type,
        units: l.units,
        region: l.region,
        headline: `${shortTypeLabel[l.business_type]} · ${l.units} ${l.business_type === "vacation_rental" ? "units" : "keys"}`,
        ask_low: l.ask_low,
        ask_high: l.ask_high,
        readiness: l.readiness,
        verified: l.verified,
        serial: l.serial,
        methodology: l.methodology,
        revenue_band: l.revenue_band,
        days_listed: l.days_listed,
      }));

  const filtered = source
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
                headline={l.headline || `${shortTypeLabel[l.business_type]} · ${l.units} ${l.business_type === "vacation_rental" ? "units" : "keys"}`}
                subhead={`${l.region} · ${l.revenue_band} revenue · ${l.days_listed}d listed`}
              />
            </Link>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}