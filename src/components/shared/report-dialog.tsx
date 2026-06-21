"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Flag } from "lucide-react";
import { toast } from "sonner";
import { createReport } from "@/app/(app)/reports/actions";

const reportSchema = z.object({
  reason: z.enum(["SPAM", "FAKE_LISTING", "HARASSMENT", "SCAM", "INAPPROPRIATE_CONTENT", "OTHER"]),
  notes: z.string().max(500).optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

const REPORT_REASONS = [
  { value: "SPAM", label: "Spam" },
  { value: "FAKE_LISTING", label: "Fake Listing" },
  { value: "HARASSMENT", label: "Harassment" },
  { value: "SCAM", label: "Scam" },
  { value: "INAPPROPRIATE_CONTENT", label: "Inappropriate Content" },
  { value: "OTHER", label: "Other" },
] as const;

interface ReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetType: "USER" | "LISTING";
  targetId: string;
}

export function ReportDialog({ open, onOpenChange, targetType, targetId }: ReportDialogProps) {
  const [loading, setLoading] = useState(false);

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
  });

  async function onSubmit(data: ReportForm) {
    setLoading(true);
    try {
      await createReport({
        targetType,
        targetId,
        reason: data.reason,
        notes: data.notes,
      });
      toast.success("Report submitted", {
        description: "Thank you for helping keep the community safe.",
      });
      onOpenChange(false);
      form.reset();
    } catch {
      toast.error("Failed to submit report");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass-strong border-border sm:max-w-md max-h-[90dvh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-destructive" />
            Report {targetType === "USER" ? "User" : "Listing"}
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe community. Please provide details about the issue.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Reason</Label>
            <Select onValueChange={(v: any /* eslint-disable-line @typescript-eslint/no-explicit-any */) => form.setValue("reason", v as ReportForm["reason"])}>
              <SelectTrigger>
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {REPORT_REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {form.formState.errors.reason && (
              <p className="text-xs text-destructive">{form.formState.errors.reason.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Additional Notes (optional)</Label>
            <Textarea
              {...form.register("notes")}
              placeholder="Provide any additional details..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive" disabled={loading}>
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

