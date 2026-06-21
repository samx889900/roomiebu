import type { Metadata } from "next";
import Link from "next/link";
import { Building2, ArrowLeft } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Privacy Policy for RoomieBU — how we collect, use, and protect your data on the Bennett University roommate matching platform.",
};

export default function PrivacyPage() {
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
            <h1 className="text-4xl font-semibold tracking-[-0.04em]">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: June 20, 2025</p>
          </div>

          <div className="prose-section space-y-8 text-[15px] leading-7 text-foreground/85">
            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">1. About RoomieBU</h2>
              <p>
                RoomieBU is a roommate and flatmate matching platform built exclusively for students
                of Bennett University. The platform connects verified students looking for hostel
                roommates or flatmates near campus. RoomieBU is a student-built project and is not
                officially operated by Bennett University.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">2. Information We Collect</h2>
              <p>We collect information that you provide directly when using the platform:</p>

              <h3 className="text-base font-semibold text-foreground mt-4">
                2.1 Authentication Data
              </h3>
              <p>
                RoomieBU uses Microsoft Entra ID (Azure Active Directory) for authentication. When
                you sign in with your Bennett University Microsoft account (
                <strong>@bennett.edu.in</strong>), we receive your name, email address, and profile
                picture from Microsoft. We do not receive or store your Microsoft account password.
              </p>

              <h3 className="text-base font-semibold text-foreground mt-4">
                2.2 Profile Information
              </h3>
              <p>During onboarding and profile setup, you may provide:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Phone number</li>
                <li>Gender and date of birth</li>
                <li>Course and academic year at Bennett University</li>
                <li>
                  Lifestyle preferences — smoking, vaping, drinking habits, sleep schedule,
                  cleanliness level, study environment preference, and guest preferences
                </li>
                <li>Languages spoken</li>
                <li>A short bio (about me)</li>
                <li>Other habits you choose to share</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-4">
                2.3 Listing Information
              </h3>
              <p>When you create a roommate listing, we store:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Listing title and description</li>
                <li>Accommodation type (hostel, flat, or flexible)</li>
                <li>Move-in date and budget range</li>
                <li>Location preference</li>
                <li>Number of roommates required and spots filled</li>
                <li>Gender preference and lifestyle preferences for the listing</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-4">
                2.4 Interaction Data
              </h3>
              <p>We record your interactions on the platform, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Interest requests you send and receive</li>
                <li>Matches created when an interest is accepted</li>
                <li>Listings you save</li>
                <li>Reports you file against users or listings</li>
                <li>Notification records</li>
              </ul>

              <h3 className="text-base font-semibold text-foreground mt-4">
                2.5 Information We Do Not Collect
              </h3>
              <p>
                RoomieBU does not collect IP addresses, browser fingerprints, precise geolocation, or
                financial information. We do not use third-party tracking cookies or advertising
                networks.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">3. How We Use Your Information</h2>
              <p>Your information is used to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Verify your identity</strong> — only students with a valid
                  @bennett.edu.in email can access the platform.
                </li>
                <li>
                  <strong>Display your profile</strong> — so other students can understand your
                  lifestyle preferences and compatibility.
                </li>
                <li>
                  <strong>Calculate compatibility scores</strong> — based on lifestyle factors like
                  smoking, drinking, sleep schedule, accommodation type, and gender preference to
                  help you find suitable matches.
                </li>
                <li>
                  <strong>Facilitate matching</strong> — when you express interest in a listing and
                  the owner accepts, we share contact information between both parties.
                </li>
                <li>
                  <strong>Send notifications</strong> — about interest requests, match updates, and
                  platform activity.
                </li>
                <li>
                  <strong>Moderate the platform</strong> — administrators review reported users and
                  listings to maintain a safe environment.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">4. Contact Information Sharing</h2>
              <p>
                Your phone number and email are only shared with another user when a mutual match is
                created — that is, when you express interest in a listing and the listing owner
                accepts your request (or vice versa). Contact information is never publicly visible
                on the platform.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">5. Data Storage and Security</h2>
              <p>
                Your data is stored in a PostgreSQL database hosted on Neon, a cloud database
                provider. The application is deployed on Vercel. All data transmission occurs over
                HTTPS. We use industry-standard security practices, but no method of electronic
                storage is 100% secure. We encourage you to keep your Microsoft account credentials
                safe.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">6. Data Retention</h2>
              <p>
                We retain your data for as long as your account is active on the platform. Listings
                may expire after 30 days of inactivity. If you delete your account, your profile
                data, listings, and match records will be permanently removed from our systems.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">
                7. Your Rights and Account Deletion
              </h2>
              <p>You have the right to:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Access your data</strong> — view all profile and listing information
                  through your account.
                </li>
                <li>
                  <strong>Update your data</strong> — edit your profile and listings at any time.
                </li>
                <li>
                  <strong>Request account deletion</strong> — contact us at{" "}
                  <a
                    href="mailto:roomiebu@buconfess.in"
                    className="text-primary hover:underline"
                  >
                    roomiebu@buconfess.in
                  </a>{" "}
                  to request complete removal of your account and all associated data.
                </li>
                <li>
                  <strong>Request data export</strong> — you may request a copy of all data we hold
                  about you by emailing us.
                </li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">8. Third-Party Services</h2>
              <p>RoomieBU uses the following third-party services:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Microsoft Entra ID</strong> — for authentication. Microsoft&apos;s privacy
                  policy applies to data processed through their sign-in service.
                </li>
                <li>
                  <strong>Vercel</strong> — for application hosting.
                </li>
                <li>
                  <strong>Neon</strong> — for database hosting.
                </li>
              </ul>
              <p>
                We do not sell, trade, or share your personal information with advertisers or data
                brokers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">9. Children&apos;s Privacy</h2>
              <p>
                RoomieBU is intended for use by university students who are 17 years of age or
                older. We do not knowingly collect information from children under 17.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">10. Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. Any changes will be reflected
                on this page with an updated &ldquo;Last updated&rdquo; date. Continued use of the
                platform after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-semibold text-foreground">11. Contact Us</h2>
              <p>
                If you have questions about this Privacy Policy or wish to exercise any of your
                rights, please contact us at:
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
