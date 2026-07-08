import { config } from "dotenv";
config({ path: ".env.local" });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";

neonConfig.webSocketConstructor = ws;

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL || "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@bennett.edu.in" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@bennett.edu.in",
      role: "ADMIN",
      isOnboarded: true,
      profile: {
        create: {
          phone: "+91 9999999999",
          gender: "MALE",
          dob: new Date("2002-01-15"),
          programCode: "CSE",
          admissionYear: 2021,
          smoking: "NEVER",
          vaping: "NEVER",
          drinking: "NEVER",
          sleepSchedule: "NIGHT_PERSON",
          cleanlinessLevel: 4,
          studyEnvironment: "MODERATE",
          guestsPreference: "OCCASIONALLY",
          languages: ["English", "Hindi"],
          aboutMe: "Platform administrator. Here to keep things running smoothly!",
          accommodationType: "HOSTEL",
        },
      },
    },
  });
  console.log(`✅ Admin user: ${admin.email}`);

  // Create sample users
  const sampleUsers = [
    {
      name: "Aarav Sharma", email: "aarav.sharma@bennett.edu.in",
      profile: { phone: "+91 9876543210", gender: "MALE" as const, dob: new Date("2003-03-15"), programCode: "CSE", admissionYear: 2023, smoking: "NEVER" as const, vaping: "NEVER" as const, drinking: "OCCASIONALLY" as const, sleepSchedule: "NIGHT_PERSON" as const, cleanlinessLevel: 4, studyEnvironment: "SILENT" as const, guestsPreference: "OCCASIONALLY" as const, languages: ["English", "Hindi"], aboutMe: "Love coding and gaming. Looking for a chill roommate who respects quiet hours.", accommodationType: "HOSTEL" as const },
    },
    {
      name: "Priya Patel", email: "priya.patel@bennett.edu.in",
      profile: { phone: "+91 9876543211", gender: "FEMALE" as const, dob: new Date("2003-07-22"), programCode: "BBA", admissionYear: 2023, smoking: "NEVER" as const, vaping: "NEVER" as const, drinking: "NEVER" as const, sleepSchedule: "MORNING_PERSON" as const, cleanlinessLevel: 5, studyEnvironment: "SILENT" as const, guestsPreference: "NEVER" as const, languages: ["English", "Hindi", "Gujarati"], aboutMe: "Early bird, neat freak. Prefer quiet environment for studying.", accommodationType: "HOSTEL" as const },
    },
    {
      name: "Rohit Kumar", email: "rohit.kumar@bennett.edu.in",
      profile: { phone: "+91 9876543212", gender: "MALE" as const, dob: new Date("2002-11-08"), programCode: "CSE", admissionYear: 2022, smoking: "OCCASIONALLY" as const, vaping: "NEVER" as const, drinking: "OCCASIONALLY" as const, sleepSchedule: "NIGHT_PERSON" as const, cleanlinessLevel: 3, studyEnvironment: "MODERATE" as const, guestsPreference: "FREQUENTLY" as const, languages: ["English", "Hindi", "Punjabi"], aboutMe: "Social butterfly. Love hanging out and exploring cafes.", accommodationType: "FLAT" as const },
    },
    {
      name: "Ananya Singh", email: "ananya.singh@bennett.edu.in",
      profile: { phone: "+91 9876543213", gender: "FEMALE" as const, dob: new Date("2003-01-30"), programCode: "BALLB", admissionYear: 2023, smoking: "NEVER" as const, vaping: "NEVER" as const, drinking: "OCCASIONALLY" as const, sleepSchedule: "DEPENDS" as const, cleanlinessLevel: 4, studyEnvironment: "MODERATE" as const, guestsPreference: "OCCASIONALLY" as const, languages: ["English", "Hindi"], aboutMe: "Law student who loves debating and Netflix. Looking for a fun roommate!", accommodationType: "NOT_SURE" as const },
    },
    {
      name: "Vikram Reddy", email: "vikram.reddy@bennett.edu.in",
      profile: { phone: "+91 9876543214", gender: "MALE" as const, dob: new Date("2002-05-12"), programCode: "ECE", admissionYear: 2022, smoking: "NEVER" as const, vaping: "OCCASIONALLY" as const, drinking: "NEVER" as const, sleepSchedule: "MORNING_PERSON" as const, cleanlinessLevel: 5, studyEnvironment: "SILENT" as const, guestsPreference: "NEVER" as const, languages: ["English", "Hindi", "Telugu"], aboutMe: "Focused on academics. Early sleeper, early riser.", accommodationType: "HOSTEL" as const },
    },
  ];

  const createdUsers = [];
  for (const userData of sampleUsers) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        name: userData.name,
        email: userData.email,
        isOnboarded: true,
        profile: { create: userData.profile },
      },
    });
    createdUsers.push(user);
    console.log(`✅ User: ${user.name} (${user.email})`);
  }

  // Create sample listings
  const listings = [
    {
      userId: createdUsers[0].id,
      title: "Looking for a roommate in BH-3",
      accommodationType: "HOSTEL" as const,
      numberRequired: 1, spotsFilled: 0,
      genderPreference: "MALE" as const,
      currentStatus: "LOOKING_URGENTLY" as const,
      description: "Need a roommate for double sharing in BH-3. Preferably someone who is a night owl like me.",
      occupancyType: "DOUBLE" as const,
      hostelBlock: "BH-3",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[1].id,
      title: "Looking for a calm & clean roommate",
      accommodationType: "HOSTEL" as const,
      numberRequired: 1, spotsFilled: 0,
      genderPreference: "FEMALE" as const,
      currentStatus: "WITHIN_1_MONTH" as const,
      description: "I keep my space very clean and prefer a quiet environment. No parties please.",
      occupancyType: "DOUBLE" as const,
      hostelBlock: "GH-1",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[2].id,
      title: "Flat near campus - need 2 more flatmates",
      accommodationType: "FLAT" as const,
      numberRequired: 3, spotsFilled: 1,
      genderPreference: "MALE" as const,
      currentStatus: "LOOKING_URGENTLY" as const,
      description: "We have a 3BHK in Sector 62. Need 2 more people to share. Great location, 10 min from campus.",
      location: "Sector 62, Noida",
      minBudget: 8000, maxBudget: 12000,
      propertyType: "APARTMENT" as const,
      furnishedStatus: "SEMI_FURNISHED" as const,
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[3].id,
      title: "Open to hostel or flat - flexible!",
      accommodationType: "NOT_SURE" as const,
      numberRequired: 1, spotsFilled: 0,
      genderPreference: "FEMALE" as const,
      currentStatus: "JUST_EXPLORING" as const,
      description: "Not sure yet if I want hostel or flat. Looking for a compatible roommate first!",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      userId: createdUsers[4].id,
      title: "Serious student looking for like-minded roommate",
      accommodationType: "HOSTEL" as const,
      numberRequired: 1, spotsFilled: 0,
      genderPreference: "MALE" as const,
      currentStatus: "WITHIN_1_MONTH" as const,
      description: "Academics are my priority. Looking for someone who goes to bed by 11 PM and keeps the room clean.",
      occupancyType: "DOUBLE" as const,
      hostelBlock: "BH-1",
      expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  ];

  for (const listingData of listings) {
    const listing = await prisma.listing.create({ data: listingData });
    console.log(`✅ Listing: ${listing.title}`);
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
