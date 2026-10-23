type Props = { eyebrow?: string; title: React.ReactNode; description?: React.ReactNode; action?: React.ReactNode; id?: string; as?: "h1" | "h2" | "h3"; tone?: "light" | "dark"; className?: string };
// Section title block: eyebrow, controlled heading size, optional lead text and a right-aligned action on wide screens.
export function SectionHeading({ eyebrow, title, description, action, id, as: Tag = "h2", tone = "light", className = "" }: Props) {
  return (
    <div className={`flex flex-col gap-6 md:flex-row md:items-end md:justify-between ${className}`}>
      <div className="max-w-2xl">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Tag id={id} className="mt-3 font-display text-[1.75rem] font-bold leading-[1.15] tracking-tight md:text-[2.125rem]">{title}</Tag>
        {description && <p className={`mt-4 text-base leading-7 md:text-[1.0625rem] ${tone === "dark" ? "text-on-dark" : "text-muted"}`}>{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
