"use client";
import { useState } from "react";
import { ChevronDown, SlidersHorizontal } from "lucide-react";
// Collapses the filter form behind a toggle below the lg breakpoint; always visible on wide screens.
export function FiltersPanel({ activeCount, children }: { activeCount: number; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <aside aria-label="Filter vessels" className="min-w-0">
      <button type="button" aria-expanded={open} aria-controls="vessel-filters" onClick={() => setOpen(o => !o)} className="btn btn-outline w-full justify-between lg:hidden">
        <span className="flex items-center gap-2"><SlidersHorizontal aria-hidden size={16} />Filters and sorting{activeCount > 0 && <span className="rounded-full bg-navy px-2 py-0.5 text-[.7rem] text-white">{activeCount} active</span>}</span>
        <ChevronDown aria-hidden size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <div id="vessel-filters" className={`${open ? "mt-3 block" : "hidden"} lg:mt-0 lg:block`}>{children}</div>
    </aside>
  );
}
