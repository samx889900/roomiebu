import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import OnboardingFlow from "./onboarding-flow";

export default async function OnboardingPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  if (session.user.isOnboarded) {
    redirect("/listings");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { profile: true },
  });

  if (!user) {
    redirect("/auth/signin");
  }

  return (
    <OnboardingFlow 
      user={{
        name: user.name,
        email: user.email,
        image: user.image,
        studentStatus: user.studentStatus,
      }}
      profile={user.profile}
    />
  );
}
