"use client";
import { useActionState, useEffect, useRef } from "react";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { changePassword, type ChangePasswordState } from "@/app/admin/account/actions";
import { PASSWORD_MAX_BYTES, PASSWORD_MIN_LENGTH } from "@/lib/password-policy";

const FIELDS = ["currentPassword", "newPassword", "confirmPassword"] as const;
const initial: ChangePasswordState = { status: "idle" };

// A Server Action form, so it also works before JavaScript loads. React clears the fields after every submission,
// which suits passwords: nothing typed stays on screen.
export function ChangePasswordForm({ email }: { email: string }) {
  const [state, action, pending] = useActionState(changePassword, initial);
  const form = useRef<HTMLFormElement>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state.status === "success") statusRef.current?.focus();
    if (state.status !== "error") return;
    const first = FIELDS.find(name => state.fields?.[name]);
    const field = first ? form.current?.elements.namedItem(first) : null;
    (field instanceof HTMLElement ? field : alertRef.current)?.focus();
  }, [state]);

  const fields = state.status === "error" ? state.fields ?? {} : {};
  const describedBy = (name: string, hint?: string) => [hint, fields[name] && `${name}-error`].filter(Boolean).join(" ") || undefined;
  const fieldError = (name: string) => fields[name] ? <span id={`${name}-error`} className="field-error">{fields[name]}</span> : null;

  return (
    <form ref={form} action={action} aria-busy={pending} className="grid gap-5">
      {state.status === "success" && (
        <div ref={statusRef} tabIndex={-1} role="status" className="flex gap-3 rounded-[4px] border border-marine/40 bg-marine-50 p-4 text-sm text-ink outline-none">
          <CheckCircle2 aria-hidden size={18} className="mt-0.5 shrink-0 text-marine-700" />
          <p><strong className="font-semibold">Password changed.</strong> Use your new password the next time you sign in. Any other browser or device signed in to this account has been signed out.</p>
        </div>
      )}
      {state.status === "error" && state.message && (
        <div ref={alertRef} tabIndex={-1} role="alert" className="flex gap-3 rounded-[4px] border border-[#f1c4bf] bg-[#fdf3f2] p-4 text-sm text-[#8a1c12] outline-none">
          <AlertTriangle aria-hidden size={18} className="mt-0.5 shrink-0" /><p>{state.message}</p>
        </div>
      )}
      {/* Lets password managers file the new password under the right account. */}
      <input type="email" name="username" autoComplete="username" value={email} readOnly hidden />
      <label className="label">Current password
        <input type="password" name="currentPassword" required autoComplete="current-password" maxLength={200} className="field" aria-invalid={fields.currentPassword ? true : undefined} aria-describedby={describedBy("currentPassword")} />
        {fieldError("currentPassword")}
      </label>
      <label className="label">New password
        <span id="newPassword-hint" className="label-hint">At least {PASSWORD_MIN_LENGTH} characters. A few unrelated words are easy to remember and hard to guess.</span>
        <input type="password" name="newPassword" required minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_BYTES} autoComplete="new-password" className="field" aria-invalid={fields.newPassword ? true : undefined} aria-describedby={describedBy("newPassword", "newPassword-hint")} />
        {fieldError("newPassword")}
      </label>
      <label className="label">Confirm new password
        <input type="password" name="confirmPassword" required minLength={PASSWORD_MIN_LENGTH} maxLength={PASSWORD_MAX_BYTES} autoComplete="new-password" className="field" aria-invalid={fields.confirmPassword ? true : undefined} aria-describedby={describedBy("confirmPassword")} />
        {fieldError("confirmPassword")}
      </label>
      <div><button disabled={pending} className="btn btn-primary">{pending ? <><Loader2 aria-hidden size={16} className="animate-spin" /> Saving…</> : "Change password"}</button></div>
    </form>
  );
}
