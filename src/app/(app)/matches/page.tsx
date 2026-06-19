import { auth } from "@/lib/auth";
import { getMatches } from "./actions";
import { MatchesClient } from "./matches-client";

export default async function MatchesPage() {
  const session = await auth();
  const matches = await getMatches();
  return <MatchesClient matches={matches} userId={session?.user?.id || ""} />;
}
