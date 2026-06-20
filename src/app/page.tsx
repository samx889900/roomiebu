"use client";

import { motion } from "framer-motion";
import { Building2, Users, Heart, Shield, ArrowRight, Search, Sparkles, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signIn } from "next-auth/react";
import { APP_NAME } from "@/lib/constants";

const features = [
  {
    icon: Search,
    title: "Browse verified roommate listings",
    desc: "Explore hostel and flat listings posted only by Bennett students.",
  },
  {
    icon: Heart,
    title: "Match on compatibility",
    desc: "See lifestyle fit, room expectations, and urgency before you reach out.",
  },
  {
    icon: Shield,
    title: "Bennett-only access",
    desc: "Microsoft Entra sign-in keeps the platform private to @bennett.edu.in accounts.",
  },
  {
    icon: Users,
    title: "Move from interest to match",
    desc: "Owners can accept interest requests and unlock contact details instantly.",
  },
];

const stats = [
  { label: "Built for", value: "Bennett students" },
  { label: "Listing types", value: "Hostel, Flat, Flexible" },
  { label: "Best for", value: "Faster roommate decisions" },
];

export default function HomePage() {
  return (
    <div className="page-shell">
      <section className="hero-wash border-b border-border/70">
        <div className="content-wrap py-6 sm:py-8">
          <nav className="surface-subtle mb-10 flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl gradient-primary text-white">
                <Building2 className="h-6 w-6" />
              </div>
              <div>
                <p className="text-lg font-semibold tracking-[-0.03em]">{APP_NAME}</p>
                <p className="text-xs text-muted-foreground">Roommate matching for Bennett University</p>
              </div>
            </div>
            <Button onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/listings" })} size="lg">
              Sign in
            </Button>
          </nav>

          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
              <Badge variant="outline" className="border-primary/20 bg-white/90 px-4 py-1.5 text-primary">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Bennett-exclusive roommate marketplace
              </Badge>
              <div className="space-y-4">
                <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.05em] text-foreground sm:text-6xl lg:text-7xl">
                  Find a roommate that feels right before move-in day.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
                  RoomieBU helps Bennett students discover compatible roommates and flatmates with a calmer,
                  cleaner browsing experience inspired by the best consumer marketplaces.
                </p>
              </div>
              <div className="surface-panel inline-flex w-full max-w-3xl flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="grid gap-1">
                  <p className="text-sm font-semibold text-foreground">Start with your Bennett Microsoft account</p>
                  <p className="text-sm text-muted-foreground">Complete your profile, browse listings, and send interest in minutes.</p>
                </div>
                <Button
                  onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/listings" })}
                  size="lg"
                  className="min-w-44"
                >
                  Explore RoomieBU
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div key={stat.label} className="surface-subtle p-4">
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
                    <p className="mt-2 text-base font-semibold tracking-[-0.02em] text-foreground">{stat.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="surface-panel overflow-hidden p-4 sm:p-5">
                <div className="rounded-[24px] bg-[#fff7f5] p-5 sm:p-6">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold">Featured listing flow</p>
                      <p className="text-sm text-muted-foreground">What students see after signing in</p>
                    </div>
                    <div className="rounded-full bg-white px-3 py-1 text-xs font-medium text-primary">Live soon</div>
                  </div>
                  <div className="space-y-4">
                    <div className="rounded-[22px] bg-white p-5 air-shadow-soft">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold tracking-[-0.02em]">Looking for one more flatmate near campus</p>
                          <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" /> Sector 62, Noida
                          </p>
                        </div>
                        <Badge className="bg-[#fff1f3] text-primary">82% match</Badge>
                      </div>
                      <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
                        <div className="rounded-2xl bg-muted px-4 py-3">Budget: ?8,000 - ?12,000</div>
                        <div className="rounded-2xl bg-muted px-4 py-3">Mood: Quiet weekdays, social weekends</div>
                        <div className="rounded-2xl bg-muted px-4 py-3">Move-in: Within 1 month</div>
                        <div className="rounded-2xl bg-muted px-4 py-3">Spots left: 2 of 3</div>
                      </div>
                    </div>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[22px] bg-white p-5 air-shadow-soft">
                        <p className="text-sm font-semibold">Why it works</p>
                        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
                          <li>Late-night study schedule matches</li>
                          <li>Similar cleanliness expectations</li>
                          <li>Compatible guest preferences</li>
                        </ul>
                      </div>
                      <div className="rounded-[22px] gradient-primary p-5 text-white">
                        <p className="text-sm font-semibold text-white/80">Action</p>
                        <p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">Express interest</p>
                        <p className="mt-2 text-sm leading-6 text-white/80">If accepted, RoomieBU reveals the contact details and creates a match.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="content-wrap py-16 sm:py-20">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">What changes with this experience</p>
          <h2 className="section-heading mt-3">A brighter, premium flow for student housing decisions.</h2>
          <p className="section-copy mt-4">
            We're shifting RoomieBU toward a cleaner, more generous marketplace feel so listings, compatibility, and profile context are easier to trust at a glance.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="surface-panel p-6"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff1f3] text-primary">
                <feature.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold tracking-[-0.02em]">{feature.title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
