"use client";

import { motion } from "framer-motion";
import { Bookmark, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { enumToLabel, formatRelativeDate, getRemainingSpots } from "@/lib/utils";
import { unsaveListing } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

export function SavedClient({ saved }: { saved: any[] }) {
  async function handleUnsave(listingId: string) {
    try {
      await unsaveListing(listingId);
      toast.success("Listing unsaved");
    } catch {
      toast.error("Failed to unsave");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Saved Listings</h1>
        <p className="text-muted-foreground">Listings you&apos;ve bookmarked for later</p>
      </div>

      {saved.length === 0 ? (
        <EmptyState icon={Bookmark} title="No saved listings" description="Bookmark listings you're interested in to find them easily later." actionLabel="Browse Listings" actionHref="/listings" />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saved.map((item, i) => {
            const listing = item.listing;
            const remaining = getRemainingSpots(listing.numberRequired, listing.spotsFilled);

            return (
              <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <Link href={`/listings/${listing.id}`} className="font-semibold hover:text-primary transition-colors">
                        {listing.title}
                      </Link>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleUnsave(listing.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-[10px]">{enumToLabel(listing.accommodationType)}</Badge>
                      <Badge variant="outline" className="text-[10px]">{remaining} spot{remaining !== 1 ? "s" : ""}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      by {listing.user?.name} • {formatRelativeDate(listing.createdAt)}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
