import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import {
  IELTS_SESSION_COOKIE,
  verifyIeltsSessionToken,
} from "@/lib/auth/session";

const LOGIN_PATH = "/ielts/login";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === LOGIN_PATH) {
    return NextResponse.next();
  }

  // Fail closed: a misconfigured/missing IELTS_AUTH_SECRET must not 500
  // the whole /ielts area — send the learner to /ielts/login, where
  // trying to log in surfaces the real "not configured" error instead.
  const ok = await verifyIeltsSessionToken(
    request.cookies.get(IELTS_SESSION_COOKIE)?.value,
  ).catch(() => false);
  if (ok) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", pathname);
  return NextResponse.redirect(loginUrl);
}

// Only the /ielts area is gated — the rest of the site (portfolio) stays public.
export const config = {
  matcher: ["/ielts", "/ielts/:path*"],
};
