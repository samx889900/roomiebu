"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user?.id || session.user.role !== "ADMIN") {
    throw new Error("Admin access required");
  }
  return session;
}

export async function getAdminStats() {
  await requireAdmin();

  const [totalUsers, totalListings, activeListings, totalMatches, pendingReports] =
    await Promise.all([
      prisma.user.count(),
      prisma.listing.count({ where: { deletedAt: null } }),
      prisma.listing.count({ where: { status: "ACTIVE" } }),
      prisma.match.count(),
      prisma.report.count({ where: { isResolved: false } }),
    ]);

  return { totalUsers, totalListings, activeListings, totalMatches, pendingReports };
}

export async function getAdminReports(filter?: { resolved?: boolean }) {
  await requireAdmin();

  return prisma.report.findMany({
    where: filter?.resolved !== undefined ? { isResolved: filter.resolved } : {},
    orderBy: { createdAt: "desc" },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      targetUser: { select: { id: true, name: true, email: true } },
      targetListing: { select: { id: true, title: true } },
    },
  });
}

export async function resolveReport(reportId: string, action: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.report.update({
      where: { id: reportId },
      data: { isResolved: true },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "RESOLVE_REPORT",
        reportId,
        reason: action,
      },
    }),
  ]);

  revalidatePath("/admin/reports");
}

export async function suspendUser(userId: string, reason: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isSuspended: true },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "SUSPEND_USER",
        targetUserId: userId,
        reason,
      },
    }),
  ]);

  revalidatePath("/admin/users");
}

export async function banUser(userId: string, reason: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isBanned: true },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "BAN_USER",
        targetUserId: userId,
        reason,
      },
    }),
  ]);

  revalidatePath("/admin/users");
}

export async function restoreUser(userId: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { isSuspended: false, isBanned: false },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "RESTORE_USER",
        targetUserId: userId,
      },
    }),
  ]);

  revalidatePath("/admin/users");
}

export async function adminRemoveListing(listingId: string, reason: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.listing.update({
      where: { id: listingId },
      data: { status: "DELETED", deletedAt: new Date() },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "REMOVE_LISTING",
        targetListingId: listingId,
        reason,
      },
    }),
  ]);

  revalidatePath("/admin/listings");
}

export async function adminRestoreListing(listingId: string) {
  const session = await requireAdmin();

  await prisma.$transaction([
    prisma.listing.update({
      where: { id: listingId },
      data: { status: "ACTIVE", deletedAt: null },
    }),
    prisma.adminAction.create({
      data: {
        adminId: session.user.id,
        actionType: "RESTORE_LISTING",
        targetListingId: listingId,
      },
    }),
  ]);

  revalidatePath("/admin/users");
  revalidatePath("/admin/listings");
}

export async function deleteUser(id: string) {
  await requireAdmin();

  // Deleting the user will cascade delete their profile, listings, interests, matches, and notifications.
  // It will set targetUserId to null in reports against them.
  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin/users/profiles");
}

export async function getAdminUserById(id: string) {
  await requireAdmin();

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      profile: true,
      _count: { 
        select: { 
          listings: true, 
          matchesAsA: true, 
          matchesAsB: true,
          interests: true,
          reportsAgainst: true
        } 
      },
    },
  });

  if (!user) return null;

  const interestsReceived = await prisma.listingInterest.count({
    where: { listing: { userId: id } }
  });

  return { ...user, interestsReceived };
}

export async function getAdminUsers(search?: string) {
  await requireAdmin();

  return prisma.user.findMany({
    where: search
      ? {
          OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      role: true,
      isBanned: true,
      isSuspended: true,
      createdAt: true,
      _count: { select: { listings: true, matchesAsA: true, matchesAsB: true } },
    },
  });
}

export async function getAdminUserProfiles() {
  await requireAdmin();

  return prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      profile: true,
    },
  });
}

export async function getAdminListings() {
  await requireAdmin();

  return prisma.listing.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: { select: { id: true, name: true, email: true } },
      _count: { select: { interests: true, matches: true } },
    },
  });
}

export async function getAnalytics() {
  await requireAdmin();

  const [
    hostelCount,
    flatCount,
    maleCount,
    femaleCount,
    otherCount,
    recentListings,
    topLocations,
    statusStats,
    programStats,
    batchStats,
    authProviderStats
  ] = await Promise.all([
    prisma.listing.count({ where: { accommodationType: "HOSTEL", deletedAt: null } }),
    prisma.listing.count({ where: { accommodationType: "FLAT", deletedAt: null } }),
    prisma.profile.count({ where: { gender: "MALE" } }),
    prisma.profile.count({ where: { gender: "FEMALE" } }),
    prisma.profile.count({ where: { gender: "OTHER" } }),
    prisma.listing.findMany({
      where: { deletedAt: null },
      orderBy: { createdAt: "desc" },
      take: 30,
      select: { accommodationType: true, createdAt: true },
    }),
    prisma.listing.groupBy({
      by: ["location"],
      where: { location: { not: null }, deletedAt: null },
      _count: { location: true },
      orderBy: { _count: { location: "desc" } },
      take: 10,
    }),
    prisma.user.groupBy({
      by: ["studentStatus"],
      _count: { studentStatus: true }
    }),
    prisma.profile.groupBy({
      by: ["programCode"],
      where: { programCode: { not: null } },
      _count: { programCode: true }
    }),
    prisma.profile.groupBy({
      by: ["admissionYear"],
      where: { admissionYear: { not: null } },
      _count: { admissionYear: true }
    }),
    prisma.user.groupBy({
      by: ["authProvider"],
      _count: { authProvider: true }
    })
  ]);

  return {
    demand: { hostel: hostelCount, flat: flatCount },
    gender: { male: maleCount, female: femaleCount, other: otherCount },
    recentListings,
    topLocations: topLocations.map((l) => ({
      location: l.location || "Unknown",
      count: l._count.location,
    })),
    statusStats: statusStats.reduce((acc, curr) => ({ ...acc, [curr.studentStatus]: curr._count.studentStatus }), {}),
    programStats: programStats.reduce((acc, curr) => ({ ...acc, [curr.programCode!]: curr._count.programCode }), {}),
    batchStats: batchStats.reduce((acc, curr) => ({ ...acc, [curr.admissionYear!]: curr._count.admissionYear }), {}),
    authProviderStats: authProviderStats.reduce((acc, curr) => ({ ...acc, [curr.authProvider]: curr._count.authProvider }), {} as Record<string, number>),
  };
}
