"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutGrid,
  List,
  Heart,
  Users,
  Bookmark,
  UserCircle,
  BarChart3,
  Flag,
  TrendingUp,
  LogOut,
  ChevronLeft,
  Building2,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS, ADMIN_NAV_ITEMS, APP_NAME } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  LayoutGrid,
  List,
  Heart,
  Users,
  Bookmark,
  UserCircle,
  BarChart3,
  Flag,
  TrendingUp,
};

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <aside
      className={cn(
        "fixed left-5 top-5 z-40 flex h-[calc(100vh-2.5rem)] flex-col overflow-hidden rounded-[32px] border border-border/80 bg-white transition-all duration-300 air-shadow",
        collapsed ? "w-[84px]" : "w-[288px]"
      )}
    >
      <div className="flex h-20 items-center justify-between border-b border-border/70 px-5">
        <Link href="/listings" className="flex items-center gap-3 overflow-hidden">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white">
            <Building2 className="h-6 w-6" />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-base font-semibold tracking-[-0.02em]">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">Bennett roommate matching</p>
            </div>
          )}
        </Link>
        <Button variant="ghost" size="icon-sm" onClick={onToggle} className="hidden lg:inline-flex">
          <ChevronLeft className={cn("h-4 w-4 transition-transform", collapsed && "rotate-180")} />
        </Button>
      </div>

      <ScrollArea className="flex-1 px-4 py-5">
        <nav className="space-y-1.5">
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutGrid;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link key={item.href} href={item.href}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all",
                    isActive
                      ? "bg-[#fff1f3] text-primary"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <Icon className="h-4.5 w-4.5 shrink-0" />
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>
              </Link>
            );
          })}
        </nav>

        {isAdmin && (
          <>
            <Separator className="my-5" />
            {!collapsed && (
              <div className="mb-3 flex items-center gap-2 px-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                <Shield className="h-3.5 w-3.5" />
                Admin
              </div>
            )}
            <nav className="space-y-1.5">
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon] || BarChart3;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link key={item.href} href={item.href}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-medium transition-all",
                        isActive
                          ? "bg-[#fff1f3] text-primary"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      )}
                    >
                      <Icon className="h-4.5 w-4.5 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </>
        )}
      </ScrollArea>

      <div className="border-t border-border/70 p-4">
        <div className={cn("surface-subtle flex items-center gap-3 p-3", collapsed && "justify-center px-2") }>
          <Avatar className="h-11 w-11 shrink-0">
            <AvatarImage src={session?.user?.image || ""} />
            <AvatarFallback className="bg-primary/10 text-primary text-xs">
              {session?.user?.name ? getInitials(session.user.name) : "?"}
            </AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{session?.user?.name}</p>
                <p className="truncate text-xs text-muted-foreground">{session?.user?.email}</p>
              </div>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
