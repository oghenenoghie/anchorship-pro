import { test } from "node:test";
import assert from "node:assert/strict";
import { passwordStamp } from "@/lib/session-stamp";

const key = "test-secret-0123456789abcdefghijklmnop";
const hash = "$2a$12$Q7TZwLYOBrNtJmkTxqE5lueZePI.QYQzd7XW0.jW1BsQLQEPIB4u.";

test("a session stamp is stable for the same password hash and key", () => {
  assert.equal(passwordStamp(hash, key), passwordStamp(hash, key));
  assert.match(passwordStamp(hash, key), /^[A-Za-z0-9_-]{22}$/);
});

test("changing the password hash or the secret changes the stamp, so older sessions stop matching", () => {
  assert.notEqual(passwordStamp(hash, key), passwordStamp(hash.replace("u.", "v."), key));
  assert.notEqual(passwordStamp(hash, key), passwordStamp(hash, `${key}x`));
});

test("the stamp does not contain the password hash", () => {
  assert.ok(!hash.includes(passwordStamp(hash, key)));
});
