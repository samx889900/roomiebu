"use client";

import { useState } from "react";
import { Sidebar } from "./sidebar";
import { Header } from "./header";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="page-shell">
      <div className="hidden lg:block">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </div>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-[300px] border-r border-border bg-white p-0">
          <Sidebar collapsed={false} onToggle={() => setMobileMenuOpen(false)} isMobile={true} />
        </SheetContent>
      </Sheet>

      <div
        className={cn(
          "transition-all duration-300 ease-out",
          sidebarCollapsed ? "lg:ml-[104px]" : "lg:ml-[308px]"
        )}
      >
        <Header onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        <main className="content-wrap pb-10 pt-6 md:pt-8">{children}</main>
      </div>
    </div>
  );
}
