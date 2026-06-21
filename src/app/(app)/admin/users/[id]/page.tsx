import { getAdminUserById } from "../../actions";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { enumToLabel, formatDate } from "@/lib/utils";
import {
  User as UserIcon, Mail, Phone, Calendar, Shield, BookOpen, 
  GraduationCap, Sparkles, Home, Activity, List, Users, Heart, Flag
} from "lucide-react";
import { AdminUserActions } from "./admin-user-actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminUserDetailPage({ params }: { params: { id: string } }) {
  const user = await getAdminUserById(params.id);
  if (!user) notFound();

  const profile = user.profile;
  const matchesCount = user._count.matchesAsA + user._count.matchesAsB;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">User Details</h1>
        <Link href="/admin/users">
          <Button variant="outline">Back to Users</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="space-y-6 md:col-span-1">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <UserIcon className="w-4 h-4" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground">Name</span>
                <p className="font-medium">{user.name || "Unknown"}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Email</span>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm">{user.email}</p>
                </div>
              </div>
              {profile?.phone && (
                <div>
                  <span className="text-xs text-muted-foreground">Phone Number</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Phone className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-sm">{profile.phone}</p>
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <div>
                  <span className="text-xs text-muted-foreground">Role</span>
                  <p className="text-sm mt-1"><Badge variant="outline">{user.role}</Badge></p>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Status</span>
                  <p className="text-sm mt-1">
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : user.isSuspended ? (
                      <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">Suspended</Badge>
                    ) : (
                      <Badge variant="default" className="bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100">Active</Badge>
                    )}
                  </p>
                </div>
              </div>
              <div className="pt-2 border-t mt-2">
                <span className="text-xs text-muted-foreground">Created Date</span>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <p className="text-sm">{formatDate(user.createdAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card className="border-red-100 bg-red-50/30">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2 text-red-800">
                <Shield className="w-4 h-4" />
                Admin Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <AdminUserActions user={user} />
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6 md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Academic Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <span className="text-xs text-muted-foreground">Course</span>
                  <div className="flex items-center gap-2 mt-1">
                    <BookOpen className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-sm">{profile?.course || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Year</span>
                  <div className="flex items-center gap-2 mt-1">
                    <GraduationCap className="w-3.5 h-3.5 text-muted-foreground" />
                    <p className="text-sm">{profile?.year || "—"}</p>
                  </div>
                </div>
                <div>
                  <span className="text-xs text-muted-foreground">Bennett Email</span>
                  <p className="text-sm mt-1">{user.email.endsWith("@bennett.edu.in") ? user.email : "—"}</p>
                </div>
              </CardContent>
            </Card>

            {/* Activity Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Activity Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <List className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-2xl font-bold">{user._count.listings}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Listings</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <Users className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-2xl font-bold">{matchesCount}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Matches</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <Heart className="w-4 h-4 text-muted-foreground mb-1" />
                    <span className="text-xl font-bold">{user._count.interests}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Int. Sent</span>
                  </div>
                  <div className="bg-muted/50 p-3 rounded-lg flex flex-col items-center justify-center text-center">
                    <Heart className="w-4 h-4 text-primary mb-1" />
                    <span className="text-xl font-bold">{user.interestsReceived}</span>
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground mt-1">Int. Received</span>
                  </div>
                  <div className="bg-red-50 p-3 rounded-lg flex flex-col items-center justify-center text-center col-span-2 border border-red-100">
                    <Flag className="w-4 h-4 text-red-500 mb-1" />
                    <span className="text-xl font-bold text-red-700">{user._count.reportsAgainst}</span>
                    <span className="text-xs font-medium text-red-600 mt-1">Reports Against User</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lifestyle Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Lifestyle & Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 sm:grid-cols-3 gap-6">
              <div><span className="text-xs text-muted-foreground">Smoking</span><p className="text-sm font-medium mt-1">{profile?.smoking ? enumToLabel(profile.smoking) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Drinking</span><p className="text-sm font-medium mt-1">{profile?.drinking ? enumToLabel(profile.drinking) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Sleep Schedule</span><p className="text-sm font-medium mt-1">{profile?.sleepSchedule ? enumToLabel(profile.sleepSchedule) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Cleanliness</span><p className="text-sm font-medium mt-1">{profile?.cleanlinessLevel ? `${profile.cleanlinessLevel}/5` : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Study Environment</span><p className="text-sm font-medium mt-1">{profile?.studyEnvironment ? enumToLabel(profile.studyEnvironment) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Guest Preference</span><p className="text-sm font-medium mt-1">{profile?.guestsPreference ? enumToLabel(profile.guestsPreference) : "—"}</p></div>
            </CardContent>
          </Card>

          {/* Languages */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Home className="w-4 h-4" />
                Languages Spoken
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile?.languages && profile.languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {profile.languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary border-0">
                      {lang}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">—</p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
