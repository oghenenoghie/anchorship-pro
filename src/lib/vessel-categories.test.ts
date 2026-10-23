import { test } from "node:test";
import assert from "node:assert/strict";
import { VESSEL_CATEGORIES, getVesselCategory, isVesselCategorySlug, keySpecifications } from "@/lib/vessel-categories";

test("keeps the nine supplied categories, names verbatim and in the supplied order", () => {
  assert.deepEqual(VESSEL_CATEGORIES.map(c => c.name), ["FPSO, FDPSO and FSO", "Pipe and Cable Laying Vessels", "Tanker Vessels", "Tugboats and Towage", "Workboats", "Well Intervention", "Jack-up Rigs and Barges", "Pontoons", "Dredgers"]);
});

test("slugs and illustrations are unique per category", () => {
  assert.equal(new Set(VESSEL_CATEGORIES.map(c => c.slug)).size, 9);
  assert.equal(new Set(VESSEL_CATEGORIES.map(c => c.illustration)).size, 9);
  for (const c of VESSEL_CATEGORIES) assert.match(c.slug, /^[a-z0-9]+(?:-[a-z0-9]+)*$/);
});

test("looks categories up by slug only", () => {
  assert.equal(getVesselCategory("tugboats-and-towage")?.name, "Tugboats and Towage");
  assert.equal(getVesselCategory("Tug"), undefined);
  assert.equal(isVesselCategorySlug("dredgers"), true);
  assert.equal(isVesselCategorySlug("dredger"), false);
  assert.equal(isVesselCategorySlug(undefined), false);
});

test("surfaces only recorded specifications that matter for the category", () => {
  const specs = [{ label: "Accommodation", value: "12 persons" }, { label: "Bollard pull (ahead)", value: "65 t" }, { label: "Engine power", value: "2 x 2,400 kW" }];
  assert.deepEqual(keySpecifications("tugboats-and-towage", specs), [specs[1], specs[2]]);
  assert.deepEqual(keySpecifications("dredgers", specs), []);
  assert.deepEqual(keySpecifications(null, specs), []);
  assert.deepEqual(keySpecifications("tugboats-and-towage", specs, 1), [specs[1]]);
});
