import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "huit-data-ventures-secret-key-2026"
);

const PUBLIC = ["/", "/login", "/signup", "/api/auth", "/api/stripe/webhook", "/_next", "/favicon"];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  if (PUBLIC.some(p => path.startsWith(p))) return NextResponse.next();
  const token = request.cookies.get("hdv_session")?.value;
  if (!token) return NextResponse.redirect(new URL("/login", request.url));
  try { await jwtVerify(token, JWT_SECRET); return NextResponse.next(); }
  catch { return NextResponse.redirect(new URL("/login", request.url)); }
}

export const config = { matcher: ["/dashboard/:path*"] };
