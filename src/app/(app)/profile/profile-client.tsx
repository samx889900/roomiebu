"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { UserCircle, Mail, Phone, BookOpen, GraduationCap, Moon, Sparkles, Pencil, Save } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { enumToLabel, getInitials } from "@/lib/utils";
import { updateProfile } from "./actions";
import { toast } from "sonner";

export function ProfileClient({ user }: { user: any }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = user?.profile;

  const [formData, setFormData] = useState({
    phone: profile?.phone || "",
    aboutMe: profile?.aboutMe || "",
    otherHabits: profile?.otherHabits || "",
  });

  async function handleSave() {
    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        <Button
          variant={editing ? "default" : "outline"}
          className={editing ? "gradient-primary" : ""}
          onClick={editing ? handleSave : () => setEditing(true)}
          disabled={loading}
        >
          {editing ? (
            <><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Save"}</>
          ) : (
            <><Pencil className="w-4 h-4 mr-2" />Edit</>
          )}
        </Button>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header Card */}
        <Card className="overflow-hidden">
          <div className="h-24 gradient-primary" />
          <CardContent className="relative pb-6">
            <Avatar className="h-20 w-20 absolute -top-10 left-6 ring-4 ring-background">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-28 pt-2">
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{user?.email}</span>
                {profile?.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{profile.phone}</span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" />Academic</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Course</span><p className="font-medium">{profile?.course || "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Year</span><p className="font-medium">{profile?.year || "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Gender</span><p className="font-medium">{profile?.gender ? enumToLabel(profile.gender) : "—"}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" />Lifestyle</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Smoking</span><p className="font-medium">{profile ? enumToLabel(profile.smoking) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Drinking</span><p className="font-medium">{profile ? enumToLabel(profile.drinking) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Vaping</span><p className="font-medium">{profile ? enumToLabel(profile.vaping) : "—"}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Moon className="w-4 h-4" />Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-xs text-muted-foreground">Sleep Schedule</span><p className="font-medium">{profile ? enumToLabel(profile.sleepSchedule) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Cleanliness</span><p className="font-medium">{profile?.cleanlinessLevel || "—"}/5</p></div>
              <div><span className="text-xs text-muted-foreground">Study Environment</span><p className="font-medium">{profile ? enumToLabel(profile.studyEnvironment) : "—"}</p></div>
              <div><span className="text-xs text-muted-foreground">Guests</span><p className="font-medium">{profile ? enumToLabel(profile.guestsPreference) : "—"}</p></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">About</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <Input value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">About Me</span>
                    <Textarea value={formData.aboutMe} onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })} maxLength={300} rows={3} />
                  </div>
                </>
              ) : (
                <>
                  <div><span className="text-xs text-muted-foreground">Bio</span><p className="text-sm">{profile?.aboutMe || "No bio yet"}</p></div>
                  <div>
                    <span className="text-xs text-muted-foreground">Languages</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile?.languages || []).map((l: string) => (
                        <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
                      ))}
                    </div>
                  </div>
                  <div><span className="text-xs text-muted-foreground">Accommodation</span><p className="font-medium">{profile ? enumToLabel(profile.accommodationType) : "—"}</p></div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
