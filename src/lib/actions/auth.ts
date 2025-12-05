"use server";

import { signIn, signOut, auth } from "@/auth";

export const login = async () => {
  await signIn("github", { redirectTo: "/api/auth/validate-token" });
};

export const logout = async () => {
  await signOut();
};
