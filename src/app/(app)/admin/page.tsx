import { getAdminStats } from "./actions";
import { AdminDashboard } from "./admin-dashboard";

export default async function AdminPage() {
  const stats = await getAdminStats();
  return <AdminDashboard stats={stats} />;
}
