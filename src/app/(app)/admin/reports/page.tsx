import { getAdminReports } from "../actions";
import { ReportsClient } from "./reports-client";

export default async function AdminReportsPage() {
  const reports = await getAdminReports();
  return <ReportsClient reports={reports} />;
}
