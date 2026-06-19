import { getReceivedInterests, getSentInterests } from "./actions";
import { InterestsClient } from "./interests-client";

export default async function InterestsPage() {
  const [received, sent] = await Promise.all([getReceivedInterests(), getSentInterests()]);
  return <InterestsClient received={received} sent={sent} />;
}
