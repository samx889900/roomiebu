import { getAdminUserById } from "../../actions";
import { ProfileClient } from "../../../profile/profile-client";
import { notFound } from "next/navigation";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await getAdminUserById(params.id);
  if (!user) notFound();
  return <ProfileClient user={user} />;
}
