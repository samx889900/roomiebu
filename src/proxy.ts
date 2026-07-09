import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const publicPaths = ["/", "/auth/signin", "/auth/error", "/api/dev-login", "/terms", "/privacy", "/contact"];
const authApiPrefix = "/api/auth";
const adminPrefix = "/admin";
const onboardingPath = "/onboarding";

export default async function middleware(request: NextRequest) {
  console.log("PROXY MIDDLEWARE RAN: ", request.nextUrl.pathname);
  const { pathname } = request.nextUrl;

  // Allow auth API routes
  if (pathname.startsWith(authApiPrefix)) {
    return NextResponse.next();
  }

  const session = await auth();

  // If user is already authenticated and tries to access signin or landing page, redirect them to app
  if (session?.user && (pathname === "/" || pathname === "/auth/signin")) {
    if (!session.user.isOnboarded) {
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  // Allow public paths for non-authenticated users
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // Not authenticated — redirect to sign in
  if (!session?.user) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Banned users
  if (session.user.isBanned) {
    return NextResponse.redirect(new URL("/auth/error?error=Banned", request.url));
  }

  // Suspended users
  if (session.user.isSuspended) {
    return NextResponse.redirect(new URL("/auth/error?error=Suspended", request.url));
  }

  // Not onboarded — redirect to onboarding (allow access to onboarding page itself)
  if (!session.user.isOnboarded) {
    if (pathname !== onboardingPath) {
      return NextResponse.redirect(new URL(onboardingPath, request.url));
    }
  } else if (session.user.isOnboarded) {
    if (pathname === onboardingPath) {
      return NextResponse.redirect(new URL("/listings", request.url));
    }
  }

  // Admin routes — require ADMIN role
  if (pathname.startsWith(adminPrefix) && session.user.role !== "ADMIN") {
    return NextResponse.redirect(new URL("/listings", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Public assets
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)",
  ],
};
