"use client";

import { motion } from "framer-motion";
import { Building2, Users, Heart, Shield, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { APP_NAME } from "@/lib/constants";

const features = [
  { icon: Users, title: "Smart Matching", desc: "AI-powered compatibility scoring based on your lifestyle and preferences." },
  { icon: Heart, title: "Express Interest", desc: "Connect with potential roommates through a secure interest system." },
  { icon: Shield, title: "Bennett Exclusive", desc: "Only verified Bennett University students with @bennett.edu.in emails." },
  { icon: Sparkles, title: "Premium Experience", desc: "Modern, intuitive interface designed for the best user experience." },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero */}
      <div className="relative">
        {/* Background effects */}
        <div className="absolute inset-0">
          <motion.div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-15" style={{ background: "radial-gradient(circle, oklch(0.55 0.25 285), transparent)" }} animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 8, repeat: Infinity }} />
          <motion.div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10" style={{ background: "radial-gradient(circle, oklch(0.65 0.2 145), transparent)" }} animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 10, repeat: Infinity }} />
        </div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: "linear-gradient(oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.9 0 0) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-20 pb-32">
          {/* Nav */}
          <nav className="flex items-center justify-between mb-20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gradient">{APP_NAME}</span>
            </div>
            <Button onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/listings" })} className="gradient-primary glow-primary gap-2">
              Get Started <ArrowRight className="w-4 h-4" />
            </Button>
          </nav>

          {/* Hero Content */}
          <div className="text-center max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Built for Bennett University Students
              </div>
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
                Find Your
                <span className="text-gradient block">Perfect Roommate</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
                Smart compatibility matching, secure messaging, and a premium experience — all exclusive to Bennett University.
              </p>
              <div className="flex justify-center gap-4">
                <Button size="lg" className="gradient-primary glow-primary text-base px-8 h-12" onClick={() => signIn("microsoft-entra-id", { callbackUrl: "/listings" })}>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 21 21" fill="none">
                    <rect x="1" y="1" width="9" height="9" fill="#f25022" />
                    <rect x="11" y="1" width="9" height="9" fill="#7fba00" />
                    <rect x="1" y="11" width="9" height="9" fill="#00a4ef" />
                    <rect x="11" y="11" width="9" height="9" fill="#ffb900" />
                  </svg>
                  Sign in with Microsoft
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pb-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="rounded-2xl border border-border bg-card/50 p-6 hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4 text-center">
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {APP_NAME} • Built for Bennett University
        </p>
      </footer>
    </div>
  );
}
