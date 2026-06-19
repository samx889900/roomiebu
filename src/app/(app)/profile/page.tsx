import { getProfile } from "./actions";
import { ProfileClient } from "./profile-client";

export default async function ProfilePage() {
  const user = await getProfile();
  return <ProfileClient user={user} />;
}
