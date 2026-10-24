// Skeleton while catalogue data loads. Scoped to listing routes: a loading boundary above a page that can call
// notFound() or redirect() would stream a 200 before the real status is known.
export default function LoadingVessels() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading vessels…</span>
      <div className="surface-dark border-b border-white/10"><div className="container-wide py-12 md:py-16"><div className="h-3 w-40 rounded bg-white/10" /><div className="mt-6 h-10 w-full max-w-xl rounded bg-white/10" /><div className="mt-4 h-4 w-full max-w-lg rounded bg-white/[.07]" /></div></div>
      <div className="bg-mist py-10 md:py-14"><div className="container-wide grid gap-6 lg:grid-cols-[272px_1fr] lg:gap-10">
        <div className="skeleton hidden h-[520px] lg:block" />
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }, (_, i) => <div key={i} className="panel overflow-hidden"><div className="skeleton aspect-[16/10] rounded-none" /><div className="grid gap-3 p-5"><div className="skeleton h-3 w-24" /><div className="skeleton h-5 w-3/4" /><div className="skeleton h-12 w-full" /></div></div>)}</div>
      </div></div>
    </div>
  );
}
