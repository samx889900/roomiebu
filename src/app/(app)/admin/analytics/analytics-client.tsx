"use client";

import { motion } from "framer-motion";
import { Building2, Users as UsersIcon, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface AnalyticsProps {
  analytics: {
    demand: { hostel: number; flat: number };
    gender: { male: number; female: number; other: number };
    topLocations: { location: string; count: number }[];
    statusStats?: Record<string, number>;
    programStats?: Record<string, number>;
    batchStats?: Record<string, number>;
    authProviderStats?: Record<string, number>;
  };
}

export function AnalyticsClient({ analytics }: AnalyticsProps) {
  const totalDemand = analytics.demand.hostel + analytics.demand.flat || 1;
  const totalGender = analytics.gender.male + analytics.gender.female + analytics.gender.other || 1;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-muted-foreground">Platform usage and trends</p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Demand */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4" />Accommodation Demand</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hostel</span>
                  <span className="font-semibold">{analytics.demand.hostel}</span>
                </div>
                <Progress value={(analytics.demand.hostel / totalDemand) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Flat</span>
                  <span className="font-semibold">{analytics.demand.flat}</span>
                </div>
                <Progress value={(analytics.demand.flat / totalDemand) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Gender */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><UsersIcon className="w-4 h-4" />Gender Distribution</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Male", count: analytics.gender.male, color: "text-blue-400" },
                { label: "Female", count: analytics.gender.female, color: "text-pink-400" },
                { label: "Other", count: analytics.gender.other, color: "text-violet-400" },
              ].map((g) => (
                <div key={g.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className={g.color}>{g.label}</span>
                    <span className="font-semibold">{g.count} ({Math.round((g.count / totalGender) * 100)}%)</span>
                  </div>
                  <Progress value={(g.count / totalGender) * 100} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Locations */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><MapPin className="w-4 h-4" />Popular Locations</CardTitle></CardHeader>
            <CardContent>
              {analytics.topLocations.length === 0 ? (
                <p className="text-sm text-muted-foreground">No location data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topLocations.map((loc, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm">{loc.location}</span>
                      <span className="text-xs text-muted-foreground font-medium">{loc.count} listings</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* User Status */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><UsersIcon className="w-4 h-4" />User Status</CardTitle></CardHeader>
            <CardContent>
              {Object.keys(analytics.statusStats || {}).length === 0 ? (
                <p className="text-sm text-muted-foreground">No status data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics.statusStats || {}).map(([status, count]) => (
                    <div key={status} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{status.replace(/_/g, " ")}</span>
                      <span className="text-xs text-muted-foreground font-medium">{count as number} users</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Auth Providers */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><UsersIcon className="w-4 h-4" />Auth Providers</CardTitle></CardHeader>
            <CardContent>
              {Object.keys(analytics.authProviderStats || {}).length === 0 ? (
                <p className="text-sm text-muted-foreground">No provider data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics.authProviderStats || {}).map(([provider, count]) => (
                    <div key={provider} className="flex items-center justify-between">
                      <span className="text-sm font-medium">{provider.replace(/_/g, " + ")}</span>
                      <span className="text-xs text-muted-foreground font-medium">{count as number} users</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Program Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Building2 className="w-4 h-4" />Programs</CardTitle></CardHeader>
            <CardContent>
              {Object.keys(analytics.programStats || {}).length === 0 ? (
                <p className="text-sm text-muted-foreground">No program data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics.programStats || {})
                    .sort(([,a], [,b]) => (b as number) - (a as number))
                    .map(([program, count]) => (
                    <div key={program} className="flex items-center justify-between">
                      <span className="text-sm font-medium uppercase">{program}</span>
                      <span className="text-xs text-muted-foreground font-medium">{count as number} users</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Batch Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><UsersIcon className="w-4 h-4" />Admission Batches</CardTitle></CardHeader>
            <CardContent>
              {Object.keys(analytics.batchStats || {}).length === 0 ? (
                <p className="text-sm text-muted-foreground">No batch data yet</p>
              ) : (
                <div className="space-y-3">
                  {Object.entries(analytics.batchStats || {})
                    .sort(([a], [b]) => Number(b) - Number(a))
                    .map(([year, count]) => (
                    <div key={year} className="flex items-center justify-between">
                      <span className="text-sm font-medium">Class of {year}</span>
                      <span className="text-xs text-muted-foreground font-medium">{count as number} users</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
