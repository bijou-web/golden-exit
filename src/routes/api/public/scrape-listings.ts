// Scrape hospitality businesses-for-sale from the web via Firecrawl,
// normalize into our listings shape, insert as verified=false.
import { createFileRoute } from "@tanstack/react-router";
import Firecrawl from "@mendable/firecrawl-js";
import { z } from "zod";

const DEFAULT_QUERIES = [
  "vacation rental portfolio for sale site:bizbuysell.com",
  "boutique hotel for sale site:bizbuysell.com",
  "bed and breakfast inn for sale site:bizbuysell.com",
  "independent hotel for sale site:businessesforsale.com",
  "vacation rental business for sale site:businessesforsale.com",
];

const ExtractSchema = {
  type: "object",
  properties: {
    headline: { type: "string", description: "One-line description of the business, max 90 chars" },
    business_type: {
      type: "string",
      enum: ["vr_portfolio", "boutique_hotel", "hotel", "bnb_inn"],
      description: "vr_portfolio = vacation rentals/cabins/condos, boutique_hotel = small design hotel, bnb_inn = B&B or inn, hotel = independent hotel",
    },
    units: { type: ["integer", "null"], description: "Number of rooms, keys, cabins, or units" },
    region: { type: "string", description: "City, State (e.g. 'Sedona, AZ')" },
    asking_low: { type: ["number", "null"], description: "Asking price in USD" },
    asking_high: { type: ["number", "null"], description: "Same as asking_low if only one price given" },
    gross_revenue_ltm: { type: ["number", "null"], description: "Trailing 12-month gross revenue in USD" },
    sde: { type: ["number", "null"], description: "Seller's discretionary earnings / cash flow in USD" },
    teaser_paragraph: { type: "string", description: "60-90 word anonymized summary of the business" },
  },
  required: ["headline", "business_type", "region", "teaser_paragraph"],
};

const BodySchema = z.object({
  queries: z.array(z.string()).max(6).optional(),
  per_query: z.number().int().min(1).max(5).optional(),
});

export const Route = createFileRoute("/api/public/scrape-listings")({
  server: {
    handlers: {
      OPTIONS: async () => new Response(null, { status: 204 }),
      POST: async ({ request }) => {
        const apiKey = process.env.FIRECRAWL_API_KEY;
        if (!apiKey) {
          return Response.json({ error: "FIRECRAWL_API_KEY not configured" }, { status: 500 });
        }

        let parsedBody: z.infer<typeof BodySchema> = {};
        try {
          const raw = await request.text();
          if (raw) parsedBody = BodySchema.parse(JSON.parse(raw));
        } catch (e) {
          return Response.json({ error: "Invalid body" }, { status: 400 });
        }

        const queries = parsedBody.queries?.length ? parsedBody.queries : DEFAULT_QUERIES;
        const perQuery = parsedBody.per_query ?? 2;

        const firecrawl = new Firecrawl({ apiKey });
        const scraped: any[] = [];
        const errors: string[] = [];

        const PLACEHOLDER_IMG_RE =
          /(facebookDefaultImage|default[-_]?(og|share|image)|placeholder|logo\.(png|svg|jpg))/i;
        const pickHero = (meta: any, markdown: string | undefined, screenshot: string | undefined) => {
          // Prefer Firecrawl's own screenshot URL — source sites (BizBuySell,
          // BusinessesForSale) hotlink-block their CDN images with Akamai, so
          // metadata og:image URLs return 403 in the browser. Firecrawl-hosted
          // screenshots are always hotlinkable.
          if (typeof screenshot === "string" && /^https?:\/\//.test(screenshot)) return screenshot;
          const candidates: string[] = [
            meta?.ogImage,
            meta?.og_image,
            meta?.["og:image"],
            meta?.twitterImage,
            meta?.["twitter:image"],
            meta?.image,
          ].filter(Boolean);
          for (const c of candidates) {
            if (typeof c !== "string") continue;
            if (PLACEHOLDER_IMG_RE.test(c)) continue;
            // Skip known hotlink-blocked CDNs
            if (/images\.bizbuysell\.com|businessesforsale\.com/i.test(c)) continue;
            return c;
          }
          // Pull first inline image from markdown that looks like a photo
          if (markdown) {
            const re = /!\[[^\]]*\]\((https?:\/\/[^)\s]+\.(?:jpe?g|png|webp)(?:\?[^)\s]*)?)\)/gi;
            let m: RegExpExecArray | null;
            while ((m = re.exec(markdown))) {
              const url = m[1];
              if (PLACEHOLDER_IMG_RE.test(url)) continue;
              if (/sprite|icon|logo|avatar/i.test(url)) continue;
              if (/images\.bizbuysell\.com|businessesforsale\.com/i.test(url)) continue;
              return url;
            }
          }
          return null;
        };

        for (const q of queries) {
          try {
            const res: any = await firecrawl.search(q, {
              limit: perQuery,
              scrapeOptions: {
                formats: [
                  "markdown",
                  "screenshot",
                  { type: "json", schema: ExtractSchema } as any,
                ],
                onlyMainContent: true,
              },
            } as any);
            const items: any[] = res?.web ?? res?.data ?? [];
            for (const item of items) {
              const j = item?.json ?? item?.extract ?? item?.data?.json;
              if (j && j.headline && j.business_type && j.region) {
                const meta = item?.metadata ?? item?.data?.metadata ?? {};
                const markdown = item?.markdown ?? item?.data?.markdown;
                const screenshot = item?.screenshot ?? item?.data?.screenshot;
                const hero = pickHero(meta, markdown, screenshot);
                scraped.push({
                  ...j,
                  source_url: item.url ?? meta.sourceURL ?? meta.url ?? null,
                  hero_image_url: hero,
                });
              }
            }
          } catch (err: any) {
            errors.push(`${q}: ${err?.message ?? String(err)}`);
          }
        }

        if (scraped.length === 0) {
          return Response.json(
            { inserted: 0, scraped: 0, errors, message: "No listings extracted" },
            { status: 200 },
          );
        }

        // Insert with service role (verified=false)
        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        const rows = scraped.map((s) => ({
          status: "live" as const,
          business_type: s.business_type,
          units: s.units ?? null,
          region: s.region,
          headline: s.headline.slice(0, 120),
          asking_low: s.asking_low ?? null,
          asking_high: s.asking_high ?? s.asking_low ?? null,
          gross_revenue_ltm: s.gross_revenue_ltm ?? null,
          sde: s.sde ?? null,
          verified: false,
          teaser_paragraph: s.teaser_paragraph,
          hero_image_url: s.hero_image_url ?? null,
          source_url: s.source_url ?? null,
        }));

        const { data: inserted, error } = await supabaseAdmin
          .from("listings")
          .insert(rows)
          .select("id, headline");

        if (error) {
          return Response.json({ error: error.message, scraped: scraped.length, errors }, { status: 500 });
        }

        return Response.json({
          inserted: inserted?.length ?? 0,
          scraped: scraped.length,
          errors,
          listings: inserted,
        });
      },
    },
  },
});