"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface AuthProviderButtonProps {
  providerId: string;
  label: string;
  icon: React.ReactNode;
  loadingText?: string;
  callbackUrl?: string;
  disabled?: boolean;
}

export function AuthProviderButton({
  providerId,
  label,
  icon,
  loadingText = "Redirecting...",
  callbackUrl = "/listings",
  disabled = false,
}: AuthProviderButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async () => {
    setIsLoading(true);
    await signIn(providerId, { callbackUrl });
    // Note: We don't set isLoading to false because the page will redirect.
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      className="w-full"
    >
      <Button
        variant="outline"
        size="lg"
        disabled={disabled || isLoading}
        onClick={handleSignIn}
        className="relative w-full h-auto min-h-14 py-3 bg-white hover:bg-zinc-50 border-zinc-200 shadow-sm hover:shadow-md text-sm sm:text-base font-medium text-zinc-900 transition-all duration-200 rounded-xl justify-start px-4 sm:px-6 focus-visible:ring-2 focus-visible:ring-primary/20"
      >
        <span className="flex items-center w-full">
          <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center mr-3 sm:mr-4">
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin text-zinc-500" /> : icon}
          </span>
          <span className="flex-grow text-left whitespace-normal leading-tight">
            {isLoading ? loadingText : label}
          </span>
        </span>
      </Button>
    </motion.div>
  );
}
