import { FrequencyLevel, SleepSchedule, AccommodationType, GenderPreference, Gender } from "@prisma/client";
import { COMPATIBILITY_WEIGHTS } from "@/lib/constants";

interface UserProfile {
  smoking: FrequencyLevel;
  drinking: FrequencyLevel;
  sleepSchedule: SleepSchedule;
  accommodationType: AccommodationType;
  gender?: Gender | null;
  admissionYear?: number | null;
  programCode?: string | null;
}

interface ListingProfile {
  accommodationType: AccommodationType;
  genderPreference: GenderPreference;
  academicPreference?: "ANY" | "SAME_COURSE" | "SAME_BATCH" | "SENIOR" | "JUNIOR" | null;
}

function frequencyScore(a: FrequencyLevel, b: FrequencyLevel): number {
  if (a === b) return 1;
  const levels: FrequencyLevel[] = ["NEVER", "OCCASIONALLY", "REGULARLY"];
  const diff = Math.abs(levels.indexOf(a) - levels.indexOf(b));
  return diff === 1 ? 0.5 : 0;
}

function sleepScore(a: SleepSchedule, b: SleepSchedule): number {
  if (a === b) return 1;
  if (a === "DEPENDS" || b === "DEPENDS") return 0.7;
  return 0;
}

function accommodationScore(a: AccommodationType, b: AccommodationType): number {
  if (a === b) return 1;
  if (a === "NOT_SURE" || b === "NOT_SURE") return 0.5;
  return 0;
}

function genderPreferenceScore(
  userGender: Gender | null | undefined,
  listingPref: GenderPreference
): number {
  if (listingPref === "ANY") return 1;
  if (!userGender) return 0.5;
  if (
    (listingPref === "MALE" && userGender === "MALE") ||
    (listingPref === "FEMALE" && userGender === "FEMALE")
  ) {
    return 1;
  }
  return 0;
}

function academicPreferenceScore(
  currentUser: UserProfile,
  ownerUser: UserProfile,
  pref?: "ANY" | "SAME_COURSE" | "SAME_BATCH" | "SENIOR" | "JUNIOR" | null
): number {
  if (!pref || pref === "ANY") return 1;
  if (!currentUser.admissionYear || !ownerUser.admissionYear) return 0.5;

  switch (pref) {
    case "SAME_COURSE":
      return currentUser.programCode === ownerUser.programCode ? 1 : 0;
    case "SAME_BATCH":
      return currentUser.admissionYear === ownerUser.admissionYear ? 1 : 0;
    case "SENIOR":
      // A smaller admission year means they joined earlier (senior)
      return currentUser.admissionYear < ownerUser.admissionYear ? 1 : 0;
    case "JUNIOR":
      return currentUser.admissionYear > ownerUser.admissionYear ? 1 : 0;
    default:
      return 1;
  }
}

export function calculateCompatibility(
  currentUser: UserProfile,
  otherUser: UserProfile,
  listing?: ListingProfile
): number {
  const smokingS = frequencyScore(currentUser.smoking, otherUser.smoking);
  const drinkingS = frequencyScore(currentUser.drinking, otherUser.drinking);
  const sleepS = sleepScore(currentUser.sleepSchedule, otherUser.sleepSchedule);
  const accommodationS = accommodationScore(
    currentUser.accommodationType,
    otherUser.accommodationType
  );
  const genderS = listing
    ? genderPreferenceScore(currentUser.gender, listing.genderPreference)
    : 1;

  // Future-proofing academic preference weight. We'll give it a 10% weight and reduce others proportionally if applied.
  // For now, we just multiply it softly as a modifier or include it in the sum if the listing has it.
  const academicS = listing?.academicPreference
    ? academicPreferenceScore(currentUser, otherUser, listing.academicPreference)
    : 1;

  // Let's assume academic preference is a strict multiplier if they explicitly specified it and it's 0.
  // Or we can just calculate raw with it.
  const raw =
    (smokingS * COMPATIBILITY_WEIGHTS.smoking +
    drinkingS * COMPATIBILITY_WEIGHTS.drinking +
    sleepS * COMPATIBILITY_WEIGHTS.sleepSchedule +
    accommodationS * COMPATIBILITY_WEIGHTS.accommodationType +
    genderS * COMPATIBILITY_WEIGHTS.genderPreference) * (listing?.academicPreference && listing.academicPreference !== "ANY" ? (academicS === 0 ? 0.2 : 1) : 1);

  return Math.round(raw * 100);
}
