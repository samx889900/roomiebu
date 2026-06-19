"use client";

import { SessionProvider } from "next-auth/react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <TooltipProvider delay={200}>
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.14 0.015 280 / 90%)",
              backdropFilter: "blur(16px)",
              border: "1px solid oklch(1 0 0 / 8%)",
              color: "oklch(0.95 0.01 280)",
            },
          }}
        />
      </TooltipProvider>
    </SessionProvider>
  );
}
