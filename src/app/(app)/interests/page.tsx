import { getReceivedInterests, getSentInterests } from "./actions";
import { InterestsClient } from "./interests-client";

export default async function InterestsPage() {
  const session = await import("@/lib/auth").then((m) => m.auth());
  const currentUser = session?.user?.id
    ? await import("@/lib/prisma").then((mod) =>
        mod.prisma.user.findUnique({
          where: { id: session.user.id },
          include: { profile: true },
        })
      )
    : null;

  const [received, sent] = await Promise.all([getReceivedInterests(), getSentInterests()]);
  return <InterestsClient received={received} sent={sent} currentUserProfile={currentUser?.profile} />;
}
