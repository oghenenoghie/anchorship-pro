import Link from "next/link";
import { Ship, Inbox, FileText, CheckCircle, ArrowRight, Plus } from "lucide-react";
import { requireUser } from "@/lib/auth";
import { canAccess } from "@/lib/admin-access";
import { getAdminStats, getAdminEnquiries, getAdminVessels } from "@/lib/queries";
import { ENQUIRY_STATUS, PUBLICATION, enquiryTypeLabel, formatDate } from "@/lib/labels";
import { AdminPageHeader, MetricCard, AdminNotice } from "@/components/admin/admin-ui";
import { StatusIndicator } from "@/components/status-indicator";

export default async function AdminHome({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const user = await requireUser();
  const showVessels = canAccess(user.role, "vessels");
  const showEnquiries = canAccess(user.role, "enquiries");
  let stats = { vessels: 0, published: 0, drafts: 0, available: 0, openEnquiries: 0, newEnquiries: 0 };
  let recentEnquiries: Awaited<ReturnType<typeof getAdminEnquiries>> = [];
  let recentVessels: Awaited<ReturnType<typeof getAdminVessels>> = [];
  let loadFailed = false;
  try { [stats, recentEnquiries, recentVessels] = await Promise.all([getAdminStats(), showEnquiries ? getAdminEnquiries({ limit: 5 }) : [], showVessels ? getAdminVessels({ limit: 5 }) : []]); } catch { loadFailed = true; }
  const forbidden = (await searchParams).error === "forbidden";
  return (
    <>
      <AdminPageHeader eyebrow="Workspace" title="Dashboard overview" description="Manage listings and follow up on incoming business enquiries." actions={showVessels ? <><Link href="/admin/vessels/new" className="btn btn-primary"><Plus size={16} aria-hidden /> Add vessel</Link><Link href="/admin/vessels" className="btn btn-outline">Manage vessels</Link></> : undefined} />
      {forbidden && <AdminNotice tone="warning">Your role does not have access to that section.</AdminNotice>}
      {loadFailed && <AdminNotice tone="warning">Dashboard data could not be loaded. Check the database configuration at <a href="/api/health" className="font-semibold underline">/api/health</a>.</AdminNotice>}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard label="Total vessel records" value={stats.vessels} icon={<Ship size={18} />} href={showVessels ? "/admin/vessels" : undefined} />
        <MetricCard label="Published vessels" value={stats.published} detail={`${stats.available} marked available`} icon={<CheckCircle size={18} />} href={showVessels ? "/admin/vessels?status=published" : undefined} />
        <MetricCard label="Open enquiries" value={stats.openEnquiries} detail={`${stats.newEnquiries} new`} icon={<Inbox size={18} />} href={showEnquiries ? "/admin/enquiries" : undefined} />
        <MetricCard label="Draft vessels" value={stats.drafts} icon={<FileText size={18} />} href={showVessels ? "/admin/vessels?status=draft" : undefined} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        {showEnquiries && (
          <section aria-labelledby="recent-enquiries" className="panel">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 id="recent-enquiries" className="font-display text-base font-bold">Recent enquiries</h2><Link href="/admin/enquiries" className="text-link text-sm">View all <ArrowRight size={14} aria-hidden /></Link></div>
            {recentEnquiries.length ? <ul className="divide-y divide-line">{recentEnquiries.map(({ enquiry: e }) => <li key={e.id}><Link href={`/admin/enquiries/${e.id}`} className="flex items-start justify-between gap-4 px-5 py-3.5 transition hover:bg-mist"><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{e.name}{e.company && <span className="font-normal text-muted"> · {e.company}</span>}</p><p className="mt-0.5 truncate text-xs text-muted">{enquiryTypeLabel(e.type)} · {e.referenceNumber}</p></div><div className="shrink-0 text-right"><StatusIndicator label={ENQUIRY_STATUS[e.status].label} tone={ENQUIRY_STATUS[e.status].tone} /><p className="mt-1 text-xs text-muted">{formatDate(e.createdAt)}</p></div></Link></li>)}</ul>
              : <p className="px-5 py-10 text-center text-sm text-muted">No enquiries received yet.</p>}
          </section>
        )}
        {showVessels && (
          <section aria-labelledby="recent-vessels" className="panel">
            <div className="flex items-center justify-between border-b border-line px-5 py-4"><h2 id="recent-vessels" className="font-display text-base font-bold">Recently updated vessels</h2><Link href="/admin/vessels" className="text-link text-sm">View all <ArrowRight size={14} aria-hidden /></Link></div>
            {recentVessels.length ? <ul className="divide-y divide-line">{recentVessels.map(({ vessel: v, category }) => <li key={v.id}><Link href={`/admin/vessels/${v.id}`} className="flex items-start justify-between gap-4 px-5 py-3.5 transition hover:bg-mist"><div className="min-w-0"><p className="truncate text-sm font-semibold text-navy">{v.name}</p><p className="mt-0.5 truncate text-xs text-muted">{category ?? "No category"}</p></div><div className="shrink-0 text-right"><StatusIndicator label={PUBLICATION[v.status].label} tone={PUBLICATION[v.status].tone} /><p className="mt-1 text-xs text-muted">{formatDate(v.updatedAt)}</p></div></Link></li>)}</ul>
              : <p className="px-5 py-10 text-center text-sm text-muted">No vessel records yet. <Link href="/admin/vessels/new" className="font-semibold text-ocean">Add a verified record</Link> to begin.</p>}
          </section>
        )}
      </div>
      <p className="mt-8 text-xs leading-5 text-muted">Publish vessels only after content and availability have been verified. Drafts stay private until published.</p>
    </>
  );
}
