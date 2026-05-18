"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getPostAuthRedirect } from "~/actions/auth";
import { clearRegisterVerifyEmail } from "@/lib/register-verify-storage";
import { ONBOARDING_ROUTE } from "@/routes";

/** After sign-in, resolve onboarding vs funnel once the client session is ready. */
export function usePostAuthRedirect() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const redirectStarted = useRef(false);

  const isAuthenticated =
    status === "authenticated" &&
    session?.invalid !== true &&
    !!session?.user?.id;

  useEffect(() => {
    if (!isAuthenticated) {
      redirectStarted.current = false;
      return;
    }

    if (redirectStarted.current) {
      return;
    }

    redirectStarted.current = true;

    void getPostAuthRedirect()
      .then((path) => {
        clearRegisterVerifyEmail();
        router.replace(path);
      })
      .catch((error) => {
        redirectStarted.current = false;
        if (process.env.NODE_ENV === "development") {
          console.warn("[auth] post-auth redirect failed", error);
        }
        clearRegisterVerifyEmail();
        router.replace(ONBOARDING_ROUTE);
      });
  }, [isAuthenticated, router]);
}
