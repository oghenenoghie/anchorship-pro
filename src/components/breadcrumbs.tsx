import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { siteUrl } from "@/lib/site-url";
export type Crumb = { label: string; href?: string };
// Visible trail plus matching BreadcrumbList structured data. "Home" is prepended automatically.
export function Breadcrumbs({ items, tone = "dark" }: { items: Crumb[]; tone?: "dark" | "light" }) {
  const trail: Crumb[] = [{ label: "Home", href: "/" }, ...items];
  const base = siteUrl();
  const jsonLd = { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: trail.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.label, ...(c.href ? { item: `${base}${c.href === "/" ? "" : c.href}` } : {}) })) };
  return (
    <nav aria-label="Breadcrumb">
      <ol className={`flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[.8rem] ${tone === "dark" ? "text-on-dark" : "text-muted"}`}>
        {trail.map((c, i) => {
          const last = i === trail.length - 1;
          return (
            <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
              {c.href && !last ? <Link href={c.href} className={`underline-offset-4 hover:underline ${tone === "dark" ? "hover:text-white" : "hover:text-navy"}`}>{c.label}</Link> : <span aria-current={last ? "page" : undefined} className={tone === "dark" ? "text-white" : "text-ink"}>{c.label}</span>}
              {!last && <ChevronRight aria-hidden size={13} className="opacity-60" />}
            </li>
          );
        })}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  );
}
