import NextAuth from "next-auth";
import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";
import Google from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import { BENNETT_EMAIL_DOMAIN, DEFAULT_ADMIN_EMAILS } from "@/lib/constants";
import { parseBennettEmail } from "@/lib/academic/parser";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID!,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET!,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER!,
      allowDangerousEmailAccountLinking: true, // Allow linking if they have the same email (though unlikely here)
    }),
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      allowDangerousEmailAccountLinking: true,
    })
  ],
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "microsoft-entra-id") {
        if (!user.email?.endsWith(BENNETT_EMAIL_DOMAIN)) {
          return false;
        }
      } else if (account?.provider === "google") {
        // If they try to use Google with a Bennett email, block them (force Microsoft)
        if (user.email?.endsWith(BENNETT_EMAIL_DOMAIN)) {
          return "/auth/signin?error=UseMicrosoft";
        }
      }
      return true;
    },
    async session({ session, user }) {
      if (session.user && user) {
        const adapterUser = user as unknown as { role?: string, id?: string, isOnboarded?: boolean, isSuspended?: boolean, isBanned?: boolean, studentStatus?: string, isProfileComplete?: boolean };
        
        if (adapterUser.role !== undefined) {
          session.user.id = adapterUser.id as string;
          session.user.role = adapterUser.role as "USER" | "ADMIN";
          session.user.isOnboarded = adapterUser.isOnboarded ?? false;
          session.user.isSuspended = adapterUser.isSuspended ?? false;
          session.user.isBanned = adapterUser.isBanned ?? false;
          session.user.studentStatus = (adapterUser.studentStatus as "PENDING_VERIFICATION" | "VERIFIED" | undefined) ?? "PENDING_VERIFICATION";
          session.user.isProfileComplete = adapterUser.isProfileComplete ?? false;
        } else {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { id: true, role: true, isOnboarded: true, isSuspended: true, isBanned: true, studentStatus: true, isProfileComplete: true },
          });
          if (dbUser) {
            session.user.id = dbUser.id;
            session.user.role = dbUser.role;
            session.user.isOnboarded = dbUser.isOnboarded;
            session.user.isSuspended = dbUser.isSuspended;
            session.user.isBanned = dbUser.isBanned;
            session.user.studentStatus = dbUser.studentStatus;
            session.user.isProfileComplete = dbUser.isProfileComplete;
          }
        }
      }
      return session;
    },
  },
  events: {
    async linkAccount({ user, account, profile }) {
      if (account.provider === "microsoft-entra-id") {
        const profileData = profile as Record<string, unknown>;
        const bennettEmail = profileData?.email || profileData?.preferred_username;
        if (bennettEmail && typeof bennettEmail === "string" && bennettEmail.endsWith(BENNETT_EMAIL_DOMAIN)) {
          // Update user to verified and set email to bennett email
          await prisma.user.update({
            where: { id: user.id },
            data: { 
              email: bennettEmail,
              studentStatus: "VERIFIED",
              authProvider: "GOOGLE_MICROSOFT"
            },
          });

          const parsed = parseBennettEmail(bennettEmail);
          if (parsed) {
            // Update or create profile with academic info
            await prisma.profile.upsert({
              where: { userId: user.id as string },
              create: {
                userId: user.id as string,
                admissionYear: parsed.admissionYear,
                programCode: parsed.programCode,
                rollNumber: parsed.rollNumber,
              },
              update: {
                admissionYear: parsed.admissionYear,
                programCode: parsed.programCode,
                rollNumber: parsed.rollNumber,
              }
            });
          }
        }
      }
    },
    async createUser({ user }) {
      // Check if it's a Bennett email
      if (user.email?.endsWith(BENNETT_EMAIL_DOMAIN)) {
        await prisma.user.update({
          where: { id: user.id },
          data: { studentStatus: "VERIFIED", authProvider: "MICROSOFT" },
        });

        const parsed = parseBennettEmail(user.email);
        if (parsed) {
          // Auto-generate profile
          await prisma.profile.create({
            data: {
              userId: user.id as string,
              admissionYear: parsed.admissionYear,
              programCode: parsed.programCode,
              rollNumber: parsed.rollNumber,
            },
          });
        }
      }
    },
    async signIn({ user }) {
      // Update lastLoginAt
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });
      } catch {
        // Ignore if user not fully created yet
      }

      // Auto-promote users to ADMIN based on ADMIN_EMAILS environment variable and defaults
      const envAdminEmails = (process.env.ADMIN_EMAILS || "")
        .split(",")
        .map((e) => e.trim().toLowerCase())
        .filter(Boolean);
      const adminEmails = Array.from(
        new Set([...DEFAULT_ADMIN_EMAILS.map((e) => e.toLowerCase()), ...envAdminEmails])
      );

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
