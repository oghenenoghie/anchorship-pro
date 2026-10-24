import { createHmac } from "node:crypto";
// A session token carries a keyed fingerprint of the password hash it was issued under. Changing or resetting the
// password changes the hash, so every session issued before the change stops matching and is refused. The HMAC keeps
// the token (which the browser can read) from revealing anything about the hash itself.
export function passwordStamp(passwordHash: string, key: string) {
  return createHmac("sha256", key).update(passwordHash).digest("base64url").slice(0, 22);
}
