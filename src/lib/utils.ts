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
      label: "Excellent match",
      color: "text-emerald-700",
      bgColor: "bg-emerald-50 border-emerald-200",
    };
  }
  if (score >= 60) {
    return {
      label: "Good match",
      color: "text-amber-700",
      bgColor: "bg-amber-50 border-amber-200",
    };
  }
  return {
    label: "Low match",
    color: "text-rose-700",
    bgColor: "bg-rose-50 border-rose-200",
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
  if (min && max) return `?${min.toLocaleString()} - ?${max.toLocaleString()}`;
  if (min) return `?${min.toLocaleString()}+`;
  return `Up to ?${max!.toLocaleString()}`;
}

export function enumToLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
