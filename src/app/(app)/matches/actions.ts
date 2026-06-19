"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getMatches() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.match.findMany({
    where: {
      OR: [
        { userAId: session.user.id },
        { userBId: session.user.id },
      ],
    },
    orderBy: { acceptedAt: "desc" },
    include: {
      listing: true,
      userA: { include: { profile: true } },
      userB: { include: { profile: true } },
    },
  });
}
