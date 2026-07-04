import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--paper)]">
      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-sm tracking-[0.22em] font-semibold text-ink" style={{ fontVariantCaps: "all-small-caps" }}>
            SELL BABY SELL
          </div>
          <p className="mt-4 max-w-md text-sm text-[var(--sage)] leading-relaxed">
            The exit rail for hospitality. Data-verified valuations, private deal rooms, and qualified buyers — for vacation rental portfolios, boutique hotels, and independent inns.
          </p>
        </div>
        <div className="text-sm space-y-3">
          <div className="eyebrow">Sellers</div>
          <Link to="/valuation" className="block text-ink hover:text-[var(--brass)]">Get a valuation</Link>
          <Link to="/sell" className="block text-ink hover:text-[var(--brass)]">Seller dashboard</Link>
        </div>
        <div className="text-sm space-y-3">
          <div className="eyebrow">Buyers</div>
          <Link to="/marketplace" className="block text-ink hover:text-[var(--brass)]">Live deals</Link>
          <Link to="/buyers" className="block text-ink hover:text-[var(--brass)]">Apply for access</Link>
        </div>
      </div>
      <div className="border-t border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-6 py-6 text-xs text-[var(--sage)]">
          Sell Baby Sell is a marketplace, not a licensed broker. Valuations are estimates, not appraisals.
        </div>
      </div>
    </footer>
  );
}