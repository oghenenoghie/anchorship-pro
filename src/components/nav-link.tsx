"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
// Link that marks itself as the current page (also for nested routes such as /vessels/<slug>).
export function NavLink({ href, className = "nav-link", children, onClick }: { href: string; className?: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname();
  const current = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
  return <Link href={href} onClick={onClick} aria-current={current ? "page" : undefined} className={className}>{children}</Link>;
}
