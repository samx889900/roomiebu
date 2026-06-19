"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
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
    },
  });

  const accommodationType = form.watch("accommodationType");

  async function onSubmit(data: ListingFormData) {
    setLoading(true);
    try {
      await createListing(data);
      toast.success("Listing created!");
      router.push("/my-listings");
    } catch (error) {
      toast.error("Failed to create listing");
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button render={<Link href="/listings" />} variant="ghost" className="gap-2">
        <ArrowLeft className="w-4 h-4" />Back
      </Button>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Listing
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input {...form.register("title")} placeholder="e.g., Looking for a roommate in BH-3" />
                {form.formState.errors.title && (
                  <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
                )}
              </div>

              {/* Type + Gender + Urgency */}
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label>Accommodation *</Label>
                  <Select
                    defaultValue="HOSTEL"
                    onValueChange={(v: any) => form.setValue("accommodationType", v as ListingFormData["accommodationType"])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="HOSTEL">Hostel</SelectItem>
                      <SelectItem value="FLAT">Flat</SelectItem>
                      <SelectItem value="NOT_SURE">Not Sure</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender Pref *</Label>
                  <Select
                    defaultValue="ANY"
                    onValueChange={(v: any) => form.setValue("genderPreference", v as ListingFormData["genderPreference"])}
                  >
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
                  <Select
                    defaultValue="JUST_EXPLORING"
                    onValueChange={(v: any) => form.setValue("currentStatus", v as ListingFormData["currentStatus"])}
                  >
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="LOOKING_URGENTLY">Urgently</SelectItem>
                      <SelectItem value="WITHIN_1_MONTH">Within 1 Month</SelectItem>
                      <SelectItem value="JUST_EXPLORING">Just Exploring</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Spots */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Total Spots Needed *</Label>
                  <Input type="number" min={1} max={10} {...form.register("numberRequired", { valueAsNumber: true })} />
                </div>
                <div className="space-y-2">
                  <Label>Spots Already Filled</Label>
                  <Input type="number" min={0} {...form.register("spotsFilled", { valueAsNumber: true })} />
                </div>
              </div>

              {/* Move-in Date */}
              <div className="space-y-2">
                <Label>Move-in Date</Label>
                <Input type="date" {...form.register("moveInDate")} />
              </div>

              {/* Hostel Fields */}
              {accommodationType === "HOSTEL" && (
                <div className="grid gap-4 sm:grid-cols-2 p-4 rounded-lg border border-border bg-muted/20">
                  <div className="sm:col-span-2 text-sm font-medium text-muted-foreground">Hostel Details</div>
                  <div className="space-y-2">
                    <Label>Occupancy Type *</Label>
                    <Select onValueChange={(v: any) => form.setValue("occupancyType", v as ListingFormData["occupancyType"])}>
                      <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SINGLE">Single</SelectItem>
                        <SelectItem value="DOUBLE">Double</SelectItem>
                        <SelectItem value="TRIPLE">Triple</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Hostel Block</Label>
                    <Input {...form.register("hostelBlock")} placeholder="e.g., BH-3" />
                  </div>
                </div>
              )}

              {/* Flat Fields */}
              {accommodationType === "FLAT" && (
                <div className="space-y-4 p-4 rounded-lg border border-border bg-muted/20">
                  <div className="text-sm font-medium text-muted-foreground">Flat Details</div>
                  <div className="space-y-2">
                    <Label>Location</Label>
                    <Input {...form.register("location")} placeholder="e.g., Sector 62, Noida" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Min Budget (₹)</Label>
                      <Input type="number" {...form.register("minBudget", { valueAsNumber: true })} placeholder="5000" />
                    </div>
                    <div className="space-y-2">
                      <Label>Max Budget (₹)</Label>
                      <Input type="number" {...form.register("maxBudget", { valueAsNumber: true })} placeholder="15000" />
                    </div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select onValueChange={(v: any) => form.setValue("propertyType", v as ListingFormData["propertyType"])}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="APARTMENT">Apartment</SelectItem>
                          <SelectItem value="BUILDER_FLOOR">Builder Floor</SelectItem>
                          <SelectItem value="INDEPENDENT_HOUSE">Independent House</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Furnished Status</Label>
                      <Select onValueChange={(v: any) => form.setValue("furnishedStatus", v as ListingFormData["furnishedStatus"])}>
                        <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FURNISHED">Furnished</SelectItem>
                          <SelectItem value="SEMI_FURNISHED">Semi Furnished</SelectItem>
                          <SelectItem value="UNFURNISHED">Unfurnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea {...form.register("description")} placeholder="Describe what you're looking for..." rows={4} />
              </div>

              <Button type="submit" className="w-full gradient-primary" disabled={loading} size="lg">
                {loading ? "Creating..." : "Create Listing"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
