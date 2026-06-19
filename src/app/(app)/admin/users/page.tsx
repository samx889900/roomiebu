import { getAdminUsers } from "../actions";
import { UsersClient } from "./users-client";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();
  return <UsersClient users={users} />;
}
