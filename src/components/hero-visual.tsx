import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { MarineIllustration } from "@/components/marine-illustration";
import { getVesselCategory, VESSEL_CATEGORIES } from "@/lib/vessel-categories";

// Technical "plate" for the homepage hero: a large line drawing framed by bearing ticks and corner registration marks.
// Decorative marks only: no figures, dimensions or labels that could be read as vessel data.
const featured = getVesselCategory("well-intervention")!;
const position = VESSEL_CATEGORIES.indexOf(featured) + 1;

function Ticks({ vertical = false }: { vertical?: boolean }) {
  const lines = Array.from({ length: 41 }, (_, i) => { const long = i % 5 === 0; const p = i * 10; return vertical ? `M0 ${p} H${long ? 10 : 5}` : `M${p} 0 V${long ? 10 : 5}`; }).join(" ");
  return (
    <svg aria-hidden viewBox={vertical ? "0 0 10 400" : "0 0 400 10"} preserveAspectRatio="none" className={vertical ? "h-full w-2.5" : "h-2.5 w-full"}>
      <path d={lines} stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" fill="none" />
    </svg>
  );
}

export function HeroVisual() {
  return (
    <figure className="relative mx-auto w-full max-w-[640px]">
      <div className="relative rounded-md border border-white/[.12] bg-navy-800/50 px-5 pb-6 pt-10 backdrop-blur-[1px] sm:px-8">
        <div className="absolute inset-x-5 top-3 text-marine-300/40 sm:inset-x-8"><Ticks /></div>
        <div className="absolute bottom-6 right-2 top-10 hidden text-marine-300/30 sm:block"><Ticks vertical /></div>
        {["left-2 top-2 border-l border-t", "right-2 top-2 border-r border-t", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map(c => <span key={c} aria-hidden className={`absolute h-3 w-3 border-marine-300/60 ${c}`} />)}
        <svg aria-hidden viewBox="0 0 40 40" className="absolute right-6 top-8 hidden h-10 w-10 text-white/40 sm:block">
          <circle cx="20" cy="20" r="15" fill="none" stroke="currentColor" strokeWidth="1" />
          <path d="M20 5 V35 M5 20 H35" stroke="currentColor" strokeWidth=".75" opacity=".6" />
          <path d="M20 9 L23 20 L20 18 L17 20 Z" fill="#56D1CB" />
        </svg>
        <MarineIllustration kind={featured.illustration} tone="dark" drift title={`Line drawing of a ${featured.name.toLowerCase()} vessel`} className="mt-2" />
      </div>
      <figcaption className="mt-3 flex items-center justify-between gap-4 text-xs text-on-dark">
        <span className="tabular-nums tracking-[.12em]">{String(position).padStart(2, "0")} / {String(VESSEL_CATEGORIES.length).padStart(2, "0")} · {featured.name.toUpperCase()}</span>
        <Link href={`/vessels/category/${featured.slug}`} className="inline-flex items-center gap-1 font-semibold text-white hover:text-marine-300">View category <ArrowUpRight aria-hidden size={14} /></Link>
      </figcaption>
    </figure>
  );
}
