import type { SessionUser } from "@/lib/auth";
// Roles allowed per admin section. Pages enforce these with requireRole(); the sidebar uses them only to hide links a
// user cannot open. API routes enforce their own role lists with requireApiRole().
type Role = SessionUser["role"];
export const ADMIN_ACCESS = {
  vessels: ["super_admin", "editor", "sales"],
  equipment: ["super_admin", "editor"],
  services: ["super_admin", "editor"],
  enquiries: ["super_admin", "editor", "sales", "enquiry_manager"],
  settings: ["super_admin"],
} satisfies Record<string, Role[]>;
export function canAccess(role: Role, section: keyof typeof ADMIN_ACCESS) { return (ADMIN_ACCESS[section] as Role[]).includes(role); }
export const ROLE_LABELS: Record<Role, string> = { super_admin: "Super admin", editor: "Editor", sales: "Sales", enquiry_manager: "Enquiry manager" };
