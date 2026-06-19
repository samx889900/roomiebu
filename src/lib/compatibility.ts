import { FrequencyLevel, SleepSchedule, AccommodationType, GenderPreference, Gender } from "@prisma/client";
import { COMPATIBILITY_WEIGHTS } from "@/lib/constants";

interface UserProfile {
  smoking: FrequencyLevel;
  drinking: FrequencyLevel;
  sleepSchedule: SleepSchedule;
  accommodationType: AccommodationType;
  gender?: Gender | null;
}

interface ListingProfile {
  accommodationType: AccommodationType;
  genderPreference: GenderPreference;
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

  const raw =
    smokingS * COMPATIBILITY_WEIGHTS.smoking +
    drinkingS * COMPATIBILITY_WEIGHTS.drinking +
    sleepS * COMPATIBILITY_WEIGHTS.sleepSchedule +
    accommodationS * COMPATIBILITY_WEIGHTS.accommodationType +
    genderS * COMPATIBILITY_WEIGHTS.genderPreference;

  return Math.round(raw * 100);
}
