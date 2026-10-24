import type { IllustrationKind } from "@/lib/vessel-categories";

// Anchorship marine illustration family: side-profile engineering line art on a shared 240×120 canvas, waterline at
// y=88. One stroke weight (non-scaling, so line work stays crisp at any size), navy line work, teal for the element
// that defines the category (reel, tow line, cutter, riser…). Styling lives in globals.css under `.illus`.
// Rules: no text, dimensions or markings inside drawings; add new kinds on the same canvas and waterline.

const VIEWBOX = "0 0 240 120";

function wave(y: number, amp: number, period: number, from: number, to: number) {
  const half = period / 2;
  let d = `M${from} ${y} q${period / 4} ${-amp} ${half} 0`;
  for (let x = from + half; x < to; x += half) d += ` t${half} 0`;
  return d;
}

function Water({ y = 88 }: { y?: number }) {
  return (
    <g>
      <path className="ln water wave" d={wave(y, 1.6, 16, -32, 272)} />
      <path className="ln th water faint wave-2" d={wave(y + 9, 1.2, 20, -40, 280)} />
      <path className="ln th water wave" style={{ opacity: 0.22 }} d={wave(y + 17, 1, 16, -32, 272)} />
    </g>
  );
}

function zigzag(x1: number, x2: number, top: number, bottom: number, step: number) {
  let d = `M${x1} ${top}`;
  for (let y = top + step, right = true; y <= bottom; y += step, right = !right) d += ` L${right ? x2 : x1} ${y}`;
  return d;
}

function JackUpLeg({ x }: { x: number }) {
  return (
    <g>
      <path className="ln" d={`M${x} 16 V110 M${x + 8} 16 V110`} />
      <path className="ln th" d={zigzag(x, x + 8, 16, 110, 6)} />
      <path className="ln fl ac" d={`M${x - 4} 110 H${x + 12} L${x + 9} 116 H${x - 1} Z`} />
    </g>
  );
}

