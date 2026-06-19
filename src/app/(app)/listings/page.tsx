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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Find Roommates</h1>
        <p className="text-muted-foreground">Browse listings from Bennett University students</p>
      </div>
      <Suspense
        fallback={
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
        />
      </Suspense>
    </div>
  );
}
