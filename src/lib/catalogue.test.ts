import { test } from "node:test";
import assert from "node:assert/strict";
import { parseCatalogueParams, catalogueQuery, activeFilterCount, likePattern } from "@/lib/catalogue";

test("defaults to the first page sorted featured-first", () => {
  assert.deepEqual(parseCatalogueParams({}), { q: undefined, category: undefined, region: undefined, availability: undefined, listing: undefined, minLength: undefined, minDeadweight: undefined, sort: "featured", page: 1 });
});

test("keeps valid filters and drops unknown or malformed values", () => {
  const f = parseCatalogueParams({ q: "  tug ", category: "tugboats-and-towage", availability: "available", listing: "charter", sort: "length", page: "3", minLength: "40", minDeadweight: "abc", region: "North Sea" });
  assert.equal(f.q, "tug"); assert.equal(f.category, "tugboats-and-towage"); assert.equal(f.availability, "available"); assert.equal(f.listing, "charter");
  assert.equal(f.sort, "length"); assert.equal(f.page, 3); assert.equal(f.minLength, 40); assert.equal(f.minDeadweight, undefined); assert.equal(f.region, "North Sea");
  const bad = parseCatalogueParams({ category: "tug", availability: "maybe", listing: "lease", sort: "price", page: "-2", minLength: "9999" });
  assert.equal(bad.category, undefined); assert.equal(bad.availability, undefined); assert.equal(bad.listing, undefined); assert.equal(bad.sort, "featured"); assert.equal(bad.page, 1); assert.equal(bad.minLength, undefined);
});

test("uses the first value when a parameter repeats", () => {
  assert.equal(parseCatalogueParams({ q: ["dredger", "tug"] }).q, "dredger");
});

test("builds short query strings without defaults", () => {
  assert.equal(catalogueQuery({ sort: "featured", page: 1 }), "");
  assert.equal(catalogueQuery({ q: "dp2 vessel", sort: "name", page: 2 }), "?q=dp2+vessel&sort=name&page=2");
  assert.equal(catalogueQuery({ category: "dredgers", availability: "available" }, ["category"]), "?availability=available");
});

test("counts active filters, ignoring sort, page and fixed filters", () => {
  const f = parseCatalogueParams({ category: "pontoons", q: "spud", sort: "name", page: "2" });
  assert.equal(activeFilterCount(f), 2);
  assert.equal(activeFilterCount(f, ["category"]), 1);
});

test("escapes LIKE wildcards in search terms", () => {
  assert.equal(likePattern("100%_a\\b"), "%100\\%\\_a\\\\b%");
});
