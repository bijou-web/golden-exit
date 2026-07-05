import { useEffect, useRef, useState } from "react";

type Step = { id: string; label: string; line: string };

const SEQ: Step[] = [
  { id: "a1", label: "UNDERWRITING…", line: "Seller Deal Engine: verify → records → valuation → readiness 84 → risk 22" },
  { id: "a2", label: "PRICING…", line: "Pricing Feedback Loop: repriced vs 312 AirDNA-style comps · band ↑" },
  { id: "a4", label: "BUYER SIDE…", line: "Buyer Underwriter: thesis \"Paris STR yield ≥ 5%\" → underwrite → memo" },
  { id: "a5", label: "BUYER SIDE…", line: "LinkedIn Buyer Matcher: real IDF firms ranked · Link Verifier HTTP 200 ✓" },
  { id: "a6", label: "MATCHING…", line: "Match Broker: bilateral case (Rivoli × Fonds Rivoli) · conviction 0.93" },
  { id: "a7", label: "CONCIERGE…", line: "Baby Ask: Jean asks \"what am I missing?\" → \"DPE + taxe foncière\"" },
  { id: "a3", label: "OUTREACH…", line: "Outreach Agent: first touch drafted → Jean APPROVED → sent ✉" },
  { id: "a8", label: "ALMOST DONE…", line: "Deal Momentum*: declared — stubbed for the timebox" },
];

const STEP = 1550;
const FINAL_PRICE = "€1.11M–€1.26M";
const FINAL_SCORE = 84;

type AgentDef = { id: string; glyph: string; title: string; desc: string; out: string; stub?: boolean };

