import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { requireDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
const COOKIE = "anchorship_session";
function secret() { const value=process.env.AUTH_SECRET; if(!value || value.length<32) throw new Error("AUTH_SECRET must be at least 32 characters"); return new TextEncoder().encode(value); }
export type SessionUser={id:string,email:string,name:string,role:"super_admin"|"editor"|"sales"|"enquiry_manager"};
export async function createSession(user:SessionUser) { const token=await new SignJWT(user).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(secret()); const jar=await cookies(); jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:8*60*60}); }
export async function destroySession(){const jar=await cookies();jar.delete(COOKIE);}
export async function getSession():Promise<SessionUser|null>{try{const jar=await cookies();const token=jar.get(COOKIE)?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());if(!payload.id||!payload.email||!payload.role)return null;return {id:String(payload.id),email:String(payload.email),name:String(payload.name||"Admin"),role:payload.role as SessionUser["role"]};}catch{return null;}}
export async function requireUser(){const user=await getSession();if(!user)redirect("/admin/login");const db=requireDb();const [record]=await db.select({active:adminUsers.active,role:adminUsers.role,name:adminUsers.name,email:adminUsers.email}).from(adminUsers).where(eq(adminUsers.id,user.id)).limit(1);if(!record?.active){await destroySession();redirect("/admin/login");}return {...user,role:record.role,name:record.name,email:record.email};}
export async function requireRole(roles:SessionUser["role"][]){const user=await requireUser();if(!roles.includes(user.role))redirect("/admin?error=forbidden");return user;}
