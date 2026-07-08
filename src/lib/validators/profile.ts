import { z } from "zod";

export const profileSchema = z.object({
  customName: z.string().min(2, "Name must be at least 2 characters").optional(),
  programCode: z.string().optional(),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^\d+$/, "Phone number must contain only digits"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  dob: z.string().optional(),
  smoking: z.enum(["NEVER", "OCCASIONALLY", "REGULARLY"]),
  vaping: z.enum(["NEVER", "OCCASIONALLY", "REGULARLY"]),
  drinking: z.enum(["NEVER", "OCCASIONALLY", "REGULARLY"]),
  otherHabits: z.string().max(200).optional(),
  sleepSchedule: z.enum(["MORNING_PERSON", "NIGHT_PERSON", "DEPENDS"]),
  cleanlinessLevel: z.number().min(1).max(5),
  studyEnvironment: z.enum(["SILENT", "MODERATE", "DOESNT_MATTER"]),
  guestsPreference: z.enum(["NEVER", "OCCASIONALLY", "FREQUENTLY"]),
  languages: z.array(z.string()).min(1, "Select at least one language"),
  aboutMe: z.string().max(300, "Bio must be 300 characters or less").optional(),
  profilePhoto: z.string().optional(),
  accommodationType: z.enum(["HOSTEL", "FLAT", "NOT_SURE"]),
});

export type ProfileFormData = z.infer<typeof profileSchema>;

export const updateProfileSchema = profileSchema.partial();
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
