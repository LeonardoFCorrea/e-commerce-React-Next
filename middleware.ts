import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const logged = req.cookies.get("admin-auth");
  const isLogin = req.nextUrl.pathname === "/admin/login";

  if (!logged && req.nextUrl.pathname.startsWith("/admin") && !isLogin) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
