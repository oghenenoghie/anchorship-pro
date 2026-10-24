import { test } from "node:test";
import assert from "node:assert/strict";
import { changePasswordSchema, enquirySchema, fieldErrors, vesselSchema } from "@/lib/validation";

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

const pw = { currentPassword: "old password 1", newPassword: "harbour crane tide 42", confirmPassword: "harbour crane tide 42" };

test("accepts a valid password change without trimming spaces", () => {
  const r = changePasswordSchema.safeParse({ ...pw, newPassword: " harbour crane tide ", confirmPassword: " harbour crane tide " });
  assert.ok(r.success);
  assert.equal(r.data.newPassword, " harbour crane tide ");
});

test("rejects short, over-long, reused and mismatched new passwords with field messages", () => {
  const errors = (input: object) => { const r = changePasswordSchema.safeParse({ ...pw, ...input }); assert.ok(!r.success); return fieldErrors(r.error); };
  assert.match(errors({ newPassword: "short", confirmPassword: "short" }).newPassword, /at least 12/);
  // 72 bytes is the most bcrypt reads; "é" is two bytes, so 37 of them (74 bytes) is too long despite being 37 characters.
  assert.ok(changePasswordSchema.safeParse({ ...pw, newPassword: "a".repeat(72), confirmPassword: "a".repeat(72) }).success);
  assert.match(errors({ newPassword: "a".repeat(73), confirmPassword: "a".repeat(73) }).newPassword, /at most 72/);
  assert.match(errors({ newPassword: "é".repeat(37), confirmPassword: "é".repeat(37) }).newPassword, /at most 72/);
  assert.match(errors({ currentPassword: "same password 12", newPassword: "same password 12", confirmPassword: "same password 12" }).newPassword, /different from your current/);
  assert.match(errors({ confirmPassword: "harbour crane tide 43" }).confirmPassword, /do not match/);
  assert.match(errors({ currentPassword: "" }).currentPassword, /current password/);
  assert.match(errors({ confirmPassword: "" }).confirmPassword, /again/);
});
