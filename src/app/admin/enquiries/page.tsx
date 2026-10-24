import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { ADMIN_ACCESS } from "@/lib/admin-access";
import { getAdminEnquiries } from "@/lib/queries";
import { ENQUIRY_STATUS, ENQUIRY_TYPES, enquiryTypeLabel, formatDate } from "@/lib/labels";
import { AdminPageHeader, AdminNotice } from "@/components/admin/admin-ui";
import { StatusIndicator } from "@/components/status-indicator";
import { GetForm } from "@/components/get-form";

type Search = { status?: string; type?: string };
export default async function AdminEnquiries({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole(ADMIN_ACCESS.enquiries);
  const p = await searchParams;
  const filters = { status: p.status && p.status in ENQUIRY_STATUS ? p.status : undefined, type: p.type && p.type in ENQUIRY_TYPES ? p.type : undefined };
  let rows: Awaited<ReturnType<typeof getAdminEnquiries>> = [];
  let failed = false;
  try { rows = await getAdminEnquiries(filters); } catch { failed = true; }
  const filtered = !!(filters.status || filters.type);
  const about = (r: (typeof rows)[number]) => r.vesselName ?? r.categoryName ?? null;
  return (
    <>
      <AdminPageHeader eyebrow="Sales pipeline" title="Enquiries" description="Recent customer submissions. Limit: latest 200 records." />
      {failed && <AdminNotice tone="warning">Enquiries could not be loaded. Check the database configuration at <a href="/api/health" className="font-semibold underline">/api/health</a>.</AdminNotice>}
      <GetForm className="panel mb-5 grid gap-3 p-4 sm:grid-cols-[1fr_1fr_auto]" aria-label="Filter enquiries">
        <label className="label"><span className="sr-only">Status</span><select name="status" defaultValue={filters.status ?? ""} className="field"><option value="">All statuses</option>{Object.entries(ENQUIRY_STATUS).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}</select></label>
        <label className="label"><span className="sr-only">Enquiry type</span><select name="type" defaultValue={filters.type ?? ""} className="field"><option value="">All types</option>{Object.entries(ENQUIRY_TYPES).map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select></label>
        <div className="flex gap-2"><button className="btn btn-dark flex-1 sm:flex-none">Filter</button>{filtered && <Link href="/admin/enquiries" className="btn btn-outline">Reset</Link>}</div>
      </GetForm>
      <p className="mb-3 text-sm text-muted">{rows.length} {rows.length === 1 ? "enquiry" : "enquiries"}{filtered ? " match these filters" : ""}</p>

      <div className="panel table-wrap hidden md:block">
        <table className="data-table min-w-[860px]">
          <thead><tr><th scope="col">Reference</th><th scope="col">Contact</th><th scope="col">Type</th><th scope="col">Regarding</th><th scope="col">Status</th><th scope="col">Received</th></tr></thead>
          <tbody>
            {rows.map(r => { const e = r.enquiry; return (
              <tr key={e.id}>
                <td><Link href={`/admin/enquiries/${e.id}`} className="font-semibold text-navy hover:text-ocean">{e.referenceNumber}</Link><p className="mt-1 max-w-xs truncate text-xs text-muted">{e.subject || e.message}</p></td>
                <td>{e.name}{e.company && <span className="block text-xs text-muted">{e.company}</span>}<a className="block text-xs text-ocean" href={`mailto:${e.email}`}>{e.email}</a></td>
                <td className="whitespace-nowrap">{enquiryTypeLabel(e.type)}</td>
                <td className="max-w-[200px] truncate text-ink">{about(r) ?? <span className="text-muted">—</span>}</td>
                <td><StatusIndicator label={ENQUIRY_STATUS[e.status].label} tone={ENQUIRY_STATUS[e.status].tone} /></td>
                <td className="whitespace-nowrap text-muted">{formatDate(e.createdAt, true)}</td>
              </tr>
            ); })}
            {!rows.length && <tr><td colSpan={6} className="p-10 text-center text-muted">{filtered ? "No enquiries match these filters." : "No enquiries received yet."}</td></tr>}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {rows.map(r => { const e = r.enquiry; return (
          <li key={e.id}><Link href={`/admin/enquiries/${e.id}`} className="panel block p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><p className="font-semibold text-navy">{e.name}</p><p className="mt-0.5 truncate text-xs text-muted">{e.referenceNumber} · {enquiryTypeLabel(e.type)}</p></div><StatusIndicator label={ENQUIRY_STATUS[e.status].label} tone={ENQUIRY_STATUS[e.status].tone} /></div>
            <p className="mt-2 line-clamp-2 text-sm text-ink">{e.subject || e.message}</p>
            <p className="mt-3 border-t border-line pt-3 text-xs text-muted">{formatDate(e.createdAt, true)}{about(r) ? ` · ${about(r)}` : ""}</p>
          </Link></li>
        ); })}
        {!rows.length && <li className="panel p-8 text-center text-sm text-muted">{filtered ? "No enquiries match these filters." : "No enquiries received yet."}</li>}
      </ul>
    </>
  );
}
