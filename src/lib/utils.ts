import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy");
}

export function formatDateTime(date: Date | string): string {
  return format(new Date(date), "MMM d, yyyy 'at' h:mm a");
}

export function formatRelativeDate(date: Date | string): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getCompatibilityTier(score: number): {
  label: string;
  color: string;
  bgColor: string;
} {
  if (score >= 80) {
    return {
      label: "Excellent Match",
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10 border-emerald-500/20",
    };
  }
  if (score >= 60) {
    return {
      label: "Good Match",
      color: "text-amber-400",
      bgColor: "bg-amber-500/10 border-amber-500/20",
    };
  }
  return {
    label: "Low Match",
    color: "text-red-400",
    bgColor: "bg-red-500/10 border-red-500/20",
  };
}

export function getRemainingSpots(numberRequired: number, spotsFilled: number): number {
  return Math.max(0, numberRequired - spotsFilled);
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatBudget(min?: number | null, max?: number | null): string {
  if (!min && !max) return "Not specified";
  if (min && max) return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}`;
  if (min) return `₹${min.toLocaleString()}+`;
  return `Up to ₹${max!.toLocaleString()}`;
}

export function enumToLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
