import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BrandLink } from "@/components/brand";
import { MobileNav } from "@/components/mobile-nav";
import { NavLink } from "@/components/nav-link";
import { NavDropdown } from "@/components/nav-dropdown";
import { MarineIllustration } from "@/components/marine-illustration";
import { VESSEL_CATEGORIES } from "@/lib/vessel-categories";
const links:[string,string][]=[ ["Home","/"],["Services","/services"],["Vessels","/vessels"],["Equipment","/equipment"],["Projects","/projects"],["About","/about"],["News","/news"],["Contact","/contact"] ];
const categories=VESSEL_CATEGORIES.map(c=>({name:c.name,slug:c.slug}));

// Rendered on the server and passed into the client dropdown, so the illustrations add no client JavaScript.
function VesselsPanel() {
  return (
    <div className="overflow-hidden rounded-md border border-line bg-white text-ink shadow-lift">
      <ul className="grid grid-cols-3 gap-px bg-line">
        {VESSEL_CATEGORIES.map(c => (
          <li key={c.slug} className="bg-white">
            <Link href={`/vessels/category/${c.slug}`} className="group flex h-full items-center gap-3 px-3.5 py-3 transition-colors hover:bg-mist">
              <span className="bg-blueprint w-[72px] shrink-0 rounded-[3px] border border-line/70 px-1.5 py-1"><MarineIllustration kind={c.illustration} /></span>
              <span className="text-[.84rem] font-semibold leading-snug text-navy group-hover:text-ocean">{c.name}</span>
            </Link>
          </li>
        ))}
      </ul>
      <div className="flex flex-wrap items-center justify-between gap-3 bg-mist px-4 py-3">
        <Link href="/vessels" className="text-link">View the full fleet catalogue <ArrowRight aria-hidden size={15} /></Link>
        <Link href="/request-vessel" className="text-link">Can&apos;t find a match? Request a vessel <ArrowRight aria-hidden size={15} /></Link>
      </div>
    </div>
  );
}

export function SiteHeader(){return <header className="surface-dark sticky top-0 z-40 border-b border-white/10 bg-navy/[.97] backdrop-blur supports-[backdrop-filter]:bg-navy/90"><div className="container-wide relative flex h-[var(--header-h)] items-center justify-between gap-6"><BrandLink/>
<nav aria-label="Main" className="hidden xl:block"><ul className="flex items-center gap-6">{links.map(([label,href])=>href==="/vessels"?<NavDropdown key={href} label={label} href={href}><VesselsPanel/></NavDropdown>:<li key={href}><NavLink href={href}>{label}</NavLink></li>)}</ul></nav>
<div className="flex items-center gap-3"><Link href="/request-vessel" className="btn btn-primary hidden sm:inline-flex">Request a Vessel <ArrowRight size={16} aria-hidden/></Link><MobileNav links={links} categories={categories}/></div></div></header>}
