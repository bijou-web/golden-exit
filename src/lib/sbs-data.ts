// Shared demo data + local valuation store.
// Backend tables will replace localStorage once the SQL migration lands.

export type BusinessType = "vacation_rental" | "boutique_hotel" | "hotel" | "bnb_inn";

export const businessTypeLabel: Record<BusinessType, string> = {
  vacation_rental: "Vacation rental portfolio",
  boutique_hotel: "Boutique hotel",
  hotel: "Hotel",
  bnb_inn: "B&B / Inn",
};

export const shortTypeLabel: Record<BusinessType, string> = {
  vacation_rental: "Vacation rental portfolio",
  boutique_hotel: "Boutique hotel",
  hotel: "Hotel",
  bnb_inn: "B&B",
};

export interface ValuationInput {
  business_type: BusinessType;
  units: number;
  city: string;
  state: string;
  revenue: number;
  noi: number | null;
  occupancy: number;
  adr: number;
  direct_pct: number;
  review_score: number;
  owner_hours: number;
  timeline: "now" | "1-2" | "3+" | "curious";
  name: string;
  email: string;
}

export interface Subscores {
  financial_records: number;
  revenue_trend: number;
  review_health: number;
  owner_dependency: number;
  channel_mix: number;
}

export interface Valuation {
  id: string;
  serial: string;
  issued_at: string;
  low: number;
  high: number;
  multiple_used: number;
  methodology: string;
  readiness_score: number;
  subscores: Subscores;
  drivers: string[];
  gaps: { label: string; fix: string; impact: string }[];
  teaser_paragraph: string;
  input: ValuationInput;
}

function nextSerial(): string {
  const n = Number(localStorage.getItem("sbs_serial_counter") || "142");
  const next = n + 1;
  localStorage.setItem("sbs_serial_counter", String(next));
  return `SBS-2026-${String(next).padStart(5, "0")}`;
}

function clamp(n: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, n));
}

// Local heuristic valuation engine. Replace with edge fn call next turn.
export function computeValuation(input: ValuationInput): Valuation {
  const sde = input.noi ?? input.revenue * 0.28;

  // Base multiples by type
  const baseMult: Record<BusinessType, number> = {
    vacation_rental: 3.5,
    boutique_hotel: 4.8,
    hotel: 5.5,
    bnb_inn: 3.2,
  };
  let mult = baseMult[input.business_type];

  // Adjustments
  if (input.review_score >= 4.7) mult += 0.4;
  else if (input.review_score < 4.3) mult -= 0.3;
  if (input.occupancy > 70) mult += 0.3;
  else if (input.occupancy < 45) mult -= 0.4;
  if (input.direct_pct > 40) mult += 0.3;
  if (input.owner_hours > 25) mult -= 0.5;
  else if (input.owner_hours < 10) mult += 0.3;

  const mid = sde * mult;
  const low = Math.round(mid * 0.9);
  const high = Math.round(mid * 1.15);

  const financial_records = input.noi != null ? 82 : 48;
  const revenue_trend = clamp(55 + input.occupancy * 0.4, 40, 92);
  const review_health = clamp(Math.round((input.review_score - 3.5) * 55 + 30), 20, 98);
  const owner_dependency = clamp(Math.round(100 - input.owner_hours * 2.4), 15, 95);
  const channel_mix = clamp(Math.round(40 + input.direct_pct * 0.9), 20, 95);
  const readiness_score = Math.round(
    (financial_records + revenue_trend + review_health + owner_dependency + channel_mix) / 5,
  );

  const gaps: Valuation["gaps"] = [];
  if (owner_dependency < 70)
    gaps.push({
      label: "Owner dependency",
      fix: `Owner works ${input.owner_hours} hrs/wk — document SOPs and hire a GM to add an estimated $${Math.round(sde * 0.4 / 1000)}K to enterprise value.`,
      impact: `+$${Math.round(sde * 0.4).toLocaleString()}`,
    });
  if (financial_records < 70)
    gaps.push({
      label: "Financial records",
      fix: "You marked NOI as unsure. Get reviewed financials (or a QoE-lite) before buyers ask — this is the #1 deal killer.",
      impact: "Unlocks serious buyers",
    });
  if (channel_mix < 60)
    gaps.push({
      label: "Channel mix",
      fix: `${input.direct_pct}% direct bookings. Investing in a direct-booking engine can lift margin 6–9 pts.`,
      impact: "+0.3× multiple",
    });

  const drivers = [
    `${(sde / 1000).toFixed(0)}K SDE × ${mult.toFixed(1)}× market multiple for ${shortTypeLabel[input.business_type].toLowerCase()}s in the ${input.state} region.`,
    `${input.occupancy}% occupancy at $${input.adr} ADR signals ${input.occupancy > 65 ? "healthy demand" : "room to grow"}.`,
    `${input.review_score.toFixed(1)}★ review score ${input.review_score >= 4.6 ? "puts you in the top quartile — buyers pay for reputation." : "is solid, and small lifts here compound in value."}`,
    `${input.direct_pct}% direct bookings ${input.direct_pct > 35 ? "means less OTA dependency — worth a premium." : "leaves margin on the table."}`,
  ];

  const teaser_paragraph = `A ${input.units}-${input.business_type === "vacation_rental" ? "unit" : "key"} ${shortTypeLabel[input.business_type].toLowerCase()} located in ${input.city}, ${input.state}, generating $${(input.revenue / 1000).toFixed(0)}K in trailing gross revenue at ${input.occupancy}% average occupancy. The business maintains a ${input.review_score.toFixed(1)}★ guest review average with ${input.direct_pct}% of revenue booked direct. Owner is ${input.owner_hours < 10 ? "largely absentee" : `active at ${input.owner_hours} hrs/wk`}, with ${input.timeline === "now" ? "immediate sale intent" : "a flexible timeline"}. Financials available in the deal room.`;

  const valuation: Valuation = {
    id: crypto.randomUUID(),
    serial: nextSerial(),
    issued_at: new Date().toISOString(),
    low,
    high,
    multiple_used: Math.round(mult * 10) / 10,
    methodology: `${Math.round(mult * 10) / 10}× SDE`,
    readiness_score,
    subscores: { financial_records, revenue_trend, review_health, owner_dependency, channel_mix },
    drivers,
    gaps,
    teaser_paragraph,
    input,
  };

  const all = getAllValuations();
  all[valuation.id] = valuation;
  localStorage.setItem("sbs_valuations", JSON.stringify(all));
  return valuation;
}

