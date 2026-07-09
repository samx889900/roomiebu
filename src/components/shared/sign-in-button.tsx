"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface SignInButtonProps {
  children: React.ReactNode;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  className?: string;
}

export function SignInButton({ children, size, variant, className }: SignInButtonProps) {
  const router = useRouter();
  
  return (
    <Button
      onClick={() => router.push("/auth/signin")}
      size={size}
      variant={variant}
      className={className}
    >
      {children}
    </Button>
  );
}
