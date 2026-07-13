import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminListingDetailClient } from "./listing-detail-client";

export const metadata: Metadata = {
  title: "Admin - Listing Details",
  description: "Manage listing and interests",
};

export default async function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await prisma.listing.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          profile: true,
        },
      },
      interests: {
        include: {
          interestedUser: {
            select: {
              id: true,
              name: true,
              image: true,
              studentStatus: true,
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc'
        }
      },
    },
  });

  if (!listing) {
    notFound();
  }

  return <AdminListingDetailClient listing={listing} />;
}
