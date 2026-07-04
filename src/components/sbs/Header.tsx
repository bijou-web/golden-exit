import { Link } from "@tanstack/react-router";
import logoPrimary from "@/assets/brand/sbs_logo_primary.svg";

export function Header() {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--paper)]/95 backdrop-blur sticky top-0 z-40">
      <div className="content-shell h-20 grid grid-cols-[auto_1fr_auto] items-center gap-6">
        <Link to="/" aria-label="Sell Baby Sell — home" className="no-underline shrink-0 flex items-center">
          <img src={logoPrimary} alt="Sell Baby Sell" style={{ height: 44 }} />
        </Link>
        <nav className="hidden md:flex items-center justify-center gap-8 text-base text-ink">
          <Link to="/marketplace" className="no-underline hover:text-[var(--brass)] transition-colors">Marketplace</Link>
          <Link to="/how-it-works" className="no-underline hover:text-[var(--brass)] transition-colors">How it works</Link>
          <Link to="/buyers" className="no-underline hover:text-[var(--brass)] transition-colors">For buyers</Link>
        </nav>
        <div className="flex items-center gap-5 justify-self-end">
          <a
            href="tel:+14155550134"
            className="no-underline hidden sm:flex items-center gap-2 text-ink group"
            aria-label="Call us at (415) 555-0134 — talk to a real person"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span className="flex flex-col leading-tight text-left">
              <span className="font-mono-num text-base font-medium">(415) 555-0134</span>
              <span className="text-[11px] text-[var(--sage)] tracking-wider uppercase">Talk to a real person</span>
            </span>
          </a>
          <Link to="/valuation" className="btn-ink no-underline">Get my valuation</Link>
        </div>
      </div>
    </header>
  );
}