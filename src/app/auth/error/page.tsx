"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { AlertTriangle, ArrowLeft, Ban, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const errorMessages: Record<string, { title: string; message: string; icon: React.ReactNode }> = {
  AccessDenied: {
    title: "Access denied",
    message: "Only Bennett University students with @bennett.edu.in emails can access this platform.",
    icon: <ShieldX className="h-10 w-10 text-destructive" />,
  },
  Banned: {
    title: "Account banned",
    message: "Your account has been banned. Contact the admin team if you believe this is a mistake.",
    icon: <Ban className="h-10 w-10 text-destructive" />,
  },
  Suspended: {
    title: "Account suspended",
    message: "Your account is temporarily suspended. Contact the admin team for more context.",
    icon: <AlertTriangle className="h-10 w-10 text-amber-500" />,
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[errorType] || {
    title: "Authentication error",
    message: "An unexpected authentication issue occurred. Please try again.",
    icon: <AlertTriangle className="h-10 w-10 text-destructive" />,
  };

  return (
    <div className="page-shell hero-wash flex min-h-screen items-center justify-center p-4">
      <div className="surface-panel w-full max-w-lg p-8 text-center sm:p-10">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
          {errorInfo.icon}
        </div>
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">{APP_NAME}</p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em]">{errorInfo.title}</h1>
        <p className="mt-3 text-sm leading-7 text-muted-foreground">{errorInfo.message}</p>
        <div className="mt-8 flex justify-center">
          <Button render={<Link href="/auth/signin" />} size="lg">
            <ArrowLeft className="h-4 w-4" />
            Back to sign in
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
