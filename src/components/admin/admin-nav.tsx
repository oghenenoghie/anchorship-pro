"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Icons arrive as rendered elements from the server layout (components cannot cross the server/client boundary).
export function AdminNav({ links }: { links: { label: string; href: string; icon: React.ReactNode }[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Admin">
      <ul className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:py-4">
        {links.map(l => {
          const current = l.href === "/admin" ? pathname === "/admin" : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <li key={l.href} className="shrink-0">
              <Link href={l.href} aria-current={current ? "page" : undefined} className={`flex min-h-10 items-center gap-3 rounded-[4px] px-3 py-2 text-sm font-medium transition-colors ${current ? "bg-white/10 text-white shadow-[inset_2px_0_0_#22A6A1]" : "text-[#c5d3dc] hover:bg-white/5 hover:text-white"}`}>
                <span aria-hidden className={current ? "text-marine-300" : "text-[#8DA2B2]"}>{l.icon}</span>{l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
