"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  notifyNewInterest,
  notifyInterestAccepted,
  notifyInterestRejected,
  notifyListingFilled,
} from "@/lib/notifications";
import { getRemainingSpots } from "@/lib/utils";

export async function expressInterest(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({
    where: { id: listingId },
    include: { user: { include: { profile: true } } },
  });

  if (!listing || listing.status !== "ACTIVE") throw new Error("Listing not available");
  if (listing.userId === session.user.id) throw new Error("Cannot express interest in own listing");

  const currentUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (
    listing.accommodationType === "HOSTEL" && 
    listing.user.profile?.gender && 
    currentUser?.profile?.gender && 
    listing.user.profile.gender !== currentUser.profile.gender
  ) {
    throw new Error("Hostel accommodation is available only for students of the same gender.");
  }

  // Check if already expressed interest
  const existing = await prisma.listingInterest.findUnique({
    where: {
      listingId_interestedUserId: {
        listingId,
        interestedUserId: session.user.id,
      },
    },
  });

  if (existing) throw new Error("Already expressed interest");

  await prisma.listingInterest.create({
    data: {
      listingId,
      interestedUserId: session.user.id,
    },
  });

  // Notify listing owner
  await notifyNewInterest(
    listing.userId,
    session.user.name || "A student",
    listing.title
  );

  revalidatePath("/interests");
  revalidatePath(`/listings/${listingId}`);
}

export async function acceptInterest(interestId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const interest = await prisma.listingInterest.findUnique({
    where: { id: interestId },
    include: {
      listing: true,
      interestedUser: true,
    },
  });

  if (!interest) throw new Error("Interest not found");
  if (interest.listing.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.$transaction([
    // Update interest status
    prisma.listingInterest.update({
      where: { id: interestId },
      data: { status: "ACCEPTED" },
    }),
    // Create match
    prisma.match.create({
      data: {
        listingId: interest.listingId,
        userAId: session.user.id,
        userBId: interest.interestedUserId,
      },
    }),
    // Increment spots filled
    prisma.listing.update({
      where: { id: interest.listingId },
      data: { spotsFilled: { increment: 1 } },
    }),
  ]);

  // Check if listing is now full
  const updatedListing = await prisma.listing.findUnique({
    where: { id: interest.listingId },
  });

  if (updatedListing && getRemainingSpots(updatedListing.numberRequired, updatedListing.spotsFilled) <= 0) {
    await prisma.listing.update({
      where: { id: interest.listingId },
      data: { status: "FILLED" },
    });
    await notifyListingFilled(session.user.id, interest.listing.title);
  }

  // Notify interested user
  await notifyInterestAccepted(
    interest.interestedUserId,
    session.user.name || "The listing owner",
    interest.listing.title
  );

  revalidatePath("/interests");
  revalidatePath("/matches");
}

export async function rejectInterest(interestId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const interest = await prisma.listingInterest.findUnique({
    where: { id: interestId },
    include: { listing: true },
  });

  if (!interest) throw new Error("Interest not found");
  if (interest.listing.userId !== session.user.id) throw new Error("Unauthorized");

  await prisma.listingInterest.update({
    where: { id: interestId },
    data: { status: "REJECTED" },
  });

  await notifyInterestRejected(interest.interestedUserId, interest.listing.title);

  revalidatePath("/interests");
}

export async function getReceivedInterests() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.listingInterest.findMany({
    where: {
      listing: { userId: session.user.id },
    },
    orderBy: { createdAt: "desc" },
    include: {
      listing: true,
      interestedUser: {
        include: { profile: true },
      },
    },
  });
}

export async function getSentInterests() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.listingInterest.findMany({
    where: { interestedUserId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      status: true,
      createdAt: true,
      listing: {
        select: {
          id: true,
          title: true,
          user: { select: { name: true } },
        },
      },
    },
  });
}
