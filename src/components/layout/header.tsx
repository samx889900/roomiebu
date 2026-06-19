"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials } from "@/lib/utils";
import { useNotificationStore } from "@/store/use-notification-store";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const unreadCount = useNotificationStore((s) => s.unreadCount);

  return (
    <header className="sticky top-0 z-30 h-16 border-b border-border glass-strong">
      <div className="flex items-center justify-between h-full px-4 md:px-6">
        {/* Left: Mobile menu + Search */}
        <div className="flex items-center gap-3 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden h-9 w-9"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden sm:flex relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search listings, people..."
              className="pl-9 bg-muted/30 border-border/50 h-9"
            />
          </div>
        </div>

        {/* Right: Notifications + Profile */}
        <div className="flex items-center gap-2">
          <Button render={<Link href="/notifications" />} variant="ghost" size="icon" className="relative h-9 w-9">
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary" />
            )}
          </Button>
          <Link href="/profile">
            <Avatar className="h-8 w-8 ring-2 ring-primary/20 hover:ring-primary/40 transition-all cursor-pointer">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {session?.user?.name ? getInitials(session.user.name) : "?"}
              </AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  );
}
