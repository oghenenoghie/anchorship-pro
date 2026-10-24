"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
// Disclosure-pattern menu for widths below the xl breakpoint, where the header nav is hidden.
export function MobileNav({links,categories}:{links:[string,string][];categories:{name:string;slug:string}[]}){const [open,setOpen]=useState(false);const pathname=usePathname();const toggle=useRef<HTMLButtonElement>(null);
useEffect(()=>{setOpen(false)},[pathname]);
useEffect(()=>{if(!open)return;const onKey=(e:KeyboardEvent)=>{if(e.key==="Escape"){setOpen(false);toggle.current?.focus();}};document.addEventListener("keydown",onKey);return()=>document.removeEventListener("keydown",onKey);},[open]);
const isCurrent=(href:string)=>href==="/"?pathname==="/":pathname===href||pathname.startsWith(href+"/");
return <div className="xl:hidden"><button ref={toggle} type="button" aria-label="Main menu" aria-expanded={open} aria-controls="mobile-nav" onClick={()=>setOpen(o=>!o)} className="grid h-11 w-11 place-items-center rounded border border-white/20 text-white transition hover:border-white/50">{open?<X size={22} aria-hidden/>:<Menu size={22} aria-hidden/>}</button>
{open&&<div aria-hidden className="fixed inset-x-0 bottom-0 top-[var(--header-h)] bg-navy/50" onClick={()=>setOpen(false)}/>}
<nav id="mobile-nav" aria-label="Main" hidden={!open} className="surface-light absolute inset-x-0 top-full max-h-[calc(100dvh-var(--header-h))] overflow-y-auto border-b border-line bg-white text-ink shadow-lift">
<div className="container-wide grid gap-8 py-4 md:grid-cols-[1fr_1.3fr] md:py-6">
<ul>{links.map(([label,href])=><li key={href}><Link href={href} aria-current={isCurrent(href)?"page":undefined} onClick={()=>setOpen(false)} className={`flex min-h-12 items-center justify-between border-b border-line text-base font-semibold ${isCurrent(href)?"text-ocean":"text-navy"}`}>{label}{isCurrent(href)&&<span aria-hidden className="h-1.5 w-1.5 rounded-full bg-marine"/>}</Link></li>)}</ul>
<div><p className="pt-2 text-[.7rem] font-bold uppercase tracking-[.16em] text-muted">Vessel categories</p><ul className="mt-2 grid gap-x-4 sm:grid-cols-2">{categories.map(c=><li key={c.slug}><Link href={`/vessels/category/${c.slug}`} onClick={()=>setOpen(false)} className="flex min-h-11 items-center border-b border-line/70 text-sm font-medium text-ink hover:text-ocean">{c.name}</Link></li>)}</ul>
<div className="mt-6 grid gap-3 pb-2 sm:grid-cols-2"><Link href="/request-vessel" onClick={()=>setOpen(false)} className="btn btn-primary w-full">Request a Vessel <ArrowRight size={16} aria-hidden/></Link><Link href="/contact" onClick={()=>setOpen(false)} className="btn btn-outline w-full">Contact our team</Link></div></div>
</div></nav></div>}
