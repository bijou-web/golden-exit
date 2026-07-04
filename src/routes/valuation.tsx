import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";
import { computeValuation, type BusinessType, type ValuationInput } from "@/lib/sbs-data";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/valuation")({
  head: () => ({
    meta: [
      { title: "Get your valuation — Sell Baby Sell" },
      { name: "description", content: "60-second AI valuation of your hospitality business, with an exit-readiness score." },
    ],
  }),
  component: ValuationPage,
});

const STATUSES = [
  "Reading revenue quality…",
  "Benchmarking your market…",
  "Weighing owner dependency…",
  "Grading your reviews…",
  "Stamping your Deal Ticket…",
];

const BUSINESS_TYPE_DB: Record<BusinessType, string> = {
  vacation_rental: "vr_portfolio",
  boutique_hotel: "boutique_hotel",
  hotel: "hotel",
  bnb_inn: "bnb_inn",
};

const TIMELINE_DB: Record<string, string> = {
  now: "now",
  "1-2": "1_2_years",
  "3+": "3_plus_years",
  curious: "curious",
};

function ValuationPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<number | null>(null);
  const [form, setForm] = useState<Partial<ValuationInput>>({
    business_type: "vacation_rental",
    units: 8,
    city: "",
    state: "",
    revenue: 800000,
    noi: 220000,
    occupancy: 62,
    adr: 285,
    direct_pct: 30,
    review_score: 4.7,
    owner_hours: 15,
    timeline: "1-2",
    name: "",
    email: "",
  });

  function set<K extends keyof ValuationInput>(k: K, v: ValuationInput[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function submit() {
    setStatus(0);
    // Animate status while the edge function runs
    let cancelled = false;
    (async () => {
      for (let i = 0; i < STATUSES.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 1400));
        if (cancelled) return;
        setStatus(i);
      }
    })();

    try {
      const input = form as ValuationInput;
      const requestRow = {
        email: input.email,
        full_name: input.name,
        business_type: BUSINESS_TYPE_DB[input.business_type],
        units: input.units,
        market_city: input.city,
        market_state: input.state,
        gross_revenue_ltm: input.revenue,
        sde: input.noi ?? null,
        sde_unknown: input.noi === null || input.noi === undefined,
        occupancy_pct: input.occupancy,
        adr: input.adr,
        direct_booking_pct: input.direct_pct,
        avg_review_score: input.review_score,
        owner_hours_per_week: input.owner_hours,
        sell_timeline: TIMELINE_DB[input.timeline as string] ?? "curious",
      };

      const { data: req, error: reqErr } = await supabase
        .from("valuation_requests")
        .insert(requestRow)
        .select()
        .single();
      if (reqErr) throw reqErr;

      const { data: fnData, error: fnErr } = await supabase.functions.invoke(
        "valuation-engine",
        { body: { ...req, request_id: req.id } },
      );
      if (fnErr) throw fnErr;
      cancelled = true;
      const valuationId = (fnData as { id?: string } | null)?.id;
      if (!valuationId) throw new Error("Valuation service returned no id");
      navigate({ to: "/dashboard/$id", params: { id: valuationId } });
    } catch (err) {
      cancelled = true;
      console.error("Valuation submit failed, falling back to local:", err);
      const v = computeValuation(form as ValuationInput);
      navigate({ to: "/dashboard/$id", params: { id: v.id } });
    }
  }

  if (status !== null) {
    return (
      <SiteShell>
        <div className="max-w-2xl mx-auto px-6 py-32 text-center">
          <div className="eyebrow">Appraising</div>
          <h1 className="mt-6 font-display text-4xl text-ink">Reading your numbers…</h1>
          <div className="mt-16 font-mono-num text-sm text-[var(--brass)] tracking-wider min-h-[24px]">
            {STATUSES[status]}
          </div>
          <div className="mt-8 max-w-md mx-auto space-y-2">
            {STATUSES.map((s, i) => (
              <div key={s} className={`font-mono-num text-xs text-left flex items-center gap-3 ${i <= status ? "text-ink" : "text-[var(--sage)]/50"}`}>
                <span>{i <= status ? "◆" : "◇"}</span>
                <span>{s}</span>
              </div>
            ))}
          </div>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <div className="eyebrow">Get your valuation · Step {step} of 3</div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-ink leading-tight">
          {step === 1 && "Tell us about the business."}
          {step === 2 && "The numbers, plainly."}
          {step === 3 && "One last thing."}
        </h1>

        <div className="mt-4 flex gap-1">
          {[1, 2, 3].map((n) => (
            <div key={n} className={`h-1 flex-1 ${n <= step ? "bg-[var(--brass)]" : "bg-[var(--sand)]"}`} />
          ))}
        </div>

        <div className="mt-12 space-y-8">
          {step === 1 && (
            <>
              <Field label="Business type">
                <div className="grid grid-cols-2 gap-2">
                  {([
                    ["vacation_rental", "Vacation rental portfolio"],
                    ["boutique_hotel", "Boutique hotel"],
                    ["hotel", "Hotel"],
                    ["bnb_inn", "B&B / Inn"],
                  ] as [BusinessType, string][]).map(([v, l]) => (
                    <button
                      key={v}
                      onClick={() => set("business_type", v)}
                      className={`text-left p-4 border text-sm ${form.business_type === v ? "border-ink bg-[var(--sand)]" : "border-[var(--border)] hover:border-ink"}`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Units / keys">
                <input type="number" value={form.units} onChange={(e) => set("units", Number(e.target.value))} className={inputCls} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City"><input value={form.city} onChange={(e) => set("city", e.target.value)} className={inputCls} placeholder="Sedona" /></Field>
                <Field label="State"><input value={form.state} onChange={(e) => set("state", e.target.value)} className={inputCls} placeholder="AZ" /></Field>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <Field label="Last 12 months gross revenue (USD)">
                <input type="number" value={form.revenue} onChange={(e) => set("revenue", Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Net operating income or SDE (USD)">
                <input type="number" value={form.noi ?? ""} onChange={(e) => set("noi", e.target.value === "" ? null : Number(e.target.value))} className={inputCls} placeholder="Leave blank if not sure" />
                <button onClick={() => set("noi", null)} className="mt-2 text-xs text-[var(--sage)] underline">I'm not sure</button>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Average occupancy (%)"><input type="number" value={form.occupancy} onChange={(e) => set("occupancy", Number(e.target.value))} className={inputCls} /></Field>
                <Field label="ADR (USD)"><input type="number" value={form.adr} onChange={(e) => set("adr", Number(e.target.value))} className={inputCls} /></Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Direct bookings (%)"><input type="number" value={form.direct_pct} onChange={(e) => set("direct_pct", Number(e.target.value))} className={inputCls} /></Field>
                <Field label="Average review score"><input type="number" step="0.1" value={form.review_score} onChange={(e) => set("review_score", Number(e.target.value))} className={inputCls} /></Field>
              </div>
              <Field label="Upload a PMS/Guesty CSV or P&L (optional)">
                <input type="file" className="text-sm text-[var(--sage)]" />
              </Field>
            </>
          )}
          {step === 3 && (
            <>
              <Field label="Hours per week the owner works in the business">
                <input type="number" value={form.owner_hours} onChange={(e) => set("owner_hours", Number(e.target.value))} className={inputCls} />
              </Field>
              <Field label="Timeline to sell">
                <div className="grid grid-cols-4 gap-2">
                  {(["now", "1-2", "3+", "curious"] as const).map((v) => (
                    <button key={v} onClick={() => set("timeline", v)} className={`p-3 text-xs border ${form.timeline === v ? "border-ink bg-[var(--sand)]" : "border-[var(--border)]"}`}>
                      {v === "now" ? "Now" : v === "1-2" ? "1–2 yrs" : v === "3+" ? "3+ yrs" : "Just curious"}
                    </button>
                  ))}
                </div>
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Your name"><input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} /></Field>
                <Field label="Email"><input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} className={inputCls} /></Field>
              </div>
            </>
          )}
        </div>

        {/* Security row — plain words, no jargon. */}
        <div className="mt-10 flex items-start gap-3 text-sm text-[var(--sage)] border-t border-[var(--border)] pt-6">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="shrink-0 mt-0.5 text-[var(--brass)]">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <p className="m-0">
            Your numbers are encrypted and never shared without your approval. No broker calls, no cold emails — you decide who sees your business.
          </p>
        </div>

        <div className="mt-12 flex justify-between">
          <button onClick={() => setStep((s) => Math.max(1, s - 1))} className="btn-outline-ink" style={{ visibility: step === 1 ? "hidden" : "visible" }}>Back</button>
          {step < 3 ? (
            <button onClick={() => setStep((s) => s + 1)} className="btn-ink">Continue</button>
          ) : (
            <button onClick={submit} disabled={!form.name || !form.email} className="btn-ink disabled:opacity-40">See my valuation →</button>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

const inputCls =
  "w-full bg-transparent border border-[var(--border)] rounded-md px-4 text-lg text-ink focus:outline-none focus:border-ink font-mono-num";
// 52px input height enforced via style below

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block mb-2 text-base font-medium text-ink">{label}</label>
      <div style={{ minHeight: 52 }} className="[&_input]:h-[52px] [&_input]:min-h-[52px]">
        {children}
      </div>
    </div>
  );
}