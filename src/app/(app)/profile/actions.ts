/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import type { UpdateProfileFormData } from "@/lib/validators/profile";
import { calculateDetailedCompatibility } from "@/lib/compatibility";

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

export async function getProfilePreview(targetUserId: string, listingId?: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Fetch only non-sensitive data
  const targetUser = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      name: true,
      image: true,
      studentStatus: true,
      profile: {
        select: {
          gender: true,
          programCode: true,
          admissionYear: true,
          accommodationType: true,
          languages: true,
          cleanlinessLevel: true,
          sleepSchedule: true,
          studyEnvironment: true,
          smoking: true,
          drinking: true,
          guestsPreference: true,
          aboutMe: true,
        },
      },
    },
  });

  if (!targetUser) throw new Error("User not found");

  let compatibility = null;
  let compatibilityDetails: string[] = [];

  // If a listingId is provided, we can calculate compatibility against it
  if (listingId && targetUser.profile) {
    const listing = await prisma.listing.findUnique({
      where: { id: listingId },
      include: { user: { include: { profile: true } } }
    });

    if (listing && listing.user?.profile) {
      // Cast profiles to any to bypass exact UserProfile strict typing from compatibility.ts
      const res = calculateDetailedCompatibility(
        listing.userId === session.user.id ? (listing.user.profile as any) : (targetUser.profile as any), 
        listing.userId === session.user.id ? (targetUser.profile as any) : (listing.user.profile as any),
        listing as any
      );
      compatibility = res.score;
      compatibilityDetails = res.details;
    }
  } else if (targetUser.profile) {
    // Basic compatibility between current user and target user
    const currentUser = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: { profile: true },
    });
    
    if (currentUser?.profile) {
      const res = calculateDetailedCompatibility(currentUser.profile as any, targetUser.profile as any);
      compatibility = res.score;
      compatibilityDetails = res.details;
    }
  }

  return { targetUser, compatibility, compatibilityDetails };
}
