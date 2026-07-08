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

          <div className="mb-5 flex flex-col gap-3">
            <Button
              onClick={() => signIn("microsoft-entra-id", { callbackUrl })}
              className="w-full justify-center"
              size="lg"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 21 21" fill="none">
                <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
              </svg>
              Continue with Microsoft
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
          
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-muted-foreground font-semibold tracking-widest">
                Are you a Fresher?
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              onClick={() => signIn("google", { callbackUrl })}
              className="w-full justify-center h-11"
            >
              <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Freshers can sign up with Google and verify their phone number.
            </p>
          </div>

          <div className="mt-8 rounded-[24px] bg-muted p-4 text-sm leading-6 text-muted-foreground">
            By signing in, you&apos;ll complete your roommate profile first, then browse listings and express interest when you find a good fit.
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
