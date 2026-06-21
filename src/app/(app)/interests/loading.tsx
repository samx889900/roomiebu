import { Skeleton } from "@/components/ui/skeleton";

export default function InterestsLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-6">
        {/* Tabs Skeleton */}
        <div className="flex border-b border-border">
          <Skeleton className="h-10 w-32 rounded-t-xl rounded-b-none" />
          <Skeleton className="h-10 w-32 rounded-t-xl rounded-b-none ml-2" />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col gap-4 rounded-2xl border bg-card p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              
              <div className="rounded-xl bg-muted/50 p-3 space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-full" />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <Skeleton className="h-9 flex-1 rounded-xl" />
                <Skeleton className="h-9 flex-1 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
