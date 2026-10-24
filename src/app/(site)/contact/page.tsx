import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ship, Handshake, Cog, MessagesSquare } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EnquiryForm } from "@/components/enquiry-form";
import { ContactDetails } from "@/components/contact-details";
import { ENQUIRY_TYPES, type EnquiryType } from "@/lib/labels";
export const metadata: Metadata = { title: "Contact Anchorship", description: "Send a vessel, charter, equipment or general enquiry to the Anchorship team, or email info@anchorship.nl. Office in Dordrecht, the Netherlands.", alternates: { canonical: "/contact" } };
const TOPICS = [
  { icon: Ship, title: "Vessel chartering", body: "For a specific vessel or charter requirement, the charter request form captures region, dates and technical needs.", href: "/request-vessel", cta: "Request a vessel" },
  { icon: Handshake, title: "Vessel sale or acquisition", body: "Discuss vessel sale and acquisition requirements with our team." },
  { icon: Cog, title: "Marine equipment", body: "Ask about equipment in our catalogue or a specific equipment requirement." },
  { icon: MessagesSquare, title: "Services and general enquiries", body: "Anything else: services, partnerships or questions about this website." },
];
export default async function Contact({ searchParams }: { searchParams: Promise<{ subject?: string | string[]; type?: string | string[] }> }) {
  const p = await searchParams;
  // Search params arrive decoded; decoding again threw on values containing "%".
  const subject = typeof p.subject === "string" ? p.subject.slice(0, 240) : "";
  const type = typeof p.type === "string" && p.type in ENQUIRY_TYPES ? (p.type as EnquiryType) : undefined;
  return (
    <>
      <PageHero eyebrow="Contact" title="Let's discuss your marine requirement." description="Send a vessel, charter, equipment or general enquiry. Provide enough detail for our team to understand your request." breadcrumbs={[{ label: "Contact" }]} />
      <section className="bg-mist py-10 md:py-14">
        <div className="container-wide grid gap-8 lg:grid-cols-[340px_minmax(0,1fr)] lg:gap-10">
          <aside className="grid content-start gap-5">
            <div className="panel p-5">
              <h2 className="text-[.72rem] font-bold uppercase tracking-[.16em] text-navy">Contact details</h2>
              <div className="mt-4"><ContactDetails variant="panel" /></div>
            </div>
            <div className="panel p-5">
              <h2 className="text-[.72rem] font-bold uppercase tracking-[.16em] text-navy">How we can help</h2>
              <ul className="mt-4 grid gap-5">
                {TOPICS.map(({ icon: Icon, title, body, href, cta }) => (
                  <li key={title} className="flex gap-3">
                    <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] border border-line text-ocean"><Icon size={17} strokeWidth={1.6} /></span>
                    <div><p className="text-sm font-semibold text-navy">{title}</p><p className="mt-0.5 text-sm leading-6 text-muted">{body}</p>{href && <Link href={href} className="text-link mt-1">{cta} <ArrowRight size={14} aria-hidden /></Link>}</div>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
          <div className="panel p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold">Send an enquiry</h2>
            <p className="mb-6 mt-2 text-sm text-muted">Our team will review your message and follow up using the details you provide.</p>
            <EnquiryForm type={type} subject={subject} />
          </div>
        </div>
      </section>
    </>
  );
}
