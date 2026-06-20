"use client";

import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Building2, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listings";
  const error = searchParams.get("error");

  return (
    <div className="page-shell hero-wash flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1fr_430px] lg:items-center">
        <div className="hidden space-y-6 lg:block">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Private Bennett access</p>
          <h1 className="max-w-2xl text-6xl font-semibold tracking-[-0.06em] text-foreground">
            Sign in and step into the roommate marketplace.
          </h1>
          <p className="max-w-xl text-lg leading-8 text-muted-foreground">
            Use your Bennett Microsoft account to unlock listings, compatibility signals, onboarding, and matches.
          </p>
          <div className="grid max-w-xl gap-4 md:grid-cols-2">
            {[
              "Only @bennett.edu.in accounts are allowed",
              "Profile onboarding is required before browsing",
              "Contact details are only shared after a match",
              "Admin moderation tools are built in",
            ].map((item) => (
              <div key={item} className="surface-subtle flex items-start gap-3 p-4 text-sm text-muted-foreground">
                <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="surface-panel mx-auto w-full max-w-md p-6 sm:p-8">
          <div className="mb-8 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-lg font-semibold tracking-[-0.03em]">{APP_NAME}</p>
              <p className="text-sm text-muted-foreground">Bennett University roommate platform</p>
            </div>
          </div>

          <div className="mb-8 space-y-3">
            <h2 className="text-3xl font-semibold tracking-[-0.04em] text-foreground">Welcome back</h2>
            <p className="text-sm leading-6 text-muted-foreground">
              Continue with Microsoft to access your Bennett-only account and pick up where you left off.
            </p>
          </div>

          {error && (
            <div className="mb-5 rounded-2xl border border-destructive/20 bg-destructive/8 px-4 py-3 text-sm text-destructive">
              {error === "AccessDenied"
                ? "Access denied. Only @bennett.edu.in email accounts can enter RoomieBU."
                : "There was a problem during sign in. Please try again."}
            </div>
          )}

          <Button
            onClick={() => signIn("microsoft-entra-id", { callbackUrl })}
            className="w-full justify-center"
            size="lg"
          >
            <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
              <rect x="1" y="1" width="9" height="9" fill="#f25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
              <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
              <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
            </svg>
            Continue with Microsoft
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="mt-6 rounded-[24px] bg-muted p-4 text-sm leading-6 text-muted-foreground">
            By signing in, you'll complete your roommate profile first, then browse listings and express interest when you find a good fit.
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex min-h-screen items-center justify-center">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
