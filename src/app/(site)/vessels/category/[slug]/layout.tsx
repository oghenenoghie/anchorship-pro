import { notFound } from "next/navigation";
import { getVesselCategory } from "@/lib/vessel-categories";
// Rejects unknown category slugs here, outside the page's loading boundary, so they get a real 404 status.
export default async function CategoryLayout({ children, params }: { children: React.ReactNode; params: Promise<{ slug: string }> }) {
  if (!getVesselCategory((await params).slug)) notFound();
  return children;
}
