import { Breadcrumbs, type Crumb } from "@/components/breadcrumbs";
type Props = { eyebrow: string; title: React.ReactNode; description?: React.ReactNode; breadcrumbs?: Crumb[]; aside?: React.ReactNode; children?: React.ReactNode };
// Navy page header for inner pages. `aside` takes a technical illustration or summary panel; `children` takes actions.
export function PageHero({ eyebrow, title, description, breadcrumbs, aside, children }: Props) {
  return (
    <section className="surface-dark relative isolate overflow-hidden border-b border-white/10">
      <div aria-hidden className="bg-blueprint-dark absolute inset-0 -z-10 [mask-image:linear-gradient(to_bottom,#000_30%,transparent)]" />
      <div className={`container-wide grid gap-10 py-10 md:py-14 ${aside ? "lg:grid-cols-[1.2fr_1fr] lg:items-center" : ""}`}>
        <div className="min-w-0">
          {breadcrumbs && <Breadcrumbs items={breadcrumbs} />}
          <p className={`eyebrow ${breadcrumbs ? "mt-7" : ""}`}>{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-display text-[2.05rem] font-extrabold leading-[1.08] tracking-tight sm:text-[2.5rem] md:text-[2.875rem]">{title}</h1>
          {description && <p className="mt-5 max-w-2xl text-base leading-7 text-on-dark md:text-[1.0625rem]">{description}</p>}
          {children && <div className="mt-8 flex flex-wrap gap-3">{children}</div>}
        </div>
        {aside && <div className="min-w-0">{aside}</div>}
      </div>
    </section>
  );
}
