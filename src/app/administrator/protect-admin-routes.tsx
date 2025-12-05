"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

const ProtectAdminRoutes = ({ children }: { children: React.ReactNode }) => {
  const session = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session.status === "authenticated") {
      console.log("awwww");
      const bearerToken = sessionStorage.getItem("bearerToken");

      if (!bearerToken) {
        router.push("/api/auth/validate-token");
      } else {
        // Token exists, user is authorized
        setIsAuthorized(true);
        setIsLoading(false);
      }
    } else if (session.status === "unauthenticated") {
      // Not logged in, redirect to login
      router.push("/login");
    }
  }, [session.status, router]);

  // Show loading while checking authentication
  if (isLoading || session.status === "loading") {
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <div className="flex flex-col gap-4 items-center">
          <Spinner className="size-8" />
          <p className="text-muted-foreground">Checking authorization...</p>
        </div>
      </div>
    );
  }

  // Show nothing while redirecting
  if (!isAuthorized) {
    return null;
  }

  // User is authorized - render children
  return <div>{children}</div>;
};

export default ProtectAdminRoutes;
