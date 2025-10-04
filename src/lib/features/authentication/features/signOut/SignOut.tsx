"use client";

import { signOut } from "next-auth/react";
import { signOutAction } from "./action";
import { useRouter } from "next/navigation";
import { routes } from "@/lib/utils/routeMapper";

export default function SignOut({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  return (
    <div
      onClick={async () => {
        await signOut({ redirect: false });
        await signOutAction();
        router.replace(routes.generic.home);
      }}
    >
      {children}
    </div>
  );
}
