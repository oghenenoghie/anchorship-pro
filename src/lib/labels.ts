// Display labels for stored enum values, shared by public pages and the admin so wording stays consistent.
import type { vessels, enquiries } from "@/db/schema";
type Availability = (typeof vessels.$inferSelect)["availabilityStatus"];
type ListingType = (typeof vessels.$inferSelect)["listingType"];
type Publication = (typeof vessels.$inferSelect)["status"];
type EnquiryStatus = (typeof enquiries.$inferSelect)["status"];
export type StatusTone = "positive" | "info" | "warning" | "neutral" | "danger";

export const AVAILABILITY: Record<Availability, { label: string; tone: StatusTone }> = {
  available: { label: "Available", tone: "positive" }, under_offer: { label: "Under offer", tone: "warning" },
  chartered: { label: "On charter", tone: "info" }, unavailable: { label: "Unavailable", tone: "neutral" }, sold: { label: "Sold", tone: "neutral" },
};
export const LISTING_TYPE: Record<ListingType, string> = { charter: "For charter", sale: "For sale", sale_or_charter: "Sale or charter" };
export const PUBLICATION: Record<Publication, { label: string; tone: StatusTone }> = {
  published: { label: "Published", tone: "positive" }, draft: { label: "Draft", tone: "warning" }, archived: { label: "Archived", tone: "neutral" },
};
export const ENQUIRY_STATUS: Record<EnquiryStatus, { label: string; tone: StatusTone }> = {
  new: { label: "New", tone: "info" }, in_progress: { label: "In progress", tone: "info" }, awaiting_response: { label: "Awaiting response", tone: "warning" },
  qualified: { label: "Qualified", tone: "positive" }, closed: { label: "Closed", tone: "neutral" }, spam: { label: "Spam", tone: "danger" },
};
export const ENQUIRY_TYPES = { general: "General enquiry", vessel_charter: "Vessel charter", vessel_sale: "Vessel sale or purchase", equipment: "Marine equipment", service: "Services" } as const;
export type EnquiryType = keyof typeof ENQUIRY_TYPES;
export function enquiryTypeLabel(type: string) { return ENQUIRY_TYPES[type as EnquiryType] ?? type.replaceAll("_", " "); }
export function canCharter(listingType: ListingType) { return listingType !== "sale"; }

const number = new Intl.NumberFormat("en-GB", { maximumFractionDigits: 2 });
export function formatMeasure(value: number | null | undefined, unit: string) { return value == null ? null : `${number.format(value)} ${unit}`; }
export function formatDate(value: Date | string | null | undefined, withTime = false) {
  if (!value) return null;
  const date = typeof value === "string" ? new Date(value) : value;
  // Fixed zone so server-rendered dates do not depend on the host's timezone.
  return date.toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "Europe/Amsterdam", ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}) });
}
