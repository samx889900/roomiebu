"use client";

import { motion } from "framer-motion";
import { cn, getCompatibilityTier } from "@/lib/utils";

interface CompatibilityBadgeProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function CompatibilityBadge({ score, size = "md", showLabel = true }: CompatibilityBadgeProps) {
  const { label, color, bgColor } = getCompatibilityTier(score);

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium",
        bgColor,
        size === "sm" && "px-2 py-0.5 text-[10px]",
        size === "md" && "px-3 py-1 text-xs",
        size === "lg" && "px-4 py-1.5 text-sm"
      )}
    >
      <span className={cn("font-bold", color)}>{score}%</span>
      {showLabel && <span className={cn("opacity-80", color)}>{label}</span>}
    </motion.div>
  );
}
