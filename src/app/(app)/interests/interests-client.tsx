"use client";

import { motion } from "framer-motion";
import { Heart, Send, Check, X, Clock, CigaretteOff, Beer, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompatibilityBadge } from "@/components/shared/compatibility-badge";
import { EmptyState } from "@/components/shared/empty-state";
import { enumToLabel, formatRelativeDate, getInitials } from "@/lib/utils";
import { calculateCompatibility } from "@/lib/compatibility";
import { acceptInterest, rejectInterest } from "./actions";
import { toast } from "sonner";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ACCEPTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function InterestsClient({ received, sent, currentUserProfile }: { received: Record<string, unknown>[]; sent: Record<string, unknown>[]; currentUserProfile?: Record<string, unknown> }) {
  async function handleAccept(id: string) {
    try {
      await acceptInterest(id);
      toast.success("Interest accepted! Contact details shared.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to accept");
    }
  }

  async function handleReject(id: string) {
    try {
      await rejectInterest(id);
      toast.success("Interest declined");
    } catch {
      toast.error("Failed to decline");
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Interests</h1>
        <p className="text-muted-foreground">Manage incoming and outgoing interest requests</p>
      </div>

      <Tabs defaultValue="received" className="space-y-6">
        <TabsList className="grid grid-cols-2 w-full max-w-md">
          <TabsTrigger value="received" className="gap-2">
            <Heart className="w-4 h-4" />
            Received ({received.length})
          </TabsTrigger>
          <TabsTrigger value="sent" className="gap-2">
            <Send className="w-4 h-4" />
            Sent ({sent.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="received" className="space-y-4">
          {received.length === 0 ? (
            <EmptyState icon={Heart} title="No interests received" description="When someone expresses interest in your listings, they'll appear here." />
          ) : (
            received.map((interest, i) => (
              <motion.div key={interest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card className="hover:border-primary/20 transition-colors">
                  <CardContent className="p-5">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={interest.interestedUser?.image || ""} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {interest.interestedUser?.name ? getInitials(interest.interestedUser.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{interest.interestedUser?.name}</h3>
                          <Badge variant="outline" className={statusColors[interest.status]}>
                            {interest.status}
                          </Badge>
                          <CompatibilityBadge 
                            score={
                              currentUserProfile && interest.interestedUser?.profile
                                ? calculateCompatibility(currentUserProfile, interest.interestedUser.profile, interest.listing)
                                : undefined
                            } 
                            size="sm" 
                            showLabel={false} 
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {interest.interestedUser?.profile?.course} • {interest.interestedUser?.profile?.year}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Interested in: <Link href={`/listings/${interest.listing.id}`} className="text-primary hover:underline">{interest.listing.title}</Link>
                        </p>
                        <div className="flex gap-2 mt-2 text-xs text-muted-foreground">
                          {interest.interestedUser?.profile && (
                            <>
                              <span className="flex items-center gap-1"><CigaretteOff className="w-3 h-3" /> {enumToLabel(interest.interestedUser.profile.smoking)}</span>
                              <span className="flex items-center gap-1"><Beer className="w-3 h-3" /> {enumToLabel(interest.interestedUser.profile.drinking)}</span>
                              <span className="flex items-center gap-1"><Moon className="w-3 h-3" /> {enumToLabel(interest.interestedUser.profile.sleepSchedule)}</span>
                            </>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatRelativeDate(interest.createdAt)}
                        </p>
                      </div>
                      {interest.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button size="sm" className="gradient-accent gap-1" onClick={() => handleAccept(interest.id)}>
                            <Check className="w-3 h-3" /> Accept
                          </Button>
                          <Button size="sm" variant="ghost" className="gap-1 text-destructive" onClick={() => handleReject(interest.id)}>
                            <X className="w-3 h-3" /> Decline
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>

        <TabsContent value="sent" className="space-y-4">
          {sent.length === 0 ? (
            <EmptyState icon={Send} title="No interests sent" description="Express interest in listings to start connecting with potential roommates." actionLabel="Browse Listings" actionHref="/listings" />
          ) : (
            sent.map((interest, i) => (
              <motion.div key={interest.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                <Card>
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <Link href={`/listings/${interest.listing.id}`} className="font-semibold hover:text-primary transition-colors">
                          {interest.listing.title}
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          by {interest.listing.user?.name} • {formatRelativeDate(interest.createdAt)}
                        </p>
                      </div>
                      <Badge variant="outline" className={statusColors[interest.status]}>
                        {interest.status}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

