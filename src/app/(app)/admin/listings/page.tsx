import { getAdminListings } from "../actions";
import { AdminListingsClient } from "./listings-client";

export default async function AdminListingsPage() {
  const listings = await getAdminListings();
  return <AdminListingsClient listings={listings} />;
}
