import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getListingById } from "../actions";
import { ListingDetail } from "./listing-detail";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  
  const currentUser = session?.user?.id
    ? await import("@/lib/prisma").then((mod) =>
        mod.prisma.user.findUnique({
          where: { id: session.user.id },
          include: { profile: true },
        })
      )
    : null;

  const listing = await getListingById(id);

  if (!listing) notFound();

  return <ListingDetail listing={listing} userId={session?.user?.id} currentUserProfile={currentUser?.profile} />;
}
