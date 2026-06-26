import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { BENNETT_EMAIL_DOMAIN } from "@/lib/constants";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user }) {
      if (!user.email?.endsWith(BENNETT_EMAIL_DOMAIN)) {
        return false;
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user && user) {
        // The 'user' parameter here comes directly from the Prisma Adapter's database fetch
        // which retrieves all columns for the User table.
        const adapterUser = user as unknown as Record<string, any>;
        
        // We still do a fallback DB fetch just in case the adapter strips fields in future Auth.js versions
        if (adapterUser.role !== undefined) {
          session.user.id = adapterUser.id;
          session.user.role = adapterUser.role;
          session.user.isOnboarded = adapterUser.isOnboarded;
          session.user.isSuspended = adapterUser.isSuspended;
          session.user.isBanned = adapterUser.isBanned;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, role: true, isOnboarded: true, isSuspended: true, isBanned: true },
          });
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
            session.user.isOnboarded = dbUser.isOnboarded;
            session.user.isSuspended = dbUser.isSuspended;
            session.user.isBanned = dbUser.isBanned;
          }
        }
      }
      return session;
    },
  },
  events: {
    async createUser({ user }) {
      // Try to fetch Microsoft profile image for the user
      if (user.image) {
        await prisma.user.update({
          where: { id: user.id },
          data: { image: user.image },
        });
      }
    },
    async signIn({ user }) {
      // Auto-promote users to ADMIN based on ADMIN_EMAILS environment variable
      const adminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);

      if (user.email && adminEmails.includes(user.email.toLowerCase())) {
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: { role: true },
        });
        
        if (dbUser && dbUser.role !== "ADMIN") {
          await prisma.user.update({
            where: { id: user.id },
            data: { role: "ADMIN" },
          });
        }
      }
    },
  },
  session: {
    strategy: "database",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60,   // 24 hours
  },
  debug: process.env.NODE_ENV === "development",
});
