"use client";
import { Spinner } from "@/components/ui/spinner";
import { useOAuthUser } from "@/hooks/queries/auth.query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ValidateToken() {
  const router = useRouter();
  const session = useSession();
  const validateUser = useOAuthUser({
    onSuccess: (data) => {
      // Store bearer token in sessionStorage for use in API client
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bearerToken", data.token);
      }

      // Redirect to administrator dashboard
      setTimeout(() => {
        if (typeof window !== undefined) {
          window.location.href = "/administrator";
        } else {
          router.push("/administrator");
        }
      }, 500);
    },
    onError: (err) => {
      // Redirect to login on error
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
  });

  useEffect(() => {
    if (session.status === "authenticated" && session.data?.user?.email) {
      validateUser.mutate(session.data.user.email);
    }
  }, [session.status, session.data?.user?.email]);

  return (
    <div className="flex w-full h-screen justify-center items-center ">
      <div className="flex flex-nowrap gap-4 justify-center items-center">
        <Spinner className="size-8" />
        <h1 className="">
          Please wait! We are validating your authentication...
        </h1>
      </div>
    </div>
  );
}
