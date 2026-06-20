import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { getListings } from "./actions";
import { ListingFeed } from "./listing-feed";
import { ListingCardSkeleton } from "@/components/shared/loading-skeleton";

interface PageProps {
  searchParams: Promise<Record<string, string | undefined>>;
}

export default async function ListingsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const session = await auth();

  const currentUser = session?.user?.id
    ? await import("@/lib/prisma").then((mod) =>
        mod.prisma.user.findUnique({
          where: { id: session.user.id },
          include: { profile: true },
        })
      )
    : null;

  const page = parseInt(params.page || "1");
  const result = await getListings({
    page,
    accommodationType: params.type,
    gender: params.gender,
    smoking: params.smoking,
    drinking: params.drinking,
    sleepSchedule: params.sleep,
    course: params.course,
    year: params.year,
    location: params.location,
    currentStatus: params.status,
    sortBy: params.sort || "newest",
    search: params.q,
  });

  return (
    <div className="space-y-8">
      <div className="surface-panel flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Listings</p>
          <h1 className="section-heading mt-3">Find roommates and flatmates at Bennett.</h1>
          <p className="section-copy mt-4">
            Browse verified student listings, compare compatibility cues, and send interest when the fit feels right.
          </p>
        </div>
        <div className="grid gap-3 rounded-[24px] bg-muted px-5 py-4 text-sm text-muted-foreground sm:grid-cols-3">
          <div>
            <p className="font-semibold text-foreground">{result.total}</p>
            <p>active results</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Hostel + flat</p>
            <p>both categories supported</p>
          </div>
          <div>
            <p className="font-semibold text-foreground">Match-first</p>
            <p>contact unlock after acceptance</p>
          </div>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        }
      >
        <ListingFeed
          listings={result.listings}
          total={result.total}
          pages={result.pages}
          currentPage={page}
          userId={session?.user?.id}
          currentUserProfile={currentUser?.profile}
        />
      </Suspense>
    </div>
  );
}
