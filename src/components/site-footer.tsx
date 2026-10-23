import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLink } from "@/components/brand";
import { VESSEL_CATEGORIES } from "@/lib/vessel-categories";
import { COMPANY_DESCRIPTION, FALLBACK_SERVICES } from "@/lib/company";
// Contact details, addresses, social and legal links are deliberately absent until approved values exist.
function Column({ title, children }: { title: string; children: React.ReactNode }) {
  return <div><h2 className="text-[.7rem] font-bold uppercase tracking-[.16em] text-marine-300">{title}</h2><ul className="mt-4 grid gap-2.5 text-sm text-on-dark">{children}</ul></div>;
}
const item = (label: string, href: string) => <li key={href}><Link href={href} className="transition-colors hover:text-white">{label}</Link></li>;
export function SiteFooter(){return <footer className="surface-dark relative isolate overflow-hidden border-t border-white/10">
<div aria-hidden className="bg-blueprint-dark absolute inset-0 -z-10 opacity-60 [mask-image:linear-gradient(to_top,#000,transparent)]"/>
<div className="container-wide grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-[1.3fr_1.1fr_.8fr_.8fr]">
<div><BrandLink/><p className="mt-5 max-w-sm text-sm leading-6 text-on-dark">{COMPANY_DESCRIPTION}</p><Link href="/request-vessel" className="btn btn-primary mt-6">Request a Vessel <ArrowRight size={16} aria-hidden/></Link></div>
<Column title="Vessel categories">{VESSEL_CATEGORIES.map(c=>item(c.name,`/vessels/category/${c.slug}`))}</Column>
<Column title="Services">{FALLBACK_SERVICES.map(s=>item(s.title,`/services#${s.slug}`))}{item("Equipment catalogue","/equipment")}</Column>
<Column title="Company">{item("About Anchorship","/about")}{item("Projects","/projects")}{item("News","/news")}{item("Contact","/contact")}<li className="pt-3 text-xs leading-5 text-on-dark/80">For vessel, chartering and equipment enquiries, please use our <Link href="/contact" className="font-semibold text-white underline underline-offset-4">contact form</Link>.</li></Column>
</div>
<div className="border-t border-white/10"><div className="container-wide flex flex-col gap-2 py-5 text-xs text-on-dark/80 sm:flex-row sm:justify-between"><span>© {new Date().getFullYear()} Anchorship. All rights reserved.</span><span>Marine &amp; Offshore Solutions</span></div></div>
</footer>}
