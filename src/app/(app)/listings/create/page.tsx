"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { listingSchema, type ListingFormData } from "@/lib/validators/listing";
import { createListing } from "../actions";
import { toast } from "sonner";
import Link from "next/link";

export default function CreateListingPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<ListingFormData>({
    resolver: zodResolver(listingSchema),
    defaultValues: {
      accommodationType: "HOSTEL",
      numberRequired: 1,
      spotsFilled: 0,
      genderPreference: "ANY",
      currentStatus: "JUST_EXPLORING",
      occupancyType: "TRIPLE",
    },
  });

  const accommodationType = form.watch("accommodationType");

  async function onSubmit(data: ListingFormData) {
    setLoading(true);
    try {
      // Auto-set occupancyType to TRIPLE for hostel
      if (data.accommodationType === "HOSTEL") {
        data.occupancyType = "TRIPLE";
      }
      await createListing(data);
      toast.success("Listing created!");
      router.push("/my-listings");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to create listing";
      toast.error(message);
      console.error("Create listing error:", error);
    } finally {
      setLoading(false);
    }
  }

  function onFormError(errors: Record<string, unknown>) {
    console.error("Form validation errors:", errors);
    const firstError = Object.values(errors)[0] as { message?: string } | undefined;
    if (firstError?.message) {
      toast.error(firstError.message);
    } else {
      toast.error("Please fill in all required fields");
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button render={<Link href="/listings" />} variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to listings
      </Button>

      <div className="surface-panel p-6 sm:p-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Create listing</p>
          <h1 className="section-heading mt-3">Post a roommate or flatmate listing that feels trustworthy.</h1>
          <p className="section-copy mt-4">
            Keep it clear, specific, and student-friendly. The better your details, the better your incoming matches.
          </p>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/70 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Plus className="h-5 w-5 text-primary" />
                Listing details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit, onFormError)} className="space-y-6">
                <div className="space-y-2">
                  <Label>Title</Label>
                  <Input {...form.register("title")} placeholder="Looking for a roommate in hostel/flat" />
                  {form.formState.errors.title && <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>}
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Accommodation</Label>
                    <Select defaultValue="HOSTEL" onValueChange={(v: string | null) => { if (v) form.setValue("accommodationType", v as "HOSTEL" | "FLAT" | "NOT_SURE"); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="HOSTEL">Hostel</SelectItem>
                        <SelectItem value="FLAT">Flat</SelectItem>
                        <SelectItem value="NOT_SURE">Not sure</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Gender preference</Label>
                    <Select defaultValue="ANY" onValueChange={(v: string | null) => { if (v) form.setValue("genderPreference", v as ListingFormData["genderPreference"]); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MALE">Male</SelectItem>
                        <SelectItem value="FEMALE">Female</SelectItem>
                        <SelectItem value="ANY">Any</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Urgency</Label>
                    <Select defaultValue="JUST_EXPLORING" onValueChange={(v: string | null) => { if (v) form.setValue("currentStatus", v as ListingFormData["currentStatus"]); }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="LOOKING_URGENTLY">Looking urgently</SelectItem>
                        <SelectItem value="WITHIN_1_MONTH">Within 1 month</SelectItem>
                        <SelectItem value="JUST_EXPLORING">Just exploring</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Total spots needed</Label>
                    <Input type="number" min={1} max={10} {...form.register("numberRequired", { valueAsNumber: true })} />
                  </div>
                  <div className="space-y-2">
                    <Label>Spots already filled</Label>
                    <Input type="number" min={0} {...form.register("spotsFilled", { valueAsNumber: true })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Move-in date <span className="text-muted-foreground font-normal">(optional)</span></Label>
                  <Input type="date" {...form.register("moveInDate")} />
                </div>

                {accommodationType === "HOSTEL" && (
                  <div className="rounded-[24px] bg-[#fff7f5] p-5">
                    <p className="mb-4 text-sm font-semibold text-foreground">Hostel details</p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label>Occupancy type</Label>
                        <Input value="Triple" disabled className="bg-muted/50" />
                      </div>
                      <div className="space-y-2">
                        <Label>Hostel block <span className="text-muted-foreground font-normal">(if allotted any, else NA)</span></Label>
                        <Input {...form.register("hostelBlock")} placeholder="C1 or D1" />
                      </div>
                    </div>
                  </div>
                )}

                {accommodationType === "FLAT" && (
                  <div className="rounded-[24px] bg-[#fff7f5] p-5">
                    <p className="mb-4 text-sm font-semibold text-foreground">Flat details</p>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Location</Label>
                        <Input {...form.register("location")} placeholder="Sector 62, Noida" />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Min budget (₹)</Label>
                          <Input type="number" {...form.register("minBudget", { valueAsNumber: true })} placeholder="5000" />
                        </div>
                        <div className="space-y-2">
                          <Label>Max budget (₹)</Label>
                          <Input type="number" {...form.register("maxBudget", { valueAsNumber: true })} placeholder="15000" />
                        </div>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Property type</Label>
                          <Select onValueChange={(v: string | null) => { if (v) form.setValue("propertyType", v as ListingFormData["propertyType"]); }}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="APARTMENT">Apartment</SelectItem>
                              <SelectItem value="BUILDER_FLOOR">Builder floor</SelectItem>
                              <SelectItem value="INDEPENDENT_HOUSE">Independent house</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Furnished status</Label>
                          <Select onValueChange={(v: string | null) => { if (v) form.setValue("furnishedStatus", v as ListingFormData["furnishedStatus"]); }}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="FURNISHED">Furnished</SelectItem>
                              <SelectItem value="SEMI_FURNISHED">Semi furnished</SelectItem>
                              <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea {...form.register("description")} placeholder="Describe the room, vibe, expectations, and what kind of roommate you want." rows={5} className="rounded-[24px] bg-white" />
                </div>

                {/* Show form-level errors */}
                {form.formState.errors.root && (
                  <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
                )}

                <Button type="submit" className="w-full" disabled={loading} size="lg">
                  {loading ? "Creating listing..." : "Create listing"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
