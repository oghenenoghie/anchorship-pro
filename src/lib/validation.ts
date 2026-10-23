import { z } from "zod";
import { VESSEL_LIMITS as L } from "@/lib/vessel-limits";
import { VESSEL_CATEGORY_SLUGS } from "@/lib/vessel-categories";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/labels";
const ENQUIRY_TYPE_VALUES = Object.keys(ENQUIRY_TYPES) as [EnquiryType, ...EnquiryType[]];
// Vessel slugs that would collide with fixed routes under /vessels.
export const RESERVED_VESSEL_SLUGS = ["category"];
// Form fields arrive as strings; an empty field means "not set".
const blankToNull = (v: unknown) => (v === "" || v === undefined ? null : v);
const measurement = (label: string, max: number) => z.preprocess(blankToNull, z.coerce.number({ invalid_type_error: `${label} must be a number.` }).positive(`${label} must be greater than 0.`).max(max, `${label} must be ${max.toLocaleString("en-GB")} or less.`).nullable());
// Optional form fields: an empty string means "not provided". Preprocessing (rather than `.or(z.literal(""))`) keeps
// field-specific error messages instead of a generic union error.
const optional = <T extends z.ZodTypeAny>(schema: T) => z.preprocess(v => (v === "" || v === null ? undefined : v), schema.optional());
const text = (label: string, max: number) => z.string().trim().max(max, `${label} must be ${max.toLocaleString("en-GB")} characters or less.`);
const isoDay = (ms: number) => new Date(ms).toISOString().slice(0, 10);
const DAY = 86_400_000;
// Charter start as YYYY-MM-DD. One day of slack absorbs the gap between the visitor's timezone and the server's.
const charterStart = z.string().trim().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter the expected start as a date.")
  .refine(v => { const d = new Date(`${v}T00:00:00Z`); return !Number.isNaN(d.getTime()) && isoDay(d.getTime()) === v; }, "Enter a valid start date.")
  .refine(v => v >= isoDay(Date.now() - DAY), "The expected start date cannot be in the past.")
  .refine(v => v <= isoDay(Date.now() + 3660 * DAY), "Enter a start date within the next ten years.");
export const enquirySchema = z.object({ type: z.enum(ENQUIRY_TYPE_VALUES, { errorMap: () => ({ message: "Choose an enquiry type from the list." }) }),
  name: z.string().trim().min(2, "Enter your full name.").max(160, "Name must be 160 characters or less."), email: z.string().trim().email("Enter a valid email address.").max(255, "Email must be 255 characters or less."),
  company: optional(text("Company", 180)), phone: optional(text("Telephone", 60)), subject: optional(text("Subject", 240)),
  message: z.string().trim().min(10, "Please add a little more detail (at least 10 characters).").max(8000, "Message must be 8,000 characters or less."),
  vesselId: optional(z.string().uuid()), equipmentId: optional(z.string().uuid()),
  // Charter request details.
  vesselCategory: optional(z.enum(VESSEL_CATEGORY_SLUGS, { errorMap: () => ({ message: "Choose a vessel category from the list." }) })),
  operatingRegion: optional(text("Operating region", 200)), charterStart: optional(charterStart), charterDuration: optional(text("Charter duration", 120)), technicalRequirements: optional(text("Technical requirements", 4000)),
  website: z.string().optional() });
// First message per field, for accessible field-level errors in the public form.
export function fieldErrors(error: z.ZodError) { const out: Record<string, string> = {}; for (const issue of error.issues) { const key = String(issue.path[0] ?? ""); if (key && !(key in out)) out[key] = issue.message; } return out; }
export const loginSchema = z.object({ email: z.string().email().max(255), password: z.string().min(8).max(200) });
export const vesselSchema = z.object({ name: z.string().trim().min(2).max(200), slug: z.string().trim().min(2).max(220).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "URL slug may only contain lowercase letters, numbers and single hyphens.").refine(v => !RESERVED_VESSEL_SLUGS.includes(v), "That URL slug is reserved by the website. Choose another."), summary: z.string().max(500).optional(), description: z.string().max(20000).optional(), listingType: z.enum(["sale","charter","sale_or_charter"]), availabilityStatus: z.enum(["available","under_offer","unavailable","sold","chartered"]), status: z.enum(["draft","published","archived"]), location: z.string().max(200).optional(), featured: z.coerce.boolean().optional(),
  categoryId: z.preprocess(blankToNull, z.string().uuid("Choose a category from the list.").nullable()), flag: z.string().trim().max(100).optional(),
  yearBuilt: z.preprocess(blankToNull, z.coerce.number({ invalid_type_error: "Year built must be a number." }).int("Year built must be a whole year.").min(L.yearBuilt.min, `Year built must be ${L.yearBuilt.min} or later.`).max(L.yearBuilt.max, `Year built must be ${L.yearBuilt.max} or earlier.`).nullable()),
  lengthMetres: measurement("Length", L.lengthMetres.max), breadthMetres: measurement("Breadth", L.breadthMetres.max), deadweightTonnes: measurement("Deadweight", L.deadweightTonnes.max),
  specifications: z.array(z.object({ label: z.string().trim().min(1, "Each specification needs a name.").max(L.specs.label, `Specification names must be ${L.specs.label} characters or less.`), value: z.string().trim().min(1, "Each specification needs a value.").max(L.specs.value, `Specification values must be ${L.specs.value} characters or less.`) })).max(L.specs.max, `Up to ${L.specs.max} additional specifications.`).default([]) });
// Column values shared by vessel create and update.
export function vesselColumns(d: z.infer<typeof vesselSchema>) { return { name: d.name, slug: d.slug, summary: d.summary || null, description: d.description || null, listingType: d.listingType, availabilityStatus: d.availabilityStatus, status: d.status, location: d.location || null, featured: !!d.featured, categoryId: d.categoryId, flag: d.flag || null, yearBuilt: d.yearBuilt, lengthMetres: d.lengthMetres, breadthMetres: d.breadthMetres, deadweightTonnes: d.deadweightTonnes, specifications: d.specifications }; }
