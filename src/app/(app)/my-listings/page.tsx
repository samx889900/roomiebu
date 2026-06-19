import { auth } from "@/lib/auth";
import { getMyListings } from "../listings/actions";
import { MyListingsClient } from "./my-listings-client";

export default async function MyListingsPage() {
  await auth();
  const listings = await getMyListings();
  return <MyListingsClient listings={listings} />;
}
