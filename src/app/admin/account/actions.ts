"use server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { requireDb } from "@/db";
import { adminUsers, auditEvents } from "@/db/schema";
import { createSession, requireUser } from "@/lib/auth";
import { changePasswordSchema, fieldErrors } from "@/lib/validation";

export type ChangePasswordState = { status: "idle" | "success" | "error"; message?: string; fields?: Record<string, string> };

// Changes the signed-in user's own password. Server Actions only accept same-origin posts, which covers CSRF.
// Sessions are tied to the password hash (src/lib/session-stamp.ts), so saving the new hash ends every other session
// for this account; this browser gets a fresh session. Passwords are never returned, logged or stored in the audit.
export async function changePassword(_previous: ChangePasswordState, formData: FormData): Promise<ChangePasswordState> {
  const user = await requireUser();
  const value = (name: string) => { const v = formData.get(name); return typeof v === "string" ? v : ""; };
  const parsed = changePasswordSchema.safeParse({ currentPassword: value("currentPassword"), newPassword: value("newPassword"), confirmPassword: value("confirmPassword") });
  if (!parsed.success) return { status: "error", message: "Your password was not changed. Check the highlighted fields.", fields: fieldErrors(parsed.error) };
  let passwordHash: string;
  try {
    const db = requireDb();
    const [record] = await db.select({ passwordHash: adminUsers.passwordHash }).from(adminUsers).where(eq(adminUsers.id, user.id)).limit(1);
    if (!record || !(await bcrypt.compare(parsed.data.currentPassword, record.passwordHash)))
      return { status: "error", message: "Your password was not changed.", fields: { currentPassword: "Your current password is not correct." } };
    passwordHash = await bcrypt.hash(parsed.data.newPassword, 12);
    // One transaction: the new hash is never stored without its audit event.
    await db.batch([
      db.update(adminUsers).set({ passwordHash, updatedAt: new Date() }).where(eq(adminUsers.id, user.id)),
      db.insert(auditEvents).values({ actorId: user.id, action: "admin_user.password_change", entityType: "admin_user", entityId: user.id }),
    ]);
  } catch (e) {
    console.error("Password change failed:", e instanceof Error ? e.message : "unknown error");
    return { status: "error", message: "Your password could not be changed right now. Try again in a moment." };
  }
  // Outside the try: once the password is saved, a failure here must not be reported as "not changed".
  await createSession(user, passwordHash);
  return { status: "success" };
}
