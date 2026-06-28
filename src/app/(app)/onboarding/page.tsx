"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  User, Heart, Moon, Sparkles, Home, CheckCircle2, ArrowRight, ArrowLeft, Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { profileSchema, type ProfileFormData } from "@/lib/validators/profile";
import { COURSE_OPTIONS, YEAR_OPTIONS, LANGUAGE_OPTIONS, APP_NAME } from "@/lib/constants";
import { completeOnboarding } from "./actions";
import { toast } from "sonner";

const STEPS = [
  { id: "welcome", title: "Welcome", icon: Sparkles },
  { id: "basic", title: "Basic Info", icon: User },
  { id: "lifestyle", title: "Lifestyle", icon: Heart },
  { id: "preferences", title: "Preferences", icon: Moon },
  { id: "about", title: "About You", icon: Sparkles },
  { id: "accommodation", title: "Accommodation", icon: Home },
  { id: "review", title: "Review", icon: CheckCircle2 },
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["English"]);
  const [customLanguage, setCustomLanguage] = useState("");
  const [cleanliness, setCleanliness] = useState(3);

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      smoking: "NEVER",
      vaping: "NEVER",
      drinking: "NEVER",
      sleepSchedule: "DEPENDS",
      cleanlinessLevel: 3,
      studyEnvironment: "DOESNT_MATTER",
      guestsPreference: "OCCASIONALLY",
      languages: ["English"],
      accommodationType: "NOT_SURE",
    },
  });

  useEffect(() => {
    const fieldsToRegister: (keyof ProfileFormData)[] = [
      "gender", "course", "year", "smoking", "vaping", "drinking",
      "sleepSchedule", "studyEnvironment",
      "guestsPreference", "accommodationType", "languages"
    ];
    fieldsToRegister.forEach((field) => form.register(field));
  }, [form]);

  const totalSteps = STEPS.length;
  const progress = ((step + 1) / totalSteps) * 100;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const toggleLanguage = (lang: string) => {
    const updated = selectedLanguages.includes(lang)
      ? selectedLanguages.filter((l) => l !== lang)
      : [...selectedLanguages, lang];
    setSelectedLanguages(updated);
    form.setValue("languages", updated);
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    try {
      let finalLanguages = [...selectedLanguages];
      if (finalLanguages.includes("Other") && customLanguage.trim()) {
        finalLanguages = finalLanguages.filter((l) => l !== "Other");
        if (!finalLanguages.includes(customLanguage.trim())) {
          finalLanguages.push(customLanguage.trim());
        }
      }
      data.languages = finalLanguages;
      await completeOnboarding(data);
      toast.success("Profile completed! Welcome to " + APP_NAME);
      router.push("/listings");
      router.refresh();
    } catch (error) {
      toast.error("Failed to complete profile. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onInvalid = (errors: unknown) => {
    console.error("Validation errors:", errors);
    toast.error("Please fill all required fields correctly (e.g., gender, course, year).");
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="border-b border-border bg-white">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary text-white">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-gradient">{APP_NAME}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Step {step + 1} of {totalSteps}
          </div>
        </div>
        <Progress value={progress} className="h-1" />
      </div>

      {/* Steps */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl">
          <AnimatePresence mode="wait" custom={1}>
            <motion.div
              key={step}
              custom={1}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {/* Step 0: Welcome */}
              {step === 0 && (
                <div className="text-center space-y-6 py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 200 }}
                    className="mx-auto flex h-20 w-20 items-center justify-center rounded-[24px] bg-primary/10"
                  >
                    <Sparkles className="w-10 h-10 text-primary" />
                  </motion.div>
                  <h1 className="text-3xl font-bold">Welcome to {APP_NAME}! 🎉</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Let&apos;s set up your profile so we can match you with the perfect roommate.
                    This takes about 2 minutes.
                  </p>
                </div>
              )}

              {/* Step 1: Basic Info */}
              {step === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Basic Information</h2>
                    <p className="text-muted-foreground">Tell us about yourself</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Phone Number *</Label>
                      <Input
                        {...form.register("phone", {
                          onChange: (e) => {
                            e.target.value = e.target.value.replace(/\D/g, "");
                          },
                        })}
                        placeholder="9876543210"
                        maxLength={15}
                      />
                      {form.formState.errors.phone && (
                        <p className="text-xs text-destructive">{form.formState.errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label>Gender *</Label>
                      <Select value={form.watch("gender") ?? null} onValueChange={(v: string | null) => { if (v) form.setValue("gender", v as ProfileFormData["gender"]); }}>
                        <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Date of Birth *</Label>
                      <Input type="date" {...form.register("dob")} />
                    </div>
                    <div className="space-y-2">
                      <Label>Course *</Label>
                      <Select value={form.watch("course") ?? null} onValueChange={(v: string | null) => { if (v) form.setValue("course", v); }}>
                        <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                        <SelectContent>
                          {COURSE_OPTIONS.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2 sm:col-span-2">
                      <Label>Year *</Label>
                      <Select value={form.watch("year") ?? null} onValueChange={(v: string | null) => { if (v) form.setValue("year", v); }}>
                        <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                        <SelectContent>
                          {YEAR_OPTIONS.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Lifestyle */}
              {step === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Lifestyle</h2>
                    <p className="text-muted-foreground">Your habits help us find compatible matches</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Smoking</Label>
                    <Select
                      value={form.watch("smoking")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("smoking", v as ProfileFormData["smoking"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Drinking</Label>
                    <Select
                      value={form.watch("drinking")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("drinking", v as ProfileFormData["drinking"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Vaping</Label>
                    <Select
                      value={form.watch("vaping")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("vaping", v as ProfileFormData["vaping"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="REGULARLY">Regularly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Other Habits</Label>
                    <Input {...form.register("otherHabits")} placeholder="e.g., Gaming, Music..." />
                  </div>
                </div>
              )}

              {/* Step 3: Preferences */}
              {step === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Preferences</h2>
                    <p className="text-muted-foreground">How do you like your living space?</p>
                  </div>
                  <div className="space-y-2">
                    <Label>Sleep Schedule</Label>
                    <Select
                      value={form.watch("sleepSchedule")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("sleepSchedule", v as ProfileFormData["sleepSchedule"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MORNING_PERSON">Morning Person 🌅</SelectItem>
                        <SelectItem value="NIGHT_PERSON">Night Person 🌙</SelectItem>
                        <SelectItem value="DEPENDS">Depends 🤷</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-4">
                    <Label>Cleanliness Level: {cleanliness}/5</Label>
                    <div className="px-2 py-4 sm:px-0 sm:py-2">
                      <div className="relative">
                        <input
                          type="range"
                          min={1}
                          max={5}
                          step={1}
                          value={cleanliness}
                          onChange={(e) => {
                            const val = parseInt(e.target.value, 10);
                            setCleanliness(val);
                            form.setValue("cleanlinessLevel", val);
                          }}
                          className="w-full h-2 rounded-full appearance-none cursor-pointer bg-muted accent-primary
                            [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
                            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white
                            [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary
                            [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer
                            [&::-webkit-slider-thumb]:transition-shadow [&::-webkit-slider-thumb]:hover:shadow-lg
                            [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5
                            [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-white
                            [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary
                            [&::-moz-range-thumb]:shadow-md [&::-moz-range-thumb]:cursor-pointer
                            [&::-moz-range-track]:bg-muted [&::-moz-range-track]:rounded-full [&::-moz-range-track]:h-2"
                        />
                        <div className="flex justify-between mt-2">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <button
                              key={n}
                              type="button"
                              onClick={() => {
                                setCleanliness(n);
                                form.setValue("cleanlinessLevel", n);
                              }}
                              className={`w-7 h-7 rounded-full text-xs font-medium transition-all ${
                                n === cleanliness
                                  ? "bg-primary text-white shadow-md scale-110"
                                  : "bg-muted text-muted-foreground hover:bg-primary/10"
                              }`}
                            >
                              {n}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground px-1">
                      <span>Relaxed</span>
                      <span>Spotless</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Study Environment</Label>
                    <Select
                      value={form.watch("studyEnvironment")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("studyEnvironment", v as ProfileFormData["studyEnvironment"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SILENT">Silent 🤫</SelectItem>
                        <SelectItem value="MODERATE">Moderate 🔊</SelectItem>
                        <SelectItem value="DOESNT_MATTER">Doesn&apos;t Matter 🎧</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Guests Preference</Label>
                    <Select
                      value={form.watch("guestsPreference")}
                      onValueChange={(v: string | null) => { if (v) form.setValue("guestsPreference", v as ProfileFormData["guestsPreference"]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NEVER">Never</SelectItem>
                        <SelectItem value="OCCASIONALLY">Occasionally</SelectItem>
                        <SelectItem value="FREQUENTLY">Frequently</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: About You */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">About You</h2>
                    <p className="text-muted-foreground">Share a bit more with potential roommates</p>
                  </div>
                  <div className="space-y-3">
                    <Label>Languages Spoken *</Label>
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
                    <Label>About Me ({(form.watch("aboutMe") || "").length}/300)</Label>
                    <Textarea
                      {...form.register("aboutMe")}
                      placeholder="Tell your future roommate about yourself..."
                      rows={4}
                      maxLength={300}
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Accommodation */}
              {step === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Accommodation</h2>
                    <p className="text-muted-foreground">What type of accommodation are you looking for?</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-3">
                    {(() => {
                      const currentAccommodationType = form.watch("accommodationType");
                      return [
                        { value: "HOSTEL", label: "Hostel", emoji: "🏫", desc: "On-campus housing" },
                        { value: "FLAT", label: "Flat", emoji: "🏠", desc: "Off-campus apartment" },
                        { value: "NOT_SURE", label: "Not Sure", emoji: "🤔", desc: "Open to both" },
                      ].map((option) => {
                        const isSelected = currentAccommodationType === option.value;
                        return (
                        <motion.div
                          key={option.value}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => form.setValue("accommodationType", option.value as ProfileFormData["accommodationType"])}
                          className={`cursor-pointer rounded-2xl border-2 p-6 text-center transition-all ${
                            isSelected
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          <div className="text-4xl mb-3">{option.emoji}</div>
                          <h3 className="font-semibold mb-1">{option.label}</h3>
                          <p className="text-xs text-muted-foreground">{option.desc}</p>
                        </motion.div>
                      );
                    })})()}
                  </div>
                </div>
              )}

              {/* Step 6: Review */}
              {step === 6 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold">Review Your Profile</h2>
                    <p className="text-muted-foreground">Make sure everything looks good</p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {[
                      { label: "Phone", value: form.watch("phone") },
                      { label: "Gender", value: form.watch("gender") },
                      { label: "Course", value: form.watch("course") },
                      { label: "Year", value: form.watch("year") },
                      { label: "Smoking", value: form.watch("smoking") },
                      { label: "Drinking", value: form.watch("drinking") },
                      { label: "Sleep", value: form.watch("sleepSchedule")?.replace(/_/g, " ") },
                      { label: "Cleanliness", value: `${cleanliness}/5` },
                      { label: "Study Env", value: form.watch("studyEnvironment")?.replace(/_/g, " ") },
                      { label: "Accommodation", value: form.watch("accommodationType")?.replace(/_/g, " ") },
                    ].map((item) => (
                      <div key={item.label} className="rounded-lg border border-border p-3">
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="font-medium capitalize">{item.value?.toLowerCase() || "—"}</p>
                      </div>
                    ))}
                  </div>
                  {form.watch("aboutMe") && (
                    <div className="rounded-lg border border-border p-3">
                      <p className="text-xs text-muted-foreground mb-1">About Me</p>
                      <p className="text-sm">{form.watch("aboutMe")}</p>
                    </div>
                  )}
                  <div className="rounded-lg border border-border p-3">
                    <p className="text-xs text-muted-foreground mb-2">Languages</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedLanguages.map((l) => (
                        <Badge key={l} variant="secondary" className="text-xs">{l}</Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 0}
              className="gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </Button>

            {step < totalSteps - 1 ? (
              <Button onClick={nextStep} className="gap-2" size="lg">
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={form.handleSubmit(onSubmit, onInvalid)}
                disabled={loading}
                className="gap-2"
                size="lg"
              >
                {loading ? "Setting up..." : "Complete Profile ✨"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
