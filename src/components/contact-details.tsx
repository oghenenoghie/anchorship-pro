import { Mail, MapPin } from "lucide-react";
import { CONTACT } from "@/lib/company";
// The approved contact details from src/lib/company.ts. "footer" is compact on navy; "panel" adds visible labels on white.
export function ContactDetails({ variant }: { variant: "footer" | "panel" }) {
  const footer = variant === "footer";
  const row = (icon: React.ReactNode, label: string, value: React.ReactNode) => (
    <div className="flex gap-3">
      <span aria-hidden className={`mt-0.5 shrink-0 ${footer ? "text-marine-300" : "text-ocean"}`}>{icon}</span>
      <div className="min-w-0">
        <p className={footer ? "sr-only" : "text-[.72rem] font-bold uppercase tracking-[.16em] text-muted"}>{label}</p>
        <div className={footer ? "" : "mt-1"}>{value}</div>
      </div>
    </div>
  );
  return (
    <address className={`grid gap-4 text-sm not-italic leading-6 ${footer ? "text-on-dark" : "text-ink"}`}>
      {row(<Mail size={16} />, "Email", <a href={`mailto:${CONTACT.email}`} className={footer ? "font-medium text-white underline-offset-4 hover:underline" : "text-link"}>{CONTACT.email}</a>)}
      {row(<MapPin size={16} />, "Office", CONTACT.office.lines.map(line => <span key={line} className="block">{line}</span>))}
    </address>
  );
}
