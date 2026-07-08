"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { setPhoneVerified } from "./actions";
import { toast } from "sonner";
import { Phone, ShieldCheck } from "lucide-react";
import { APP_NAME } from "@/lib/constants";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

export const dynamic = "force-dynamic";

export default function VerifyPhonePage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<{ confirm: (code: string) => Promise<unknown> } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
        callback: () => {
          // reCAPTCHA solved
        },
      });
    }
  }, []);

  const sendOTP = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error("Please enter a valid phone number");
      return;
    }
    
    setLoading(true);
    try {
      const formattedNumber = phoneNumber.startsWith("+") ? phoneNumber : `+91${phoneNumber}`;
      const confirmation = await signInWithPhoneNumber(auth, formattedNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      toast.success("OTP sent successfully!");
    } catch (error: unknown) {
      console.error(error);
      const e = error as Error;
      toast.error(e.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    if (!verificationCode || verificationCode.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    try {
      if (confirmationResult) {
        await confirmationResult.confirm(verificationCode);
        // Verification successful, update DB via server action
        await setPhoneVerified();
        toast.success("Phone verified successfully!");
        router.push("/onboarding");
        router.refresh();
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error("Invalid OTP code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell flex min-h-screen items-center justify-center p-4 hero-wash">
      <div className="w-full max-w-md space-y-8 surface-panel p-8">
        <div className="text-center space-y-2">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Phone className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Verify your phone</h2>
          <p className="text-sm text-muted-foreground">
            To keep {APP_NAME} secure, we require freshers to verify their phone number.
          </p>
        </div>

        <div className="space-y-4">
          <div id="recaptcha-container"></div>
          
          {!confirmationResult ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="tel"
                  placeholder="Phone Number (e.g. 9876543210)"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                  maxLength={15}
                />
              </div>
              <Button 
                onClick={sendOTP} 
                disabled={loading || phoneNumber.length < 10}
                className="w-full"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ""))}
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={verifyOTP} 
                disabled={loading || verificationCode.length !== 6}
                className="w-full"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => setConfirmationResult(null)}
                className="w-full"
                disabled={loading}
              >
                Change Phone Number
              </Button>
            </div>
          )}

          <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="h-4 w-4" />
            <span>Secured by Firebase Phone Verification</span>
          </div>
        </div>
      </div>
    </div>
  );
}
