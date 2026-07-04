import beachCondos from "@/assets/property-beach-condos.jpg";
import cabinPortfolio from "@/assets/property-cabin-portfolio.jpg";
import desertVillas from "@/assets/property-desert-villas.jpg";
import eventHotel from "@/assets/property-event-hotel.jpg";
import mountainInn from "@/assets/property-mountain-inn.jpg";
import wineInn from "@/assets/property-wine-inn.jpg";
import type { BusinessType } from "@/lib/sbs-data";

const BAD_LISTING_IMAGE_RE =
  /(firecrawl-scrape-media\/screenshot-|screenshot[-_][a-z0-9-]+\.(?:png|jpe?g|webp)|\/screenshots?\/|facebookDefaultImage|default[-_]?(og|share|image)|placeholder|logo\.(?:png|svg|jpe?g))/i;

type ListingImageInput = {
  business_type?: BusinessType | string | null;
  region?: string | null;
  headline?: string | null;
  hero_image_url?: string | null;
};

export function isBadListingImageUrl(url: string | null | undefined): boolean {
  return !!url && BAD_LISTING_IMAGE_RE.test(url);
}

export function listingDisplayImage(listing: ListingImageInput): string {
  if (listing.hero_image_url && !isBadListingImageUrl(listing.hero_image_url)) {
    return listing.hero_image_url;
  }

  const text = `${listing.region ?? ""} ${listing.headline ?? ""}`.toLowerCase();
  if (/sedona|joshua|desert|red rock|az|ca/.test(text)) return desertVillas;
  if (/napa|wine|vineyard|valley/.test(text)) return wineInn;
  if (/asheville|stowe|vermont|mountain|historic inn|bnb|b&b/.test(text)) return mountainInn;
  if (/30a|gulf|beach|coast|fl|al|condo/.test(text)) return beachCondos;
  if (/smoky|cabin|tn/.test(text)) return cabinPortfolio;
  if (/hill country|event|barn|hotel|hudson/.test(text)) return eventHotel;

  if (listing.business_type === "boutique_hotel") return wineInn;
  if (listing.business_type === "bnb_inn") return mountainInn;
  if (listing.business_type === "hotel") return eventHotel;
  return cabinPortfolio;
}