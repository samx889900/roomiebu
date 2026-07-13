/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars */
"use client";

import { motion } from "framer-motion";
import { ArrowLeft, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { enumToLabel, formatRelativeDate, formatDate, getInitials, formatBudget } from "@/lib/utils";
import { getReadableProgramName } from "@/lib/academic/mapping";
import { computeCurrentAcademicYear, getReadableAcademicYear } from "@/lib/academic/year";
import { calculateCompatibility } from "@/lib/compatibility";
import { ProfilePreviewDialog } from "@/components/profile/profile-preview-dialog";
import Link from "next/link";

const statusColors: Record<string, string> = {
  PENDING: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ACCEPTED: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  REJECTED: "bg-red-500/10 text-red-400 border-red-500/20",
};

export function AdminListingDetailClient({ listing }: { listing: any }) {
  const pending = listing.interests.filter((i: any) => i.status === "PENDING").length;
  const accepted = listing.interests.filter((i: any) => i.status === "ACCEPTED").length;
  const rejected = listing.interests.filter((i: any) => i.status === "REJECTED").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button render={<Link href="/admin/listings" />} variant="ghost" size="icon">
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Listing Details</h1>
          <p className="text-muted-foreground">{listing.title}</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Listing Summary */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-10 w-10">
                <AvatarImage src={listing.user?.image || ""} />
                <AvatarFallback>{getInitials(listing.user?.name || "?")}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{listing.user?.name}</p>
                <p className="text-xs text-muted-foreground">Listing Owner</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-muted-foreground block">Type</span>
                <span className="font-medium">{enumToLabel(listing.accommodationType)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Budget</span>
                <span className="font-medium">{formatBudget(listing.minBudget, listing.maxBudget)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Occupancy</span>
                <span className="font-medium">{enumToLabel(listing.occupancyType)}</span>
              </div>
              <div>
                <span className="text-muted-foreground block">Created At</span>
                <span className="font-medium">{formatDate(listing.createdAt)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interests Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Interests Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Total</span>
                <span className="font-bold">{listing.interests.length}</span>
              </div>
              <div className="flex justify-between items-center text-amber-500">
                <span>Pending</span>
                <span className="font-bold">{pending}</span>
              </div>
              <div className="flex justify-between items-center text-emerald-500">
                <span>Accepted</span>
                <span className="font-bold">{accepted}</span>
              </div>
              <div className="flex justify-between items-center text-red-500">
                <span>Rejected</span>
                <span className="font-bold">{rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Interested Students</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Mobile Card List (visible on small screens) */}
          <div className="block md:hidden">
            {listing.interests.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No interests received yet.
              </div>
            ) : (
              <div className="space-y-4">
                {listing.interests.map((interest: any) => {
                  const profile = interest.interestedUser.profile;
                  const comp = (listing.user?.profile && profile)
                    ? calculateCompatibility(listing.user.profile, profile, listing)
                    : null;

                  return (
                    <div key={interest.id} className="p-4 border border-zinc-100 rounded-2xl space-y-3 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={interest.interestedUser.image || ""} />
                            <AvatarFallback>{getInitials(interest.interestedUser.name || "?")}</AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <span className="font-semibold block truncate text-sm">{interest.interestedUser.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {profile?.gender ? enumToLabel(profile.gender) : "Gender N/A"}
                            </span>
                          </div>
                        </div>
                        <Badge variant="outline" className={`shrink-0 text-xs ${statusColors[interest.status]}`}>
                          {enumToLabel(interest.status)}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground bg-zinc-50/50 p-2.5 rounded-xl border border-zinc-100/50">
                        <div className="min-w-0">
                          <span className="block text-[10px] uppercase font-semibold text-zinc-400 mb-0.5">Academic</span>
                          <span className="block truncate">
                            {profile?.programCode ? getReadableProgramName(profile.programCode) : "N/A"}
                          </span>
                          {profile?.admissionYear && (
                            <span className="block text-[10px] text-zinc-400 mt-0.5 truncate">
                              {getReadableAcademicYear(computeCurrentAcademicYear(profile.admissionYear))}
                            </span>
                          )}
                        </div>
                        <div>
                          <span className="block text-[10px] uppercase font-semibold text-zinc-400 mb-0.5">Compatibility</span>
                          <span className="font-bold text-primary text-sm">
                            {comp !== null ? `${comp}%` : "N/A"}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1 gap-2">
                        <span className="text-[11px] text-muted-foreground truncate">
                          Submitted {formatRelativeDate(interest.createdAt)}
                        </span>
                        <ProfilePreviewDialog userId={interest.interestedUser.id} listingId={listing.id}>
                          <Button size="xs" variant="outline" className="gap-1.5 py-1 px-3 text-xs shadow-sm">
                            <User className="w-3 h-3" /> View Profile
                          </Button>
                        </ProfilePreviewDialog>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Desktop Table View (visible on medium+ screens) */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Academic</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Compatibility</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {listing.interests.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No interests received yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  listing.interests.map((interest: any) => {
                    const profile = interest.interestedUser.profile;
                    const comp = (listing.user?.profile && profile)
                      ? calculateCompatibility(listing.user.profile, profile, listing)
                      : null;

                    return (
                      <TableRow key={interest.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={interest.interestedUser.image || ""} />
                              <AvatarFallback>{getInitials(interest.interestedUser.name || "?")}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{interest.interestedUser.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {profile?.programCode ? getReadableProgramName(profile.programCode) : "N/A"}
                          <br />
                          {profile?.admissionYear ? getReadableAcademicYear(computeCurrentAcademicYear(profile.admissionYear)) : ""}
                        </TableCell>
                        <TableCell>
                          {profile?.gender ? enumToLabel(profile.gender) : "N/A"}
                        </TableCell>
                        <TableCell>
                          {comp !== null ? `${comp}%` : "N/A"}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={statusColors[interest.status]}>
                            {enumToLabel(interest.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {formatRelativeDate(interest.createdAt)}
                        </TableCell>
                        <TableCell>
                          <ProfilePreviewDialog userId={interest.interestedUser.id} listingId={listing.id}>
                            <Button size="sm" variant="ghost" className="gap-2 text-xs">
                              <User className="w-3 h-3" /> View Profile
                            </Button>
                          </ProfilePreviewDialog>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
