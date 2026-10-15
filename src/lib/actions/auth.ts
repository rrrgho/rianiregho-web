"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";

export type LoginState = { error?: string };

export const login = async (
  _prev: LoginState,
  formData: FormData
): Promise<LoginState> => {
  try {
    await signIn("credentials", {
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      redirectTo: "/api/auth/validate-token",
    });
    return {};
  } catch (err) {
    if (err instanceof AuthError) {
      return {
        error:
          (err as AuthError & { code?: string }).code === "too_many_attempts"
            ? "Too many attempts. Please try again in a minute."
            : "Email or password is incorrect.",
      };
    }
    throw err; // lets Next.js handle the success redirect
  }
};

export const logout = async () => {
  await signOut();
};
