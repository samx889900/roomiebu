import { z } from "zod";

export const listingSchema = z
  .object({
    title: z.string().min(3, "Title must be at least 3 characters").max(100),
    accommodationType: z.enum(["HOSTEL", "FLAT", "NOT_SURE"]),
    numberRequired: z.number().min(1).max(10),
    spotsFilled: z.number().min(0),
    genderPreference: z.enum(["MALE", "FEMALE", "ANY"]),
    currentStatus: z.enum(["LOOKING_URGENTLY", "WITHIN_1_MONTH", "JUST_EXPLORING"]),
    moveInDate: z.string().optional(),
    description: z.string().max(1000).optional(),

    // Hostel fields
    occupancyType: z.enum(["SINGLE", "DOUBLE", "TRIPLE"]).optional(),
    hostelBlock: z.string().max(50).optional(),

    // Flat fields
    location: z.string().max(200).optional(),
    minBudget: z.number().min(0).optional(),
    maxBudget: z.number().min(0).optional(),
    propertyType: z.enum(["APARTMENT", "BUILDER_FLOOR", "INDEPENDENT_HOUSE"]).optional(),
    furnishedStatus: z.enum(["FURNISHED", "SEMI_FURNISHED", "UNFURNISHED"]).optional(),
  })
  .refine(
    (data) => {
      if (data.minBudget && data.maxBudget) {
        return data.maxBudget >= data.minBudget;
      }
      return true;
    },
    { message: "Max budget must be greater than min budget", path: ["maxBudget"] }
  );

export type ListingFormData = z.infer<typeof listingSchema>;
