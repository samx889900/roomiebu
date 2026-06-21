"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { type ListingFormData } from "@/lib/validators/listing";
import { updateListing } from "../../actions";
import { toast } from "sonner";
import Link from "next/link";
import { ListingForm } from "@/components/shared/listing-form";
import { format } from "date-fns";

export function EditListingClient({ listing }: { listing: { id: string; [key: string]: unknown } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onSubmit(data: ListingFormData) {
    setLoading(true);
    try {
      if (data.accommodationType === "HOSTEL") {
        data.occupancyType = "TRIPLE";
      }
      await updateListing(listing.id, data);
      toast.success("Listing updated!");
      router.push(`/listings/${listing.id}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to update listing";
      toast.error(message);
      console.error("Update listing error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Format moveInDate for date input (YYYY-MM-DD) if it exists
  const initialMoveInDate = listing.moveInDate 
    ? format(new Date(listing.moveInDate), "yyyy-MM-dd") 
    : undefined;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button render={<Link href={`/listings/${listing.id}`} />} variant="ghost" className="gap-2">
        <ArrowLeft className="h-4 w-4" />
        Back to listing
      </Button>

      <div className="surface-panel p-6 sm:p-8">
        <div className="mb-8 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Edit listing</p>
          <h1 className="section-heading mt-3">Update your listing details.</h1>
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-border/70 bg-white shadow-none">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Pencil className="h-5 w-5 text-primary" />
                Edit details
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ListingForm 
                onSubmit={onSubmit} 
                loading={loading} 
                submitLabel="Save changes" 
                initialData={{
                  ...listing,
                  moveInDate: initialMoveInDate,
                  minBudget: listing.minBudget ?? undefined,
                  maxBudget: listing.maxBudget ?? undefined,
                  propertyType: listing.propertyType ?? undefined,
                  furnishedStatus: listing.furnishedStatus ?? undefined,
                  occupancyType: listing.occupancyType ?? undefined,
                  hostelBlock: listing.hostelBlock ?? undefined,
                  location: listing.location ?? undefined,
                  description: listing.description ?? undefined,
                }}
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
