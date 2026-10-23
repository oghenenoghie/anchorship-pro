// The nine vessel categories supplied by the business, in the order supplied. Names are business terminology:
// keep them verbatim (FDPSO is intentional). Slugs are public URLs (/vessels/category/<slug>) and match the rows
// inserted by migration 0003, so do not change them without a redirect and a data migration.
export type IllustrationKind = "fpso" | "pipelay" | "tanker" | "tug" | "workboat" | "well-intervention" | "jack-up" | "pontoon" | "dredger";
// Typed particulars that are meaningful for a category: they drive card highlights and catalogue filters.
export type ParticularKey = "length" | "deadweight";
export type VesselCategoryDefinition = {
  slug: string; name: string; illustration: IllustrationKind;
  summary: string; description: string;
  particulars: readonly ParticularKey[];
  // Labels of staff-entered specifications worth surfacing on listing cards, matched case-insensitively.
  keySpecs: readonly string[];
};

export const VESSEL_CATEGORIES = [
  { slug: "fpso-fdpso-fso", name: "FPSO, FDPSO and FSO", illustration: "fpso",
    summary: "Floating units that produce, store and offload hydrocarbons at offshore fields.",
    description: "Floating production, storage and offloading units (FPSO), their drilling-capable counterparts (FDPSO) and floating storage and offloading units (FSO) for field development, extended well tests and offshore storage.",
    particulars: ["length", "deadweight"], keySpecs: ["Storage capacity", "Production capacity", "Mooring", "Accommodation"] },
  { slug: "pipe-and-cable-laying-vessels", name: "Pipe and Cable Laying Vessels", illustration: "pipelay",
    summary: "Vessels with reels, carousels or lay towers for subsea pipelines, umbilicals and cables.",
    description: "Pipe-lay and cable-lay vessels equipped with reels, carousels, tensioners or lay towers for installing subsea pipelines, flexibles, umbilicals and power or communication cables.",
    particulars: ["length", "deadweight"], keySpecs: ["Lay tension", "Top tension", "Carousel capacity", "Reel capacity", "Crane capacity", "Deck area"] },
  { slug: "tanker-vessels", name: "Tanker Vessels", illustration: "tanker",
    summary: "Tankers for the transport and storage of crude oil, products, chemicals and gas.",
    description: "Tanker vessels for the carriage and floating storage of liquid cargoes, including crude oil, refined products, chemicals and liquefied gas.",
    particulars: ["deadweight", "length"], keySpecs: ["Cargo capacity", "Tank capacity", "Cargo tanks", "Pumping capacity"] },
  { slug: "tugboats-and-towage", name: "Tugboats and Towage", illustration: "tug",
    summary: "Tugs for harbour assistance, ocean towage and positioning of offshore units.",
    description: "Harbour, coastal and ocean-going tugs for towage, ship assistance, and the towing, positioning and mooring of barges, rigs and offshore units.",
    particulars: ["length"], keySpecs: ["Bollard pull", "Engine power", "Towing winch"] },
  { slug: "workboats", name: "Workboats", illustration: "workboat",
    summary: "Compact utility vessels with open working decks for nearshore and offshore support.",
    description: "Multipurpose workboats and utility vessels with open working decks for marine construction support, deck cargo, survey, buoy handling and general nearshore works.",
    particulars: ["length"], keySpecs: ["Deck area", "Deck load", "Crane capacity", "Bollard pull"] },
  { slug: "well-intervention", name: "Well Intervention", illustration: "well-intervention",
    summary: "Vessels with intervention towers for maintaining and servicing subsea wells.",
    description: "Well intervention vessels with intervention towers, moonpools and well-control equipment for maintaining, logging and stimulating subsea wells without a drilling rig.",
    particulars: ["length", "deadweight"], keySpecs: ["Tower capacity", "Moonpool", "Crane capacity", "Accommodation", "DP class"] },
  { slug: "jack-up-rigs-and-barges", name: "Jack-up Rigs and Barges", illustration: "jack-up",
    summary: "Self-elevating platforms and barges for drilling, accommodation and construction.",
    description: "Jack-up rigs and self-elevating barges that stand on the seabed for drilling, accommodation, maintenance and construction work, together with barges for marine transport and works.",
    particulars: ["length"], keySpecs: ["Water depth", "Leg length", "Deck load", "Variable deck load", "Accommodation"] },
  { slug: "pontoons", name: "Pontoons", illustration: "pontoon",
    summary: "Flat-deck floating platforms for heavy loads and stable working areas.",
    description: "Flat-deck and modular pontoons for transporting heavy loads and providing stable working platforms in ports, rivers and sheltered coastal waters.",
    particulars: ["length", "deadweight"], keySpecs: ["Deck area", "Deck load", "Deck strength", "Spud"] },
  { slug: "dredgers", name: "Dredgers", illustration: "dredger",
    summary: "Cutter suction, hopper and other dredgers for dredging and reclamation work.",
    description: "Cutter suction, trailing suction hopper, backhoe and other dredgers for capital and maintenance dredging, land reclamation and seabed preparation.",
    particulars: ["length", "deadweight"], keySpecs: ["Dredging depth", "Hopper capacity", "Cutter power", "Pump power", "Pipe diameter"] },
] as const satisfies readonly VesselCategoryDefinition[];

export type VesselCategory = (typeof VESSEL_CATEGORIES)[number];
export type VesselCategorySlug = VesselCategory["slug"];
export const VESSEL_CATEGORY_SLUGS = VESSEL_CATEGORIES.map(c => c.slug) as [VesselCategorySlug, ...VesselCategorySlug[]];

export function getVesselCategory(slug: string | null | undefined): VesselCategory | undefined {
  return VESSEL_CATEGORIES.find(c => c.slug === slug);
}
export function isVesselCategorySlug(slug: unknown): slug is VesselCategorySlug {
  return typeof slug === "string" && VESSEL_CATEGORIES.some(c => c.slug === slug);
}

// Staff-entered specifications that matter for this category, in the category's priority order.
export function keySpecifications(slug: string | null | undefined, specs: readonly { label: string; value: string }[], limit = 2) {
  const category = getVesselCategory(slug);
  if (!category) return [];
  const picked: { label: string; value: string }[] = [];
  for (const key of category.keySpecs) {
    const match = specs.find(s => s.label.trim().toLowerCase().startsWith(key.toLowerCase()) && !picked.includes(s));
    if (match) picked.push(match);
    if (picked.length >= limit) break;
  }
  return picked;
}
