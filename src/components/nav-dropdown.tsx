"use client";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
// Disclosure-pattern dropdown: the label stays a normal link, a separate button opens the panel. Opens on click or
// keyboard, and on hover for mouse users; closes on Escape (focus returns to the button), outside click and focus leaving.
export function NavDropdown({ label, href, children }: { label: string; href: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const id = useId();
  const root = useRef<HTMLLIElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const current = pathname === href || pathname.startsWith(`${href}/`);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") { setOpen(false); button.current?.focus(); } };
    const onPointer = (e: PointerEvent) => { if (!root.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("pointerdown", onPointer); };
  }, [open]);
  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  return (
    <li ref={root} className="relative flex items-center"
      onPointerEnter={e => { if (e.pointerType === "mouse") { cancelClose(); setOpen(true); } }}
      onPointerLeave={e => { if (e.pointerType === "mouse") { cancelClose(); closeTimer.current = setTimeout(() => setOpen(false), 160); } }}
      onBlur={e => { if (!root.current?.contains(e.relatedTarget as Node)) setOpen(false); }}>
      <Link href={href} className="nav-link" aria-current={current ? "page" : undefined}>{label}</Link>
      <button ref={button} type="button" aria-expanded={open} aria-controls={id} onClick={() => setOpen(o => !o)} className="ml-0.5 grid h-9 w-7 place-items-center rounded text-[#d3dee6] transition hover:text-white">
        <span className="sr-only">{label} categories</span>
        <ChevronDown aria-hidden size={15} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      <div id={id} hidden={!open} className="surface-light absolute left-1/2 top-full z-50 w-[min(780px,calc(100vw-3rem))] -translate-x-1/2 pt-5">{children}</div>
    </li>
  );
}
