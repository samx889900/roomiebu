"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, BookOpen, Moon, Sparkles, Pencil, Save, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { enumToLabel, getInitials } from "@/lib/utils";
import { updateProfile } from "./actions";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import { LANGUAGE_OPTIONS } from "@/lib/constants";

export function ProfileClient({ user }: { user: { name?: string | null; email?: string | null; image?: string | null; profile?: any /* eslint-disable-line @typescript-eslint/no-explicit-any */; } }) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const profile = user?.profile || {};

  const [formData, setFormData] = useState({
    phone: profile.phone || "",
    aboutMe: profile.aboutMe || "",
    otherHabits: profile.otherHabits || "",
    course: profile.course || "",
    year: profile.year || "",
    gender: profile.gender || "MALE",
    smoking: profile.smoking || "NEVER",
    drinking: profile.drinking || "NEVER",
    vaping: profile.vaping || "NEVER",
    sleepSchedule: profile.sleepSchedule || "DEPENDS",
    cleanlinessLevel: profile.cleanlinessLevel?.toString() || "3",
    studyEnvironment: profile.studyEnvironment || "DOESNT_MATTER",
    guestsPreference: profile.guestsPreference || "OCCASIONALLY",
    accommodationType: profile.accommodationType || "NOT_SURE",
  });

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(() => {
    const langs: string[] = profile.languages || [];
    const hasCustom = langs.some(l => !LANGUAGE_OPTIONS.includes(l as never) && l !== "Other");
    if (hasCustom) {
      return [...langs.filter(l => LANGUAGE_OPTIONS.includes(l as never)), "Other"];
    }
    return langs;
  });

  const [customLanguage, setCustomLanguage] = useState(() => {
    const langs: string[] = profile.languages || [];
    const custom = langs.filter(l => !LANGUAGE_OPTIONS.includes(l as never) && l !== "Other");
    return custom.join(", ");
  });

  const toggleLanguage = (lang: string) => {
    const updated = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(updated);
  };

  async function handleSave() {
    setLoading(true);
    try {
      let finalLanguages = [...selectedLanguages];
      if (finalLanguages.includes("Other") && customLanguage.trim()) {
        finalLanguages = finalLanguages.filter((l) => l !== "Other");
        const customLangs = customLanguage.split(",").map(s => s.trim()).filter(Boolean);
        customLangs.forEach(lang => {
          if (!finalLanguages.includes(lang)) {
            finalLanguages.push(lang);
          }
        });
      }

      await updateProfile({
        ...formData,
        languages: finalLanguages,
        cleanlinessLevel: parseInt(formData.cleanlinessLevel, 10),
      });
      toast.success("Profile updated!");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectChange(field: string, value: string | null) {
    if (value) {
      setFormData((prev) => ({ ...prev, [field]: value }));
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Your Profile</h1>
          <p className="text-muted-foreground">View and manage your profile information</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={editing ? "default" : "outline"}
            onClick={editing ? handleSave : () => setEditing(true)}
            disabled={loading}
          >
            {editing ? (
              <><Save className="w-4 h-4 mr-2" />{loading ? "Saving..." : "Save"}</>
            ) : (
              <><Pencil className="w-4 h-4 mr-2" />Edit</>
            )}
          </Button>
          {!editing && (
            <Button
              variant="destructive"
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              disabled={loading}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Header Card */}
        <Card className="overflow-hidden bg-white shadow-none border-border/70">
          <div className="h-24 bg-muted" />
          <CardContent className="relative pb-6">
            <Avatar className="h-20 w-20 absolute -top-10 left-6 ring-4 ring-background">
              <AvatarImage src={user?.image || ""} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {user?.name ? getInitials(user.name) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="ml-28 pt-2 min-w-0">
              <h2 className="text-xl font-bold truncate break-words">{user?.name}</h2>
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-sm text-muted-foreground mt-1 min-w-0">
                <span className="flex items-center gap-1 min-w-0"><Mail className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{user?.email}</span></span>
                {profile?.phone && <span className="flex items-center gap-1 min-w-0"><Phone className="w-3.5 h-3.5 shrink-0" /><span className="truncate">{profile.phone}</span></span>}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Info Cards */}
        <div className="grid gap-4 sm:grid-cols-2 mt-6">
          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><BookOpen className="w-4 h-4" />Academic</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Course</span><Input value={formData.course} onChange={(e) => setFormData({ ...formData, course: e.target.value })} /></div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Year</span><Input value={formData.year} onChange={(e) => setFormData({ ...formData, year: e.target.value })} /></div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Gender</span>
                    <Select value={formData.gender} onValueChange={(v) => handleSelectChange("gender", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="OTHER">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div><span className="text-xs text-muted-foreground">Course</span><p className="font-medium">{profile?.course || "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Year</span><p className="font-medium">{profile?.year || "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Gender</span><p className="font-medium">{profile?.gender ? enumToLabel(profile.gender) : "—"}</p></div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Sparkles className="w-4 h-4" />Lifestyle</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Smoking</span>
                    <Select value={formData.smoking} onValueChange={(v) => handleSelectChange("smoking", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Drinking</span>
                    <Select value={formData.drinking} onValueChange={(v) => handleSelectChange("drinking", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Vaping</span>
                    <Select value={formData.vaping} onValueChange={(v) => handleSelectChange("vaping", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div><span className="text-xs text-muted-foreground">Smoking</span><p className="font-medium">{profile?.smoking ? enumToLabel(profile.smoking) : "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Drinking</span><p className="font-medium">{profile?.drinking ? enumToLabel(profile.drinking) : "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Vaping</span><p className="font-medium">{profile?.vaping ? enumToLabel(profile.vaping) : "—"}</p></div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm flex items-center gap-2"><Moon className="w-4 h-4" />Preferences</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Sleep Schedule</span>
                    <Select value={formData.sleepSchedule} onValueChange={(v) => handleSelectChange("sleepSchedule", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING_PERSON">Morning Person</SelectItem>
                        <SelectItem value="NIGHT_PERSON">Night Person</SelectItem>
                        <SelectItem value="DEPENDS">Depends</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Cleanliness</span>
                    <Select value={formData.cleanlinessLevel} onValueChange={(v) => handleSelectChange("cleanlinessLevel", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 - Messy</SelectItem>
                        <SelectItem value="2">2 - Relaxed</SelectItem>
                        <SelectItem value="3">3 - Moderate</SelectItem>
                        <SelectItem value="4">4 - Clean</SelectItem>
                        <SelectItem value="5">5 - Spotless</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Study Environment</span>
                    <Select value={formData.studyEnvironment} onValueChange={(v) => handleSelectChange("studyEnvironment", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SILENT">Silent</SelectItem>
                        <SelectItem value="MODERATE">Moderate</SelectItem>
                        <SelectItem value="DOESNT_MATTER">Doesn&apos;t Matter</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1"><span className="text-xs text-muted-foreground">Guests</span>
                    <Select value={formData.guestsPreference} onValueChange={(v) => handleSelectChange("guestsPreference", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="FREQUENTLY">Frequently</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              ) : (
                <>
                  <div><span className="text-xs text-muted-foreground">Sleep Schedule</span><p className="font-medium">{profile?.sleepSchedule ? enumToLabel(profile.sleepSchedule) : "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Cleanliness</span><p className="font-medium">{profile?.cleanlinessLevel || "—"}/5</p></div>
                  <div><span className="text-xs text-muted-foreground">Study Environment</span><p className="font-medium">{profile?.studyEnvironment ? enumToLabel(profile.studyEnvironment) : "—"}</p></div>
                  <div><span className="text-xs text-muted-foreground">Guests</span><p className="font-medium">{profile?.guestsPreference ? enumToLabel(profile.guestsPreference) : "—"}</p></div>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">About</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {editing ? (
                <>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Phone</span>
                    <Input
                      value={formData.phone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setFormData({ ...formData, phone: val });
                      }}
                      maxLength={15}
                    />
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Accommodation Preference</span>
                    <Select value={formData.accommodationType} onValueChange={(v) => handleSelectChange("accommodationType", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOSTEL">Hostel</SelectItem>
                        <SelectItem value="FLAT">Flat</SelectItem>
                        <SelectItem value="NOT_SURE">Not Sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">Languages</span>
                    <div className="flex flex-wrap gap-2">
                      {LANGUAGE_OPTIONS.map((lang) => (
                        <Badge
                          key={lang}
                          variant={selectedLanguages.includes(lang) ? "default" : "outline"}
                          className={`cursor-pointer transition-all ${
                            selectedLanguages.includes(lang)
                              ? "gradient-primary border-0"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => toggleLanguage(lang)}
                        >
                          {lang}
                        </Badge>
                      ))}
                    </div>
                    {selectedLanguages.includes("Other") && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-2"
                      >
                        <Input
                          placeholder="Type your language"
                          value={customLanguage}
                          onChange={(e) => setCustomLanguage(e.target.value)}
                          className="max-w-xs"
                        />
                      </motion.div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <span className="text-xs text-muted-foreground">About Me</span>
                    <Textarea value={formData.aboutMe} onChange={(e) => setFormData({ ...formData, aboutMe: e.target.value })} maxLength={300} rows={3} />
                  </div>
                </>
              ) : (
                <>
                  <div className="min-w-0"><span className="text-xs text-muted-foreground">Bio</span><p className="text-sm break-words">{profile?.aboutMe || "No bio yet"}</p></div>
                  <div className="min-w-0">
                    <span className="text-xs text-muted-foreground">Languages</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {(profile?.languages || []).map((l: string) => (
                        <Badge key={l} variant="secondary" className="text-xs max-w-full break-all whitespace-normal text-left">{l}</Badge>
                      ))}
                    </div>
                  </div>
                  <div><span className="text-xs text-muted-foreground">Accommodation</span><p className="font-medium">{profile?.accommodationType ? enumToLabel(profile.accommodationType) : "—"}</p></div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
}
