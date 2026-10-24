import Image from "next/image";
import aerial from "@/assets/hero/aerial.jpg";
import bow from "@/assets/hero/bow.jpg";
import { HeroMotionToggle } from "@/components/hero-motion-toggle";

// Moving background for the homepage hero, rebuilt from the "cinematic hero" supplied by Anchorship (Oct 2026): an
// aerial approach and a low-angle bow shot, pushed in slowly and cross-faded on a 10-second loop (.hero-shot in
// globals.css). Decorative only, so no alt text. The vessel name, MMSI and home port painted on the bow in the supplied
// image were invented and have been removed from bow.jpg; do not add captions that present either vessel as fleet.
export function HeroMedia() {
  return (
    <>
      <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden bg-navy">
        <Image src={aerial} alt="" fill priority sizes="100vw" placeholder="blur" className="hero-shot hero-shot-aerial object-cover object-[68%_center]" />
        <Image src={bow} alt="" fill sizes="100vw" className="hero-shot hero-shot-bow object-cover object-[62%_center]" />
      </div>
      {/* Navy wash: an even tint on small screens, where text spans the width; on large screens solid behind the text
          and opening towards the vessel on the right. */}
      <div aria-hidden className="absolute inset-0 -z-10 bg-navy/80 lg:bg-transparent lg:bg-[linear-gradient(90deg,rgba(7,27,44,.95)_0%,rgba(7,27,44,.86)_36%,rgba(7,27,44,.4)_68%,rgba(7,27,44,.18)_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(7,27,44,.5)_0%,transparent_28%,transparent_58%,rgba(7,27,44,.9)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-24 lg:bottom-28">
        <div className="container-wide flex justify-end"><HeroMotionToggle /></div>
      </div>
    </>
  );
}
