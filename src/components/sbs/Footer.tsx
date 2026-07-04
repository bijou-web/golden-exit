import { Link } from "@tanstack/react-router";
import logoDark from "@/assets/brand/sbs_logo_dark.svg";

export function Footer() {
  return (
    <footer className="mt-0 bg-[var(--ink)] text-[var(--paper)]">
      <div className="content-shell py-16 grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <img src={logoDark} alt="Sell Baby Sell" style={{ height: 44 }} />
          <p className="mt-6 max-w-md text-base text-[var(--paper)]/80 leading-relaxed">
            The exit rail for hospitality. Data-verified valuations, private deal rooms, and qualified buyers — for vacation rental portfolios, boutique hotels, and independent inns.
          </p>
          <a
            href="tel:+14155550134"
            className="no-underline mt-8 inline-flex items-center gap-3 text-[var(--paper)]"
            aria-label="Call us at (415) 555-0134"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>
              <span className="font-mono-num text-lg">(415) 555-0134</span>
              <span className="block text-xs text-[var(--paper)]/60 uppercase tracking-wider">Talk to a real person · 9a–7p PT</span>
            </span>
          </a>
          <address className="not-italic mt-6 text-sm text-[var(--paper)]/70 leading-relaxed">
            Sell Baby Sell, Inc.<br />
            548 Market St, PMB 62114<br />
            San Francisco, CA 94104
          </address>
        </div>
        <div className="text-base space-y-4">
          <div className="eyebrow" style={{ color: "var(--paper)", opacity: 0.55 }}>Sellers</div>
          <Link to="/valuation" className="no-underline block text-[var(--paper)] hover:text-[var(--brass)]">Get a valuation</Link>
          <Link to="/sell" className="no-underline block text-[var(--paper)] hover:text-[var(--brass)]">Seller dashboard</Link>
        </div>
        <div className="text-base space-y-4">
          <div className="eyebrow" style={{ color: "var(--paper)", opacity: 0.55 }}>Buyers</div>
          <Link to="/marketplace" className="no-underline block text-[var(--paper)] hover:text-[var(--brass)]">Live deals</Link>
          <Link to="/buyers" className="no-underline block text-[var(--paper)] hover:text-[var(--brass)]">Apply for access</Link>
        </div>
      </div>
      <div className="border-t border-[var(--paper)]/10">
        <div className="content-shell py-6 text-xs text-[var(--paper)]/55">
          Sell Baby Sell is a marketplace, not a licensed broker. Valuations are estimates, not appraisals. © {new Date().getFullYear()} Sell Baby Sell, Inc.
        </div>
      </div>
    </footer>
  );
}