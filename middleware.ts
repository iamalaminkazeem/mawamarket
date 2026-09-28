import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== "/admin/login";
  const isAccountRoute =
    pathname.startsWith("/account") &&
    pathname !== "/account/login" &&
    pathname !== "/account/register";

  if (isAdminRoute && (!token || token.role !== "admin")) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (isAccountRoute && (!token || token.role !== "customer")) {
    const loginUrl = new URL("/account/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
