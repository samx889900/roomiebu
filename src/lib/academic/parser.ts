import { ParsedAcademicInfo } from "./types";
import { BENNETT_EMAIL_DOMAIN } from "../constants";

/**
 * Parses a Bennett University student email.
 * Example: e23cseu1717@bennett.edu.in
 * Format: [prefix][yy][programCode][rollNumber]@bennett.edu.in
 */
export function parseBennettEmail(email: string): ParsedAcademicInfo | null {
  if (!email || !email.toLowerCase().endsWith(BENNETT_EMAIL_DOMAIN)) {
    return null;
  }

  // Extract the local part (before @)
  const localPart = email.split("@")[0].toLowerCase();

  // Regex to extract: prefix (letters), year (2 digits), program (letters), roll (digits)
  const regex = /^([a-z]+)(\d{2})([a-z]+)(\d+)$/;
  const match = localPart.match(regex);

  if (!match) {
    return null;
  }

  const yy = match[2];
  const programCode = match[3];
  const rollNumber = match[4];
  // Convert 2-digit year to 4-digit year (assuming 2000+)
  const admissionYear = 2000 + parseInt(yy, 10);

  return {
    admissionYear,
    programCode,
    rollNumber,
  };
}
