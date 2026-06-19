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
  const users = [
    { email: "admin@bennett.edu.in", token: "test-session-admin" },
    { email: "aarav.sharma@bennett.edu.in", token: "test-session-aarav" },
    { email: "priya.patel@bennett.edu.in", token: "test-session-priya" }
  ];

  for (const u of users) {
    const user = await prisma.user.findUnique({ where: { email: u.email } });
    if (!user) {
      console.log("User not found:", u.email);
      continue;
    }
    await prisma.session.deleteMany({ where: { sessionToken: u.token } });
    await prisma.session.create({
      data: {
        sessionToken: u.token,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      }
    });
    console.log("Created session for", u.email, "->", u.token);
  }
}

main().finally(() => prisma.$disconnect());
