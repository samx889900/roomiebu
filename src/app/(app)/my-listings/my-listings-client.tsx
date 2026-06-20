"use client";

import { motion } from "framer-motion";
import { List, Plus, Eye, Pencil, Trash2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { enumToLabel, formatRelativeDate, getRemainingSpots } from "@/lib/utils";
import { deleteListing, closeListing } from "@/app/(app)/listings/actions";
import { toast } from "sonner";
import Link from "next/link";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FILLED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  EXPIRED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function MyListingsClient({ listings }: { listings: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  async function handleDelete(id: string) {
    try {
      await deleteListing(id);
      toast.success("Listing deleted");
    } catch {
      toast.error("Failed to delete listing");
    }
  }

  async function handleClose(id: string) {
    try {
      await closeListing(id);
      toast.success("Listing closed");
    } catch {
      toast.error("Failed to close listing");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Listings</h1>
          <p className="text-muted-foreground">Manage your roommate listings</p>
        </div>
        <Button render={<Link href="/listings/create" />} className="gradient-primary gap-2">
          <Plus className="w-4 h-4" />
          New Listing
        </Button>
      </div>

      {listings.length === 0 ? (
        <EmptyState
          icon={List}
          title="No listings yet"
          description="Create your first listing to start finding roommates."
          actionLabel="Create Listing"
          actionHref="/listings/create"
        />
      ) : (
        <div className="space-y-4">
          {listings.map((listing, i) => {
            const remaining = getRemainingSpots(listing.numberRequired, listing.spotsFilled);

            return (
              <motion.div
                key={listing.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold truncate">{listing.title}</h3>
                          <Badge variant="outline" className={statusColors[listing.status]}>
                            {listing.status}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{enumToLabel(listing.accommodationType)}</span>
                          <span>•</span>
                          <span>{remaining} spot{remaining !== 1 ? "s" : ""} remaining</span>
                          <span>•</span>
                          <span>{listing._count.interests} interest{listing._count.interests !== 1 ? "s" : ""}</span>
                          <span>•</span>
                          <span>{formatRelativeDate(listing.createdAt)}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button render={<Link href={`/listings/${listing.id}`} />} variant="ghost" size="icon">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {listing.status === "ACTIVE" && (
                          <>
                            <Button variant="ghost" size="icon" onClick={() => handleClose(listing.id)}>
                              <XCircle className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => handleDelete(listing.id)}>
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
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

