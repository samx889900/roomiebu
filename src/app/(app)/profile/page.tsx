import { getProfile } from "./actions";
import { ProfileClient } from "./profile-client";
import { notFound } from "next/navigation";

export default async function ProfilePage() {
  const user = await getProfile();
  if (!user) notFound();
  return <ProfileClient user={user} />;
}
