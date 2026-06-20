import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { getListingById } from "../../actions";
import { EditListingClient } from "./edit-client";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditListingPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return notFound();

  const listing = await getListingById(id);
  if (!listing) return notFound();

  const isOwner = listing.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";

  if (!isOwner && !isAdmin) {
    return notFound();
  }

  return <EditListingClient listing={listing} />;
}
