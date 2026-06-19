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
  const listing = await getListingById(id);

  if (!listing) notFound();

  return <ListingDetail listing={listing} userId={session?.user?.id} />;
}