const DRAWINGS: Record<IllustrationKind, React.ReactNode> = {
  fpso: (
    <>
      <path className="ln ac dash" d="M204 92 L192 119 M208 92 L224 119" />
      <path className="ln fl" d="M14 68 H220 Q229 68 228 76 L222 92 H26 L16 80 Z" />
      <path className="ln th ac dash" d="M202 72 V90 M210 72 V90" />
      <rect className="ln fl" x="22" y="44" width="26" height="24" />
      <rect className="ln fl" x="26" y="36" width="18" height="8" />
      <path className="ln th dash" d="M27 50 H43 M27 56 H43 M27 62 H43" />
      <path className="ln" d="M16 32 H52" />
      <path className="ln th" d="M22 32 L26 36 M46 32 L44 36" />
      <rect className="ln fl" x="56" y="52" width="22" height="16" />
      <rect className="ln fl" x="80" y="46" width="20" height="22" />
      <rect className="ln fl" x="102" y="54" width="20" height="14" />
      <rect className="ln fl" x="124" y="48" width="22" height="20" />
      <rect className="ln fl" x="148" y="52" width="20" height="16" />
      <rect className="ln fl" x="170" y="56" width="16" height="12" />
      <path className="ln th" d="M86 46 V38 M94 46 V41 M130 48 V40 M138 48 V43 M154 52 V46" />
      <path className="ln th" d="M52 63 H190" />
      <path className="ln" d="M194 68 L208 20 M204 68 L212 20" />
      <path className="ln th" d="M196 62 L205 56 L199 50 L208 44 L203 38 L210 32 L206 26 L211.5 21" />
      <path className="ln ac" d="M210 18 q-3 -4 0 -9 q3 5 0 9" />
    </>
  ),
  pipelay: (
    <>
      <path className="ln fl" d="M14 70 H176 V64 H218 Q228 64 228 72 L220 92 H24 L14 80 Z" />
      <path className="ln" d="M36 70 L46 12 M48 70 L56 12 M45 12 H57" />
      <path className="ln th" d="M37.7 60 H49.4 M39.8 48 H51 M41.9 36 H52.7 M43.9 24 H54.3" />
      <path className="ln ac" d="M112 28 Q78 14 51 12 L42 70 L38 92 Q34 108 22 119" />
      <path className="ln" d="M96 70 L112 48 L128 70" />
      <circle className="ln fl ac" cx="112" cy="48" r="20" />
      <circle className="ln th ac dash" cx="112" cy="48" r="14" />
      <circle className="ln ac" cx="112" cy="48" r="5" />
      <rect className="ln fl" x="166" y="58" width="6" height="12" />
      <path className="ln" d="M169 58 L148 34" />
      <path className="ln th" d="M148 34 V46" />
      <rect className="ln fl" x="180" y="42" width="34" height="22" />
      <rect className="ln fl" x="184" y="34" width="26" height="8" />
      <path className="ln th dash" d="M184 48 H210 M184 54 H210" />
      <path className="ln" d="M186 30 H226" />
      <path className="ln th" d="M190 30 V34 M222 30 L214 42" />
    </>
  ),
  tanker: (
    <>
      <path className="ln fl" d="M14 64 H50 V70 H210 V66 H222 Q230 66 229 72 L221 92 H26 L16 80 Z" />
      <path className="ln th ac dash" d="M56 75 H206 V89 H56 Z M81 75 V89 M106 75 V89 M131 75 V89 M156 75 V89 M181 75 V89" />
      <path className="ln fl" d="M21 42 L22 25 H29 L30 42 Z" />
      <rect className="ln fl" x="20" y="42" width="26" height="22" />
      <rect className="ln fl" x="30" y="34" width="16" height="8" />
      <path className="ln" d="M30 34 H50" />
      <path className="ln th dash" d="M24 48 H42 M24 54 H42" />
      <path className="ln th" d="M52 66.5 H208 M64 66.5 V70 M88 66.5 V70 M112 66.5 V70 M160 66.5 V70 M184 66.5 V70" />
      <path className="ln" d="M124 70 V60 M132 70 V60 M121 60 H135" />
      <path className="ln" d="M144 70 V50 L126 43" />
      <path className="ln th" d="M216 66 V50 M212 54 H220" />
    </>
  ),
  tug: (
    <>
      <path className="ln fl" d="M44 70 H150 Q178 70 198 54 L202 57 Q196 78 184 92 H64 Q50 90 46 80 Z" />
      <path className="ln th" d="M46 66 H148 Q174 66 195.5 51 M60 66 V70 M76 66 V70" />
      <path className="ln hv" d="M201 60 Q196 77 186 88 M44.5 71 Q44.5 78 47 83" />
      <path className="ln ac" d="M97 63 L47 64 Q28 68 0 80" />
      <rect className="ln fl" x="88" y="62" width="18" height="8" />
      <circle className="ln th" cx="97" cy="66" r="2.5" />
      <circle className="ln fl" cx="48" cy="66.5" r="2.5" />
      <rect className="ln fl" x="116" y="40" width="5" height="12" />
      <rect className="ln fl" x="116" y="52" width="52" height="18" />
      <path className="ln fl" d="M122 52 L128 36 H162 L166 52 Z" />
      <path className="ln th" d="M130.5 40 H160.5 L162.5 47 H128.5 Z M138.5 40 V47 M146.5 40 V47 M154.5 40 V47" />
      <circle className="ln th" cx="128" cy="61" r="1.8" />
      <circle className="ln th" cx="140" cy="61" r="1.8" />
      <circle className="ln th" cx="152" cy="61" r="1.8" />
      <path className="ln" d="M146 36 V12" />
      <path className="ln th" d="M138 20 H154 M141 14 H151" />
    </>
  ),
  workboat: (
    <>
      <path className="ln fl" d="M30 72 H200 L208 68 L204 80 L198 92 H42 L32 82 Z" />
      <path className="ln th" d="M32 68 H200 M50 68 V72 M86 68 V72 M128 68 V72 M146 68 V72" />
      <path className="ln hv" d="M33 76 H203" />
      <path className="ln" d="M38 72 V65 M42 72 V65" />
      <circle className="ln fl" cx="63" cy="66.5" r="5" />
      <path className="ln fl ac" d="M106 58 L84 29 L88 27 L110 57 Z" />
      <path className="ln fl ac" d="M86 27 L61 40 L62.5 43 L87.5 30.5 Z" />
      <path className="ln th ac" d="M62 42 V56 q0 3 2.5 3" />
      <rect className="ln fl" x="104" y="58" width="8" height="14" />
      <path className="ln" d="M101 58 H115" />
      <rect className="ln fl" x="164" y="50" width="32" height="22" />
      <rect className="ln fl" x="168" y="38" width="26" height="12" />
      <path className="ln th" d="M171 42 H191 V46 H171 Z M178 42 V46 M185 42 V46" />
      <path className="ln th dash" d="M168 58 H192" />
      <path className="ln" d="M182 38 V22" />
      <path className="ln th" d="M176 26 H188" />
    </>
  ),
  "well-intervention": (
    <>
      <path className="ln ac" d="M108 8 V110" />
      <path className="ln ac" d="M101 116 H115 M103.5 116 V110 H112.5 V116" />
      <path className="ln th dot faint" d="M84 117 H132" />
      <path className="ln fl" d="M14 68 H170 V62 H220 Q230 62 229 70 L220 92 H24 L14 80 Z" />
      <path className="ln th dash" d="M102 68 V92 M114 68 V92" />
      <path className="ln ac" d="M108 68 V92" />
      <path className="ln" d="M92 68 L103 8 M124 68 L113 8" />
      <path className="ln th" d="M94.2 56 H121.8 M96.4 44 H119.6 M98.6 32 H117.4 M100.8 20 H115.2" />
      <path className="ln th" d="M92 68 L121.8 56 M124 68 L94.2 56 M94.2 56 L119.6 44 M121.8 56 L96.4 44 M96.4 44 L117.4 32 M119.6 44 L98.6 32 M98.6 32 L115.2 20 M117.4 32 L100.8 20" />
      <rect className="ln fl" x="100" y="3" width="16" height="5" />
      <rect className="ln fl ac" x="103" y="58" width="10" height="10" />
      <rect className="ln fl" x="36" y="56" width="8" height="12" />
      <path className="ln" d="M40 56 L70 26" />
      <path className="ln th" d="M70 26 V42" />
      <rect className="ln fl" x="174" y="36" width="40" height="26" />
      <rect className="ln fl" x="178" y="28" width="32" height="8" />
      <path className="ln th dash" d="M178 43 H210 M178 49 H210 M178 55 H210" />
      <path className="ln" d="M180 24 H230" />
      <path className="ln th" d="M184 24 V28 M226 24 L214 36" />
    </>
  ),
  "jack-up": (
    <>
      <path className="ln th dot faint" d="M0 117 H240" />
      <g className="faint"><JackUpLeg x={120} /></g>
      <JackUpLeg x={72} />
      <JackUpLeg x={168} />
      <path className="ln fl" d="M36 44 H196 L190 56 H42 Z" />
      <rect className="ln fl ac" x="69" y="36" width="14" height="8" />
      <rect className="ln fl ac" x="165" y="36" width="14" height="8" />
      <rect className="ln fl" x="14" y="38" width="52" height="6" />
      <path className="ln" d="M16 38 L23 6 M34 38 L27 6" />
      <path className="ln th" d="M17.75 30 H32.25 M19.5 22 H30.5 M21.25 14 H28.75 M16 38 L32.25 30 M34 38 L17.75 30 M17.75 30 L30.5 22 M32.25 30 L19.5 22" />
      <rect className="ln fl" x="21" y="3" width="8" height="3" />
      <rect className="ln fl" x="134" y="26" width="26" height="18" />
      <path className="ln th dash" d="M137 32 H157 M137 38 H157" />
      <rect className="ln fl" x="182" y="34" width="6" height="10" />
      <path className="ln" d="M185 34 L210 12" />
      <path className="ln th" d="M210 12 V26" />
    </>
  ),
  pontoon: (
    <>
      <path className="ln th dot faint" d="M0 117 H240" />
      <rect className="ln fl ac" x="34" y="26" width="5" height="91" />
      <rect className="ln fl ac" x="201" y="26" width="5" height="91" />
      <path className="ln fl" d="M14 70 H226 L220 92 H20 Z" />
      <path className="ln th" d="M16 74 H224 M74 74 V92 M120 74 V92 M166 74 V92" />
      <circle className="ln th" cx="74" cy="80" r="1.6" />
      <circle className="ln th" cx="120" cy="80" r="1.6" />
      <circle className="ln th" cx="166" cy="80" r="1.6" />
      <rect className="ln fl" x="30" y="60" width="13" height="10" />
      <rect className="ln fl" x="197" y="60" width="13" height="10" />
      <path className="ln th" d="M48 60 H192 M48 60 V70 M72 60 V70 M96 60 V70 M120 60 V70 M144 60 V70 M168 60 V70 M192 60 V70" />
      <path className="ln" d="M20 70 V66 H25 V70 M215 70 V66 H220 V70" />
    </>
  ),
  dredger: (
    <>
      <path className="ln th dot faint" d="M120 117 H240" />
      <rect className="ln fl" x="50" y="24" width="4" height="93" />
      <rect className="ln fl" x="60" y="16" width="4" height="78" />
      <path className="ln" d="M44 79 Q36 83 26 83 H0" />
      <ellipse className="ln fl" cx="30" cy="86" rx="6" ry="3" />
      <ellipse className="ln fl" cx="10" cy="86" rx="6" ry="3" />
      <path className="ln fl" d="M44 72 H188 L196 68 L190 92 H54 L44 82 Z" />
      <rect className="ln fl" x="46" y="62" width="22" height="10" />
      <path className="ln fl ac" d="M172 78 L222 108 L218 114 L168 84 Z" />
      <circle className="ln fl ac" cx="224" cy="112" r="6" />
      <path className="ln th ac" d="M219.5 108.5 Q224 113 228.5 108.5 M218.5 113.5 Q224 118.5 229.5 113.5 M224 106 V118" />
      <path className="ln" d="M178 72 L190 40 M188 72 L194 40 M188 40 H198" />
      <path className="ln th" d="M196 40 L208 99.6" />
      <path className="ln fl" d="M98 56 L100 42 H108 L110 56 Z" />
      <rect className="ln fl" x="88" y="56" width="36" height="16" />
      <rect className="ln fl" x="126" y="46" width="30" height="26" />
      <rect className="ln fl" x="130" y="38" width="26" height="8" />
      <path className="ln th" d="M133 41 H153" />
      <path className="ln th dash" d="M129 54 H153 M129 60 H153" />
    </>
  ),
};

type Props = {
  kind: IllustrationKind;
  // Give a title when the drawing carries meaning on its own; omit it when adjacent text already names the category.
  title?: string;
  tone?: "light" | "dark";
  // Slow continuous wave movement. Reserved for one hero-scale drawing per page; disabled for reduced motion.
  drift?: boolean;
  className?: string;
};

export function MarineIllustration({ kind, title, tone = "light", drift = false, className = "" }: Props) {
  const classes = ["illus", tone === "dark" && "illus-dark", drift && "illus-drift", className].filter(Boolean).join(" ");
  return (
    <svg viewBox={VIEWBOX} className={classes} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} focusable="false" preserveAspectRatio="xMidYMid meet">
      {title && <title>{title}</title>}
      {DRAWINGS[kind]}
      <Water />
    </svg>
  );
}
