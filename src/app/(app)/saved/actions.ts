"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function saveListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.savedListing.upsert({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
    create: { userId: session.user.id, listingId },
    update: {},
  });

  revalidatePath("/saved");
  revalidatePath("/listings");
}

export async function unsaveListing(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.savedListing.deleteMany({
    where: { userId: session.user.id, listingId },
  });

  revalidatePath("/saved");
  revalidatePath("/listings");
}

export async function getSavedListings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.savedListing.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: {
          user: { include: { profile: true } },
          _count: { select: { interests: true } },
        },
      },
    },
  });
}

export async function isListingSaved(listingId: string) {
  const session = await auth();
  if (!session?.user?.id) return false;

  const saved = await prisma.savedListing.findUnique({
    where: {
      userId_listingId: {
        userId: session.user.id,
        listingId,
      },
    },
  });

  return !!saved;
}
