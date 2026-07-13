"use client";

import { useState, useOptimistic, useTransition } from "react";
import { motion } from "framer-motion";
import {
  Building2, Home, MapPin, Users, Calendar, Heart, Bookmark, Flag,
  ArrowLeft, Clock, Bed, DollarSign, Sofa, Pencil
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CompatibilityBadge } from "@/components/shared/compatibility-badge";
import { ReportDialog } from "@/components/shared/report-dialog";
import { cn, enumToLabel, formatDate, formatBudget, getRemainingSpots, getInitials } from "@/lib/utils";
import { getReadableProgramName } from "@/lib/academic/mapping";
import { computeCurrentAcademicYear, getReadableAcademicYear } from "@/lib/academic/year";
import { calculateCompatibility } from "@/lib/compatibility";
import { expressInterest } from "@/app/(app)/interests/actions";
import { saveListing } from "@/app/(app)/saved/actions";
import { toast } from "sonner";
import Link from "next/link";

interface ListingDetailProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  listing: any;
  userId?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  currentUserProfile?: any;
}

export function ListingDetail({ listing, userId, currentUserProfile }: ListingDetailProps) {
  const [reportOpen, setReportOpen] = useState(false);
  const [, startTransition] = useTransition();
  const [isOptimisticallyInterested, setOptimisticallyInterested] = useOptimistic(false);
  const [isOptimisticallySaved, setOptimisticallySaved] = useOptimistic(false);
  const isOwn = listing.userId === userId;
  const remaining = getRemainingSpots(listing.numberRequired, listing.spotsFilled);
  const profile = listing.user?.profile;

  async function handleInterest() {
    if (
      listing.accommodationType === "HOSTEL" && 
      profile?.gender && 
      currentUserProfile?.gender && 
      profile.gender !== currentUserProfile.gender
    ) {
      toast.error("Hostel accommodation is available only for students of the same gender.");
      return;
    }

    startTransition(() => {
      setOptimisticallyInterested(true);
    });
    try {
      await expressInterest(listing.id);
      toast.success("Interest expressed!", { description: "The listing owner will be notified." });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      toast.error(error.message || "Failed to express interest");
    }
  }

  async function handleSave() {
    startTransition(() => {
      setOptimisticallySaved(true);
    });
    try {
      await saveListing(listing.id);
      toast.success("Listing saved!");
    } catch {
      toast.error("Failed to save listing");
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <div className="flex items-center justify-between">
        <Button render={<Link href="/listings" />} variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Feed
        </Button>
        {(isOwn || currentUserProfile?.user?.role === "ADMIN") && (
          <Button render={<Link href={`/listings/${listing.id}/edit`} />} variant="outline" className="gap-2">
            <Pencil className="w-4 h-4" />
            Edit Listing
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Card>
              <CardContent className="p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h1 className="text-2xl font-bold">{listing.title}</h1>
                    <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Posted {formatDate(listing.createdAt)}
                    </div>
                  </div>
                  {listing.user?.profile && currentUserProfile && !isOwn && (
                    <CompatibilityBadge 
                      score={calculateCompatibility(currentUserProfile, listing.user.profile, listing)} 
                    />
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className="gap-1.5">
                    {listing.accommodationType === "HOSTEL" ? (
                      <Building2 className="w-3.5 h-3.5" />
                    ) : (
                      <Home className="w-3.5 h-3.5" />
                    )}
                    {enumToLabel(listing.accommodationType)}
                  </Badge>
                  <Badge variant="outline" className="gap-1.5">
                    <Users className="w-3.5 h-3.5" />
                    {remaining} of {listing.numberRequired} spot{listing.numberRequired > 1 ? "s" : ""} remaining
                  </Badge>
                  <Badge variant="outline">{enumToLabel(listing.genderPreference)} Only</Badge>
                  <Badge variant="outline">{enumToLabel(listing.currentStatus)}</Badge>
                </div>

                {listing.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground whitespace-pre-wrap">{listing.description}</p>
                  </div>
                )}

                {/* Type-specific Details */}
                <div className="grid gap-3 sm:grid-cols-2">
                  {listing.moveInDate && (
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Move-in: {formatDate(listing.moveInDate)}</span>
                    </div>
                  )}
                  {listing.occupancyType && (
                    <div className="flex items-center gap-2 text-sm">
                      <Bed className="w-4 h-4 text-muted-foreground" />
                      <span>{enumToLabel(listing.occupancyType)} Occupancy</span>
                    </div>
                  )}
                  {listing.hostelBlock && (
                    <div className="flex items-center gap-2 text-sm">
                      <Building2 className="w-4 h-4 text-muted-foreground" />
                      <span>Block: {listing.hostelBlock}</span>
                    </div>
                  )}
                  {listing.location && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span>{listing.location}</span>
                    </div>
                  )}
                  {(listing.minBudget || listing.maxBudget) && (
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-muted-foreground" />
                      <span>{formatBudget(listing.minBudget, listing.maxBudget)}</span>
                    </div>
                  )}
                  {listing.furnishedStatus && (
                    <div className="flex items-center gap-2 text-sm">
                      <Sofa className="w-4 h-4 text-muted-foreground" />
                      <span>{enumToLabel(listing.furnishedStatus)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {!isOwn && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      <Button 
                        className="flex-1 gradient-primary gap-2" 
                        onClick={handleInterest}
                        disabled={isOptimisticallyInterested}
                      >
                        <Heart className={cn("w-4 h-4", isOptimisticallyInterested && "fill-current text-white")} />
                        {isOptimisticallyInterested ? "Interest Sent" : "I'm Interested"}
                      </Button>
                      <Button variant="outline" className="gap-2" onClick={handleSave}>
                        <Bookmark className={cn("w-4 h-4", isOptimisticallySaved && "fill-current text-primary")} />
                        {isOptimisticallySaved ? "Saved" : "Save"}
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => setReportOpen(true)}>
                        <Flag className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Sidebar — User Profile */}
        <div className="space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Listed By</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={listing.user?.image || ""} />
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {listing.user?.name ? getInitials(listing.user.name) : "?"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{listing.user?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {listing.user?.studentStatus === "PENDING_VERIFICATION" && (!profile || !profile.programCode)
                        ? "Incoming Fresher"
                        : profile?.programCode
                          ? `${getReadableProgramName(profile.programCode)} • ${getReadableAcademicYear(computeCurrentAcademicYear(profile.admissionYear))}`
                          : "Verified Student"
                      }
                    </p>
                  </div>
                </div>

                {profile && (
                  <div className="space-y-3">
                    <Separator />
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-lg bg-muted/50 p-2">
                        <span className="text-muted-foreground">Sleep</span>
                        <p className="font-medium">{enumToLabel(profile.sleepSchedule)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <span className="text-muted-foreground">Clean</span>
                        <p className="font-medium">{profile.cleanlinessLevel}/5</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <span className="text-muted-foreground">Smoking</span>
                        <p className="font-medium">{enumToLabel(profile.smoking)}</p>
                      </div>
                      <div className="rounded-lg bg-muted/50 p-2">
                        <span className="text-muted-foreground">Drinking</span>
                        <p className="font-medium">{enumToLabel(profile.drinking)}</p>
                      </div>
                      {profile.vaping && (
                        <div className="rounded-lg bg-muted/50 p-2">
                          <span className="text-muted-foreground">Vaping</span>
                          <p className="font-medium">{enumToLabel(profile.vaping)}</p>
                        </div>
                      )}
                      {profile.studyEnvironment && (
                        <div className="rounded-lg bg-muted/50 p-2">
                          <span className="text-muted-foreground">Study Env</span>
                          <p className="font-medium">{enumToLabel(profile.studyEnvironment)}</p>
                        </div>
                      )}
                      {profile.guestsPreference && (
                        <div className="rounded-lg bg-muted/50 p-2">
                          <span className="text-muted-foreground">Guests</span>
                          <p className="font-medium">{enumToLabel(profile.guestsPreference)}</p>
                        </div>
                      )}
                    </div>
                    {profile.otherHabits && (
                      <div className="text-xs">
                        <p className="font-medium text-foreground mb-1">Other Habits</p>
                        <p className="text-muted-foreground">{profile.otherHabits}</p>
                      </div>
                    )}
                    {profile.languages && profile.languages.length > 0 && (
                      <div className="text-xs">
                        <p className="font-medium text-foreground mb-1.5">Languages</p>
                        <div className="flex flex-wrap gap-1">
                          {profile.languages.map((lang: string) => (
                            <Badge key={lang} variant="secondary" className="text-[10px] px-1.5 py-0">{lang}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {profile.aboutMe && (
                      <div className="text-xs text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">About</p>
                        {profile.aboutMe}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>

      <ReportDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        targetType="LISTING"
        targetId={listing.id}
      />
    </div>
  );
}
