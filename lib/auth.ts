import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "huit-data-ventures-secret-key-2026"
);

export interface SessionUser {
  id: string; email: string; product: string;
  subscriptionId: string; status: string;
}

export async function createSession(user: SessionUser): Promise<string> {
  return new SignJWT(user as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt().setExpirationTime("30d").sign(JWT_SECRET);
}

export async function getSession(): Promise<SessionUser | null> {
  try {
    const token = cookies().get("hdv_session")?.value;
    if (!token) return null;
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as SessionUser;
  } catch { return null; }
}

export async function destroySession() { cookies().delete("hdv_session"); }
