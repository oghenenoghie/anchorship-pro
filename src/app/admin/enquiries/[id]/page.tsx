import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { Mail, Phone, Building2, ArrowUpRight } from "lucide-react";
import { requireRole } from "@/lib/auth";
import { ADMIN_ACCESS } from "@/lib/admin-access";
import { getEnquiryDetail } from "@/lib/queries";
import { ENQUIRY_STATUS, enquiryTypeLabel, formatDate } from "@/lib/labels";
import { AdminPageHeader } from "@/components/admin/admin-ui";
import { StatusIndicator } from "@/components/status-indicator";

// Read-only view of one enquiry, including the structured charter details.
export default async function AdminEnquiry({ params }: { params: Promise<{ id: string }> }) {
  await requireRole(ADMIN_ACCESS.enquiries);
  const { id } = await params;
  if (!z.string().uuid().safeParse(id).success) notFound();
  const row = await getEnquiryDetail(id);
  if (!row) notFound();
  const { enquiry: e, vessel, categoryName, equipmentName } = row;
  const status = ENQUIRY_STATUS[e.status];
  const request = ([["Enquiry type", enquiryTypeLabel(e.type)], ["Subject", e.subject], ["Vessel category", categoryName], ["Operating region", e.operatingRegion], ["Expected charter start", formatDate(e.charterStart)], ["Expected duration", e.charterDuration], ["Equipment", equipmentName]] as [string, string | null][]).filter((x): x is [string, string] => !!x[1]);
  return (
    <>
      <AdminPageHeader back={{ href: "/admin/enquiries", label: "All enquiries" }} eyebrow="Enquiry" title={e.referenceNumber}
        description={<span className="flex flex-wrap items-center gap-x-4 gap-y-1"><StatusIndicator label={status.label} tone={status.tone} /><span>Received {formatDate(e.createdAt, true)}</span><span>{e.notificationSent ? "Notification email sent" : "Notification email not sent"}</span></span>} />
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-5">
          <section aria-labelledby="request" className="panel">
            <h2 id="request" className="border-b border-line px-5 py-4 font-display text-base font-bold">Request</h2>
            <dl className="divide-y divide-line">
              {request.map(([k, v]) => <div key={k} className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"><dt className="text-sm text-muted">{k}</dt><dd className="text-sm font-medium text-navy">{v}</dd></div>)}
              {vessel && <div className="grid gap-1 px-5 py-3 sm:grid-cols-[180px_1fr] sm:gap-4"><dt className="text-sm text-muted">Vessel</dt><dd className="flex flex-wrap items-center gap-x-3 text-sm font-medium text-navy"><Link href={`/admin/vessels/${vessel.id}`} className="text-ocean hover:text-navy">{vessel.name}</Link>{vessel.status === "published" && <Link href={`/vessels/${vessel.slug}`} className="inline-flex items-center gap-1 text-xs font-semibold text-ocean">Public page <ArrowUpRight size={12} aria-hidden /></Link>}</dd></div>}
            </dl>
          </section>
          {e.technicalRequirements && (
            <section aria-labelledby="technical" className="panel">
              <h2 id="technical" className="border-b border-line px-5 py-4 font-display text-base font-bold">Technical requirements</h2>
              <p className="whitespace-pre-line px-5 py-4 text-sm leading-6 text-ink">{e.technicalRequirements}</p>
            </section>
          )}
          <section aria-labelledby="message" className="panel">
            <h2 id="message" className="border-b border-line px-5 py-4 font-display text-base font-bold">{e.type === "vessel_charter" ? "Project details" : "Message"}</h2>
            <p className="whitespace-pre-line break-words px-5 py-4 text-sm leading-6 text-ink">{e.message}</p>
          </section>
        </div>
        <aside aria-labelledby="contact" className="panel h-fit">
          <h2 id="contact" className="border-b border-line px-5 py-4 font-display text-base font-bold">Contact</h2>
          <div className="grid gap-3 px-5 py-4 text-sm">
            <p className="font-semibold text-navy">{e.name}</p>
            {e.company && <p className="flex items-center gap-2 text-ink"><Building2 size={15} aria-hidden className="text-ocean" />{e.company}</p>}
            <a href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.referenceNumber}${e.subject ? ` – ${e.subject}` : ""}`)}`} className="flex items-center gap-2 break-all text-ocean hover:text-navy"><Mail size={15} aria-hidden />{e.email}</a>
            {e.phone && <a href={`tel:${e.phone.replace(/[^\d+]/g, "")}`} className="flex items-center gap-2 text-ocean hover:text-navy"><Phone size={15} aria-hidden />{e.phone}</a>}
          </div>
          <p className="border-t border-line px-5 py-4 text-xs leading-5 text-muted">Status changes and assignment are not yet editable in the admin. Quote the reference when replying.</p>
        </aside>
      </div>
    </>
  );
}
