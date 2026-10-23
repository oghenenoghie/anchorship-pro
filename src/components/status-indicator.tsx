import type { StatusTone } from "@/lib/labels";
const DOT: Record<StatusTone, string> = { positive: "bg-marine", info: "bg-ocean", warning: "bg-[#D08A0C]", neutral: "bg-[#8C9DAB]", danger: "bg-[#B42318]" };
// Restrained status label: coloured dot + text, so state never depends on colour alone.
export function StatusIndicator({ label, tone, variant = "plain", className = "" }: { label: string; tone: StatusTone; variant?: "plain" | "pill" | "dark"; className?: string }) {
  const look = variant === "pill" ? "rounded-[3px] border border-line bg-white/95 px-2 py-1 text-ink shadow-card" : variant === "dark" ? "text-white" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap text-xs font-semibold ${look} ${className}`}>
      <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${DOT[tone]} ${variant === "dark" && tone === "info" ? "!bg-marine-300" : ""}`} />{label}
    </span>
  );
}
