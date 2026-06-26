"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function SignInButton({ children, size, variant, className }: SignInButtonProps) {
  return (
    <Button
      onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/listings" })}
      size={size}
      variant={variant}
      className={className}
    >
      {children}
    </Button>
  );
}
