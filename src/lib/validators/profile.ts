import { z } from "zod";

export const profileSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long")
    .regex(/^[+]?[\d\s-]+$/, "Invalid phone number format"),
  gender: z.enum(["MALE", "FEMALE", "OTHER"], { message: "Gender is required" }),
  dob: z.string().min(1, "Date of birth is required"),
  course: z.string().min(1, "Course is required"),
  year: z.string().min(1, "Year is required"),
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
