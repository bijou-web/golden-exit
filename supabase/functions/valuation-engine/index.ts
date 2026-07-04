// SELL BABY SELL — valuation-engine
// POST body: valuation_requests row (include request_id). Returns saved valuation row.
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SYSTEM_PROMPT = `You are the valuation engine for Sell Baby Sell, a data-verified exit marketplace for hospitality businesses (vacation rental portfolios, boutique hotels, hotels, inns).

You value businesses using these heuristics. Apply them faithfully and show your reasoning in plain operator language — confident, specific, never salesy.

BASE MULTIPLES (applied to SDE; if SDE unknown, estimate SDE as 38-45% of gross revenue for VR portfolios, 30-38% for hotels/inns, and say you did):
- Vacation rental portfolio (business only, no real estate): 2.8x–4.5x SDE
- Vacation rental portfolio + management company: 3.5x–5.0x
- Boutique hotel / inn (with real estate): value as the greater of 4.5x–6.5x SDE or a revenue multiple of 2.0x–2.8x
- Independent hotel: 5.0x–7.0x SDE

ADJUSTMENTS (move within or slightly beyond the range):
+ occupancy > 75%: +0.3x | occupancy < 60%: -0.4x
+ avg review >= 4.8: +0.3x | < 4.5: -0.3x
+ direct bookings > 40% of revenue: +0.4x (platform-risk reduction) | < 20%: -0.3x
+ owner works < 10 hrs/wk: +0.4x | > 25 hrs/wk: -0.5x (owner-dependency discount)
+ premium supply-constrained market (Napa, Sedona, Maui, Charleston, ski towns, wine country, national-park gateways): +0.3x

READINESS SUBSCORES (0-100 each):
- financial_records: 85 if a file/PMS source was provided, 55 if numbers were self-reported, 35 if SDE unknown
- revenue_trend: infer from occupancy vs. type norms (norm ~65-70%)
- review_health: map review score (5.0->98, 4.8->90, 4.5->70, 4.0->45)
- owner_dependency: <5 hrs/wk -> 95, 10 -> 80, 20 -> 55, 30+ -> 30
- channel_mix: direct% 50+ -> 90, 30 -> 70, 15 -> 45, <10 -> 30
Overall readiness_score = weighted mean (financial_records 25%, owner_dependency 25%, others 16.7% each), rounded.

For every subscore under 70, produce a gap with a dollar-quantified fix (estimate the SDE-multiple impact honestly, e.g. "Documenting SOPs and delegating guest comms typically recovers 0.3-0.5x — roughly $95K-$160K on this business").

Respond with ONLY a valid JSON object, no markdown fences, no preamble:
{
  "low": number, "high": number,
  "multiple_used": string,
  "methodology": string,
  "readiness_score": number,
  "subscores": {"financial_records": n, "revenue_trend": n, "review_health": n, "owner_dependency": n, "channel_mix": n},
  "drivers": [string, ...],
  "gaps": [{"area": string, "impact": string, "fix": string}, ...],
  "teaser_paragraph": string
}
Round low/high to the nearest $25,000. The range width should be 15-25% of the midpoint.`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const payload = await req.json();
    const userMsg = `Value this business:\n${JSON.stringify(payload, null, 2)}`;

    const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": Deno.env.get("ANTHROPIC_API_KEY")!,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 1500,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userMsg }],
      }),
    });

    const data = await anthropicRes.json();
    const raw = (data.content ?? [])
      .filter((b: any) => b.type === "text")
      .map((b: any) => b.text)
      .join("\n");
    const clean = raw.replace(/```json|```/g, "").trim();
    const valuation = JSON.parse(clean);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
    const { data: saved, error } = await supabase
      .from("valuations")
      .insert({
        request_id: payload.request_id ?? null,
        low: valuation.low,
        high: valuation.high,
        multiple_used: valuation.multiple_used,
        methodology: valuation.methodology,
        readiness_score: valuation.readiness_score,
        subscores: valuation.subscores,
        drivers: valuation.drivers,
        gaps: valuation.gaps,
        teaser_paragraph: valuation.teaser_paragraph,
      })
      .select()
      .single();
    if (error) throw error;

    return new Response(JSON.stringify(saved), {
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  } catch (err) {
    console.error("valuation-engine error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, "content-type": "application/json" },
    });
  }
});