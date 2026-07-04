import { formatFull, formatMoney } from "@/lib/sbs-data";

interface Props {
  serial: string;
  issued_at?: string;
  low: number;
  high: number;
  methodology: string;
  readiness: number;
  headline?: string;
  subhead?: string;
  compact?: boolean;
  verified?: boolean;
}

export function ReadinessSeal({ score, size = 96 }: { score: number; size?: number }) {
  const r = size / 2 - 6;
  const c = 2 * Math.PI * r;
  const off = c - (score / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="var(--sand)" strokeWidth="6" fill="var(--paper)" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--brass)"
          strokeWidth="6"
          fill="none"
          strokeDasharray={c}
          strokeDashoffset={off}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-mono-num text-xl font-medium leading-none text-ink">{score}</span>
        <span className="eyebrow mt-1" style={{ fontSize: "0.55rem", letterSpacing: "0.14em" }}>READY</span>
      </div>
    </div>
  );
}

export function DealTicket({
  serial,
  issued_at,
  low,
  high,
  methodology,
  readiness,
  headline,
  subhead,
  compact,
  verified,
}: Props) {
  const dateStr = issued_at
    ? new Date(issued_at).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase()
    : new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }).toUpperCase();

  return (
    <div
      className="relative bg-[var(--sand)] p-6 md:p-8"
      style={{
        border: "1px solid var(--ink)",
        boxShadow: "inset 0 0 0 4px var(--sand), inset 0 0 0 5px var(--ink)",
        borderRadius: "4px",
      }}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="eyebrow">Deal Ticket · Appraisal Certificate</div>
          {headline && (
            <div className="mt-3 font-display text-lg text-ink leading-snug">{headline}</div>
          )}
          {subhead && <div className="mt-1 text-xs text-[var(--sage)]">{subhead}</div>}
        </div>
        <div className="text-right shrink-0">
          <div className="font-mono-num text-[10px] text-[var(--sage)] tracking-widest">{serial}</div>
          <div className="font-mono-num text-[10px] text-[var(--sage)] tracking-widest mt-1">{dateStr}</div>
          {verified && (
            <div className="mt-2 inline-block font-mono-num text-[9px] tracking-widest px-2 py-0.5 border border-[var(--brass)] text-[var(--brass)]">
              DATA-VERIFIED
            </div>
          )}
        </div>
      </div>

      <div className={`mt-6 grid gap-6 ${compact ? "grid-cols-1" : "md:grid-cols-[1fr_auto] items-center"}`}>
        <div>
          <div className="eyebrow">Valuation Range</div>
          <div className={`mt-2 font-display font-normal text-[var(--brass)] leading-none ${compact ? "text-3xl md:text-4xl" : "text-4xl md:text-5xl"}`}>
            {compact ? `${formatMoney(low)}–${formatMoney(high)}` : (
              <>
                {formatFull(low)}
                <span className="text-[var(--sage)] mx-2 text-2xl md:text-3xl">–</span>
                {formatFull(high)}
              </>
            )}
          </div>
          <div className="mt-3 font-mono-num text-xs text-[var(--sage)]">
            METHODOLOGY · {methodology.toUpperCase()}
          </div>
        </div>
        <ReadinessSeal score={readiness} size={compact ? 76 : 104} />
      </div>
    </div>
  );
}