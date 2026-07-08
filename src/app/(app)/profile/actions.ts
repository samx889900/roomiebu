"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { UpdateProfileFormData } from "@/lib/validators/profile";

export async function getProfile() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });
}

export async function updateProfile(data: UpdateProfileFormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await prisma.profile.update({
    where: { userId: session.user.id },
    data: {
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.gender !== undefined && { gender: data.gender }),
      ...(data.dob !== undefined && { dob: new Date(data.dob) }),

      ...(data.smoking !== undefined && { smoking: data.smoking }),
      ...(data.vaping !== undefined && { vaping: data.vaping }),
      ...(data.drinking !== undefined && { drinking: data.drinking }),
      ...(data.otherHabits !== undefined && { otherHabits: data.otherHabits }),
      ...(data.sleepSchedule !== undefined && { sleepSchedule: data.sleepSchedule }),
      ...(data.cleanlinessLevel !== undefined && { cleanlinessLevel: data.cleanlinessLevel }),
      ...(data.studyEnvironment !== undefined && { studyEnvironment: data.studyEnvironment }),
      ...(data.guestsPreference !== undefined && { guestsPreference: data.guestsPreference }),
      ...(data.languages !== undefined && { languages: data.languages }),
      ...(data.aboutMe !== undefined && { aboutMe: data.aboutMe }),
      ...(data.profilePhoto !== undefined && { profilePhoto: data.profilePhoto }),
      ...(data.accommodationType !== undefined && { accommodationType: data.accommodationType }),
    },
  });

  revalidatePath("/profile");
}
