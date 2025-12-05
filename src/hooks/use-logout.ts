"use client";

import { logout as serverLogout } from "@/lib/actions/auth";

export function useLogout() {
  const logout = async () => {
    try {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("bearerToken");
        localStorage.removeItem("authToken");
      }

      // Wait for server logout to complete
      await serverLogout();

      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    } catch (error) {
      window.location.href = "/login";
    }
  };

  return { logout };
}
