"use client";

import Link from "next/link";
import Image from "next/image";
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
  isMobile?: boolean;
}

export function Sidebar({ collapsed, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <aside
      className={cn(
        "z-40 flex flex-col overflow-hidden bg-white transition-all duration-300",
        isMobile
          ? "w-full h-[100dvh] pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
          : cn(
              "fixed left-5 top-5 h-[calc(100vh-2.5rem)] rounded-[32px] border border-border/80 air-shadow",
              collapsed ? "w-[84px]" : "w-[288px]"
            )
      )}
    >
      {/* Header */}
      <div className={cn(
        "flex h-20 items-center border-b border-border/70 shrink-0",
        collapsed ? "justify-center px-2" : "justify-between px-5"
      )}>
        <Link href="/listings" className={cn(
          "flex items-center overflow-hidden",
          collapsed ? "justify-center" : "gap-3"
        )}>
          <div className={cn(
            "flex items-center justify-center shrink-0",
            collapsed ? "h-10 w-10" : "h-12 w-12"
          )}>
            <Image 
              src="/logo.png" 
              alt="RoomieBU" 
              width={48} 
              height={48} 
              className={cn("object-contain", collapsed ? "h-8 w-8" : "h-10 w-10")} 
              priority 
            />
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-base font-semibold tracking-[-0.02em]">{APP_NAME}</p>
              <p className="text-xs text-muted-foreground">Bennett roommate matching</p>
            </div>
          )}
        </Link>
        {!collapsed && (
          <Button variant="ghost" size="icon-sm" onClick={onToggle} className="hidden lg:inline-flex shrink-0">
            <ChevronLeft className="h-4 w-4 transition-transform" />
          </Button>
        )}
        {collapsed && (
          <Button variant="ghost" size="icon-sm" onClick={onToggle} className="hidden lg:inline-flex absolute right-1 top-7">
            <ChevronLeft className="h-4 w-4 rotate-180 transition-transform" />
          </Button>
        )}
      </div>

      {/* Nav */}
      <ScrollArea className="flex-1 py-5 min-h-0">
        <nav className={cn("space-y-1.5", collapsed ? "px-2" : "px-4")}>
          {NAV_ITEMS.map((item) => {
            const Icon = iconMap[item.icon] || LayoutGrid;
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link key={item.href} href={item.href} onClick={() => { if (isMobile) onToggle(); }}>
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-full text-sm font-medium transition-all",
                    collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
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
            <nav className={cn("space-y-1.5", collapsed ? "px-2" : "px-4")}>
              {ADMIN_NAV_ITEMS.map((item) => {
                const Icon = iconMap[item.icon] || BarChart3;
                const isActive = pathname === item.href || pathname.startsWith(item.href + "/");

                return (
                  <Link key={item.href} href={item.href} onClick={() => { if (isMobile) onToggle(); }}>
                    <div
                      className={cn(
                        "flex items-center gap-3 rounded-full text-sm font-medium transition-all",
                        collapsed ? "justify-center px-0 py-3" : "px-4 py-3",
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

      {/* Footer */}
      <div className={cn("border-t border-border/70", collapsed ? "p-2" : "p-4")}>
        <div className={cn(
          "surface-subtle flex items-center",
          collapsed ? "justify-center p-2" : "gap-3 p-3"
        )}>
          <Avatar className={cn("shrink-0", collapsed ? "h-9 w-9" : "h-11 w-11")}>
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
