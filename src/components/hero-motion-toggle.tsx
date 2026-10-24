"use client";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
// Motion that runs longer than five seconds needs a way to stop it (WCAG 2.2.2). Pausing sets data-paused on the hero,
// which freezes the .hero-shot animations; the button is hidden for visitors who prefer reduced motion (nothing moves).
export function HeroMotionToggle() {
  const [paused, setPaused] = useState(false);
  return (
    <button
      type="button"
      onClick={e => { const next = !paused; e.currentTarget.closest("[data-hero]")?.toggleAttribute("data-paused", next); setPaused(next); }}
      className="hero-motion-toggle pointer-events-auto inline-flex min-h-9 items-center gap-1.5 rounded-[4px] border border-white/25 bg-navy/60 px-3 text-xs font-semibold text-white backdrop-blur-sm transition-colors hover:border-white/45 hover:bg-navy/80"
    >
      {paused ? <Play size={14} aria-hidden /> : <Pause size={14} aria-hidden />}
      {paused ? "Play" : "Pause"}<span className="sr-only"> background motion</span>
    </button>
  );
}
