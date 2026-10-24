import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Newspaper } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { getPublishedContent } from "@/lib/queries";
import { formatDate } from "@/lib/labels";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "News and Insights", description: "Company announcements, marine industry updates and approved insights from Anchorship.", alternates: { canonical: "/news" } };
export default async function News() {
  let rows: Awaited<ReturnType<typeof getPublishedContent>>["articles"] = [];
  try { rows = (await getPublishedContent()).articles; } catch {}
  return (
    <>
      <PageHero eyebrow="News & insights" title="Updates from Anchorship." description="Company announcements, marine industry updates and approved insights." breadcrumbs={[{ label: "News" }]} />
      <section className="bg-mist py-10 md:py-14">
        <div className="container-wide">
          {rows.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map(x => (
                <article key={x.id} className="card flex flex-col">
                  {x.coverImageUrl ? <img src={x.coverImageUrl} alt={x.title} loading="lazy" decoding="async" className="aspect-[16/9] w-full border-b border-line object-cover" /> : <div aria-hidden className="bg-blueprint aspect-[16/9] border-b border-line" />}
                  <div className="flex-1 p-5">
                    <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{x.publishedAt ? <time dateTime={x.publishedAt.toISOString()}>{formatDate(x.publishedAt)}</time> : "News"}</p>
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug">{x.title}</h2>
                    {x.excerpt && <p className="mt-2 text-sm leading-6 text-muted">{x.excerpt}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={<Newspaper size={24} />} title="No news published yet" actions={<Link href="/vessels" className="btn btn-outline">Explore the fleet <ArrowRight size={16} aria-hidden /></Link>}>Company updates and approved articles will appear here.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
