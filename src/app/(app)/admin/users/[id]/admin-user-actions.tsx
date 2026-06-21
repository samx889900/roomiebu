"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { suspendUser, banUser, restoreUser } from "../../actions";
import { toast } from "sonner";
import { Ban, ShieldAlert, ShieldCheck } from "lucide-react";

export function AdminUserActions({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  const handleAction = async (action: "suspend" | "ban" | "restore") => {
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    setLoading(true);
    try {
      if (action === "suspend") {
        await suspendUser(user.id, "Suspended by admin via user details page");
        toast.success("User suspended successfully");
      } else if (action === "ban") {
        await banUser(user.id, "Banned by admin via user details page");
        toast.success("User banned successfully");
      } else if (action === "restore") {
        await restoreUser(user.id);
        toast.success("User restored successfully");
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {user.isSuspended || user.isBanned ? (
        <Button 
          onClick={() => handleAction("restore")} 
          disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700"
        >
          <ShieldCheck className="w-4 h-4 mr-2" />
          {user.isBanned ? "Unban User" : "Unsuspend User"}
        </Button>
      ) : (
        <>
          <Button 
            variant="secondary"
            onClick={() => handleAction("suspend")} 
            disabled={loading}
            className="w-full bg-orange-100 text-orange-800 hover:bg-orange-200"
          >
            <ShieldAlert className="w-4 h-4 mr-2" />
            Suspend User
          </Button>
          <Button 
            variant="destructive"
            onClick={() => handleAction("ban")} 
            disabled={loading}
            className="w-full"
          >
            <Ban className="w-4 h-4 mr-2" />
            Ban User
          </Button>
        </>
      )}
    </div>
  );
}
