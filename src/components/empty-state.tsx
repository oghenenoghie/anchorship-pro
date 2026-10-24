import { MarineIllustration } from "@/components/marine-illustration";
import type { IllustrationKind } from "@/lib/vessel-categories";
type Props = { title: string; children?: React.ReactNode; illustration?: IllustrationKind; icon?: React.ReactNode; actions?: React.ReactNode; as?: "h2" | "h3"; className?: string };
// Designed empty/error state: says what is missing and offers a useful next step. Never fills the gap with sample data.
export function EmptyState({ title, children, illustration, icon, actions, as: Tag = "h2", className = "" }: Props) {
  return (
    <div className={`panel bg-blueprint px-6 py-12 text-center sm:px-10 ${className}`}>
      {illustration && <div className="mx-auto w-full max-w-[280px]"><MarineIllustration kind={illustration} /></div>}
      {!illustration && icon && <div aria-hidden className="mx-auto grid h-14 w-14 place-items-center rounded-md border border-line bg-white text-ocean">{icon}</div>}
      <Tag className="mt-6 font-display text-xl font-bold">{title}</Tag>
      {children && <div className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted">{children}</div>}
      {actions && <div className="mt-7 flex flex-wrap justify-center gap-3">{actions}</div>}
    </div>
  );
}
