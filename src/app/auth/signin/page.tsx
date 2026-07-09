"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Building2, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { AuthProviderButton } from "@/components/auth/auth-provider-button";
import { motion } from "framer-motion";
import Link from "next/link";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

function SignInContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/listings";
  const error = searchParams.get("error");

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center justify-center p-4 selection:bg-primary/20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[480px]"
      >
        <div className="bg-white rounded-[32px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-zinc-100 p-8 sm:p-10">
          
          {/* Logo & Header */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-[20px] bg-primary/10 text-primary mb-6 shadow-sm">
              <Building2 className="h-7 w-7" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 mb-3">
              Find Your Perfect Roommate
            </h1>
            <p className="text-[15px] leading-relaxed text-zinc-500 max-w-[320px]">
              The smarter way for Bennett University students to discover compatible roommates based on lifestyle, preferences, and compatibility.
            </p>
          </div>

          {error && (
            <div className="mb-6 rounded-2xl border border-destructive/20 bg-destructive/10 p-4 text-sm text-destructive text-center font-medium">
              {error === "AccessDenied"
                ? "Access denied. Only @bennett.edu.in email accounts can enter RoomieBU."
                : error === "UseMicrosoft"
                ? "Please use 'Continue with Bennett Account' for @bennett.edu.in emails."
                : "There was a problem during sign in. Please try again."}
            </div>
          )}

          <div className="space-y-8">
            
            {/* Bennett Section */}
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h2 className="text-sm font-semibold text-zinc-900">Current Bennett Student</h2>
                <p className="text-xs text-zinc-500">Already have your Bennett University account?</p>
              </div>
              
              <AuthProviderButton
                providerId="microsoft-entra-id"
                label="Continue with Bennett Account"
                loadingText="Redirecting to Bennett University..."
                callbackUrl={callbackUrl}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                }
              />
              <p className="text-center text-[11px] text-zinc-400">
                Uses your official Bennett University Microsoft account.
              </p>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-4 text-zinc-400 font-semibold tracking-wider">
                  OR
                </span>
              </div>
            </div>

            {/* Fresher Section */}
            <div className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <h2 className="text-sm font-semibold text-zinc-900">🎓 Are you joining Bennett this year?</h2>
                <p className="text-xs text-zinc-500">
                  Don&apos;t have your Bennett email yet? Create your RoomieBU account using Google and verify your phone number to get started.
                </p>
              </div>
              
              <AuthProviderButton
                providerId="google"
                label="Continue with Google"
                loadingText="Redirecting to Google..."
                callbackUrl={callbackUrl}
                icon={
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                }
              />
            </div>
            
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3 px-4">
          {[
            "Bennett Students Only",
            "Secure Microsoft Auth",
            "Phone Verified Freshers",
            "Privacy First",
          ].map((badge) => (
            <div key={badge} className="flex items-center text-xs font-medium text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5 mr-1.5 text-zinc-400" />
              {badge}
            </div>
          ))}
        </div>
        {/* FAQ Section */}
        <div className="mt-8 px-4">
          <Accordion className="w-full bg-white rounded-2xl border border-zinc-100 shadow-sm px-4">
            <AccordionItem value="faq-1" className="border-none">
              <AccordionTrigger className="text-sm font-medium text-zinc-900 hover:no-underline py-4">
                Why are there two sign-in options?
              </AccordionTrigger>
              <AccordionContent className="text-[13px] text-zinc-600 space-y-3 pb-4">
                <div>
                  <strong className="text-zinc-900 font-medium block mb-1">Bennett Account</strong>
                  Use your official Bennett University account.
                </div>
                <div>
                  <strong className="text-zinc-900 font-medium block mb-1">Google</strong>
                  Use this option if you&apos;re an incoming fresher and haven&apos;t yet received your Bennett account. You can verify your phone number now and link your Bennett account later.
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>

        {/* Footer */}
        <p className="mt-10 mb-8 text-center text-[13px] text-zinc-500">
          By continuing, you agree to our{" "}
          <Link href="/terms" className="text-zinc-900 underline underline-offset-2 hover:text-primary transition-colors">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-zinc-900 underline underline-offset-2 hover:text-primary transition-colors">
            Privacy Policy
          </Link>.
        </p>
      </motion.div>
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
            <p className="text-sm font-medium text-zinc-500">Loading {APP_NAME}...</p>
          </div>
        </div>
      }
    >
      <SignInContent />
    </Suspense>
  );
}
