export function calculateProfileCompletion(profile: Record<string, unknown> | null | undefined): number {
  if (!profile) return 0;
  
  let score = 0;
  let total = 0;

  const check = (value: unknown) => {
    total++;
    if (value !== undefined && value !== null && value !== "" && value !== "NOT_SURE" && value !== "DEPENDS" && value !== "DOESNT_MATTER") {
      score++;
    }
  };

  // Identity / Basic Info
  check(profile.phone);
  check(profile.gender);
  
  // Accommodation
  check(profile.accommodationType);
  
  // Lifestyle & Preferences
  check(profile.smoking);
  check(profile.drinking);
  check(profile.sleepSchedule);
  check(profile.cleanlinessLevel);
  check(profile.studyEnvironment);
  check(profile.guestsPreference);

  // Bio
  check(profile.aboutMe);
  check(Array.isArray(profile.languages) && profile.languages.length > 0 ? true : null);

  return Math.round((score / total) * 100);
}
