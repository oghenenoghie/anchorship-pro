import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FolderKanban } from "lucide-react";
import { PageHero } from "@/components/page-hero";
import { EmptyState } from "@/components/empty-state";
import { getPublishedContent } from "@/lib/queries";
import { formatDate } from "@/lib/labels";
export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects", description: "Approved project stories and examples of marine work.", alternates: { canonical: "/projects" } };
export default async function Projects() {
  let rows: Awaited<ReturnType<typeof getPublishedContent>>["projects"] = [];
  try { rows = (await getPublishedContent()).projects; } catch {}
  return (
    <>
      <PageHero eyebrow="Projects" title="Marine work, capability and collaboration." description="Explore approved project stories and examples of marine work." breadcrumbs={[{ label: "Projects" }]} />
      <section className="bg-mist py-10 md:py-14">
        <div className="container-wide">
          {rows.length ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {rows.map(x => (
                <article key={x.id} className="card flex flex-col">
                  {x.imageUrl ? <img src={x.imageUrl} alt={x.title} loading="lazy" decoding="async" className="aspect-[16/9] w-full border-b border-line object-cover" /> : <div aria-hidden className="bg-blueprint aspect-[16/9] border-b border-line" />}
                  <div className="flex-1 p-5">
                    {x.publishedAt && <p className="text-xs font-semibold uppercase tracking-[.12em] text-muted">{formatDate(x.publishedAt)}</p>}
                    <h2 className="mt-2 font-display text-lg font-bold leading-snug">{x.title}</h2>
                    {x.summary && <p className="mt-2 text-sm leading-6 text-muted">{x.summary}</p>}
                    {x.body && <p className="mt-3 line-clamp-4 whitespace-pre-line text-sm leading-6 text-ink/90">{x.body}</p>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState icon={<FolderKanban size={24} />} title="Project stories are on their way" actions={<Link href="/vessels" className="btn btn-outline">Explore the fleet <ArrowRight size={16} aria-hidden /></Link>}>Approved project stories will be published here.</EmptyState>
          )}
        </div>
      </section>
    </>
  );
}
