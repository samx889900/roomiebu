import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service for RoomieBU — rules, responsibilities, and policies for using the Bennett University roommate matching platform.",
};

export default function TermsPage() {
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
        <article className="mx-auto max-w-3xl space-y-8">
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-[-0.04em]">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: June 20, 2025</p>
          </div>

          <div className="prose-section space-y-8 text-[15px] leading-7 text-foreground/85">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. Acceptance of Terms</h2>
              <p>
                By accessing or using RoomieBU, you agree to be bound by these Terms of Service. If
                you do not agree to these terms, you may not use the platform. RoomieBU is a
                student-built project and is not officially affiliated with or operated by Bennett
                University.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Eligibility</h2>
              <p>
                RoomieBU is exclusively available to current students of Bennett University.
                To use the platform, you must:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  Have a valid Bennett University email address ending in{" "}
                  <strong>@bennett.edu.in</strong>.
                </li>
                <li>
                  Authenticate through Microsoft Entra ID using your institutional Microsoft
                  account.
                </li>
                <li>
                  Be at least 17 years of age.
                </li>
                <li>
                  Complete the onboarding profile with accurate information about yourself.
                </li>
              </ul>
              <p>
                Accounts that do not meet these criteria may be suspended or removed without notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. User Responsibilities</h2>
              <p>As a user of RoomieBU, you agree to:</p>

              <h3 className="text-base font-semibold text-foreground mt-4">
                3.1 Provide Accurate Information
              </h3>
              <p>
                All profile information, including your name, course, year, lifestyle habits, and
                preferences, must be truthful and accurate. Misleading or false profiles undermine
                trust for everyone on the platform.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-4">
                3.2 Create Honest Listings
              </h3>
              <p>
                Listings must accurately represent a genuine need for a roommate or flatmate. You
                must not create fake listings, post misleading budget or location details, or use
                listings for any purpose other than finding a roommate.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-4">
                3.3 Communicate Respectfully
              </h3>
              <p>
                All interactions on the platform — including interest requests, matches, and any
                communication that follows — must be respectful. You agree not to:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Harass, threaten, or intimidate other users.</li>
                <li>Send unsolicited or inappropriate messages after a match.</li>
                <li>Discriminate based on religion, caste, ethnicity, or any other protected characteristic beyond the stated listing preferences.</li>
                <li>Engage in stalking or persistent unwanted contact.</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-4">
                3.4 Not Engage in Prohibited Conduct
              </h3>
              <p>You must not:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Impersonate</strong> another student or create accounts on behalf of
                  others.
                </li>
                <li>
                  <strong>Scam</strong> other users — including soliciting money, advance payments,
                  or deposits through the platform.
                </li>
                <li>
                  <strong>Spam</strong> the platform with repetitive or irrelevant listings.
                </li>
                <li>
                  <strong>Misuse the reporting system</strong> by filing false or malicious reports
                  against other users.
                </li>
                <li>
                  <strong>Attempt to access</strong> admin features, other users&apos; accounts, or
                  backend systems without authorization.
                </li>
                <li>
                  <strong>Scrape, crawl, or extract</strong> data from the platform in an automated
                  manner.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Listings and Matching</h2>
              <p>
                RoomieBU allows you to create up to 5 active listings at a time. Each listing may
                specify accommodation type (hostel, flat, or flexible), budget, location, gender
                preference, and lifestyle preferences. Listings automatically expire after 30 days
                of inactivity.
              </p>
              <p>
                When you express interest in a listing, the listing owner receives a notification
                and can choose to accept or reject your request. If accepted, a match is created and
                contact details (email and phone number) are shared between both parties.
              </p>
              <p>
                You may withdraw your interest before it is accepted. Once a match is created, both
                parties can view each other&apos;s contact information.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                5. Platform Rights and Moderation
              </h2>
              <p>
                RoomieBU reserves the right to maintain the safety and quality of the platform. We
                may, at our discretion:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Remove listings</strong> that violate these terms, are misleading, or are
                  reported by other users.
                </li>
                <li>
                  <strong>Suspend accounts</strong> temporarily while investigating a report or
                  complaint.
                </li>
                <li>
                  <strong>Permanently ban users</strong> who repeatedly violate these terms or
                  engage in serious misconduct.
                </li>
                <li>
                  <strong>Edit or remove content</strong> that is inappropriate, offensive, or
                  violates community standards.
                </li>
                <li>
                  <strong>Review reports</strong> submitted by users and take appropriate action.
                </li>
              </ul>
              <p>
                Moderation decisions are made by appointed platform administrators. If you believe a
                decision was made in error, you may submit a moderation appeal by contacting us at{" "}
                <a
                  href="mailto:roomiebu@buconfess.in"
                  className="text-primary hover:underline"
                >
                  roomiebu@buconfess.in
                </a>
                .
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Limitation of Liability</h2>
              <p>
                RoomieBU is a <strong>matching platform</strong> that helps Bennett University
                students find potential roommates. It is important to understand that:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>RoomieBU does not guarantee compatibility</strong> between matched users.
                  Compatibility scores are calculated based on self-reported lifestyle preferences
                  and are indicative, not absolute.
                </li>
                <li>
                  <strong>RoomieBU is not responsible for roommate disputes</strong>, disagreements,
                  or any issues that arise after a match is made. Living arrangements are ultimately
                  the responsibility of the individuals involved.
                </li>
                <li>
                  <strong>RoomieBU does not verify housing</strong>. We do not inspect, verify, or
                  guarantee the accuracy of accommodation details in listings (rent amounts,
                  locations, or property conditions).
                </li>
                <li>
                  <strong>RoomieBU is not a real estate service</strong>. We do not facilitate
                  lease agreements, rental transactions, or financial dealings between users.
                </li>
                <li>
                  <strong>Use your judgment</strong>. Always verify details independently, meet
                  potential roommates in safe, public settings, and do not share financial
                  information through the platform.
                </li>
              </ul>
              <p>
                The platform is provided &ldquo;as is&rdquo; without warranties of any kind, either
                express or implied. RoomieBU shall not be liable for any direct, indirect,
                incidental, or consequential damages arising from your use of the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                7. Intellectual Property
              </h2>
              <p>
                The RoomieBU name, logo, design, and code are the property of the RoomieBU team.
                Content you post (listings, bios, profile information) remains yours, but you grant
                RoomieBU a non-exclusive license to display it on the platform as needed for the
                service to function.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Account Termination</h2>
              <p>
                You may stop using RoomieBU at any time. To request account deletion and removal of
                all your data, contact us at{" "}
                <a
                  href="mailto:roomiebu@buconfess.in"
                  className="text-primary hover:underline"
                >
                  roomiebu@buconfess.in
                </a>
                . We will process deletion requests within a reasonable timeframe.
              </p>
              <p>
                We may also terminate or suspend your account if you violate these terms, with or
                without prior notice.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Changes to These Terms</h2>
              <p>
                We may update these Terms of Service from time to time. Changes will be reflected
                on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the
                platform after changes constitutes acceptance of the updated terms.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Contact</h2>
              <p>
                For questions about these Terms of Service, contact us at:
              </p>
              <p>
                <a
                  href="mailto:roomiebu@buconfess.in"
                  className="text-primary hover:underline font-medium"
                >
                  roomiebu@buconfess.in
                </a>
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
