"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense } from "react";
import { AlertTriangle, ArrowLeft, Ban, ShieldX } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { APP_NAME } from "@/lib/constants";

const errorMessages: Record<string, { title: string; message: string; icon: React.ReactNode }> = {
  AccessDenied: {
    title: "Access Denied",
    message: "Only Bennett University students with @bennett.edu.in emails can access this platform.",
    icon: <ShieldX className="w-10 h-10 text-destructive" />,
  },
  Banned: {
    title: "Account Banned",
    message: "Your account has been banned. Contact the admin team if you believe this is an error.",
    icon: <Ban className="w-10 h-10 text-destructive" />,
  },
  Suspended: {
    title: "Account Suspended",
    message: "Your account has been temporarily suspended. Contact the admin team for more information.",
    icon: <AlertTriangle className="w-10 h-10 text-amber-400" />,
  },
};

function ErrorContent() {
  const searchParams = useSearchParams();
  const errorType = searchParams.get("error") || "Default";

  const errorInfo = errorMessages[errorType] || {
    title: "Authentication Error",
    message: "An unexpected error occurred during authentication. Please try again.",
    icon: <AlertTriangle className="w-10 h-10 text-destructive" />,
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-strong rounded-2xl p-8 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex justify-center mb-6"
          >
            <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center">
              {errorInfo.icon}
            </div>
          </motion.div>

          <h1 className="text-2xl font-bold mb-2">{errorInfo.title}</h1>
          <p className="text-muted-foreground text-sm mb-8">{errorInfo.message}</p>

          <div className="flex flex-col gap-3">
            <Button render={<Link href="/auth/signin" />} className="gradient-primary">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Sign In
            </Button>
          </div>
        </div>

        <p className="text-center mt-6 text-xs text-muted-foreground/40">
          {APP_NAME} • Bennett University
        </p>
      </motion.div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-background">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  );
}
