import Link from "next/link";
// Wordmark and monogram. `tone` is the surface it sits on.
export function BrandLink({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <Link href="/" aria-label="Anchorship home" className="flex shrink-0 items-center gap-3">
      <span aria-hidden className={`flex h-10 w-10 items-center justify-center rounded-[4px] border font-display text-lg font-extrabold ${dark ? "border-white/20 bg-white/[.04] text-white" : "border-navy bg-navy text-white"}`}>A<span className="text-marine">.</span></span>
      <span aria-hidden className="leading-none">
        <strong className={`block font-display text-[1.02rem] font-extrabold tracking-[.16em] ${dark ? "text-white" : "text-navy"}`}>ANCHORSHIP</strong>
        <span className={`mt-1.5 block whitespace-nowrap text-[.6rem] font-semibold tracking-[.22em] ${dark ? "text-on-dark" : "text-muted"}`}>MARINE &amp; OFFSHORE</span>
      </span>
    </Link>
  );
}
