"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Flag, Check, Ban, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { enumToLabel, formatRelativeDate } from "@/lib/utils";
import { resolveReport, suspendUser, banUser } from "../actions";
import { toast } from "sonner";

export function ReportsClient({ reports }: { reports: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  async function handleResolve(id: string) {
    try {
      await resolveReport(id, "Resolved by admin");
      toast.success("Report resolved");
    } catch { toast.error("Failed to resolve"); }
  }

  async function handleSuspend(userId: string) {
    try {
      await suspendUser(userId, "Suspended due to report");
      toast.success("User suspended");
    } catch { toast.error("Failed to suspend"); }
  }

  async function handleBan(userId: string) {
    try {
      await banUser(userId, "Banned due to report");
      toast.success("User banned");
    } catch { toast.error("Failed to ban"); }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <p className="text-muted-foreground">Review and moderate reported content</p>
      </div>

      {reports.length === 0 ? (
        <EmptyState icon={Flag} title="No reports" description="No reports have been submitted yet." />
      ) : (
        <div className="space-y-4">
          {reports.map((report, i) => (
            <motion.div key={report.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card className={report.isResolved ? "opacity-60" : ""}>
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className={report.isResolved ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}>
                          {report.isResolved ? "Resolved" : "Pending"}
                        </Badge>
                        <Badge variant="outline">{report.targetType}</Badge>
                        <Badge variant="outline">{enumToLabel(report.reason)}</Badge>
                      </div>
                      <p className="text-sm">
                        <span className="text-muted-foreground">Reported by:</span>{" "}
                        {report.reporter?.name} ({report.reporter?.email})
                      </p>
                      {report.targetUser && (
                        <p className="text-sm"><span className="text-muted-foreground">Target user:</span> {report.targetUser.name}</p>
                      )}
                      {report.targetListing && (
                        <div className="flex flex-col gap-1 mb-2">
                          <p className="text-sm"><span className="text-muted-foreground">Target listing:</span> {report.targetListing.title}</p>
                          <Link href={`/listings/${report.targetListing.id}`} target="_blank" className="text-primary hover:underline text-xs flex items-center w-fit">
                            View Listing ↗
                          </Link>
                        </div>
                      )}
                      {report.notes && <p className="text-xs text-muted-foreground mt-2">{report.notes}</p>}
                      <p className="text-xs text-muted-foreground/60 mt-2">{formatRelativeDate(report.createdAt)}</p>
                    </div>
                    {!report.isResolved && (
                      <div className="flex flex-col gap-2">
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => handleResolve(report.id)}>
                          <Check className="w-3 h-3" /> Resolve
                        </Button>
                        {report.targetUserId && (
                          <>
                            <Button size="sm" variant="outline" className="gap-1 text-amber-400" onClick={() => handleSuspend(report.targetUserId)}>
                              <Shield className="w-3 h-3" /> Suspend
                            </Button>
                            <Button size="sm" variant="outline" className="gap-1 text-destructive" onClick={() => handleBan(report.targetUserId)}>
                              <Ban className="w-3 h-3" /> Ban
                            </Button>
                          </>
                        )}
                      </div>
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

