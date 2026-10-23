import Link from "next/link";
import { Plus, Search, ArrowUpRight, Pencil } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { ADMIN_ACCESS } from "@/lib/admin-access";
import { getAdminVessels } from "@/lib/queries";
import { AVAILABILITY, LISTING_TYPE, PUBLICATION, formatDate } from "@/lib/labels";
import { AdminPageHeader, AdminNotice } from "@/components/admin/admin-ui";
import { StatusIndicator } from "@/components/status-indicator";
import { GetForm } from "@/components/get-form";

type Search = { q?: string; status?: string; availability?: string };
export default async function AdminVessels({ searchParams }: { searchParams: Promise<Search> }) {
  await requireRole(ADMIN_ACCESS.vessels);
  const p = await searchParams;
  const filters = { q: p.q?.trim().slice(0, 120) || undefined, status: p.status && p.status in PUBLICATION ? p.status : undefined, availability: p.availability && p.availability in AVAILABILITY ? p.availability : undefined };
  let rows: Awaited<ReturnType<typeof getAdminVessels>> = [];
  let failed = false;
  try { rows = await getAdminVessels(filters); } catch { failed = true; }
  const filtered = !!(filters.q || filters.status || filters.availability);
  return (
    <>
      <AdminPageHeader eyebrow="Catalogue" title="Vessel management" description="Review listing status and create new records." actions={<Link href="/admin/vessels/new" className="btn btn-primary"><Plus size={16} aria-hidden /> Add vessel</Link>} />
      {failed && <AdminNotice tone="warning">Vessel records could not be loaded. Check the database configuration at <a href="/api/health" className="font-semibold underline">/api/health</a>.</AdminNotice>}
      <GetForm className="panel mb-5 grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_auto]" aria-label="Filter vessels">
        <label className="label"><span className="sr-only">Search vessels</span><span className="relative"><Search aria-hidden size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted" /><input name="q" type="search" defaultValue={filters.q} placeholder="Search name or slug" className="field pl-9" /></span></label>
        <label className="label"><span className="sr-only">Publication status</span><select name="status" defaultValue={filters.status ?? ""} className="field"><option value="">All statuses</option>{Object.entries(PUBLICATION).map(([v, s]) => <option key={v} value={v}>{s.label}</option>)}</select></label>
        <label className="label"><span className="sr-only">Availability</span><select name="availability" defaultValue={filters.availability ?? ""} className="field"><option value="">Any availability</option>{Object.entries(AVAILABILITY).map(([v, a]) => <option key={v} value={v}>{a.label}</option>)}</select></label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-1"><button className="btn btn-dark flex-1 lg:flex-none">Filter</button>{filtered && <Link href="/admin/vessels" className="btn btn-outline">Reset</Link>}</div>
      </GetForm>
      <p className="mb-3 text-sm text-muted">{rows.length} {rows.length === 1 ? "record" : "records"}{filtered ? " match these filters" : ""}</p>

      {/* Table from md up; stacked cards below. */}
      <div className="panel table-wrap hidden md:block">
        <table className="data-table min-w-[820px]">
          <thead><tr><th scope="col">Vessel</th><th scope="col">Category</th><th scope="col">Listing</th><th scope="col">Availability</th><th scope="col">Status</th><th scope="col">Updated</th><th scope="col"><span className="sr-only">Actions</span></th></tr></thead>
          <tbody>
            {rows.map(({ vessel: v, category }) => (
              <tr key={v.id}>
                <td><Link className="font-semibold text-navy hover:text-ocean" href={`/admin/vessels/${v.id}`}>{v.name}</Link><p className="mt-0.5 text-xs text-muted">/{v.slug}{v.featured && <span className="ml-2 rounded-[3px] bg-marine-50 px-1.5 py-0.5 font-semibold text-marine-700">Featured</span>}</p></td>
                <td className="text-ink">{category ?? <span className="text-muted">—</span>}</td>
                <td className="whitespace-nowrap">{LISTING_TYPE[v.listingType]}</td>
                <td><StatusIndicator label={AVAILABILITY[v.availabilityStatus].label} tone={AVAILABILITY[v.availabilityStatus].tone} /></td>
                <td><StatusIndicator label={PUBLICATION[v.status].label} tone={PUBLICATION[v.status].tone} /></td>
                <td className="whitespace-nowrap text-muted">{formatDate(v.updatedAt)}</td>
                <td className="whitespace-nowrap text-right"><Link href={`/admin/vessels/${v.id}`} className="btn btn-outline btn-sm"><Pencil size={14} aria-hidden /> Edit<span className="sr-only"> {v.name}</span></Link>{v.status === "published" && <Link href={`/vessels/${v.slug}`} className="ml-2 inline-flex items-center gap-1 text-xs font-semibold text-ocean">Public<ArrowUpRight size={13} aria-hidden /><span className="sr-only"> page for {v.name}</span></Link>}</td>
              </tr>
            ))}
            {!rows.length && <tr><td colSpan={7} className="p-10 text-center text-muted">{filtered ? "No vessel records match these filters." : "No vessel records yet. Add a verified record to begin."}</td></tr>}
          </tbody>
        </table>
      </div>
      <ul className="grid gap-3 md:hidden">
        {rows.map(({ vessel: v, category }) => (
          <li key={v.id} className="panel p-4">
            <div className="flex items-start justify-between gap-3"><div className="min-w-0"><Link href={`/admin/vessels/${v.id}`} className="font-semibold text-navy">{v.name}</Link><p className="mt-0.5 truncate text-xs text-muted">{category ?? "No category"} · {LISTING_TYPE[v.listingType]}</p></div><StatusIndicator label={PUBLICATION[v.status].label} tone={PUBLICATION[v.status].tone} /></div>
            <div className="mt-3 flex items-center justify-between gap-3 border-t border-line pt-3 text-xs text-muted"><StatusIndicator label={AVAILABILITY[v.availabilityStatus].label} tone={AVAILABILITY[v.availabilityStatus].tone} /><span>Updated {formatDate(v.updatedAt)}</span></div>
          </li>
        ))}
        {!rows.length && <li className="panel p-8 text-center text-sm text-muted">{filtered ? "No vessel records match these filters." : "No vessel records yet. Add a verified record to begin."}</li>}
      </ul>
    </>
  );
}
