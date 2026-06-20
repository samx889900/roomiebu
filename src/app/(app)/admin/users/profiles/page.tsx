import { getAdminUsers } from "../../actions";
import { ProfileClient } from "../../../profile/profile-client";

export default async function AdminProfilesPage() {
  const users = await getAdminUsers();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">All User Profiles (Admin View)</h1>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <ProfileClient key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
