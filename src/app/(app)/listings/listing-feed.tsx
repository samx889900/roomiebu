"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search, SlidersHorizontal, Building2, Home, MapPin, Users,
  Heart, Bookmark, Clock, Filter, X, Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CompatibilityBadge } from "@/components/shared/compatibility-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { cn, enumToLabel, formatRelativeDate, getRemainingSpots, getInitials, formatBudget } from "@/lib/utils";
import { expressInterest } from "@/app/(app)/interests/actions";
import { saveListing } from "@/app/(app)/saved/actions";
import { toast } from "sonner";
import Link from "next/link";

interface ListingFeedProps {
  listings: any[];
  total: number;
  pages: number;
  currentPage: number;
  userId?: string;
}

const typeIcons: Record<string, React.ReactNode> = {
  HOSTEL: <Building2 className="w-3.5 h-3.5" />,
  FLAT: <Home className="w-3.5 h-3.5" />,
  NOT_SURE: <MapPin className="w-3.5 h-3.5" />,
};

const statusColors: Record<string, string> = {
  LOOKING_URGENTLY: "bg-red-500/10 text-red-400 border-red-500/20",
  WITHIN_1_MONTH: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  JUST_EXPLORING: "bg-blue-500/10 text-blue-400 border-blue-500/20",
};

export function ListingFeed({ listings, total, pages, currentPage, userId }: ListingFeedProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
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
      toast.success("Interest expressed!", { description: "The listing owner will be notified." });
    } catch (error: any) {
      toast.error(error.message || "Failed to express interest");
    }
  }

  async function handleSave(listingId: string) {
    try {
      await saveListing(listingId);
      toast.success("Listing saved!");
    } catch {
      toast.error("Failed to save listing");
    }
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            className="pl-9"
          />
        </div>
        <Select
          defaultValue={searchParams.get("sort") || "newest"}
          onValueChange={(v: string | null) => updateFilters("sort", v)}
        >
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="alphabetical">Alphabetical</SelectItem>
          </SelectContent>
        </Select>
        <Sheet>
          <SheetTrigger render={<Button variant="outline" className="gap-2" />}>
            <SlidersHorizontal className="w-4 h-4" />
            Filters
          </SheetTrigger>
          <SheetContent className="bg-card border-border overflow-y-auto">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <Filter className="w-5 h-5" />
                Filter Listings
              </SheetTitle>
            </SheetHeader>
            <div className="space-y-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">Accommodation Type</label>
                <Select
                  defaultValue={searchParams.get("type") || ""}
                  onValueChange={(v: string | null) => updateFilters("type", v)}
                >
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOSTEL">Hostel</SelectItem>
                    <SelectItem value="FLAT">Flat</SelectItem>
                    <SelectItem value="NOT_SURE">Not Sure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Gender Preference</label>
                <Select
                  defaultValue={searchParams.get("gender") || ""}
                  onValueChange={(v: string | null) => updateFilters("gender", v)}
                >
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
                <label className="text-sm font-medium">Sleep Schedule</label>
                <Select onValueChange={(v: string | null) => updateFilters("sleep", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MORNING_PERSON">Morning Person</SelectItem>
                    <SelectItem value="NIGHT_PERSON">Night Person</SelectItem>
                    <SelectItem value="DEPENDS">Depends</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Urgency</label>
                <Select onValueChange={(v: string | null) => updateFilters("status", v)}>
                  <SelectTrigger><SelectValue placeholder="Any" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="LOOKING_URGENTLY">Looking Urgently</SelectItem>
                    <SelectItem value="WITHIN_1_MONTH">Within 1 Month</SelectItem>
                    <SelectItem value="JUST_EXPLORING">Just Exploring</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                variant="ghost"
                className="w-full"
                onClick={() => {
                  startTransition(() => router.push("/listings"));
                }}
              >
                <X className="w-4 h-4 mr-2" />
                Clear All Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
        <Button render={<Link href="/listings/create" />} className="gradient-primary gap-2">
          <Plus className="w-4 h-4" />
          Create Listing
        </Button>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total} listing{total !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Listing Grid */}
      {listings.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No listings found"
          description="Try adjusting your filters or create a new listing to get started."
          actionLabel="Create Listing"
          actionHref="/listings/create"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing, i) => {
            const remaining = getRemainingSpots(listing.numberRequired, listing.spotsFilled);
            const isOwn = listing.userId === userId;

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="group hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 bg-card">
                  <CardContent className="p-5 space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/listings/${listing.id}`} className="hover:underline">
                          <h3 className="font-semibold text-sm truncate group-hover:text-primary transition-colors">
                            {listing.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(listing.createdAt)}
                        </div>
                      </div>
                      <CompatibilityBadge score={75} size="sm" showLabel={false} />
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5">
                      <Badge variant="outline" className="text-[10px] gap-1">
                        {typeIcons[listing.accommodationType]}
                        {enumToLabel(listing.accommodationType)}
                      </Badge>
                      <Badge variant="outline" className="text-[10px]">
                        <Users className="w-3 h-3 mr-1" />
                        {remaining} spot{remaining !== 1 ? "s" : ""}
                      </Badge>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px]", statusColors[listing.currentStatus])}
                      >
                        {enumToLabel(listing.currentStatus)}
                      </Badge>
                    </div>

                    {/* Location / Budget */}
                    {listing.location && (
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <MapPin className="w-3 h-3" />
                        {listing.location}
                        {listing.minBudget || listing.maxBudget
                          ? ` • ${formatBudget(listing.minBudget, listing.maxBudget)}`
                          : ""}
                      </div>
                    )}

                    {/* Description */}
                    {listing.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {listing.description}
                      </p>
                    )}

                    <Separator />

                    {/* User + Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={listing.user?.image || ""} />
                          <AvatarFallback className="bg-primary/10 text-primary text-[10px]">
                            {listing.user?.name ? getInitials(listing.user.name) : "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-xs font-medium">{listing.user?.name}</p>
                          <p className="text-[10px] text-muted-foreground">
                            {listing.user?.profile?.course} • {listing.user?.profile?.year}
                          </p>
                        </div>
                      </div>
                      {!isOwn && (
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            className="h-8 text-xs gradient-primary"
                            onClick={() => handleInterest(listing.id)}
                          >
                            <Heart className="w-3 h-3 mr-1" />
                            Interested
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0"
                            onClick={() => handleSave(listing.id)}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
            <Button
              key={p}
              variant={p === currentPage ? "default" : "outline"}
              size="sm"
              className={p === currentPage ? "gradient-primary" : ""}
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
