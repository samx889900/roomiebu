/**
 * Dynamically computes the student's current academic year.
 * Assumes the academic session starts in July (month index 6).
 */
export function computeCurrentAcademicYear(admissionYear: number | null | undefined): number | null {
  if (!admissionYear) return null;

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed (0 = Jan, 6 = July)

  // If we are in July or later, a new academic session has started
  const sessionYear = currentMonth >= 6 ? currentYear : currentYear - 1;
  
  const academicYear = sessionYear - admissionYear + 1;
  
  // Ensure it's not negative (e.g. future admission years somehow)
  return Math.max(1, academicYear);
}

/**
 * Returns a readable string for the academic year (e.g., "1st Year", "2nd Year").
 */
export function getReadableAcademicYear(year: number | null | undefined): string {
  if (!year) return "Unknown Year";
  
  if (year === 1) return "1st Year";
  if (year === 2) return "2nd Year";
  if (year === 3) return "3rd Year";
  if (year >= 4) return `${year}th Year`;
  
  return `${year} Year`;
}
