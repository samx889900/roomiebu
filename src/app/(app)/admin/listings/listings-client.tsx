"use client";

import { motion } from "framer-motion";
import { List, Trash2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { enumToLabel, formatRelativeDate } from "@/lib/utils";
import { adminRemoveListing, adminRestoreListing } from "../actions";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  FILLED: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  CLOSED: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
  EXPIRED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  DELETED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function AdminListingsClient({ listings }: { listings: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">All Listings</h1>
        <p className="text-muted-foreground">{listings.length} total listings</p>
      </div>

      {listings.length === 0 ? (
        <EmptyState icon={List} title="No listings" description="No listings have been created yet." />
      ) : (
        <div className="space-y-3">
          {listings.map((listing, i) => (
            <motion.div key={listing.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Card className={listing.status === "DELETED" ? "opacity-50" : ""}>
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium truncate">{listing.title}</h3>
                      <Badge variant="outline" className={statusColors[listing.status]}>{listing.status}</Badge>
                      <Badge variant="outline" className="text-[10px]">{enumToLabel(listing.accommodationType)}</Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      by {listing.user?.name} â€¢ {listing._count.interests} interests â€¢ {listing._count.matches} matches â€¢ {formatRelativeDate(listing.createdAt)}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    {listing.status === "DELETED" ? (
                      <Button size="sm" variant="outline" className="gap-1" onClick={async () => { await adminRestoreListing(listing.id); toast.success("Restored"); }}>
                        <RotateCcw className="w-3 h-3" /> Restore
                      </Button>
                    ) : (
                      <Button size="sm" variant="ghost" className="text-destructive gap-1" onClick={async () => { await adminRemoveListing(listing.id, "Removed by admin"); toast.success("Removed"); }}>
                        <Trash2 className="w-3 h-3" /> Remove
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

