import { Link } from "@tanstack/react-router";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="font-display text-[15px] tracking-[0.22em] font-semibold text-ink" style={{ fontVariantCaps: "all-small-caps" }}>
          SELL BABY SELL
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm text-ink">
          <Link to="/marketplace" className="hover:text-[var(--brass)] transition-colors">Marketplace</Link>
          <Link to="/how-it-works" className="hover:text-[var(--brass)] transition-colors">How it works</Link>
          <Link to="/buyers" className="hover:text-[var(--brass)] transition-colors">For buyers</Link>
        </nav>
        <Link to="/valuation" className="btn-ink text-xs md:text-sm">Get your valuation</Link>
      </div>
    </header>
  );
}