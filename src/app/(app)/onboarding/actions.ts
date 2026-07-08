"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { profileSchema, type ProfileFormData } from "@/lib/validators/profile";
import { revalidatePath } from "next/cache";

export async function completeOnboarding(data: ProfileFormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = profileSchema.parse(data);

  const sessionUser = await prisma.user.findUnique({ where: { id: session.user.id } });
  
  if (validated.customName && sessionUser?.studentStatus === "PENDING_VERIFICATION") {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { name: validated.customName },
    });
  }

  const currentYear = new Date().getFullYear();

  await prisma.$transaction([
    prisma.profile.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        phone: validated.phone,
        gender: validated.gender,
        dob: validated.dob ? new Date(validated.dob) : null,
        smoking: validated.smoking,
        vaping: validated.vaping,
        drinking: validated.drinking,
        otherHabits: validated.otherHabits || null,
        sleepSchedule: validated.sleepSchedule,
        cleanlinessLevel: validated.cleanlinessLevel,
        studyEnvironment: validated.studyEnvironment,
        guestsPreference: validated.guestsPreference,
        languages: validated.languages,
        aboutMe: validated.aboutMe || null,
        profilePhoto: validated.profilePhoto || null,
        accommodationType: validated.accommodationType,
        ...(sessionUser?.studentStatus === "PENDING_VERIFICATION" && validated.programCode
          ? { programCode: validated.programCode.toLowerCase(), admissionYear: currentYear }
          : {}),
      },
      update: {
        phone: validated.phone,
        gender: validated.gender,
        dob: validated.dob ? new Date(validated.dob) : null,
        smoking: validated.smoking,
        vaping: validated.vaping,
        drinking: validated.drinking,
        otherHabits: validated.otherHabits || null,
        sleepSchedule: validated.sleepSchedule,
        cleanlinessLevel: validated.cleanlinessLevel,
        studyEnvironment: validated.studyEnvironment,
        guestsPreference: validated.guestsPreference,
        languages: validated.languages,
        aboutMe: validated.aboutMe || null,
        profilePhoto: validated.profilePhoto || null,
        accommodationType: validated.accommodationType,
        ...(sessionUser?.studentStatus === "PENDING_VERIFICATION" && validated.programCode
          ? { programCode: validated.programCode.toLowerCase(), admissionYear: currentYear }
          : {}),
      },
    }),
    prisma.user.update({
      where: { id: session.user.id },
      data: { 
        isOnboarded: true,
        isProfileComplete: true
      },
    }),
  ]);

  revalidatePath("/");
}
