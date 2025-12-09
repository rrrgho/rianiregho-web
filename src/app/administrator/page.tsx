"use client";

import { useSession } from "next-auth/react";

export default function AdministratorHomePage() {
  const session = useSession();
  return (
    <div>
      <h1>Home</h1>
    </div>
  );
}
