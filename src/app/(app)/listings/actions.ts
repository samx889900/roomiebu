"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { listingSchema, type ListingFormData } from "@/lib/validators/listing";
import { revalidatePath } from "next/cache";
import { LISTING_EXPIRY_DAYS, DEFAULT_PAGE_SIZE } from "@/lib/constants";
import { Prisma } from "@prisma/client";

export async function createListing(data: ListingFormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const validated = listingSchema.parse(data);

  // Auto-set occupancyType for hostel listings
  const occupancyType = validated.accommodationType === "HOSTEL" ? "TRIPLE" : (validated.occupancyType || null);

  // Clean NaN values from number fields
  const minBudget = validated.minBudget && !isNaN(validated.minBudget) ? validated.minBudget : null;
  const maxBudget = validated.maxBudget && !isNaN(validated.maxBudget) ? validated.maxBudget : null;

  const listing = await prisma.listing.create({
    data: {
      userId: session.user.id,
      title: validated.title,
      accommodationType: validated.accommodationType,
      numberRequired: validated.numberRequired,
      spotsFilled: validated.spotsFilled,
      genderPreference: validated.genderPreference,
      currentStatus: validated.currentStatus,
      moveInDate: validated.moveInDate ? new Date(validated.moveInDate) : null,
      description: validated.description || null,
      occupancyType,
      hostelBlock: validated.hostelBlock || null,
      location: validated.location || null,
      minBudget,
      maxBudget,
      propertyType: validated.propertyType || null,
      furnishedStatus: validated.furnishedStatus || null,
      expiresAt: new Date(Date.now() + LISTING_EXPIRY_DAYS * 24 * 60 * 60 * 1000),
    },
  });

  revalidatePath("/listings");
  revalidatePath("/my-listings");
  return listing;
}

export async function updateListing(id: string, data: Partial<ListingFormData>) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Not found");
  
  const isOwner = listing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) throw new Error("Unauthorized");

  // Clean NaN/null values for number fields
  const numberRequired = data.numberRequired != null && !isNaN(Number(data.numberRequired)) ? Number(data.numberRequired) : listing.numberRequired;
  const spotsFilled = data.spotsFilled != null && !isNaN(Number(data.spotsFilled)) ? Number(data.spotsFilled) : listing.spotsFilled;
  const minBudget = data.minBudget !== undefined ? (data.minBudget == null || isNaN(Number(data.minBudget)) ? null : Number(data.minBudget)) : undefined;
  const maxBudget = data.maxBudget !== undefined ? (data.maxBudget == null || isNaN(Number(data.maxBudget)) ? null : Number(data.maxBudget)) : undefined;

  await prisma.listing.update({
    where: { id },
    data: {
      title: data.title,
      accommodationType: data.accommodationType,
      numberRequired,
      spotsFilled,
      genderPreference: data.genderPreference,
      currentStatus: data.currentStatus,
      moveInDate: data.moveInDate ? new Date(data.moveInDate) : null,
      description: data.description || null,
      occupancyType: data.accommodationType === "HOSTEL" ? "TRIPLE" : data.occupancyType,
      hostelBlock: data.hostelBlock || null,
      location: data.location || null,
      minBudget,
      maxBudget,
      propertyType: data.propertyType || null,
      furnishedStatus: data.furnishedStatus || null,
    },
  });

  revalidatePath("/listings");
  revalidatePath(`/listings/${id}`);
  revalidatePath("/my-listings");
}

export async function deleteListing(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Not found");
  
  const isOwner = listing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) throw new Error("Unauthorized");

  // Soft delete
  await prisma.listing.update({
    where: { id },
    data: { status: "DELETED", deletedAt: new Date() },
  });

  revalidatePath("/listings");
  revalidatePath("/my-listings");
}

export async function closeListing(id: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const listing = await prisma.listing.findUnique({ where: { id } });
  if (!listing) throw new Error("Not found");
  
  const isOwner = listing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) throw new Error("Unauthorized");

  await prisma.listing.update({
    where: { id },
    data: { status: "CLOSED" },
  });

  revalidatePath("/listings");
  revalidatePath("/my-listings");
}

interface GetListingsParams {
  accommodationType?: string;
  gender?: string;
  smoking?: string;
  drinking?: string;
  sleepSchedule?: string;
  course?: string;
  year?: string;
  minBudget?: number;
  maxBudget?: number;
  location?: string;
  currentStatus?: string;
  sortBy?: string;
  search?: string;
}

export async function getListings(params: GetListingsParams = {}) {
  const {
    accommodationType,
    gender,
    smoking,
    drinking,
    sleepSchedule,
    course,
    year,
    minBudget,
    maxBudget,
    location,
    currentStatus,
    sortBy = "newest",
    search,
  } = params;

  const where: Prisma.ListingWhereInput = {
    status: "ACTIVE",
    deletedAt: null,
  };

  if (accommodationType) where.accommodationType = accommodationType as Prisma.EnumAccommodationTypeFilter;
  if (gender) where.genderPreference = gender as Prisma.EnumGenderPreferenceFilter;
  if (currentStatus) where.currentStatus = currentStatus as Prisma.EnumUrgencyStatusFilter;
  if (location) where.location = { contains: location, mode: "insensitive" };
  if (minBudget) where.minBudget = { gte: minBudget };
  if (maxBudget) where.maxBudget = { lte: maxBudget };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { location: { contains: search, mode: "insensitive" } },
    ];
  }

  // Filter by listing owner's profile attributes
  if (smoking || drinking || sleepSchedule || course || year) {
    where.user = {
      profile: {
        ...(smoking && { smoking: smoking as Prisma.EnumFrequencyLevelFilter }),
        ...(drinking && { drinking: drinking as Prisma.EnumFrequencyLevelFilter }),
        ...(sleepSchedule && { sleepSchedule: sleepSchedule as Prisma.EnumSleepScheduleFilter }),
        ...(course && { course }),
        ...(year && { year }),
      },
    };
  }

  const orderBy: Prisma.ListingOrderByWithRelationInput = (() => {
    switch (sortBy) {
      case "oldest":
        return { createdAt: "asc" as const };
      case "alphabetical":
        return { user: { name: "asc" as const } };
      default:
        return { createdAt: "desc" as const };
    }
  })();

  const [listings, total] = await Promise.all([
    prisma.listing.findMany({
      where,
      orderBy,
      select: {
        id: true,
        title: true,
        accommodationType: true,
        numberRequired: true,
        spotsFilled: true,
        genderPreference: true,
        currentStatus: true,
        moveInDate: true,
        description: true,
        location: true,
        minBudget: true,
        maxBudget: true,
        createdAt: true,
        status: true,
        userId: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            profile: {
              select: {
                course: true,
                year: true,
                sleepSchedule: true,
                cleanlinessLevel: true,
                smoking: true,
                drinking: true,
              },
            },
          },
        },
        _count: {
          select: { interests: true, savedBy: true },
        },
      },
    }),
    prisma.listing.count({ where }),
  ]);

  return {
    listings,
    total,
  };
}

export async function getListingById(id: string) {
  return prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        include: { profile: true },
      },
      _count: {
        select: { interests: true, savedBy: true, matches: true },
      },
    },
  });
}

export async function getMyListings() {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  return prisma.listing.findMany({
    where: { userId: session.user.id, deletedAt: null },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: { interests: true, matches: true },
      },
    },
  });
}
