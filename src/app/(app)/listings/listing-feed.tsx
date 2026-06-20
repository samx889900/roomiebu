"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  SlidersHorizontal,
  Building2,
  Home,
  MapPin,
  Users,
  Heart,
  Bookmark,
  Clock,
  Filter,
  X,
  Plus,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CompatibilityBadge } from "@/components/shared/compatibility-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, enumToLabel, formatRelativeDate, getRemainingSpots, getInitials, formatBudget } from "@/lib/utils";
import { calculateCompatibility } from "@/lib/compatibility";
import { expressInterest } from "@/app/(app)/interests/actions";
import { saveListing } from "@/app/(app)/saved/actions";
import { toast } from "sonner";
import Link from "next/link";

interface ListingFeedProps {
  listings: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */;
  total: number;
  pages: number;
  currentPage: number;
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUserProfile?: any;
}

const typeIcons: Record<string, React.ReactNode> = {
  HOSTEL: <Building2 className="h-3.5 w-3.5" />,
  FLAT: <Home className="h-3.5 w-3.5" />,
  NOT_SURE: <MapPin className="h-3.5 w-3.5" />,
};

const statusColors: Record<string, string> = {
  LOOKING_URGENTLY: "bg-rose-50 text-rose-700 border-rose-200",
  WITHIN_1_MONTH: "bg-amber-50 text-amber-700 border-amber-200",
  JUST_EXPLORING: "bg-sky-50 text-sky-700 border-sky-200",
};

