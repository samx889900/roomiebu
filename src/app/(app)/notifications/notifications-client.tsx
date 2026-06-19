"use client";

import { motion } from "framer-motion";
import { Bell, Heart, Check, X, AlertTriangle, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeDate, cn } from "@/lib/utils";
import { markAsRead, markAllAsRead } from "./actions";
import { toast } from "sonner";

const typeIcons: Record<string, React.ReactNode> = {
  NEW_INTEREST: <Heart className="w-4 h-4 text-pink-400" />,
  INTEREST_ACCEPTED: <Check className="w-4 h-4 text-emerald-400" />,
  INTEREST_REJECTED: <X className="w-4 h-4 text-red-400" />,
  LISTING_EXPIRING: <AlertTriangle className="w-4 h-4 text-amber-400" />,
  LISTING_FILLED: <CheckCheck className="w-4 h-4 text-blue-400" />,
  LISTING_REPORTED: <AlertTriangle className="w-4 h-4 text-red-400" />,
};

export function NotificationsClient({ notifications }: { notifications: any[] }) {
  const unread = notifications.filter((n) => !n.isRead);

  async function handleMarkAll() {
    try {
      await markAllAsRead();
      toast.success("All marked as read");
    } catch {
      toast.error("Failed to update");
    }
  }

  async function handleMarkOne(id: string) {
    try {
      await markAsRead(id);
    } catch {
      toast.error("Failed to update");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">{unread.length} unread notification{unread.length !== 1 ? "s" : ""}</p>
        </div>
        {unread.length > 0 && (
          <Button variant="outline" size="sm" onClick={handleMarkAll}>
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState icon={Bell} title="No notifications" description="You're all caught up! Notifications will appear here when there's activity on your listings." />
      ) : (
        <div className="space-y-2">
          {notifications.map((notif, i) => (
            <motion.div key={notif.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}>
              <Card
                className={cn(
                  "cursor-pointer transition-colors",
                  !notif.isRead ? "border-primary/20 bg-primary/[0.02]" : "opacity-70"
                )}
                onClick={() => !notif.isRead && handleMarkOne(notif.id)}
              >
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center flex-shrink-0">
                    {typeIcons[notif.type] || <Bell className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm", !notif.isRead && "font-semibold")}>{notif.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{notif.message}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{formatRelativeDate(notif.createdAt)}</p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 rounded-full gradient-primary flex-shrink-0 mt-2" />}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
