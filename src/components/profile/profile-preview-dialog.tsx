"use client";

import { ReactNode, useState, useTransition } from "react";
import { getProfilePreview } from "@/app/(app)/profile/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { enumToLabel, getInitials } from "@/lib/utils";
import { getReadableProgramName } from "@/lib/academic/mapping";
import { computeCurrentAcademicYear, getReadableAcademicYear } from "@/lib/academic/year";
import { Check, AlertTriangle, Loader2 } from "lucide-react";

interface ProfilePreviewDialogProps {
  userId: string;
  listingId?: string;
  children: ReactNode;
}

export function ProfilePreviewDialog({ userId, listingId, children }: ProfilePreviewDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(null);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen && !data) {
      startTransition(async () => {
        try {
          const result = await getProfilePreview(userId, listingId);
          setData(result);
        } catch (e) {
          console.error(e);
        }
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={children as React.ReactElement} />
      <DialogContent className="sm:max-w-[425px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Profile Preview</DialogTitle>
        </DialogHeader>

        {isPending ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : data?.targetUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={data.targetUser.image || ""} />
                <AvatarFallback>{getInitials(data.targetUser.name || "?")}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-lg">{data.targetUser.name}</h3>
                {data.targetUser.studentStatus === "PENDING_VERIFICATION" && (!data.targetUser.profile || !data.targetUser.profile.programCode) ? (
                  <Badge variant="outline" className="text-xs">Incoming Fresher</Badge>
                ) : (
                  <Badge variant="secondary" className="text-xs">Verified Student</Badge>
                )}
              </div>
            </div>

            {data.compatibility !== null && (
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Compatibility</span>
                  <span className="text-primary font-bold">{data.compatibility}%</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {data.compatibilityDetails.map((detail: string, i: number) => (
                    <li key={i} className="flex items-center gap-1.5">
                      {detail.startsWith("✓") ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      )}
                      <span>{detail.slice(2)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {data.targetUser.profile && (
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium mb-1">Academic</h4>
                  <p className="text-muted-foreground">
                    {data.targetUser.profile.programCode ? getReadableProgramName(data.targetUser.profile.programCode) : "Not specified"} • 
                    {data.targetUser.profile.admissionYear ? ` ${getReadableAcademicYear(computeCurrentAcademicYear(data.targetUser.profile.admissionYear))}` : ""}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-1">Preferences</h4>
                  <div className="flex flex-wrap gap-2 text-muted-foreground">
                    {data.targetUser.profile.accommodationType && <Badge variant="outline">{enumToLabel(data.targetUser.profile.accommodationType)}</Badge>}
                    {data.targetUser.profile.gender && <Badge variant="outline">Gender: {enumToLabel(data.targetUser.profile.gender)}</Badge>}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-1">Lifestyle</h4>
                  <div className="flex flex-wrap gap-2 text-muted-foreground">
                    {data.targetUser.profile.smoking && <Badge variant="secondary">Smoking: {enumToLabel(data.targetUser.profile.smoking)}</Badge>}
                    {data.targetUser.profile.drinking && <Badge variant="secondary">Drinking: {enumToLabel(data.targetUser.profile.drinking)}</Badge>}
                    {data.targetUser.profile.sleepSchedule && <Badge variant="secondary">Sleep: {enumToLabel(data.targetUser.profile.sleepSchedule)}</Badge>}
                    {data.targetUser.profile.cleanlinessLevel != null && <Badge variant="secondary">Cleanliness: {data.targetUser.profile.cleanlinessLevel}/5</Badge>}
                    {data.targetUser.profile.studyEnvironment && <Badge variant="secondary">Study: {enumToLabel(data.targetUser.profile.studyEnvironment)}</Badge>}
                    {data.targetUser.profile.guestsPreference && <Badge variant="secondary">Guests: {enumToLabel(data.targetUser.profile.guestsPreference)}</Badge>}
                  </div>
                </div>

                {data.targetUser.profile.languages && data.targetUser.profile.languages.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-1">Languages</h4>
                    <p className="text-muted-foreground">{data.targetUser.profile.languages.map(enumToLabel).join(", ")}</p>
                  </div>
                )}

                {data.targetUser.profile.aboutMe && (
                  <div>
                    <h4 className="font-medium mb-1">About</h4>
                    <p className="text-muted-foreground">{data.targetUser.profile.aboutMe}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            Failed to load profile.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