const SELLER: AgentDef[] = [
  { id: "a1", glyph: "S", title: "Seller Deal Engine", desc: "verify → records → valuation → readiness → risk", out: "READY 84 · RISK 22" },
  { id: "a2", glyph: "P", title: "Pricing Feedback Loop", desc: "reprices vs AirDNA-style comps, live", out: "BAND ↑ €1.09–1.24M" },
  { id: "a3", glyph: "O", title: "Outreach Agent", desc: "first-touch draft · sends on Jean's approval", out: "SENT ✉ (APPROVED)" },
];
const BUYER: AgentDef[] = [
  { id: "a4", glyph: "B", title: "Buyer Underwriter", desc: "thesis → underwrite → market → risk → memo", out: "OFFER €1.18M" },
  { id: "a5", glyph: "L", title: "LinkedIn Buyer Matcher", desc: "ranks real IDF firms · Link Verifier sub-agent", out: "HTTP 200 ✓ ×3" },
];
const PLATFORM: AgentDef[] = [
  { id: "a6", glyph: "M", title: "Match Broker", desc: "bilateral matching · conviction scoring", out: "CONVICTION 0.93" },
  { id: "a7", glyph: "A", title: "Baby Ask Concierge", desc: "tool-using chat · listings, docs, buyers", out: "2 DOCS FOUND" },
  { id: "a8", glyph: "D", title: "Deal Momentum*", desc: "trajectory · blockers · nudges", out: "STUBBED · NEXT SPRINT", stub: true },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function MeetTheAgents() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const startedRef = useRef(false);
  const timeoutsRef = useRef<number[]>([]);
  const [activeIndex, setActiveIndex] = useState(-1); // index in SEQ currently .on; earlier are .done
  const [ticker, setTicker] = useState("");
  const [timerLabel, setTimerLabel] = useState("UNDERWRITING…");
  const [allDone, setAllDone] = useState(false);
  const [ticketVisible, setTicketVisible] = useState(false);
  const [priceText, setPriceText] = useState("€0.00M–€0.00M");
  const [priceUp, setPriceUp] = useState(false);
  const [score, setScore] = useState(0);
  const [bellVisible, setBellVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const start = () => {
      if (startedRef.current) return;
      startedRef.current = true;

      if (prefersReducedMotion()) {
        setActiveIndex(SEQ.length); // all done
        setAllDone(true);
        setTicker("Deal package assembled · buyer requests the deal room…");
        setTimerLabel("DONE · 58 SECONDS");
        setTicketVisible(true);
        setPriceText(FINAL_PRICE);
        setPriceUp(true);
        setScore(FINAL_SCORE);
        setBellVisible(true);
        return;
      }

      const push = (fn: () => void, delay: number) => {
        timeoutsRef.current.push(window.setTimeout(fn, delay));
      };

      SEQ.forEach((s, i) => {
        push(() => {
          setActiveIndex(i);
          setTicker(s.line);
          setTimerLabel(s.label);
        }, 1200 + i * STEP);
      });

      push(() => {
        setAllDone(true);
        setTicker("Deal package assembled · buyer requests the deal room…");
        setTimerLabel("DONE · 58 SECONDS");
      }, 1200 + SEQ.length * STEP);

      push(() => {
        setTicketVisible(true);
        const t0 = performance.now();
        const dur = 1200;
        const lo = 1.11;
        const hi = 1.26;
        let raf = 0;
        const tick = (t: number) => {
          const p = Math.min((t - t0) / dur, 1);
          const e = 1 - Math.pow(1 - p, 3);
          setPriceText(`€${(lo * e).toFixed(2)}M–€${(hi * e).toFixed(2)}M`);
          if (p < 1) {
            raf = requestAnimationFrame(tick);
          } else {
            setPriceText(FINAL_PRICE);
            setPriceUp(true);
          }
        };
        raf = requestAnimationFrame(tick);
        timeoutsRef.current.push(raf as unknown as number);

        let v = 0;
        const iv = window.setInterval(() => {
          v += 3;
          if (v >= FINAL_SCORE) {
            v = FINAL_SCORE;
            window.clearInterval(iv);
          }
          setScore(v);
        }, 40);
        timeoutsRef.current.push(iv as unknown as number);
      }, 1400 + SEQ.length * STEP + 500);

      push(() => setBellVisible(true), 1400 + SEQ.length * STEP + 2400);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
            start();
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);

    return () => {
      io.disconnect();
      timeoutsRef.current.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      timeoutsRef.current = [];
    };
  }, []);

  const agentState = (id: string): "" | "on" | "done" => {
    const idx = SEQ.findIndex((s) => s.id === id);
    if (idx === -1) return "";
    if (allDone || activeIndex > idx) return "done";
    if (activeIndex === idx) return "on";
    return "";
  };

  const arcCircumference = 214;
  const arcOffset = arcCircumference - arcCircumference * (score / 100);

  const renderAgent = (a: AgentDef) => {
    const st = agentState(a.id);
    const cls = ["mta-agent", a.stub ? "mta-stub" : "", st === "on" ? "mta-on" : "", st === "done" ? "mta-done" : ""]
      .filter(Boolean)
      .join(" ");
    return (
      <div key={a.id} className={cls}>
        <div className="mta-glyph">{a.glyph}</div>
        <h3>{a.title}</h3>
        <p>{a.desc}</p>
        <div className="mta-out">{a.out}</div>
      </div>
    );
  };

  return (
    <section
      ref={sectionRef}
      aria-label="Animation showing eight AI agents processing a property sale"
      className="mta-section"
    >
      <style>{CSS}</style>
      <div className="mta-stage">
        <div className="mta-eyebrow">HOW IT WORKS · EIGHT AGENTS · THREE TEAMS</div>
        <h2 className="mta-h1">
          Jean's business goes in. <em>A signed deal comes out.</em>
        </h2>
        <p className="mta-sub">
          Seller agents work for Jean · Buyer agents work for the investor · Platform agents run the marketplace
        </p>

        <div className="mta-top-row">
          <div className="mta-chip mta-jean">👴 JEAN · SELLER · SINCE 1995</div>
          <div className="mta-chip mta-addr">
            <span className="mta-pin">◆</span>12 RUE DE RIVOLI, 75004 PARIS
          </div>
          <div className="mta-chip mta-buyer">🕴️ FONDS RIVOLI · BUYER</div>
        </div>

        <div className="mta-timer">
          <i />
        </div>
        <div className="mta-timer-label">{timerLabel}</div>
        <div style={{ height: 26 }} />

        <div className="mta-groups">
          <div className="mta-group mta-seller">
            <div className="mta-gtitle">SELLER AGENTS</div>
            <div className="mta-gsub">WORK FOR JEAN</div>
            <div className="mta-agents">{SELLER.map(renderAgent)}</div>
          </div>
          <div className="mta-group mta-gbuyer">
            <div className="mta-gtitle">BUYER AGENTS</div>
            <div className="mta-gsub">WORK FOR THE BUYER</div>
            <div className="mta-agents">{BUYER.map(renderAgent)}</div>
          </div>
          <div className="mta-group mta-platform">
            <div className="mta-gtitle">PLATFORM AGENTS</div>
            <div className="mta-gsub">RUN THE MARKETPLACE</div>
            <div className="mta-agents">{PLATFORM.map(renderAgent)}</div>
          </div>
        </div>

        <div className="mta-ticker" aria-live="polite">{ticker}</div>

        <div className="mta-ticket-wrap">
          <div className={`mta-ticket${ticketVisible ? " mta-show" : ""}`}>
            <div className="mta-t-head">
              <span className="mta-brand">SELL BABY SELL</span>
              <span className="mta-serial">SBS-2026-00142</span>
            </div>
            <div className="mta-t-addr">🏠 JEAN'S BUSINESS · 12 RUE DE RIVOLI, 75004 PARIS · 2 BD / 1 BA · 80 M²</div>
            <div className="mta-t-main">
              <div className="mta-t-val">
                <div className="mta-lbl">LIVE PRICE BAND</div>
                <div className="mta-num">{priceText}</div>
                <div className={`mta-up${priceUp ? " mta-show" : ""}`}>▲ REPRICED LIVE VS 312 COMPS</div>
              </div>
              <div className="mta-dial">
                <svg width="82" height="82">
                  <circle className="mta-track" cx="41" cy="41" r="34" />
                  <circle
                    className="mta-arc"
                    cx="41"
                    cy="41"
                    r="34"
                    style={{ strokeDashoffset: arcOffset }}
                  />
                </svg>
                <div className="mta-score">
                  <b>{score}</b>
                  <span>READINESS</span>
                </div>
              </div>
            </div>
            <div className="mta-t-grid">
              <div className="mta-t-cell"><div className="mta-lbl">STR SCORE</div><div className="mta-v">72 / 100</div></div>
              <div className="mta-t-cell"><div className="mta-lbl">CAP RATE</div><div className="mta-v">6.1%</div></div>
              <div className="mta-t-cell"><div className="mta-lbl">RISK</div><div className="mta-v">22 / 100</div></div>
              <div className="mta-t-cell"><div className="mta-lbl">BUYER</div><div className="mta-v mta-match">MATCHED 0.93</div></div>
            </div>
          </div>
        </div>

        <div className={`mta-bell-line${bellVisible ? " mta-show" : ""}`}>
          <svg className="mta-bell" viewBox="0 0 120 120">
            <path d="M104 26 A54 54 0 0 1 116 44" fill="none" stroke="#D3A64A" strokeWidth={6} strokeLinecap="round" />
            <circle cx="60" cy="28" r="9" fill="#D3A64A" />
            <rect x="56" y="34" width="8" height="10" rx="2" fill="#D3A64A" />
            <path d="M18 92 A42 42 0 0 1 102 92 Z" fill="#FCFBF8" />
            <rect x="8" y="96" width="104" height="12" rx="6" fill="#B98A2F" />
          </svg>
          <span>Deal room opened · Jean and his buyer are talking. Sell, baby, sell.</span>
        </div>
      </div>
    </section>
  );
}

