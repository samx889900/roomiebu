import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowLeft, Mail, Bug, UserX, ShieldAlert, HelpCircle } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the RoomieBU team for support, bug reports, account deletion requests, or moderation appeals.",
};

const contactReasons = [
  {
    icon: Bug,
    title: "Bug Reports",
    description:
      "Found something broken? Let us know what happened, what you expected, and which page or feature was affected.",
  },
  {
    icon: UserX,
    title: "Account Deletion",
    description:
      "Request complete removal of your account and all associated data. We'll process your request and confirm once done.",
  },
  {
    icon: ShieldAlert,
    title: "Moderation Appeals",
    description:
      "If your listing was removed or your account was suspended and you believe it was an error, reach out with your case.",
  },
  {
    icon: HelpCircle,
    title: "General Support",
    description:
      "Questions about how the platform works, profile setup, matching, or anything else — we're happy to help.",
  },
];

export default function ContactPage() {
  return (
    <div className="page-shell">
      {/* Header */}
      <header className="border-b border-border/70 bg-white/80 backdrop-blur-sm sticky top-0 z-30">
        <div className="content-wrap flex items-center justify-between py-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-primary text-white">
              <Building2 className="h-5 w-5" />
            </div>
            <span className="text-lg font-semibold tracking-[-0.03em]">{APP_NAME}</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="content-wrap py-12 sm:py-16">
        <div className="mx-auto max-w-3xl space-y-10">
          {/* Hero */}
          <div className="space-y-4">
            <h1 className="text-4xl font-semibold tracking-[-0.04em]">Contact Us</h1>
            <p className="text-lg text-muted-foreground leading-7 max-w-2xl">
              RoomieBU is a roommate matching platform built by Bennett University students, for
              Bennett University students. If you need help or have feedback, we&apos;re here for you.
            </p>
          </div>

          {/* Email card */}
          <div className="surface-panel p-6 sm:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff1f3] text-primary">
                <Mail className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg font-semibold">Email Us</h2>
                <p className="text-sm text-muted-foreground leading-6">
                  For all inquiries — support, reports, account requests, or feedback — send us an
                  email and we&apos;ll get back to you as soon as possible.
                </p>
                <a
                  href="mailto:roomiebu@buconfess.in"
                  className="inline-flex items-center gap-2 text-primary font-medium hover:underline mt-1"
                >
                  <Mail className="h-4 w-4" />
                  roomiebu@buconfess.in
                </a>
              </div>
            </div>
          </div>

          {/* Reasons */}
          <div className="space-y-5">
            <h2 className="text-xl font-semibold">What can we help with?</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactReasons.map((reason) => (
                <div key={reason.title} className="surface-panel p-5 space-y-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#fff1f3] text-primary">
                    <reason.icon className="h-4.5 w-4.5" />
                  </div>
                  <h3 className="text-base font-semibold">{reason.title}</h3>
                  <p className="text-sm text-muted-foreground leading-6">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="rounded-[24px] border border-border/80 bg-muted/40 p-6">
            <h3 className="text-sm font-semibold mb-3">Tips for a faster response</h3>
            <ul className="text-sm text-muted-foreground space-y-2 leading-6">
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                Use your @bennett.edu.in email so we can verify your identity.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                Include your registered name and a clear description of the issue.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                For bug reports, mention which page or feature was affected and what happened.
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1.5 block h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                For moderation appeals, include the listing title or relevant context.
              </li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
