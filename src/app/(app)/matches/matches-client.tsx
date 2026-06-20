"use client";

import { motion } from "framer-motion";
import { Users, Phone, Mail, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CompatibilityBadge } from "@/components/shared/compatibility-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatDate, getInitials, enumToLabel } from "@/lib/utils";
import { calculateCompatibility } from "@/lib/compatibility";
import Link from "next/link";

export function MatchesClient({ matches, userId }: { matches: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */; userId: string }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Your Matches 🎉</h1>
        <p className="text-muted-foreground">People you&apos;ve been matched with — contact details below</p>
      </div>

      {matches.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No matches yet"
          description="Accept interests on your listings or express interest in others to create matches."
          actionLabel="Browse Listings"
          actionHref="/listings"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {matches.map((match, i) => {
            const otherUser = match.userAId === userId ? match.userB : match.userA;
            const currentUser = match.userAId === userId ? match.userA : match.userB;
            const otherProfile = otherUser?.profile;
            const currentProfile = currentUser?.profile;

            return (
              <motion.div
                key={match.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="hover:border-primary/30 transition-colors overflow-hidden">
                  <div className="h-1 gradient-accent" />
                  <CardContent className="p-5 space-y-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12 ring-2 ring-accent/20">
                        <AvatarImage src={otherUser?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {otherUser?.name ? getInitials(otherUser.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{otherUser?.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {otherProfile?.course} • {otherProfile?.year}
                        </p>
                      </div>
                      <CompatibilityBadge 
                        score={
                          currentProfile && otherProfile
                            ? calculateCompatibility(currentProfile, otherProfile, match.listing)
                            : undefined
                        } 
                        size="sm" 
                      />
                    </div>

                    {/* Contact Details — REVEALED */}
                    <div className="rounded-lg bg-accent/5 border border-accent/20 p-3 space-y-2">
                      <p className="text-xs font-semibold text-accent uppercase tracking-wider">Contact Details</p>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="w-4 h-4 text-accent" />
                        <span>{otherProfile?.phone || "Not provided"}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="w-4 h-4 text-accent" />
                        <span>{otherUser?.email}</span>
                      </div>
                    </div>

                    {/* Listing info */}
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <Link href={`/listings/${match.listing?.id}`} className="hover:text-primary transition-colors">
                        ðŸ“‹ {match.listing?.title}
                      </Link>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {formatDate(match.acceptedAt)}
                      </span>
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

