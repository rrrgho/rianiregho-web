import React from "react";
import ProtectLoginRoute from "./protect-login-route";

export const metadata = {
  title: "Login",
  description: "You need to be authenticated to access Administrator page",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectLoginRoute>{children}</ProtectLoginRoute>;
}