export function getValuation(id: string): Valuation | null {
  if (typeof window === "undefined") return null;
  const all = getAllValuations();
  return all[id] ?? null;
}

export function getAllValuations(): Record<string, Valuation> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem("sbs_valuations") || "{}");
  } catch {
    return {};
  }
}

// Seed marketplace listings
export interface Listing {
  id: string;
  serial: string;
  business_type: BusinessType;
  units: number;
  region: string;
  revenue_band: string;
  ask_low: number;
  ask_high: number;
  readiness: number;
  verified: boolean;
  days_listed: number;
  multiple: number;
  methodology: string;
  metrics: {
    revenue: number;
    noi: number;
    occupancy: number;
    adr: number;
    review_score: number;
    direct_pct: number;
  };
  subscores: Subscores;
  teaser: string;
  headline: string;
}

export const SEED_LISTINGS: Listing[] = [
  {
    id: "sedona-portfolio",
    serial: "SBS-2026-00142",
    business_type: "vacation_rental",
    units: 12,
    region: "Sedona, AZ",
    revenue_band: "$1.4M–$1.6M",
    ask_low: 2100000,
    ask_high: 2600000,
    readiness: 84,
    verified: true,
    days_listed: 6,
    multiple: 4.6,
    methodology: "4.6× SDE",
    metrics: { revenue: 1520000, noi: 512000, occupancy: 74, adr: 389, review_score: 4.8, direct_pct: 42 },
    subscores: { financial_records: 88, revenue_trend: 82, review_health: 92, owner_dependency: 78, channel_mix: 80 },
    teaser: "A twelve-unit short-term rental portfolio spread across three curated Sedona neighborhoods, generating $1.52M in trailing gross revenue at 74% occupancy. Established in 2016, the business runs on a full property-management stack (Guesty + PriceLabs) with 42% of revenue booked direct through a proprietary site. Owner spends ~8 hrs/wk on oversight; a two-person local ops team handles turnovers and guest comms. Financials available in the deal room.",
    headline: "12-unit vacation rental portfolio · Sedona, AZ",
  },
  {
    id: "napa-boutique",
    serial: "SBS-2026-00138",
    business_type: "boutique_hotel",
    units: 14,
    region: "Napa Valley, CA",
    revenue_band: "$2.1M–$2.4M",
    ask_low: 6800000,
    ask_high: 8100000,
    readiness: 91,
    verified: true,
    days_listed: 14,
    multiple: 5.1,
    methodology: "5.1× SDE",
    metrics: { revenue: 2280000, noi: 780000, occupancy: 68, adr: 612, review_score: 4.9, direct_pct: 58 },
    subscores: { financial_records: 95, revenue_trend: 78, review_health: 96, owner_dependency: 92, channel_mix: 90 },
    teaser: "Fourteen-key boutique property on a working vineyard adjacent to St. Helena, operating year-round with a strong shoulder-season food & beverage program. Full GM in place; owner absentee. 58% direct bookings, 4.9★ across 1,200+ reviews.",
    headline: "Boutique hotel · 14 keys · Napa Valley, CA",
  },
  {
    id: "asheville-inn",
    serial: "SBS-2026-00131",
    business_type: "bnb_inn",
    units: 8,
    region: "Asheville, NC",
    revenue_band: "$540K–$620K",
    ask_low: 1650000,
    ask_high: 1950000,
    readiness: 72,
    verified: true,
    days_listed: 22,
    multiple: 3.4,
    methodology: "3.4× SDE",
    metrics: { revenue: 580000, noi: 198000, occupancy: 62, adr: 289, review_score: 4.7, direct_pct: 71 },
    subscores: { financial_records: 74, revenue_trend: 68, review_health: 88, owner_dependency: 55, channel_mix: 88 },
    teaser: "Eight-room historic inn walkable to downtown Asheville. Owner-operated for 11 years — SOP transfer plan documented. Real estate included in asking range.",
    headline: "Historic inn · 8 rooms · Asheville, NC",
  },
  {
    id: "gulf-portfolio",
    serial: "SBS-2026-00127",
    business_type: "vacation_rental",
    units: 26,
    region: "30A, FL",
    revenue_band: "$3.8M–$4.2M",
    ask_low: 4200000,
    ask_high: 5100000,
    readiness: 79,
    verified: true,
    days_listed: 31,
    multiple: 4.1,
    methodology: "4.1× SDE",
    metrics: { revenue: 4020000, noi: 1120000, occupancy: 71, adr: 486, review_score: 4.6, direct_pct: 38 },
    subscores: { financial_records: 82, revenue_trend: 84, review_health: 78, owner_dependency: 72, channel_mix: 76 },
    teaser: "Twenty-six-unit vacation-rental management business along Florida's 30A corridor. Mix of owned and managed units with a proven acquisition playbook.",
    headline: "26-unit VR portfolio · 30A, FL",
  },
  {
    id: "hudson-hotel",
    serial: "SBS-2026-00119",
    business_type: "hotel",
    units: 32,
    region: "Hudson Valley, NY",
    revenue_band: "$2.8M–$3.1M",
    ask_low: 7400000,
    ask_high: 9200000,
    readiness: 86,
    verified: true,
    days_listed: 44,
    multiple: 5.3,
    methodology: "5.3× SDE",
    metrics: { revenue: 2960000, noi: 892000, occupancy: 65, adr: 341, review_score: 4.7, direct_pct: 51 },
    subscores: { financial_records: 90, revenue_trend: 76, review_health: 88, owner_dependency: 88, channel_mix: 86 },
    teaser: "Thirty-two-room independent hotel with an on-site restaurant, meeting space, and a strong wedding pipeline. Full management team stays with sale.",
    headline: "Independent hotel · 32 keys · Hudson Valley, NY",
  },
  {
    id: "joshua-tree",
    serial: "SBS-2026-00108",
    business_type: "vacation_rental",
    units: 6,
    region: "Joshua Tree, CA",
    revenue_band: "$410K–$470K",
    ask_low: 980000,
    ask_high: 1250000,
    readiness: 68,
    verified: false,
    days_listed: 58,
    multiple: 3.2,
    methodology: "3.2× SDE",
    metrics: { revenue: 442000, noi: 148000, occupancy: 58, adr: 312, review_score: 4.5, direct_pct: 22 },
    subscores: { financial_records: 62, revenue_trend: 70, review_health: 78, owner_dependency: 60, channel_mix: 55 },
    teaser: "Six architectural desert rentals, Instagram-forward, high margin on peak weekends. Owner willing to stay 6 months post-close for handover.",
    headline: "6-unit design vacation rentals · Joshua Tree, CA",
  },
];

export function getListing(id: string): Listing | null {
  return SEED_LISTINGS.find((l) => l.id === id) ?? null;
}

export function formatMoney(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(n >= 10_000_000 ? 1 : 2).replace(/\.?0+$/, "")}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}K`;
  return `$${n.toLocaleString()}`;
}

export function formatFull(n: number): string {
  return `$${n.toLocaleString()}`;
}