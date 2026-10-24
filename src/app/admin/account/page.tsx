import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/admin-access";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const metadata: Metadata = { title: "Account", robots: { index: false, follow: false } };

// Every role can change its own password; nobody can change another user's password here.
export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <AdminPageHeader eyebrow="Your account" title="Change password" description="Choose a new password for signing in to the admin console." />
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <section aria-label="Change password" className="panel max-w-2xl p-5 sm:p-6"><ChangePasswordForm email={user.email} /></section>
        <aside className="grid gap-4">
          <div className="panel p-5">
            <h2 className="text-[.72rem] font-bold uppercase tracking-[.16em] text-muted">Signed in as</h2>
            <dl className="mt-3 grid gap-3 text-sm">
              <div><dt className="text-muted">Name</dt><dd className="mt-0.5 break-words font-medium text-ink">{user.name}</dd></div>
              <div><dt className="text-muted">Email</dt><dd className="mt-0.5 break-all font-medium text-ink">{user.email}</dd></div>
              <div><dt className="text-muted">Role</dt><dd className="mt-0.5 font-medium text-ink">{ROLE_LABELS[user.role]}</dd></div>
            </dl>
          </div>
          <div className="panel flex gap-3 p-5">
            <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] bg-mist text-ocean"><ShieldCheck size={18} /></span>
            <div>
              <h2 className="font-display text-sm font-bold text-navy">What happens when you change it</h2>
              <ul className="mt-2 grid list-disc gap-1.5 pl-4 text-sm leading-6 text-muted">
                <li>This browser stays signed in.</li>
                <li>Every other browser or device signed in to this account is signed out.</li>
                <li>The change is recorded in the audit log, without the password.</li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
