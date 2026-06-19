"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notifyListingReported } from "@/lib/notifications";

interface CreateReportParams {
  targetType: "USER" | "LISTING";
  targetId: string;
  reason: "SPAM" | "FAKE_LISTING" | "HARASSMENT" | "SCAM" | "INAPPROPRIATE_CONTENT" | "OTHER";
  notes?: string;
}

export async function createReport(params: CreateReportParams) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const report = await prisma.report.create({
    data: {
      reporterId: session.user.id,
      targetType: params.targetType,
      ...(params.targetType === "USER" && { targetUserId: params.targetId }),
      ...(params.targetType === "LISTING" && { targetListingId: params.targetId }),
      reason: params.reason,
      notes: params.notes || null,
    },
  });

  // Notify listing owner if it's a listing report
  if (params.targetType === "LISTING") {
    const listing = await prisma.listing.findUnique({
      where: { id: params.targetId },
    });
    if (listing) {
      await notifyListingReported(listing.userId, listing.title);
    }
  }

  return report;
}
