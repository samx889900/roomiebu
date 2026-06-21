import { Skeleton } from "@/components/ui/skeleton";

export default function MatchesLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex flex-col gap-4 rounded-2xl border bg-card p-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-24 rounded-full" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-4">
                <Skeleton className="h-12 w-12 rounded-full border-2 border-background" />
                <Skeleton className="h-12 w-12 rounded-full border-2 border-background" />
              </div>
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
            </div>

            <div className="pt-4 border-t space-y-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
