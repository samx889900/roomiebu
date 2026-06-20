import { getAdminUsers } from "../actions";
import { UsersClient } from "./users-client";

import Link from "next/link";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Management</h1>
        <Link href="/admin/users/profiles" className="text-primary underline hover:no-underline">View All Profiles</Link>
      </div>
      <UsersClient users={users} />
    </div>
  );
}
