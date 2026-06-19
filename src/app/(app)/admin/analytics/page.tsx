import { getAnalytics } from "../actions";
import { AnalyticsClient } from "./analytics-client";

export default async function AdminAnalyticsPage() {
  const analytics = await getAnalytics();
  return <AnalyticsClient analytics={analytics} />;
}
