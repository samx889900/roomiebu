import { ProgramMapping } from "./types";

// This mapping will be updated officially later.
// Currently serves as a modular foundation.
export const PROGRAM_MAPPINGS: ProgramMapping = {
  "cseu": "B.Tech CSE",
  "ai": "B.Tech AI",
  "ece": "B.Tech ECE",
  "mech": "B.Tech ME",
  "bca": "BCA",
  "bba": "BBA",
  "law": "B.A. LL.B. (Hons.)",
  "mba": "MBA",
};

/**
 * Converts a program code into a readable course name.
 * Falls back to upper-cased code if not found.
 */
export function getReadableProgramName(code: string | null | undefined): string {
  if (!code) return "Unknown Program";
  
  const normalized = code.toLowerCase();
  return PROGRAM_MAPPINGS[normalized] || code.toUpperCase();
}
