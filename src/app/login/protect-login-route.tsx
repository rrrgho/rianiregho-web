"use client";

import { Spinner } from "@/components/ui/spinner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ProtectLoginRoute = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (session.status === "loading") return;

    if (session.status === "authenticated") {
      // User is logged in with GitHub, redirect to admin
      router.replace("/administrator");
    } else {
      // User not authenticated, show login page
      setIsReady(true);
    }
  }, [session.status, router]);

  // Show loading while checking session
  if (session.status === "loading" || !isReady) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <div>{children}</div>;
};

export default ProtectLoginRoute;
