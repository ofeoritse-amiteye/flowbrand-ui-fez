"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import OtpVerification from "@/components/features/auth/register/OtpVerification";
import AuthSplitLayout from "@/components/features/auth/authSplitLayout";
import { usePostAuthRedirect } from "@/hooks/use-post-auth-redirect";
import {
  getRegisterVerifyEmail,
  subscribeToRegisterVerifyEmail,
} from "@/lib/register-verify-storage";

export default function RegisterVerifyPage() {
  const router = useRouter();
  const { status } = useSession();
  const isAuthenticated = status === "authenticated";
  const email = useSyncExternalStore(
    subscribeToRegisterVerifyEmail,
    getRegisterVerifyEmail,
    () => null,
  );

  usePostAuthRedirect();

  useEffect(() => {
    if (status === "loading") {
      return;
    }
    if (email === null && !isAuthenticated) {
      router.replace("/register");
    }
  }, [email, isAuthenticated, status, router]);

  if (status === "loading" || (email === null && isAuthenticated)) {
    return (
      <AuthSplitLayout>
        <div className="py-12 text-center text-sm text-[#32476D]">Loading…</div>
      </AuthSplitLayout>
    );
  }

  if (email === null) {
    return (
      <AuthSplitLayout>
        <div className="py-12 text-center text-sm text-[#32476D]">Loading…</div>
      </AuthSplitLayout>
    );
  }

  return (
    <AuthSplitLayout>
      <OtpVerification email={email} />
    </AuthSplitLayout>
  );
}
