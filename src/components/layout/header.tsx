"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { getUnreadCount } from "@/app/(app)/notifications/actions";
import { useEffect, useState } from "react";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { data: session } = useSession();
  const [unreadCount, setUnreadCount] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (session?.user) {
      getUnreadCount().then(setUnreadCount);
    }
  }, [session?.user]);

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 topbar-blur">
      <div className="content-wrap flex h-20 items-center gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMobileMenuToggle}
            className="lg:hidden"
          >
            <Menu className="w-5 h-5" />
          </Button>
          <div className="hidden flex-1 md:block">
            <form 
              className="relative max-w-xl"
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                const q = formData.get("q") as string;
                if (q.trim()) {
                  router.push(`/listings?q=${encodeURIComponent(q.trim())}`);
                } else {
                  router.push("/listings");
                }
              }}
            >
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                type="search"
                placeholder="Search listings, areas, lifestyles..."
                className="h-12 rounded-full border-border bg-white pl-11 shadow-none"
              />
            </form>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button render={<Link href="/notifications" />} variant="outline" size="icon" className="relative bg-white">
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-primary" />
            )}
          </Button>
          <Link href="/profile" className="surface-subtle flex items-center gap-3 px-2 py-1.5 pr-3 transition hover:border-foreground/10 min-w-0 max-w-full">
            <Avatar className="h-10 w-10 shrink-0">
              <AvatarImage src={session?.user?.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {session?.user?.name ? getInitials(session.user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden text-left sm:block min-w-0">
              <p className="max-w-28 truncate text-sm font-medium text-foreground">{session?.user?.name}</p>
              <p className="max-w-28 truncate text-xs text-muted-foreground">{session?.user?.role === "ADMIN" ? "Admin" : "Student"}</p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
