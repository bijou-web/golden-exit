import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { DealTicket } from "@/components/sbs/DealTicket";
import { getValuation, type Valuation, formatFull, businessTypeLabel } from "@/lib/sbs-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/dashboard/$id")({
  ssr: false,
  component: DashboardPage,
});

function DashboardPage() {
  const { id } = Route.useParams();
  const [v, setV] = useState<Valuation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      // Try Supabase first (real valuation from edge fn)
      const { data: row } = await supabase
        .from("valuations")
        .select("*, valuation_requests(*)")
        .eq("id", id)
        .maybeSingle();
      if (!alive) return;
      if (row) {
        const req = (row as any).valuation_requests ?? {};
        const bt = req.business_type ?? "vr_portfolio";
        const inputMap: Record<string, Valuation["input"]["business_type"]> = {
          vr_portfolio: "vacation_rental",
          boutique_hotel: "boutique_hotel",
          hotel: "hotel",
          bnb_inn: "bnb_inn",
        };
        const anyRow = row as any;
        const mapped: Valuation = {
          id: anyRow.id,
          serial: anyRow.serial ?? "SBS-DRAFT",
          issued_at: anyRow.created_at ?? new Date().toISOString(),
          low: Number(anyRow.low),
          high: Number(anyRow.high),
          multiple_used: anyRow.multiple_used ?? "",
          methodology: anyRow.methodology ?? "",
          readiness_score: anyRow.readiness_score ?? 0,
          subscores: (anyRow.subscores as Valuation["subscores"]) ?? {
            financial_records: 0,
            revenue_trend: 0,
            review_health: 0,
            owner_dependency: 0,
            channel_mix: 0,
          },
          drivers: (anyRow.drivers as string[]) ?? [],
          gaps: ((anyRow.gaps as any[]) ?? []).map((g: any) => ({
            label: g.area ?? g.label ?? "",
            fix: g.fix ?? g.impact ?? "",
          })),
          teaser: anyRow.teaser_paragraph ?? "",
          input: {
            business_type: inputMap[bt] ?? "vacation_rental",
            units: req.units ?? 0,
            city: req.market_city ?? "",
            state: req.market_state ?? "",
            revenue: Number(req.gross_revenue_ltm ?? 0),
            noi: req.sde !== null && req.sde !== undefined ? Number(req.sde) : null,
            occupancy: Number(req.occupancy_pct ?? 0),
            adr: Number(req.adr ?? 0),
            direct_pct: Number(req.direct_booking_pct ?? 0),
            review_score: Number(req.avg_review_score ?? 0),
            owner_hours: req.owner_hours_per_week ?? 0,
            timeline: (req.sell_timeline ?? "curious") as Valuation["input"]["timeline"],
            name: req.full_name ?? "",
            email: req.email ?? "",
          },
        };
        setV(mapped);
        setLoading(false);
        return;
      }
      // Fallback: local cached valuation (pre-Supabase demos)
      setV(getValuation(id));
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  if (loading) {
    return (
      <SiteShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="eyebrow">Loading Deal Ticket…</div>
        </div>
      </SiteShell>
    );
  }

  if (!v) {
    return (
      <SiteShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="eyebrow">Not found</div>
          <h1 className="mt-4 font-display text-3xl text-ink">This Deal Ticket has expired or was never issued.</h1>
          <Link to="/valuation" className="btn-ink mt-8 inline-flex">Start a new valuation</Link>
        </div>
      </SiteShell>
    );
  }

  const sublabels: Record<keyof Valuation["subscores"], string> = {
    financial_records: "Financial records",
    revenue_trend: "Revenue trend",
    review_health: "Review health",
    owner_dependency: "Owner dependency",
    channel_mix: "Channel mix",
  };

  return (
    <SiteShell>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="eyebrow">Your Deal Ticket · Draft</div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl text-ink">
          {v.input.units}-{v.input.business_type === "vacation_rental" ? "unit" : "key"} {businessTypeLabel[v.input.business_type].toLowerCase()} · {v.input.city}, {v.input.state}
        </h1>

        <div className="mt-8">
          <DealTicket
            serial={v.serial}
            issued_at={v.issued_at}
            low={v.low}
            high={v.high}
            methodology={v.methodology}
            readiness={v.readiness_score}
          />
        </div>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="eyebrow">Readiness breakdown</div>
            <div className="mt-6 space-y-5">
              {Object.entries(v.subscores).map(([k, score]) => {
                const gap = v.gaps.find((g) => g.label.toLowerCase().includes(sublabels[k as keyof Valuation["subscores"]].toLowerCase().split(" ")[0]));
                return (
                  <div key={k}>
                    <div className="flex items-center justify-between font-mono-num text-xs">
                      <span className="text-ink tracking-wider uppercase">{sublabels[k as keyof Valuation["subscores"]]}</span>
                      <span className={score < 70 ? "text-[var(--signal)]" : "text-ink"}>{score}</span>
                    </div>
                    <div className="mt-2 h-1.5 bg-[var(--sand)]">
                      <div className="h-full" style={{ width: `${score}%`, background: score < 70 ? "var(--signal)" : "var(--ink)" }} />
                    </div>
                    {gap && (
                      <div className="mt-3 border-l-2 border-[var(--signal)] pl-3 text-xs text-[var(--sage)]">
                        <span className="font-mono-num text-[var(--signal)] mr-2">GAP</span>
                        {gap.fix}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="mt-12">
              <div className="eyebrow">What's driving your number</div>
              <ul className="mt-6 space-y-4">
                {v.drivers.map((d, i) => (
                  <li key={i} className="flex gap-4 text-sm text-ink leading-relaxed">
                    <span className="font-mono-num text-[var(--brass)] shrink-0">{String(i + 1).padStart(2, "0")}</span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="space-y-8">
            <div className="border border-ink p-6 bg-[var(--sand)]">
              <div className="eyebrow">Buyer demand</div>
              <div className="mt-3 font-display text-2xl text-ink">
                <span className="font-mono-num text-[var(--brass)]">42</span> verified buyers match this profile
              </div>
              <div className="mt-6 space-y-3">
                {[
                  { t: "Search fund", d: "$1–3M · SBA pre-qualified · Southwest US" },
                  { t: "Family office", d: "$2–5M · All cash · West Coast" },
                  { t: "Strategic operator", d: "Portfolio roll-up · Regional footprint" },
                ].map((b) => (
                  <div key={b.t} className="border border-ink/20 bg-[var(--paper)] p-3 text-xs">
                    <div className="font-mono-num text-ink tracking-wider uppercase">{b.t}</div>
                    <div className="text-[var(--sage)] mt-1">{b.d}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-ink/20 text-xs text-[var(--sage)]">
                List your business to connect →
              </div>
            </div>

            <div className="space-y-3">
              <button className="btn-ink w-full">List my business</button>
              <button className="btn-outline-ink w-full">Track my value monthly — $199/mo</button>
            </div>

            <div className="text-xs text-[var(--sage)] leading-relaxed">
              Valuation range: <span className="font-mono-num text-ink">{formatFull(v.low)}</span> – <span className="font-mono-num text-ink">{formatFull(v.high)}</span> based on {v.methodology}. This is an estimate, not an appraisal.
            </div>
          </aside>
        </div>
      </div>
    </SiteShell>
  );
}