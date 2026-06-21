"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { suspendUser, banUser, restoreUser, deleteUser } from "../../actions";
import { toast } from "sonner";
import { Ban, ShieldAlert, ShieldCheck, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function AdminUserActions({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAction = async (action: "suspend" | "ban" | "restore" | "delete") => {
    if (action === "delete") {
      if (!confirm(`WARNING: Are you absolutely sure you want to PERMANENTLY DELETE this user? This action cannot be undone and will remove all their listings, interests, and profile data.`)) return;
    } else {
      if (!confirm(`Are you sure you want to ${action} this user?`)) return;
    }

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
      } else if (action === "delete") {
        await deleteUser(user.id);
        toast.success("User deleted permanently");
        router.push("/admin/users");
      }
    } catch (error) {
      toast.error(`Failed to ${action} user`);
      setLoading(false);
    } finally {
      if (action !== "delete") {
        setLoading(false);
      }
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
      
      <div className="border-t border-red-200 my-1 pt-3">
        <Button 
          variant="outline"
          onClick={() => handleAction("delete")} 
          disabled={loading}
          className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Delete User Permanently
        </Button>
      </div>
    </div>
  );
}
