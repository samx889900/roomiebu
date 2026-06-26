import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, AlertCircle } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="page-shell flex min-h-[100dvh] flex-col items-center justify-center p-4 text-center">
      <div className="surface-panel w-full max-w-md p-8 animate-fade-in-up">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#fff1f3] text-primary">
          <AlertCircle className="h-8 w-8" />
        </div>
        <h1 className="mb-2 text-3xl font-semibold tracking-[-0.02em] text-foreground">
          Page Not Found
        </h1>
        <p className="mb-8 text-sm leading-6 text-muted-foreground">
          The page you're looking for doesn't exist or has been moved. 
          Let's get you back to finding the perfect roommate.
        </p>
        
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild variant="default">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/listings">
              <Search className="mr-2 h-4 w-4" />
              Browse Listings
            </Link>
          </Button>
        </div>
      </div>
      
      <p className="mt-8 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} {APP_NAME}.
      </p>
    </div>
  );
}
