import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development") {
    return NextResponse.json({ error: "Only available in development" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "No email provided" }, { status: 400 });
  }

  const { prisma } = await import("@/lib/prisma");
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const sessionToken = crypto.randomUUID();
  const expires = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  await prisma.session.create({
    data: {
      sessionToken,
      userId: user.id,
      expires,
    },
  });

  const cookieStore = await cookies();
  const isSecure = request.url.startsWith("https://");
  const cookieName = isSecure ? "__Secure-authjs.session-token" : "authjs.session-token";
  
  cookieStore.set(cookieName, sessionToken, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secure: isSecure,
  });

  return NextResponse.redirect(new URL("/", request.url));
}
