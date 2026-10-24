import { test } from "node:test";
import assert from "node:assert/strict";
import { enquirySchema, fieldErrors, vesselSchema } from "@/lib/validation";

const day = (offset: number) => new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
const base = { type: "vessel_charter", name: "Sam Example", email: "sam@example.com", message: "We need a tug for a 30-day tow." };

test("accepts a minimal general enquiry and treats blank optional fields as absent", () => {
  const r = enquirySchema.safeParse({ ...base, type: "general", company: "", phone: "", subject: "", vesselId: "", equipmentId: "", vesselCategory: "", charterStart: "" });
  assert.ok(r.success);
  assert.equal(r.data.company, undefined); assert.equal(r.data.charterStart, undefined); assert.equal(r.data.vesselCategory, undefined);
});

test("accepts a full charter request", () => {
  const r = enquirySchema.safeParse({ ...base, company: "Example Offshore", phone: "+31 10 000 0000", vesselCategory: "tugboats-and-towage", operatingRegion: "North Sea", charterStart: day(30), charterDuration: "30 days + options", technicalRequirements: "Bollard pull 60 t or more" });
  assert.ok(r.success);
  assert.equal(r.data.vesselCategory, "tugboats-and-towage");
});

test("rejects past, malformed and impossible charter start dates with a field message", () => {
  for (const value of [day(-5), "01/02/2027", "2027-02-30"]) {
    const r = enquirySchema.safeParse({ ...base, charterStart: value });
    assert.equal(r.success, false, value);
    assert.ok(fieldErrors(r.error!).charterStart, value);
  }
  assert.ok(enquirySchema.safeParse({ ...base, charterStart: day(0) }).success);
});

test("rejects categories outside the supplied list", () => {
  const r = enquirySchema.safeParse({ ...base, vesselCategory: "Tug" });
  assert.equal(r.success, false);
  assert.equal(fieldErrors(r.error!).vesselCategory, "Choose a vessel category from the list.");
});

test("reports one readable message per invalid field", () => {
  const r = enquirySchema.safeParse({ type: "general", name: "A", email: "not-an-email", message: "short", company: "x".repeat(181) });
  assert.equal(r.success, false);
  const errors = fieldErrors(r.error!);
  assert.deepEqual(Object.keys(errors).sort(), ["company", "email", "message", "name"]);
  assert.equal(errors.company, "Company must be 180 characters or less.");
});

test("rejects unknown enquiry types and malformed linked ids", () => {
  assert.equal(enquirySchema.safeParse({ ...base, type: "spam" }).success, false);
  assert.equal(enquirySchema.safeParse({ ...base, vesselId: "123" }).success, false);
});

test("reserves vessel slugs that collide with catalogue routes", () => {
  const vessel = { name: "Category", slug: "category", listingType: "charter", availabilityStatus: "available", status: "draft", categoryId: "" };
  assert.equal(vesselSchema.safeParse(vessel).success, false);
  assert.ok(vesselSchema.safeParse({ ...vessel, slug: "category-one" }).success);
});