const CSS = `
.mta-section{
  --ink:#0E2233; --paper:#FCFBF8; --brass:#B98A2F; --brass-hi:#D3A64A;
  --sage:#7A9086; --sand:#EDE7DB; --signal:#C4553B; --blue:#9db8d6;
  background:var(--ink);
  color:var(--paper);
  font-family:'Instrument Sans',sans-serif;
  padding:120px 22px;
  border-top:1px solid rgba(122,144,134,.3);
  border-bottom:1px solid rgba(122,144,134,.3);
  background-image:
    repeating-linear-gradient(0deg,transparent,transparent 47px,rgba(252,251,248,.02) 48px),
    linear-gradient(12deg,rgba(185,138,47,.05),transparent 60%);
}
@media(max-width:768px){.mta-section{padding:64px 22px}}
.mta-section *{box-sizing:border-box}
.mta-stage{width:100%;max-width:1180px;margin:0 auto}
.mta-eyebrow{font-family:'Spline Sans Mono',monospace;font-size:12.5px;letter-spacing:6px;color:var(--sage);text-align:center;margin-bottom:12px}
.mta-h1{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(26px,4vw,42px);text-align:center;line-height:1.15;margin:0 0 8px;color:var(--paper)}
.mta-h1 em{color:var(--brass-hi);font-style:italic}
.mta-sub{text-align:center;color:var(--sage);font-size:16px;margin:0 0 30px}

.mta-top-row{display:flex;justify-content:center;gap:12px;flex-wrap:wrap;margin-bottom:28px}
.mta-chip{font-family:'Spline Sans Mono',monospace;font-size:13.5px;padding:10px 18px;border-radius:6px;display:flex;gap:9px;align-items:center;opacity:0;transform:translateY(-8px);animation:mta-drop .5s forwards}
.mta-chip.mta-addr{background:var(--paper);color:var(--ink);animation-delay:.2s}
.mta-chip.mta-jean{border:1.5px solid var(--paper);color:var(--paper);animation-delay:.4s}
.mta-chip.mta-buyer{border:1.5px solid var(--blue);color:var(--blue);animation-delay:.6s}
.mta-chip .mta-pin{color:var(--signal)}
@keyframes mta-drop{to{opacity:1;transform:none}}

.mta-timer{max-width:520px;margin:0 auto 8px;height:3px;background:rgba(252,251,248,.12);border-radius:2px;overflow:hidden}
.mta-timer i{display:block;height:100%;width:0;background:var(--brass);animation:mta-fill 15s 1s linear forwards}
@keyframes mta-fill{to{width:100%}}
.mta-timer-label{font-family:'Spline Sans Mono',monospace;font-size:11px;letter-spacing:3px;color:var(--sage);text-align:center;margin-top:8px}

.mta-groups{display:grid;grid-template-columns:3fr 2fr 3fr;gap:16px;margin-bottom:38px}
@media(max-width:900px){.mta-groups{grid-template-columns:1fr}}

.mta-group{border:1px solid;border-radius:10px;padding:16px 12px 12px;position:relative}
.mta-group.mta-seller{border-color:rgba(252,251,248,.35);background:rgba(252,251,248,.025)}
.mta-group.mta-gbuyer{border-color:rgba(157,184,214,.45);background:rgba(157,184,214,.04)}
.mta-group.mta-platform{border-color:rgba(211,166,74,.5);background:rgba(185,138,47,.05)}
.mta-gtitle{position:absolute;top:-11px;left:50%;transform:translateX(-50%);white-space:nowrap;font-family:'Spline Sans Mono',monospace;font-size:10.5px;letter-spacing:3px;background:var(--ink);padding:2px 12px}
.mta-group.mta-seller .mta-gtitle{color:var(--paper)}
.mta-group.mta-gbuyer .mta-gtitle{color:var(--blue)}
.mta-group.mta-platform .mta-gtitle{color:var(--brass-hi)}
.mta-gsub{font-family:'Spline Sans Mono',monospace;font-size:9.5px;letter-spacing:2px;color:var(--sage);text-align:center;margin-bottom:12px}
.mta-agents{display:grid;gap:10px}
.mta-group.mta-seller .mta-agents{grid-template-columns:repeat(3,1fr)}
.mta-group.mta-gbuyer .mta-agents{grid-template-columns:repeat(2,1fr)}
.mta-group.mta-platform .mta-agents{grid-template-columns:repeat(3,1fr)}
@media(max-width:900px){.mta-group .mta-agents{grid-template-columns:repeat(3,1fr)!important}.mta-group.mta-gbuyer .mta-agents{grid-template-columns:repeat(2,1fr)!important}}

.mta-agent{background:rgba(252,251,248,.04);border:1px solid rgba(252,251,248,.1);border-radius:6px;padding:14px 8px 12px;text-align:center;opacity:.32;transition:.4s;position:relative}
.mta-agent .mta-glyph{width:40px;height:40px;margin:0 auto 8px;border:1.5px solid var(--sage);border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Fraunces',serif;font-size:17px;font-style:italic;color:var(--sage);transition:.4s;position:relative}
.mta-agent h3{font-family:'Fraunces',serif;font-weight:600;font-size:13px;margin:0 0 4px;line-height:1.2;color:var(--paper)}
.mta-agent p{font-size:10.5px;line-height:1.4;color:var(--sage);margin:0}
.mta-agent .mta-out{font-family:'Spline Sans Mono',monospace;font-size:9.5px;color:var(--brass-hi);margin-top:7px;opacity:0;transform:translateY(4px);transition:.4s;min-height:1.2em}
.mta-agent.mta-on{opacity:1;border-color:var(--brass);background:rgba(185,138,47,.08)}
.mta-group.mta-gbuyer .mta-agent.mta-on{border-color:var(--blue);background:rgba(157,184,214,.08)}
.mta-agent.mta-on .mta-glyph{border-color:var(--brass-hi);color:var(--brass-hi);animation:mta-pulse 1.1s}
.mta-group.mta-gbuyer .mta-agent.mta-on .mta-glyph{border-color:var(--blue);color:var(--blue)}
.mta-agent.mta-on .mta-out,.mta-agent.mta-done .mta-out{opacity:1;transform:none}
.mta-agent.mta-done{opacity:.88}
.mta-agent.mta-done .mta-glyph::after{content:'\\2713';position:absolute;top:-6px;right:-6px;width:15px;height:15px;background:var(--brass);color:var(--ink);border-radius:50%;font-size:9px;font-style:normal;font-family:'Instrument Sans',sans-serif;font-weight:600;display:flex;align-items:center;justify-content:center}
.mta-agent.mta-stub{border-style:dashed}
.mta-agent.mta-stub .mta-out{color:var(--signal)}
@keyframes mta-pulse{0%{box-shadow:0 0 0 0 rgba(211,166,74,.55)}100%{box-shadow:0 0 0 16px rgba(211,166,74,0)}}

.mta-ticker{font-family:'Spline Sans Mono',monospace;font-size:12.5px;color:var(--brass-hi);text-align:center;min-height:19px;margin-bottom:34px;letter-spacing:1px}

.mta-ticket-wrap{display:flex;justify-content:center;perspective:900px}
.mta-ticket{background:var(--sand);color:var(--ink);border-radius:6px;padding:24px 28px;max-width:580px;width:100%;border:1px solid var(--ink);box-shadow:inset 0 0 0 4px var(--sand),inset 0 0 0 5px rgba(14,34,51,.35);opacity:0;transform:rotateX(14deg) translateY(24px);transition:.8s cubic-bezier(.2,.8,.2,1);position:relative}
.mta-ticket.mta-show{opacity:1;transform:none}
.mta-t-head{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:5px}
.mta-t-head .mta-brand{font-family:'Fraunces',serif;font-weight:600;font-size:13px;letter-spacing:2px}
.mta-t-head .mta-serial{font-family:'Spline Sans Mono',monospace;font-size:11px;color:var(--sage)}
.mta-t-addr{font-family:'Spline Sans Mono',monospace;font-size:12.5px;color:var(--sage);margin-bottom:13px}
.mta-t-main{display:flex;justify-content:space-between;align-items:center;gap:16px}
.mta-t-val .mta-lbl{font-family:'Spline Sans Mono',monospace;font-size:10px;letter-spacing:2px;color:var(--sage)}
.mta-t-val .mta-num{font-family:'Fraunces',serif;font-weight:600;font-size:clamp(22px,3.6vw,32px);color:var(--brass)}
.mta-t-val .mta-up{font-family:'Spline Sans Mono',monospace;font-size:11px;color:#2c7a4b;margin-top:2px;opacity:0;transition:.4s}
.mta-t-val .mta-up.mta-show{opacity:1}
.mta-dial{width:82px;height:82px;position:relative;flex-shrink:0}
.mta-dial svg{transform:rotate(-90deg)}
.mta-dial .mta-track{fill:none;stroke:rgba(14,34,51,.15);stroke-width:6}
.mta-dial .mta-arc{fill:none;stroke:var(--brass);stroke-width:6;stroke-linecap:round;stroke-dasharray:214;stroke-dashoffset:214;transition:stroke-dashoffset 1.4s ease}
.mta-dial .mta-score{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center}
.mta-dial .mta-score b{font-family:'Fraunces',serif;font-size:22px;color:var(--ink)}
.mta-dial .mta-score span{font-family:'Spline Sans Mono',monospace;font-size:8px;letter-spacing:1px;color:var(--sage)}
.mta-t-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:9px;margin-top:15px;padding-top:13px;border-top:1px solid rgba(14,34,51,.2)}
.mta-t-cell .mta-lbl{font-family:'Spline Sans Mono',monospace;font-size:9px;letter-spacing:1.5px;color:var(--sage)}
.mta-t-cell .mta-v{font-family:'Spline Sans Mono',monospace;font-size:13.5px;font-weight:500}
.mta-t-cell .mta-v.mta-match{color:var(--brass)}

.mta-bell-line{display:flex;justify-content:center;align-items:center;gap:12px;margin-top:24px;opacity:0;transition:.6s}
.mta-bell-line.mta-show{opacity:1}
.mta-bell{width:32px;height:32px;transform-origin:top center}
.mta-bell-line.mta-show .mta-bell{animation:mta-ding .5s .2s 2}
@keyframes mta-ding{0%,100%{transform:rotate(0)}30%{transform:rotate(-14deg)}70%{transform:rotate(11deg)}}
.mta-bell-line span{font-family:'Fraunces',serif;font-style:italic;font-size:18px;color:var(--brass-hi)}

@media(prefers-reduced-motion:reduce){.mta-section *{animation-duration:.01s!important;transition-duration:.01s!important}}
`;