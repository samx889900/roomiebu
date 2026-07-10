import { config } from "dotenv";
config({ path: ".env.local" });

import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import { PrismaClient } from "@prisma/client";
import ws from "ws";
import { parseBennettEmail } from "./src/lib/academic/parser";

neonConfig.webSocketConstructor = ws;
const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL || "" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Starting DB fix for past users...");

  // Get all users who have an email ending with @bennett.edu.in
  const users = await prisma.user.findMany({
    where: {
      email: {
        endsWith: "@bennett.edu.in",
      },
    },
    include: {
      profile: true,
    },
  });

  console.log(`Found ${users.length} users with Bennett emails.`);

  let updatedCount = 0;

  for (const user of users) {
    const parsed = parseBennettEmail(user.email);
    if (!parsed) continue;

    // Check if they need updating
    const needsUpdate = 
      !user.profile?.programCode || 
      !user.profile?.admissionYear || 
      user.studentStatus !== "VERIFIED";

    if (needsUpdate) {
      console.log(`Updating user: ${user.email} (Parsed: ${parsed.programCode}, ${parsed.admissionYear})`);
      
      // Ensure studentStatus is VERIFIED
      await prisma.user.update({
        where: { id: user.id },
        data: {
          studentStatus: "VERIFIED",
        }
      });

      // Update or create profile
      if (user.profile) {
        await prisma.profile.update({
          where: { userId: user.id },
          data: {
            programCode: user.profile.programCode || parsed.programCode,
            admissionYear: user.profile.admissionYear || parsed.admissionYear,
            rollNumber: user.profile.rollNumber || parsed.rollNumber,
          },
        });
      } else {
        await prisma.profile.create({
          data: {
            userId: user.id,
            programCode: parsed.programCode,
            admissionYear: parsed.admissionYear,
            rollNumber: parsed.rollNumber,
          },
        });
      }

      updatedCount++;
    }
  }

  console.log(`Finished fixing DB. Updated ${updatedCount} users.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
