import { getSavedListings } from "./actions";
import { SavedClient } from "./saved-client";

export default async function SavedPage() {
  const saved = await getSavedListings();
  return <SavedClient saved={saved} />;
}
