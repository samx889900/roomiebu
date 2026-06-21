"use client";

import { motion } from "framer-motion";
import { Users, Shield, Ban, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EmptyState } from "@/components/shared/empty-state";
import Link from "next/link";
import { getInitials, formatDate } from "@/lib/utils";
import { suspendUser, banUser, restoreUser } from "../actions";
import { toast } from "sonner";

export function UsersClient({ users }: { users: any[] /* eslint-disable-line @typescript-eslint/no-explicit-any */ }) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <p className="text-muted-foreground">{users.length} registered users</p>
      </div>

      {users.length === 0 ? (
        <EmptyState icon={Users} title="No users" description="No users registered yet." />
      ) : (
        <div className="space-y-3">
          {users.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
              <Card className={user.isBanned ? "opacity-50 border-destructive/30" : user.isSuspended ? "opacity-70 border-amber-500/30" : ""}>
                <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <Avatar className="h-10 w-10 shrink-0">
                      <AvatarImage src={user.image || ""} />
                      <AvatarFallback className="bg-primary/10 text-primary text-xs">
                        {user.name ? getInitials(user.name) : "?"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link href={`/admin/users/${user.id}`} className="font-medium truncate hover:underline" prefetch={false}>{user.name}</Link>
                        {user.role === "ADMIN" && <Badge className="gradient-primary border-0 text-[10px]">Admin</Badge>}
                        {user.isBanned && <Badge variant="destructive" className="text-[10px]">Banned</Badge>}
                        {user.isSuspended && <Badge className="bg-amber-500/10 text-amber-400 border-amber-500/20 text-[10px]">Suspended</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <p className="text-[10px] text-muted-foreground">
                        {user._count.listings} listings • {user._count.matchesAsA + user._count.matchesAsB} matches • Joined {formatDate(user.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1.5 sm:w-auto w-full">
                    {user.isBanned || user.isSuspended ? (
                      <Button size="sm" variant="outline" className="gap-1 flex-1 sm:flex-none" onClick={async () => { await restoreUser(user.id); toast.success("User restored"); }}>
                        <RotateCcw className="w-3 h-3" /> Restore
                      </Button>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" className="text-amber-400 gap-1 flex-1 sm:flex-none justify-center bg-amber-400/10 sm:bg-transparent" onClick={async () => { await suspendUser(user.id, "Admin action"); toast.success("Suspended"); }}>
                          <Shield className="w-3 h-3" /> <span className="sm:hidden">Suspend</span>
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive gap-1 flex-1 sm:flex-none justify-center bg-destructive/10 sm:bg-transparent" onClick={async () => { await banUser(user.id, "Admin action"); toast.success("Banned"); }}>
                          <Ban className="w-3 h-3" /> <span className="sm:hidden">Ban</span>
                        </Button>
                      </>
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

