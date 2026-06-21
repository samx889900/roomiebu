import { Skeleton } from "@/components/ui/skeleton";

export default function ProfileLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-8 pb-24">
      <div className="space-y-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-8">
        {/* Photo Section */}
        <div className="flex flex-col items-center justify-center space-y-4 rounded-3xl border bg-card p-8">
          <Skeleton className="h-32 w-32 rounded-full" />
          <Skeleton className="h-10 w-32 rounded-full" />
          <Skeleton className="h-4 w-64" />
        </div>

        {/* Basic Info */}
        <div className="space-y-4 rounded-3xl border bg-card p-6 md:p-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        {/* Lifestyle */}
        <div className="space-y-4 rounded-3xl border bg-card p-6 md:p-8">
          <Skeleton className="h-6 w-32 mb-6" />
          <div className="grid gap-6 sm:grid-cols-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full rounded-xl" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Skeleton className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  );
}
