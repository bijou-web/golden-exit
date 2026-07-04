import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteShell } from "@/components/sbs/SiteShell";

export const Route = createFileRoute("/buyers")({
  head: () => ({
    meta: [
      { title: "For buyers — Sell Baby Sell" },
      { name: "description", content: "Proprietary, data-verified hospitality deal flow. The numbers come from the PMS, not the seller's memory." },
    ],
  }),
  component: BuyersPage,
});

function BuyersPage() {
  const [sent, setSent] = useState(false);
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="eyebrow">For buyers</div>
        <h1 className="mt-4 font-display text-4xl md:text-6xl text-ink leading-[1.05] max-w-3xl">
          Proprietary, data-verified hospitality deal flow.
        </h1>
        <p className="mt-6 text-lg text-[var(--sage)] max-w-2xl">
          The numbers come straight from the property-management system — not the seller's memory. No listing broker between you and the operator.
        </p>

        <div className="mt-16 grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div className="border border-ink bg-[var(--sand)] p-8">
            <div className="flex items-baseline justify-between">
              <div className="eyebrow">Buyer Pro</div>
              <div className="font-mono-num text-3xl text-[var(--brass)]">$349<span className="text-sm text-[var(--sage)]">/mo</span></div>
            </div>
            <ul className="mt-8 space-y-4 text-sm text-ink">
              {[
                "72-hour head start on every new listing",
                "Full financial teasers with verified metrics",
                "Direct deal-room requests, no gatekeeper",
                "Deal alerts tuned to your investment thesis",
                "Quarterly market brief on hospitality M&A",
              ].map((f) => (
                <li key={f} className="flex gap-3"><span className="font-mono-num text-[var(--brass)]">◆</span>{f}</li>
              ))}
            </ul>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="border border-[var(--border)] p-8">
            {sent ? (
              <div className="py-8 text-center">
                <div className="eyebrow text-[var(--brass)]">Application received</div>
                <h3 className="mt-3 font-display text-xl text-ink">We verify every buyer.</h3>
                <p className="mt-2 text-sm text-[var(--sage)]">Expect an answer within one business day.</p>
              </div>
            ) : (
              <>
                <div className="eyebrow">Apply for buyer access</div>
                <div className="mt-6 space-y-4">
                  <input required placeholder="Full name" className="w-full border-b border-[var(--border)] py-2 text-sm bg-transparent focus:outline-none focus:border-ink" />
                  <input required type="email" placeholder="Email" className="w-full border-b border-[var(--border)] py-2 text-sm bg-transparent focus:outline-none focus:border-ink" />
                  <select className="w-full border-b border-[var(--border)] py-2 text-sm bg-transparent font-mono-num">
                    <option>Individual</option><option>Search fund</option><option>Family office</option><option>PE</option><option>Strategic operator</option>
                  </select>
                  <input placeholder="Budget range (USD)" className="w-full border-b border-[var(--border)] py-2 text-sm bg-transparent font-mono-num focus:outline-none focus:border-ink" />
                  <input placeholder="Target markets (e.g. Southwest US, coastal)" className="w-full border-b border-[var(--border)] py-2 text-sm bg-transparent focus:outline-none focus:border-ink" />
                  <label className="flex items-start gap-2 text-xs text-[var(--sage)] pt-2"><input type="checkbox" required className="mt-0.5" /> I attest that I can provide proof of funds on request.</label>
                </div>
                <button className="btn-ink w-full mt-6">Submit application</button>
              </>
            )}
          </form>
        </div>
      </div>
    </SiteShell>
  );
}