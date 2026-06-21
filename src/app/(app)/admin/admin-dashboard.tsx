"use client";

import { motion } from "framer-motion";
import { Users, List, BarChart3, Heart, Flag, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface AdminDashboardProps {
  stats: {
    totalUsers: number;
    totalListings: number;
    activeListings: number;
    totalMatches: number;
    pendingReports: number;
  };
}

const statCards = [
  { key: "totalUsers", label: "Total Users", icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
  { key: "totalListings", label: "Total Listings", icon: List, color: "text-violet-400", bg: "bg-violet-500/10" },
  { key: "activeListings", label: "Active Listings", icon: TrendingUp, color: "text-emerald-400", bg: "bg-emerald-500/10" },
  { key: "totalMatches", label: "Matches Created", icon: Heart, color: "text-pink-400", bg: "bg-pink-500/10" },
  { key: "pendingReports", label: "Pending Reports", icon: Flag, color: "text-red-400", bg: "bg-red-500/10" },
];

export function AdminDashboard({ stats }: AdminDashboardProps) {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground">Platform overview and moderation tools</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          const value = stats[card.key as keyof typeof stats];
          return (
            <motion.div key={card.key} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <CardContent className="p-5">
                  <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                  <p className="text-2xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{card.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 sm:grid-cols-3 mt-6">
        {[
          { label: "Manage Reports", desc: "Review and resolve reports", href: "/admin/reports", icon: Flag },
          { label: "Manage Users", desc: "View and moderate users", href: "/admin/users", icon: Users },
          { label: "View Analytics", desc: "Platform analytics and trends", href: "/admin/analytics", icon: BarChart3 },
        ].map((item, i) => (
          <motion.div key={item.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.05 }}>
            <Link href={item.href}>
              <Card className="hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/5 cursor-pointer">
                <CardContent className="p-6 text-center">
                  <item.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h3 className="font-semibold mb-1">{item.label}</h3>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
