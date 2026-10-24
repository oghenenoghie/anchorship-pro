import Link from "next/link";
import { ArrowLeft } from "lucide-react";
// Shared admin building blocks, styled with the same tokens as the public site but denser.
export function AdminPageHeader({ eyebrow, title, description, actions, back }: { eyebrow: string; title: React.ReactNode; description?: React.ReactNode; actions?: React.ReactNode; back?: { href: string; label: string } }) {
  return (
    <div className="mb-8">
      {back && <Link href={back.href} className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-ocean hover:text-navy"><ArrowLeft size={15} aria-hidden />{back.label}</Link>}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0"><p className="eyebrow">{eyebrow}</p><h1 className="mt-2 font-display text-[1.75rem] font-bold leading-tight md:text-3xl">{title}</h1>{description && <div className="mt-2 text-sm text-muted">{description}</div>}</div>
        {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function MetricCard({ label, value, detail, icon, href }: { label: string; value: number | string; detail?: string; icon: React.ReactNode; href?: string }) {
  const body = (
    <>
      <div className="flex items-center justify-between"><p className="text-sm font-medium text-muted">{label}</p><span aria-hidden className="grid h-9 w-9 place-items-center rounded-[4px] bg-mist text-ocean">{icon}</span></div>
      <p className="mt-3 font-display text-3xl font-bold tabular-nums text-navy">{value}</p>
      {detail && <p className="mt-1 text-xs text-muted">{detail}</p>}
    </>
  );
  return href ? <Link href={href} className="panel block p-5 transition hover:border-[#c5d3dc] hover:shadow-card">{body}</Link> : <div className="panel p-5">{body}</div>;
}

export function AdminNotice({ tone = "info", children }: { tone?: "info" | "warning"; children: React.ReactNode }) {
  return <div role={tone === "warning" ? "alert" : "status"} className={`mb-6 rounded-[4px] border px-4 py-3 text-sm ${tone === "warning" ? "border-[#f3d39c] bg-[#fff8eb] text-[#7a4b00]" : "border-line bg-white text-ink"}`}>{children}</div>;
}
