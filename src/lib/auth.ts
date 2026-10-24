import { cache } from "react";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { requireDb } from "@/db";
import { adminUsers } from "@/db/schema";
import { eq } from "drizzle-orm";
import { passwordStamp } from "@/lib/session-stamp";
const COOKIE = "anchorship_session";
function secretValue() { const value=process.env.AUTH_SECRET; if(!value || value.length<32) throw new Error("AUTH_SECRET must be at least 32 characters"); return value; }
function secret() { return new TextEncoder().encode(secretValue()); }
export type SessionUser={id:string,email:string,name:string,role:"super_admin"|"editor"|"sales"|"enquiry_manager"};
type Session=SessionUser&{stamp:string};
// passwordHash is the account's current hash: the session is only valid while that hash is unchanged (see session-stamp.ts).
export async function createSession(user:SessionUser,passwordHash:string) { const token=await new SignJWT({...user,ps:passwordStamp(passwordHash,secretValue())}).setProtectedHeader({alg:"HS256"}).setIssuedAt().setExpirationTime("8h").sign(secret()); const jar=await cookies(); jar.set(COOKIE,token,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:8*60*60}); }
export async function destroySession(){const jar=await cookies();jar.delete(COOKIE);}
// Reads the signed cookie only. Tokens without a password stamp (issued before stamps existed) are not accepted.
export async function getSession():Promise<Session|null>{try{const jar=await cookies();const token=jar.get(COOKIE)?.value;if(!token)return null;const {payload}=await jwtVerify(token,secret());if(!payload.id||!payload.email||!payload.role||typeof payload.ps!=="string")return null;return {id:String(payload.id),email:String(payload.email),name:String(payload.name||"Admin"),role:payload.role as SessionUser["role"],stamp:payload.ps};}catch{return null;}}
// The session's account as it is now: null when there is no session, the account is inactive, or the password has
// changed since the session was issued. Role, name and email come from the database, not the token.
// Cached per request so the admin layout and page share one database lookup.
export const getActiveUser=cache(async function getActiveUser():Promise<SessionUser|null>{const session=await getSession();if(!session)return null;const [record]=await requireDb().select({active:adminUsers.active,role:adminUsers.role,name:adminUsers.name,email:adminUsers.email,passwordHash:adminUsers.passwordHash}).from(adminUsers).where(eq(adminUsers.id,session.id)).limit(1);if(!record?.active||passwordStamp(record.passwordHash,secretValue())!==session.stamp)return null;return {id:session.id,role:record.role,name:record.name,email:record.email};});
// Server Components cannot change cookies, so a stale cookie is left in place; it is refused on every request and replaced at the next sign-in.
export async function requireUser(){const user=await getActiveUser();if(!user)redirect("/admin/login");return user;}
export async function requireRole(roles:SessionUser["role"][]){const user=await requireUser();if(!roles.includes(user.role))redirect("/admin?error=forbidden");return user;}
// API-route counterpart of requireRole. A deactivated or downgraded account, or a session from before a password change, is refused before the token expires.
export async function requireApiRole(roles:SessionUser["role"][]):Promise<{user:SessionUser;error?:never}|{user?:never;error:NextResponse}>{const session=await getSession();if(!session)return {error:NextResponse.json({error:"Authentication required."},{status:401})};const user=await getActiveUser();if(!user)return {error:NextResponse.json({error:"Your session has ended. Sign in again."},{status:401})};if(!roles.includes(user.role))return {error:NextResponse.json({error:"Insufficient permissions."},{status:403})};return {user};}
