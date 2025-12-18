"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const ProtectAdminRoutes = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Wait for session to load
    if (session.status === "loading") return;

    if (session.status === "authenticated") {
      // User is logged in with GitHub
      // Middleware already protected this route, so we're good
      setIsReady(true);
    } else {
      // Not logged in, redirect to login
      router.replace("/login");
    }
  }, [session.status, router]);

  // Show loading while checking authentication
  if (session.status === "loading" || !isReady) {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    );
  }

  // User is authenticated - render children
  return <div>{children}</div>;
};

export default ProtectAdminRoutes;
