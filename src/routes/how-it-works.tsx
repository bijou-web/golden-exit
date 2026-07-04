import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteShell } from "@/components/sbs/SiteShell";

export const Route = createFileRoute("/how-it-works")({
  head: () => ({
    meta: [
      { title: "How it works — Sell Baby Sell" },
      { name: "description", content: "How Sell Baby Sell values, lists, and closes hospitality businesses without a traditional broker." },
    ],
  }),
  component: HowPage,
});

const FAQ = [
  { q: "Is my listing anonymous?", a: "Yes. Public marketplace cards show business type, unit count, and region only. Your name, brand, and exact address are shared only after you approve a deal-room request." },
  { q: "How do you verify the numbers?", a: "We connect directly to your PMS or import a machine-readable P&L. When the numbers on the listing carry a brass 'Data-verified' seal, they were computed from the source data — not typed by the seller." },
  { q: "What happens after a deal-room request?", a: "The buyer submits identity, buyer type, and a proof-of-funds attestation. You get an email, review their profile in your seller dashboard, and approve or decline. Approved buyers unlock the full data room." },
  { q: "Are you brokers?", a: "No. Sell Baby Sell is a marketplace. We don't represent either side, don't collect earnest money, and don't negotiate on your behalf. Valuations are estimates, not appraisals. For definitive advice, consult a licensed M&A advisor or attorney." },
];

function HowPage() {
  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="eyebrow">How it works</div>
        <h1 className="mt-4 font-display text-4xl md:text-5xl text-ink">A private brokerage, with the middleman removed.</h1>

        <div className="mt-16 space-y-16">
          {[
            { n: "01", t: "Connect your data", d: "Upload a PMS/Guesty CSV, a P&L, or paste your Airbnb link. We normalize the numbers into a language every buyer understands: revenue, NOI/SDE, RevPAR, review health, channel mix." },
            { n: "02", t: "Get your Deal Ticket", d: "In 60 seconds, our valuation engine returns a range, the multiple used, the methodology, and an exit-readiness score. Every subscore comes with the specific fix that would move the number — and by how much." },
            { n: "03", t: "Meet verified buyers", d: "Your listing goes live anonymized. Buyers request deal-room access. You approve who sees your full financials. When a deal closes, we take 5% of the transaction value — and only then." },
          ].map((s) => (
            <div key={s.n} className="grid gap-6 md:grid-cols-[auto_1fr] items-start">
              <div className="font-mono-num text-4xl text-[var(--brass)]">{s.n}</div>
              <div>
                <h2 className="font-display text-3xl text-ink">{s.t}</h2>
                <p className="mt-3 text-[var(--sage)] leading-relaxed max-w-2xl">{s.d}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-24 border-y border-ink py-10">
          <div className="eyebrow">Fees</div>
          <p className="mt-4 font-display text-2xl text-ink max-w-3xl">
            <span className="text-[var(--brass)] font-mono-num text-3xl">5%</span> success fee on close. No listing fees. Buyer subscriptions keep the lights on — sellers pay only when they get paid.
          </p>
        </div>

        <div className="mt-16">
          <div className="eyebrow">FAQ</div>
          <div className="mt-6 divide-y divide-[var(--border)] border-y border-[var(--border)]">
            {FAQ.map((f) => (
              <details key={f.q} className="group py-6">
                <summary className="flex justify-between items-center cursor-pointer text-ink font-display text-xl">
                  {f.q}
                  <span className="font-mono-num text-[var(--brass)] group-open:rotate-45 transition-transform">+</span>
                </summary>
                <p className="mt-4 text-sm text-[var(--sage)] leading-relaxed max-w-3xl">{f.a}</p>
              </details>
            ))}
          </div>
        </div>

        <div className="mt-16 text-center">
          <Link to="/valuation" className="btn-ink">Get your free valuation</Link>
        </div>
      </div>
    </SiteShell>
  );
}