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
  // Delete existing test user and their profile if they exist
  const existing = await prisma.user.findUnique({ where: { email: "testuser@bennett.edu.in" } });
  if (existing) {
    await prisma.profile.deleteMany({ where: { userId: existing.id } });
    await prisma.session.deleteMany({ where: { userId: existing.id } });
    await prisma.user.delete({ where: { id: existing.id } });
    console.log("Deleted existing test user");
  }

  // Create a new un-onboarded user
  const user = await prisma.user.create({
    data: {
      name: "Test NewUser",
      email: "testuser@bennett.edu.in",
      isOnboarded: false,
      role: "USER",
    },
  });

  console.log(`✅ Created new un-onboarded user: ${user.email} (id: ${user.id})`);
  console.log(`\nUse this URL to log in:\nhttp://localhost:3000/api/dev-login?email=testuser@bennett.edu.in`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