export function ListingFeed({ listings, total, pages, currentPage, userId, currentUserProfile }: ListingFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const [search, setSearch] = useState(searchParams.get("q") || "");

  function updateFilters(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    startTransition(() => router.push(`/listings?${params.toString()}`));
  }

  function handleSearch() {
    updateFilters("q", search);
  }

  async function handleInterest(listingId: string) {
    try {
      await expressInterest(listingId);
      toast.success("Interest sent", { description: "The listing owner will review your request." });
    } catch (error: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) {
      toast.error(error.message || "Failed to express interest");
    }
  }

  async function handleSave(listingId: string) {
    try {
      await saveListing(listingId);
      toast.success("Listing saved");
    } catch {
      toast.error("Failed to save listing");
    }
  }

  return (
    <div className="space-y-6">
      <div className="surface-subtle flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title, area, or description"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="rounded-full pl-11"
          />
        </div>
        <Select defaultValue={searchParams.get("sort") || "newest"} onValueChange={(v: string | null) => updateFilters("sort", v)}>
          <SelectTrigger className="h-12 w-full rounded-full bg-white sm:w-[190px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="gap-2 bg-white" />}>
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </SheetTrigger>
          <SheetContent className="overflow-y-auto bg-white">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filter listings
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-6 px-6 pb-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Accommodation type</label>
                <Select defaultValue={searchParams.get("type") || ""} onValueChange={(v: string | null) => updateFilters("type", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOSTEL">Hostel</SelectItem>
                    <SelectItem value="FLAT">Flat</SelectItem>
                    <SelectItem value="NOT_SURE">Not sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender preference</label>
                <Select defaultValue={searchParams.get("gender") || ""} onValueChange={(v: string | null) => updateFilters("gender", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MALE">Male</SelectItem>
                    <SelectItem value="FEMALE">Female</SelectItem>
                    <SelectItem value="ANY">Any</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Smoking</label>
                <Select onValueChange={(v: string | null) => updateFilters("smoking", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEVER">Never</SelectItem>
                    <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                    <SelectItem value="REGULARLY">Regularly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Drinking</label>
                <Select onValueChange={(v: string | null) => updateFilters("drinking", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="NEVER">Never</SelectItem>
                    <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                    <SelectItem value="REGULARLY">Regularly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Sleep schedule</label>
                <Select onValueChange={(v: string | null) => updateFilters("sleep", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING_PERSON">Morning person</SelectItem>
                    <SelectItem value="NIGHT_PERSON">Night person</SelectItem>
                    <SelectItem value="DEPENDS">Depends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency</label>
                <Select onValueChange={(v: string | null) => updateFilters("status", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOOKING_URGENTLY">Looking urgently</SelectItem>
                    <SelectItem value="WITHIN_1_MONTH">Within 1 month</SelectItem>
                    <SelectItem value="JUST_EXPLORING">Just exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="ghost" className="w-full" onClick={() => startTransition(() => router.push("/listings"))}>
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button render={<Link href="/listings/create" />} className="gap-2">
          <Plus className="h-4 w-4" />
          Create listing
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{total} listing{total !== 1 ? "s" : ""} available</p>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No listings found"
          description="Try adjusting the filters or create a listing to get discovered faster."
          actionLabel="Create listing"
          actionHref="/listings/create"
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {listings.map((listing) => {
            const remaining = getRemainingSpots(listing.numberRequired, listing.spotsFilled);
            const isOwn = listing.userId === userId;

            return (
              <Card key={listing.id} className="overflow-hidden border-border/70 bg-white">
                <CardContent className="space-y-5 p-0">
                  <div className="rounded-b-[28px] bg-[#fff7f5] p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <Link href={`/listings/${listing.id}`} className="block text-lg font-semibold tracking-[-0.02em] transition hover:text-primary">
                          {listing.title}
                        </Link>
                        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3.5 w-3.5" />
                          {formatRelativeDate(listing.createdAt)}
                        </p>
                      </div>
                      <CompatibilityBadge 
                        score={
                          currentUserProfile && listing.user?.profile && !isOwn
                            ? calculateCompatibility(currentUserProfile, listing.user.profile, listing)
                            : undefined
                        } 
                        size="sm" 
                        showLabel={false} 
                      />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1 bg-white">
                        {typeIcons[listing.accommodationType]}
                        {enumToLabel(listing.accommodationType)}
                      </Badge>
                      <Badge variant="outline" className="bg-white">
                        <Users className="mr-1 h-3.5 w-3.5" />
                        {remaining} spot{remaining !== 1 ? "s" : ""} left
                      </Badge>
                      <Badge variant="outline" className={cn("bg-white", statusColors[listing.currentStatus])}>
                        {enumToLabel(listing.currentStatus)}
                      </Badge>
                    </div>
                  </div>

                  <div className="space-y-4 px-5 pb-5">
                    {listing.location ? (
                      <div className="rounded-[20px] bg-muted px-4 py-3 text-sm text-muted-foreground">
                        <p className="flex items-center gap-2 text-foreground">
                          <MapPin className="h-4 w-4 text-primary" />
                          {listing.location}
                        </p>
                        {(listing.minBudget || listing.maxBudget) && <p className="mt-1">{formatBudget(listing.minBudget, listing.maxBudget)}</p>}
                      </div>
                    ) : (
                      <div className="rounded-[20px] bg-muted px-4 py-3 text-sm text-muted-foreground">
                        Best for students still exploring their living arrangement preferences.
                      </div>
                    )}

                    {listing.description && <p className="text-sm leading-6 text-muted-foreground line-clamp-3">{listing.description}</p>}

                    <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4">
                      <div className="flex items-center gap-3 min-w-0">
                        <Avatar className="h-11 w-11">
                          <AvatarImage src={listing.user?.image || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {listing.user?.name ? getInitials(listing.user.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">{listing.user?.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {listing.user?.profile?.course} â€¢ {listing.user?.profile?.year}
                          </p>
                        </div>
                      </div>
                      {!isOwn ? (
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={() => handleInterest(listing.id)}>
                            <Heart className="h-3.5 w-3.5" />
                            Interested
                          </Button>
                          <Button size="icon-sm" variant="outline" onClick={() => handleSave(listing.id)} className="bg-white">
                            <Bookmark className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ) : (
                        <Button render={<Link href={`/listings/${listing.id}`} />} size="sm" variant="outline" className="bg-white">
                          View
                          <ArrowUpRight className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              className={p !== currentPage ? "bg-white" : ""}
              onClick={() => updateFilters("page", p.toString())}
            >
              {p}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

