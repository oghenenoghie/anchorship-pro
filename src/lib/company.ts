// Public company copy in one place. Only statements already on the website or supplied by the business belong here:
// no fleet sizes, years of experience, certifications, client names or response-time promises, and contact details
// only as the business supplied them.
export const COMPANY_DESCRIPTION = "Marine and offshore solutions, vessel brokerage and chartering support. Contact our team to discuss your requirements.";
// Supplied by the business with the 2026 redesign brief.
export const SPECIALISATION = "Anchorship charters offshore vessels and marine equipment to commercial, offshore energy, oil and gas, dredging and marine construction clients.";
export const SECTORS = ["Offshore energy", "Oil and gas", "Dredging", "Marine construction", "Commercial marine"] as const;

// Supplied by the business on 24 Oct 2026. The office address is reproduced exactly as given (the house number and
// full postcode are still to be confirmed), so it is not split into street and postcode fields anywhere.
export const CONTACT = {
  email: "info@anchorship.nl",
  office: { lines: ["Eemkerkstraat 3312 Dordrecht", "The Netherlands"], locality: "Dordrecht", countryCode: "NL" },
} as const;

// Shown when no services are published in the database. Mirrors the service areas already on the website.
export type ServiceIcon = "charter" | "brokerage" | "equipment" | "management";
export const FALLBACK_SERVICES: { slug: string; title: string; summary: string; icon: ServiceIcon }[] = [
  { slug: "vessel-chartering", title: "Vessel Chartering", icon: "charter", summary: "Share your charter requirements and operational criteria. Our catalogue covers nine vessel categories, from tugs and workboats to FPSOs and jack-ups." },
  { slug: "marine-equipment", title: "Marine Equipment", icon: "equipment", summary: "Marine and offshore equipment for your operation. Browse the equipment catalogue or send us a specific requirement." },
  { slug: "vessel-brokerage", title: "Vessel Brokerage", icon: "brokerage", summary: "Discuss vessel sale and acquisition requirements with our team." },
  { slug: "ship-management", title: "Ship Management", icon: "management", summary: "Contact us to discuss ship management requirements." },
];
