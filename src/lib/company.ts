// Public company copy in one place. Only statements already on the website or supplied by the business belong here:
// no fleet sizes, years of experience, certifications, client names, addresses or response-time promises.
export const COMPANY_DESCRIPTION = "Marine and offshore solutions, vessel brokerage and chartering support. Contact our team to discuss your requirements.";
// Supplied by the business with the 2026 redesign brief.
export const SPECIALISATION = "Anchorship charters offshore vessels and marine equipment to commercial, offshore energy, oil and gas, dredging and marine construction clients.";
export const SECTORS = ["Offshore energy", "Oil and gas", "Dredging", "Marine construction", "Commercial marine"] as const;

// Shown when no services are published in the database. Mirrors the service areas already on the website.
export type ServiceIcon = "charter" | "brokerage" | "equipment" | "management";
export const FALLBACK_SERVICES: { slug: string; title: string; summary: string; icon: ServiceIcon }[] = [
  { slug: "vessel-chartering", title: "Vessel Chartering", icon: "charter", summary: "Share your charter requirements and operational criteria. Our catalogue covers nine vessel categories, from tugs and workboats to FPSOs and jack-ups." },
  { slug: "marine-equipment", title: "Marine Equipment", icon: "equipment", summary: "Marine and offshore equipment for your operation. Browse the equipment catalogue or send us a specific requirement." },
  { slug: "vessel-brokerage", title: "Vessel Brokerage", icon: "brokerage", summary: "Discuss vessel sale and acquisition requirements with our team." },
  { slug: "ship-management", title: "Ship Management", icon: "management", summary: "Contact us to discuss ship management requirements." },
];
